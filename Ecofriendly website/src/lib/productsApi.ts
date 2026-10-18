/**
 * Centralized API client for the Earthform backend (Express + MongoDB).
 * Base URL is driven by the NEXT_PUBLIC_API_URL environment variable so it
 * never needs to be duplicated across components.
 *
 * Authentication: All mutating requests include credentials: 'include' so the
 * browser automatically attaches the HTTP-only auth_token cookie. The token
 * is never stored in or read from JavaScript.
 */

import { getApiBaseUrl } from "./apiConfig";

const BASE_URL = getApiBaseUrl();

export interface Product {
  _id: string;
  name: string;
  description?: string;
  category: string;
  price: number;
  size: string;
  material?: string;
  color?: string;
  stockQuantity: number;
  image?: string;
  imagePublicId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFormData {
  name: string;
  description: string;
  category: string;
  price: number;
  size: string;
  material: string;
  color: string;
  stockQuantity: number;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  messages?: string[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
  };
}

/** Extract a human-readable error message from an API response. */
function extractError(
  json: Partial<ApiResponse<unknown>>,
  status: number,
  fallback: string
): string {
  if (status === 401) return "Authentication required. Please log in.";
  if (status === 403) return "Access denied. Admin privileges required.";
  if (json.messages && json.messages.length > 0) return json.messages.join(" ");
  if (json.message) return json.message;
  if (typeof json.error === "string") return json.error;
  return `${fallback} (HTTP ${status})`;
}

/**
 * Fetch all active products (includeInactive=false by default).
 * includeInactive=true requires admin authentication.
 */
export async function fetchProducts(includeInactive = false): Promise<Product[]> {
  const url = includeInactive
    ? `${BASE_URL}/api/products?includeInactive=true`
    : `${BASE_URL}/api/products`;

  const res = await fetch(url, {
    cache: "no-store",
    credentials: "include", // Sends auth cookie when present (needed for includeInactive)
  });

  if (res.status === 401) throw new Error("Authentication required. Please log in.");
  if (res.status === 403) throw new Error("Access denied. Admin privileges required.");

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(extractError(body, res.status, "Failed to load products"));
  }

  const json: ApiResponse<Product[]> = await res.json();
  return json.data ?? [];
}

/** Create a new product (JSON body, no image). Requires admin auth. */
export async function createProduct(data: ProductFormData): Promise<Product> {
  const res = await fetch(`${BASE_URL}/api/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // Auth cookie
    body: JSON.stringify(data),
  });

  const json: ApiResponse<Product> = await res.json().catch(() => ({}));
  if (!res.ok || !json.success) {
    throw new Error(extractError(json, res.status, "Failed to create product"));
  }
  return json.data!;
}

/** Update an existing product (JSON body). Requires admin auth. */
export async function updateProduct(
  id: string,
  data: Partial<ProductFormData>
): Promise<Product> {
  const res = await fetch(`${BASE_URL}/api/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // Auth cookie
    body: JSON.stringify(data),
  });

  const json: ApiResponse<Product> = await res.json().catch(() => ({}));
  if (!res.ok || !json.success) {
    throw new Error(extractError(json, res.status, "Failed to update product"));
  }
  return json.data!;
}

/** Soft-delete a product (sets isActive = false). Requires admin auth. */
export async function deleteProduct(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/products/${id}`, {
    method: "DELETE",
    credentials: "include", // Auth cookie
  });

  const json: ApiResponse<unknown> = await res.json().catch(() => ({}));
  if (!res.ok || !json.success) {
    throw new Error(extractError(json, res.status, "Failed to deactivate product"));
  }
}

/**
 * Upload an image for an existing product via multipart/form-data.
 * Requires admin auth.
 * IMPORTANT: Do NOT set Content-Type manually — the browser sets it with
 * the correct multipart boundary automatically.
 */
export async function uploadProductImage(id: string, file: File): Promise<Product> {
  const form = new FormData();
  form.append("image", file);

  const res = await fetch(`${BASE_URL}/api/products/${id}/image`, {
    method: "POST",
    credentials: "include", // Auth cookie
    body: form,
  });

  const json: ApiResponse<Product> = await res.json().catch(() => ({}));
  if (!res.ok || !json.success) {
    throw new Error(extractError(json, res.status, "Image upload failed"));
  }
  return json.data!;
}

/** Remove a product's image from Cloudinary and clear it in MongoDB. Requires admin auth. */
export async function deleteProductImage(id: string): Promise<Product> {
  const res = await fetch(`${BASE_URL}/api/products/${id}/image`, {
    method: "DELETE",
    credentials: "include", // Auth cookie
  });

  const json: ApiResponse<Product> = await res.json().catch(() => ({}));
  if (!res.ok || !json.success) {
    throw new Error(extractError(json, res.status, "Failed to remove image"));
  }
  return json.data!;
}
