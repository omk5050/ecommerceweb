"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import ProductForm from "@/components/admin/ProductForm";
import {
  Package,
  ShoppingBag,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  CheckCircle,
  XCircle,
  RefreshCw,
  ImageIcon,
  Search,
  X,
  LogOut,
  Leaf,
} from "lucide-react";
import type { Product } from "@/lib/productsApi";
import type { AdminUser } from "@/lib/authApi";

/* ─── Toast ─────────────────────────────────────────────────────────── */
interface ToastMsg {
  id: number;
  type: "success" | "error";
  text: string;
}
let _tid = 0;

function useToasts() {
  const [toasts, setToasts] = useState<ToastMsg[]>([]);
  const push = useCallback((type: ToastMsg["type"], text: string) => {
    const id = ++_tid;
    setToasts((p) => [...p, { id, type, text }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 5000);
  }, []);
  const remove = useCallback(
    (id: number) => setToasts((p) => p.filter((t) => t.id !== id)),
    []
  );
  return { toasts, push, remove };
}

/* ─── Confirm dialog ─────────────────────────────────────────────────── */
function ConfirmDialog({
  productName,
  onConfirm,
  onCancel,
  busy,
}: {
  productName: string;
  onConfirm: () => void;
  onCancel: () => void;
  busy: boolean;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
    >
      <div className="w-full max-w-sm rounded-xl bg-ivory border border-beige shadow-2xl p-6">
        <h3 id="confirm-title" className="font-serif text-lg text-charcoal mb-2">
          Deactivate Product?
        </h3>
        <p className="text-sm text-charcoal/70 mb-6">
          <strong className="text-charcoal">{productName}</strong> will be
          deactivated and hidden from the active list. This can be reversed via
          the database.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={busy}
            className="flex-1 px-4 py-2 rounded-md border border-beige text-sm text-charcoal hover:bg-beige/40 transition-colors disabled:opacity-40"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={busy}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-60"
          >
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            {busy ? "Deactivating…" : "Deactivate"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Product card ───────────────────────────────────────────────────── */
function ProductCard({
  product,
  onEdit,
  onDelete,
}: {
  product: Product;
  onEdit: (p: Product) => void;
  onDelete: (p: Product) => void;
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-beige overflow-hidden flex flex-col">
      {/* Image */}
      <div className="aspect-video relative bg-beige/30 flex items-center justify-center overflow-hidden">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <ImageIcon className="w-10 h-10 text-charcoal/20" aria-hidden="true" />
        )}
        <span
          className={`absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full font-medium ${
            product.isActive
              ? "bg-sugarcane/20 text-sugarcane"
              : "bg-red-100 text-red-600"
          }`}
        >
          {product.isActive ? "Active" : "Inactive"}
        </span>
      </div>

      {/* Details */}
      <div className="p-4 flex flex-col flex-1 gap-1">
        <h3 className="font-medium text-base text-charcoal line-clamp-2 leading-snug">
          {product.name}
        </h3>
        <p className="text-sm text-charcoal/50">{product.category}</p>

        <div className="mt-2 grid grid-cols-2 gap-x-2 gap-y-0.5 text-xs text-charcoal/60">
          <span>
            <span className="font-medium text-charcoal/80">Price:</span> ₹
            {product.price.toLocaleString("en-IN")}
          </span>
          <span>
            <span className="font-medium text-charcoal/80">Stock:</span>{" "}
            {product.stockQuantity}
          </span>
          {product.size && (
            <span>
              <span className="font-medium text-charcoal/80">Size:</span>{" "}
              {product.size}
            </span>
          )}
          {product.material && (
            <span>
              <span className="font-medium text-charcoal/80">Material:</span>{" "}
              {product.material}
            </span>
          )}
          {product.color && (
            <span className="col-span-2">
              <span className="font-medium text-charcoal/80">Color:</span>{" "}
              {product.color}
            </span>
          )}
        </div>

        <div className="mt-auto pt-3 flex gap-2">
          <button
            onClick={() => onEdit(product)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 text-sm rounded-sm bg-charcoal text-ivory hover:bg-forest transition-colors"
            aria-label={`Edit ${product.name}`}
          >
            <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
            Edit
          </button>
          <button
            onClick={() => onDelete(product)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 text-sm rounded-sm border border-red-300 text-red-600 hover:bg-red-50 transition-colors"
            aria-label={`Deactivate ${product.name}`}
          >
            <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
            Deactivate
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Auth guard wrapper ─────────────────────────────────────────────── */
type AuthState = "checking" | "authenticated" | "unauthenticated";

/* ─── Main admin page ────────────────────────────────────────────────── */
export default function AdminDashboard() {
  const router = useRouter();

  // ── Auth state ──
  const [authState, setAuthState] = useState<AuthState>("checking");
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  // ── Data state ──
  const [orders, setOrders] = useState<
    {
      id: string;
      customerName: string;
      customerEmail: string;
      createdAt: string;
      totalAmount: number;
      status: string;
    }[]
  >([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState("products");

  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState<string>("");

  // Search / filter
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Product | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  const { toasts, push: pushToast, remove: removeToast } = useToasts();

  /* ── Auth check on mount ── */
  useEffect(() => {
    import("@/lib/authApi").then(({ getMe }) => {
      getMe()
        .then((admin) => {
          if (admin) {
            setCurrentAdmin(admin);
            setAuthState("authenticated");
          } else {
            setAuthState("unauthenticated");
          }
        })
        .catch(() => {
          setAuthState("unauthenticated");
        });
    });
  }, []);

  /* ── Redirect unauthenticated users ── */
  useEffect(() => {
    if (authState === "unauthenticated") {
      router.replace("/admin/login");
    }
  }, [authState, router]);

  /* ── Logout handler ── */
  const handleLogout = useCallback(async () => {
    setLoggingOut(true);
    try {
      const { logout } = await import("@/lib/authApi");
      await logout();
    } catch {
      // Ignore logout errors — always navigate away
    } finally {
      setLoggingOut(false);
      router.replace("/admin/login");
    }
  }, [router]);

  /* ── Load orders (uses the existing Next.js /api/orders route) ── */
  useEffect(() => {
    if (authState !== "authenticated") return;
    fetch("/api/orders")
      .then((r) => r.json())
      .then((data) => {
        if (!data.error) setOrders(data);
      })
      .catch(() => {})
      .finally(() => setLoadingOrders(false));
  }, [authState]);

  /* ── Load products from backend ── */
  const loadProducts = useCallback(async () => {
    setLoadingProducts(true);
    setProductsError("");
    try {
      const { fetchProducts } = await import("@/lib/productsApi");
      // Load ALL products (including inactive) for admin dashboard
      const data = await fetchProducts(true);
      setProducts(data);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Unable to reach the backend service.";
      setProductsError(msg);
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  useEffect(() => {
    if (authState !== "authenticated") return;
    let ignore = false;
    (async () => {
      try {
        const { fetchProducts } = await import("@/lib/productsApi");
        // Admin sees all products including inactive ones
        const data = await fetchProducts(true);
        if (!ignore) {
          setProducts(data);
        }
      } catch (err: unknown) {
        if (!ignore) {
          const msg =
            err instanceof Error
              ? err.message
              : "Unable to reach the backend service.";
          setProductsError(msg);
        }
      } finally {
        if (!ignore) {
          setLoadingProducts(false);
        }
      }
    })();
    return () => {
      ignore = true;
    };
  }, [authState]);

  /* ── Derived: unique categories from loaded products ── */
  const categories = useMemo(
    () =>
      Array.from(new Set(products.map((p) => p.category).filter(Boolean))).sort(),
    [products]
  );

  /* ── Derived: filtered product list ── */
  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return products.filter((p) => {
      const matchesSearch = !q || p.name.toLowerCase().includes(q);
      const matchesCategory = !categoryFilter || p.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, categoryFilter]);

  const hasFilters = searchQuery.trim() !== "" || categoryFilter !== "";

  const clearFilters = () => {
    setSearchQuery("");
    setCategoryFilter("");
  };

  /* ── Form handlers ── */
  const openAdd = () => {
    setFormMode("add");
    setEditTarget(null);
    setFormOpen(true);
  };

  const openEdit = (product: Product) => {
    setFormMode("edit");
    setEditTarget(product);
    setFormOpen(true);
  };

  const handleFormSuccess = useCallback(
    (savedProduct: Product) => {
      setFormOpen(false);
      // Always reload from backend to reflect latest Cloudinary URLs
      loadProducts();
      pushToast(
        "success",
        formMode === "add"
          ? `"${savedProduct.name}" added successfully.`
          : `"${savedProduct.name}" updated successfully.`
      );
    },
    [formMode, loadProducts, pushToast]
  );

  /* ── Delete / deactivate ── */
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const { deleteProduct } = await import("@/lib/productsApi");
      await deleteProduct(deleteTarget._id);
      setProducts((prev) => prev.filter((p) => p._id !== deleteTarget._id));
      pushToast("success", `"${deleteTarget.name}" has been deactivated.`);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to deactivate product.";
      pushToast("error", msg);
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  /* ── Empty-state helper for products tab ── */
  const renderProductsContent = () => {
    if (loadingProducts) {
      return (
        <div className="flex items-center gap-2 text-charcoal/60 py-20 justify-center">
          <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
          <span>Loading products…</span>
        </div>
      );
    }

    if (productsError) {
      return (
        <div className="rounded-lg bg-red-50 border border-red-200 p-8 text-center">
          <XCircle className="w-10 h-10 text-red-400 mx-auto mb-3" aria-hidden="true" />
          <p className="text-sm text-red-700 font-medium mb-1">
            Could not load products
          </p>
          <p className="text-xs text-red-600">{productsError}</p>
          <button
            onClick={loadProducts}
            className="mt-4 px-4 py-2 rounded-md bg-red-600 text-white text-sm hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      );
    }

    if (products.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-24 text-charcoal/40 gap-3">
          <Package className="w-14 h-14" aria-hidden="true" />
          <p className="text-lg font-medium">No products yet</p>
          <p className="text-sm text-center max-w-xs">
            Click &ldquo;Add Product&rdquo; to create your first product.
          </p>
          <button
            onClick={openAdd}
            className="mt-2 flex items-center gap-2 px-4 py-2 rounded-md bg-sugarcane text-ivory text-sm font-medium hover:bg-forest transition-colors"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            Add Product
          </button>
        </div>
      );
    }

    if (filteredProducts.length === 0 && hasFilters) {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-charcoal/40 gap-3">
          <Search className="w-12 h-12" aria-hidden="true" />
          <p className="text-lg font-medium">No results found</p>
          <p className="text-sm text-center">
            {searchQuery && categoryFilter
              ? `No "${categoryFilter}" products match "${searchQuery}".`
              : searchQuery
              ? `No products match "${searchQuery}".`
              : `No products in category "${categoryFilter}".`}
          </p>
          <button
            onClick={clearFilters}
            className="mt-2 px-4 py-2 rounded-md border border-beige text-sm text-charcoal hover:bg-beige/40 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onEdit={openEdit}
            onDelete={setDeleteTarget}
          />
        ))}
      </div>
    );
  };

  /* ── Auth loading / redirect states ── */
  if (authState === "checking") {
    return (
      <div className="min-h-screen bg-beige/30 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-charcoal/60">
          <Loader2 className="w-8 h-8 animate-spin" aria-hidden="true" />
          <span className="text-sm">Verifying session…</span>
        </div>
      </div>
    );
  }

  if (authState === "unauthenticated") {
    // Render nothing while redirect is in progress
    return null;
  }

  return (
    <div className="min-h-screen bg-beige/30 flex flex-col overflow-x-hidden">
      <Navbar />

      <div className="flex flex-col md:flex-row flex-grow">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-forest text-ivory p-6 shrink-0 flex flex-col">
          {/* Brand */}
          <div className="flex items-center gap-2 mb-2">
            <Leaf className="w-5 h-5 text-sugarcane" aria-hidden="true" />
            <h2 className="font-serif text-2xl font-bold">Admin Portal</h2>
          </div>

          {/* Current admin */}
          {currentAdmin && (
            <p className="text-xs text-ivory/40 mb-8 truncate pl-7">
              {currentAdmin.email}
            </p>
          )}

          {/* Navigation */}
          <nav className="flex flex-col gap-2 flex-1" aria-label="Admin navigation">
            <button
              onClick={() => setActiveTab("orders")}
              className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                activeTab === "orders"
                  ? "bg-sugarcane text-white"
                  : "hover:bg-forest/80 text-ivory/80 hover:text-ivory"
              }`}
              aria-current={activeTab === "orders" ? "page" : undefined}
            >
              <ShoppingBag className="w-5 h-5" aria-hidden="true" /> Orders
            </button>
            <button
              onClick={() => setActiveTab("products")}
              className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                activeTab === "products"
                  ? "bg-sugarcane text-white"
                  : "hover:bg-forest/80 text-ivory/80 hover:text-ivory"
              }`}
              aria-current={activeTab === "products" ? "page" : undefined}
            >
              <Package className="w-5 h-5" aria-hidden="true" /> Products
            </button>
          </nav>

          {/* Logout button */}
          <button
            id="admin-logout-btn"
            onClick={handleLogout}
            disabled={loggingOut}
            className="mt-6 flex items-center gap-3 px-4 py-3 rounded-md text-ivory/60 hover:text-ivory hover:bg-red-900/30 transition-colors disabled:opacity-40 text-sm"
            aria-label="Log out of admin portal"
          >
            {loggingOut ? (
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
            ) : (
              <LogOut className="w-4 h-4" aria-hidden="true" />
            )}
            {loggingOut ? "Logging out…" : "Log out"}
          </button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 min-w-0">
          {/* Page header */}
          <div className="mb-6 flex flex-wrap gap-3 items-center justify-between">
            <h1 className="font-serif text-2xl sm:text-3xl text-charcoal">
              {activeTab === "orders" ? "Order Management" : "Product Management"}
            </h1>
            {activeTab === "products" && (
              <div className="flex gap-2">
                <button
                  onClick={loadProducts}
                  disabled={loadingProducts}
                  aria-label="Refresh product list"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-md border border-beige text-sm text-charcoal hover:bg-beige/40 transition-colors disabled:opacity-40"
                >
                  <RefreshCw
                    className={`w-4 h-4 ${loadingProducts ? "animate-spin" : ""}`}
                    aria-hidden="true"
                  />
                  <span className="hidden sm:inline">Refresh</span>
                </button>
                <button
                  onClick={openAdd}
                  className="flex items-center gap-2 px-4 py-2 rounded-md bg-sugarcane text-ivory text-sm font-medium hover:bg-forest transition-colors"
                  aria-label="Add new product"
                >
                  <Plus className="w-4 h-4" aria-hidden="true" />
                  Add Product
                </button>
              </div>
            )}
          </div>

          {/* ─── Orders tab ── */}
          {activeTab === "orders" && (
            <>
              {loadingOrders ? (
                <div className="flex items-center gap-2 text-charcoal/60 py-12 justify-center">
                  <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                  <span>Loading orders…</span>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm border border-beige overflow-x-auto">
                  <table className="w-full text-left text-sm text-charcoal min-w-[560px]">
                    <thead className="bg-ivory border-b border-beige font-medium">
                      <tr>
                        <th className="p-4" scope="col">Order ID</th>
                        <th className="p-4" scope="col">Customer</th>
                        <th className="p-4" scope="col">Date</th>
                        <th className="p-4" scope="col">Total</th>
                        <th className="p-4" scope="col">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-beige">
                      {orders.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-charcoal/60">
                            No orders found.
                          </td>
                        </tr>
                      ) : (
                        orders.map((order) => (
                          <tr key={order.id} className="hover:bg-beige/10">
                            <td className="p-4 font-mono text-xs text-charcoal/70">
                              {order.id.slice(0, 8)}…
                            </td>
                            <td className="p-4">
                              <div>{order.customerName}</div>
                              <div className="text-xs text-charcoal/50">
                                {order.customerEmail}
                              </div>
                            </td>
                            <td className="p-4 text-charcoal/80">
                              {new Date(order.createdAt).toLocaleDateString("en-IN")}
                            </td>
                            <td className="p-4 font-medium">₹{order.totalAmount}</td>
                            <td className="p-4">
                              <span className="px-2 py-1 bg-sugarcane/20 text-sugarcane rounded-full text-xs font-medium">
                                {order.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {/* ─── Products tab ── */}
          {activeTab === "products" && (
            <>
              {/* Search + filter toolbar — only shown when products exist */}
              {!loadingProducts && !productsError && products.length > 0 && (
                <div className="mb-5 flex flex-col sm:flex-row gap-3">
                  {/* Search input */}
                  <div className="relative flex-1 min-w-0">
                    <Search
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/40 pointer-events-none"
                      aria-hidden="true"
                    />
                    <input
                      id="product-search"
                      type="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search products…"
                      className="w-full rounded-md border border-beige bg-white pl-9 pr-9 py-2 text-sm text-charcoal placeholder-charcoal/40 focus:border-sugarcane focus:outline-none focus:ring-1 focus:ring-sugarcane transition-colors"
                      aria-label="Search products by name"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        aria-label="Clear search"
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded text-charcoal/40 hover:text-charcoal transition-colors"
                      >
                        <X className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                    )}
                  </div>

                  {/* Category filter */}
                  <div className="flex gap-2 shrink-0">
                    <select
                      id="category-filter"
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="rounded-md border border-beige bg-white px-3 py-2 text-sm text-charcoal focus:border-sugarcane focus:outline-none focus:ring-1 focus:ring-sugarcane transition-colors min-w-[130px]"
                      aria-label="Filter by category"
                    >
                      <option value="">All Categories</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>

                    {hasFilters && (
                      <button
                        onClick={clearFilters}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-md border border-beige text-sm text-charcoal hover:bg-beige/40 transition-colors whitespace-nowrap"
                        aria-label="Clear all filters"
                      >
                        <X className="w-3.5 h-3.5" aria-hidden="true" />
                        <span className="hidden sm:inline">Clear</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Results count when filtering */}
              {!loadingProducts && !productsError && hasFilters && products.length > 0 && (
                <p className="mb-4 text-xs text-charcoal/50">
                  Showing {filteredProducts.length} of {products.length} product
                  {products.length !== 1 ? "s" : ""}
                  {categoryFilter ? ` in "${categoryFilter}"` : ""}
                  {searchQuery ? ` matching "${searchQuery}"` : ""}
                </p>
              )}

              {renderProductsContent()}
            </>
          )}
        </main>
      </div>

      {/* Product form modal */}
      {formOpen && (
        <ProductForm
          mode={formMode}
          product={editTarget}
          onClose={() => {
            if (!deleting) setFormOpen(false);
          }}
          onSuccess={handleFormSuccess}
        />
      )}

      {/* Delete confirm modal */}
      {deleteTarget && (
        <ConfirmDialog
          productName={deleteTarget.name}
          onConfirm={confirmDelete}
          onCancel={() => {
            if (!deleting) setDeleteTarget(null);
          }}
          busy={deleting}
        />
      )}

      {/* Toast notifications */}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-full max-w-xs pointer-events-none"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-lg shadow-lg border text-sm ${
              t.type === "success"
                ? "bg-sugarcane/10 border-sugarcane/30 text-sugarcane"
                : "bg-red-50 border-red-200 text-red-700"
            }`}
            role="status"
          >
            {t.type === "success" ? (
              <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
            ) : (
              <XCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
            )}
            <span className="flex-1">{t.text}</span>
            <button
              onClick={() => removeToast(t.id)}
              aria-label="Dismiss notification"
              className="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
