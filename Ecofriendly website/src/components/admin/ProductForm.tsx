"use client";

import { useEffect, useRef, useState } from "react";
import { X, ImageIcon, Loader2 } from "lucide-react";
import type { Product, ProductFormData } from "@/lib/productsApi";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

interface ProductFormProps {
  mode: "add" | "edit";
  product?: Product | null;
  onClose: () => void;
  onSuccess: (product: Product) => void;
}

const EMPTY_FORM: ProductFormData = {
  name: "",
  description: "",
  category: "",
  price: 0,
  size: "",
  material: "100% Sugarcane Bagasse",
  color: "Natural Ivory",
  stockQuantity: 0,
};

type ImageState =
  | { kind: "none" }              // No image at all
  | { kind: "existing"; url: string }  // Edit mode: existing Cloudinary image, unchanged
  | { kind: "new"; file: File; preview: string }   // New file selected
  | { kind: "removed" };          // Admin explicitly removed existing image

export default function ProductForm({
  mode,
  product,
  onClose,
  onSuccess,
}: ProductFormProps) {
  const [form, setForm] = useState<ProductFormData>(() => {
    if (mode === "edit" && product) {
      return {
        name: product.name ?? "",
        description: product.description ?? "",
        category: product.category ?? "",
        price: product.price ?? 0,
        size: product.size ?? "",
        material: product.material ?? "100% Sugarcane Bagasse",
        color: product.color ?? "Natural Ivory",
        stockQuantity: product.stockQuantity ?? 0,
      };
    }
    return EMPTY_FORM;
  });

  const [imgState, setImgState] = useState<ImageState>(() => {
    if (mode === "edit" && product?.image) {
      return { kind: "existing", url: product.image };
    }
    return { kind: "none" };
  });

  const [imageError, setImageError] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState<string>("");
  const [serverError, setServerError] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  /* ── Focus first input on open ── */
  useEffect(() => {
    const t = setTimeout(() => firstInputRef.current?.focus(), 60);
    return () => clearTimeout(t);
  }, []);

  /* ── ESC to close ── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !submitting) onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [submitting, onClose]);

  /* ── Helpers ── */
  const setField = <K extends keyof ProductFormData>(key: K, value: ProductFormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageError("");
    const file = e.target.files?.[0] ?? null;
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setImageError("Only JPEG, PNG, or WEBP images are allowed.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setImageError("Image must be smaller than 5 MB.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () =>
      setImgState({ kind: "new", file, preview: reader.result as string });
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImageError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    // If there was a new file selected, revert to whatever was there before
    if (imgState.kind === "new") {
      setImgState(
        mode === "edit" && product?.image
          ? { kind: "existing", url: product.image }
          : { kind: "none" }
      );
    } else if (imgState.kind === "existing") {
      // Mark for deletion via API on submit
      setImgState({ kind: "removed" });
    }
  };

  const handleRestoreImage = () => {
    if (mode === "edit" && product?.image) {
      setImgState({ kind: "existing", url: product.image });
    }
  };

  /* ── Validation ── */
  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    if (!form.name.trim()) errors.name = "Product name is required.";
    if (!form.category.trim()) errors.category = "Category is required.";
    if (!form.size.trim()) errors.size = "Size is required.";
    if (typeof form.price !== "number" || isNaN(form.price) || form.price < 0)
      errors.price = "Price must be a non-negative number.";
    if (
      typeof form.stockQuantity !== "number" ||
      !Number.isInteger(form.stockQuantity) ||
      form.stockQuantity < 0
    )
      errors.stockQuantity = "Stock quantity must be a non-negative integer.";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /* ── Submit ── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;

    setSubmitting(true);
    try {
      const { createProduct, updateProduct, uploadProductImage, deleteProductImage } =
        await import("@/lib/productsApi");

      let savedProduct: Product;

      if (mode === "add") {
        setStep("Creating product…");
        savedProduct = await createProduct(form);
      } else {
        setStep("Saving changes…");
        savedProduct = await updateProduct(product!._id, form);
      }

      // Handle image operations
      if (imgState.kind === "new") {
        setStep("Uploading image…");
        savedProduct = await uploadProductImage(savedProduct._id, imgState.file);
      } else if (imgState.kind === "removed" && savedProduct.imagePublicId) {
        setStep("Removing image…");
        savedProduct = await deleteProductImage(savedProduct._id);
      }
      // kind === "existing" → no image operation needed

      onSuccess(savedProduct);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred. Please try again.";
      setServerError(msg);
    } finally {
      setSubmitting(false);
      setStep("");
    }
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current && !submitting) onClose();
  };

  const inputCls =
    "w-full rounded-md border border-beige bg-white px-3 py-2.5 text-sm text-charcoal placeholder-charcoal/40 focus:border-sugarcane focus:outline-none focus:ring-1 focus:ring-sugarcane transition-colors";
  const labelCls = "block text-xs font-medium text-charcoal/70 mb-1";
  const errorCls = "mt-1 text-xs text-red-600";

  /* ── Image area rendering ── */
  const renderImageArea = () => {
    if (imgState.kind === "removed") {
      return (
        <div className="rounded-lg border border-dashed border-red-300 bg-red-50/50 p-4 text-center">
          <p className="text-xs text-red-600 mb-2">Image will be removed on save.</p>
          <div className="flex gap-2 justify-center">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={submitting}
              className="px-3 py-1.5 text-xs rounded-md bg-charcoal text-ivory hover:bg-forest transition-colors disabled:opacity-40"
            >
              Upload New Instead
            </button>
            <button
              type="button"
              onClick={handleRestoreImage}
              disabled={submitting}
              className="px-3 py-1.5 text-xs rounded-md border border-beige text-charcoal hover:bg-beige/40 transition-colors disabled:opacity-40"
            >
              Keep Existing
            </button>
          </div>
        </div>
      );
    }

    const previewSrc =
      imgState.kind === "new"
        ? imgState.preview
        : imgState.kind === "existing"
        ? imgState.url
        : null;

    if (previewSrc) {
      const isNew = imgState.kind === "new";
      const isExisting = imgState.kind === "existing";
      return (
        <div className="rounded-lg border border-beige bg-beige/10 overflow-hidden">
          {/* Label banner */}
          <div
            className={`text-xs px-3 py-1.5 font-medium flex items-center justify-between ${
              isNew
                ? "bg-sugarcane/10 text-sugarcane border-b border-sugarcane/20"
                : "bg-beige/40 text-charcoal/60 border-b border-beige"
            }`}
          >
            <span>
              {isNew
                ? `New image: ${(imgState as { kind: "new"; file: File; preview: string }).file.name}`
                : "Current image (Cloudinary)"}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={submitting}
                className="underline hover:no-underline transition-all disabled:opacity-40"
                aria-label="Change image"
              >
                Change
              </button>
              {(isNew || isExisting) && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  disabled={submitting}
                  className="text-red-500 underline hover:no-underline transition-all disabled:opacity-40"
                  aria-label="Remove image"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
          <img
            src={previewSrc}
            alt="Product image preview"
            className="w-full max-h-52 object-contain bg-white"
          />
        </div>
      );
    }

    return (
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={submitting}
        className="w-full flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-beige bg-beige/20 py-8 text-charcoal/50 hover:border-sugarcane hover:bg-sugarcane/5 hover:text-sugarcane transition-colors focus:outline-none focus:ring-2 focus:ring-sugarcane"
        aria-label="Upload product image"
      >
        <ImageIcon className="w-8 h-8" />
        <span className="text-sm">Click to upload image</span>
        <span className="text-xs">JPEG · PNG · WEBP · max 5 MB</span>
      </button>
    );
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-form-title"
    >
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-ivory shadow-2xl border border-beige flex flex-col">
        {/* Sticky header */}
        <div className="sticky top-0 z-10 flex items-center justify-between bg-ivory border-b border-beige px-6 py-4 shrink-0">
          <h2 id="product-form-title" className="font-serif text-xl text-charcoal">
            {mode === "add" ? "Add New Product" : "Edit Product"}
          </h2>
          <button
            onClick={onClose}
            disabled={submitting}
            aria-label="Close form"
            className="p-1.5 rounded-md hover:bg-beige transition-colors disabled:opacity-40"
          >
            <X className="w-5 h-5 text-charcoal/70" />
          </button>
        </div>

        {/* Scrollable form body */}
        <form
          id="product-form"
          onSubmit={handleSubmit}
          noValidate
          className="p-6 space-y-5 flex-1 min-h-0 overflow-y-auto"
        >
          {/* Server error banner */}
          {serverError && (
            <div
              role="alert"
              className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700"
            >
              {serverError}
            </div>
          )}

          {/* Row 1 – Name + Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="pf-name" className={labelCls}>
                Product Name <span className="text-red-500" aria-hidden="true">*</span>
              </label>
              <input
                ref={firstInputRef}
                id="pf-name"
                type="text"
                className={inputCls}
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
                placeholder="e.g. Eco Dinner Plate"
                disabled={submitting}
                aria-required="true"
                aria-describedby={fieldErrors.name ? "err-name" : undefined}
              />
              {fieldErrors.name && (
                <p id="err-name" className={errorCls} role="alert">
                  {fieldErrors.name}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="pf-category" className={labelCls}>
                Category <span className="text-red-500" aria-hidden="true">*</span>
              </label>
              <input
                id="pf-category"
                type="text"
                className={inputCls}
                value={form.category}
                onChange={(e) => setField("category", e.target.value)}
                placeholder="e.g. Plates"
                disabled={submitting}
                aria-required="true"
                aria-describedby={fieldErrors.category ? "err-category" : undefined}
              />
              {fieldErrors.category && (
                <p id="err-category" className={errorCls} role="alert">
                  {fieldErrors.category}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="pf-description" className={labelCls}>
              Description
            </label>
            <textarea
              id="pf-description"
              rows={3}
              className={`${inputCls} resize-none`}
              value={form.description}
              onChange={(e) => setField("description", e.target.value)}
              placeholder="Short product description…"
              disabled={submitting}
            />
          </div>

          {/* Row 2 – Price + Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="pf-price" className={labelCls}>
                Price (₹) <span className="text-red-500" aria-hidden="true">*</span>
              </label>
              <input
                id="pf-price"
                type="number"
                min={0}
                step="0.01"
                className={inputCls}
                value={form.price === 0 ? "" : form.price}
                onChange={(e) => setField("price", parseFloat(e.target.value) || 0)}
                placeholder="e.g. 499"
                disabled={submitting}
                aria-required="true"
                aria-describedby={fieldErrors.price ? "err-price" : undefined}
              />
              {fieldErrors.price && (
                <p id="err-price" className={errorCls} role="alert">
                  {fieldErrors.price}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="pf-stock" className={labelCls}>
                Stock Quantity <span className="text-red-500" aria-hidden="true">*</span>
              </label>
              <input
                id="pf-stock"
                type="number"
                min={0}
                step={1}
                className={inputCls}
                value={form.stockQuantity === 0 ? "" : form.stockQuantity}
                onChange={(e) =>
                  setField("stockQuantity", parseInt(e.target.value, 10) || 0)
                }
                placeholder="e.g. 150"
                disabled={submitting}
                aria-required="true"
                aria-describedby={fieldErrors.stockQuantity ? "err-stock" : undefined}
              />
              {fieldErrors.stockQuantity && (
                <p id="err-stock" className={errorCls} role="alert">
                  {fieldErrors.stockQuantity}
                </p>
              )}
            </div>
          </div>

          {/* Row 3 – Size + Material + Color */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="pf-size" className={labelCls}>
                Size <span className="text-red-500" aria-hidden="true">*</span>
              </label>
              <input
                id="pf-size"
                type="text"
                className={inputCls}
                value={form.size}
                onChange={(e) => setField("size", e.target.value)}
                placeholder="e.g. 10 inch"
                disabled={submitting}
                aria-required="true"
                aria-describedby={fieldErrors.size ? "err-size" : undefined}
              />
              {fieldErrors.size && (
                <p id="err-size" className={errorCls} role="alert">
                  {fieldErrors.size}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="pf-material" className={labelCls}>
                Material
              </label>
              <input
                id="pf-material"
                type="text"
                className={inputCls}
                value={form.material}
                onChange={(e) => setField("material", e.target.value)}
                placeholder="e.g. 100% Sugarcane Bagasse"
                disabled={submitting}
              />
            </div>
            <div>
              <label htmlFor="pf-color" className={labelCls}>
                Color
              </label>
              <input
                id="pf-color"
                type="text"
                className={inputCls}
                value={form.color}
                onChange={(e) => setField("color", e.target.value)}
                placeholder="e.g. Natural Ivory"
                disabled={submitting}
              />
            </div>
          </div>

          {/* Image upload */}
          <div>
            <label className={labelCls}>
              Product Image
              {imgState.kind === "removed" && (
                <span className="ml-2 text-red-500 font-normal">(will be removed)</span>
              )}
              {imgState.kind === "new" && (
                <span className="ml-2 text-sugarcane font-normal">(new file selected)</span>
              )}
            </label>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              id="pf-image"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              onChange={handleImageChange}
              disabled={submitting}
              aria-label="Upload product image file"
            />

            {renderImageArea()}

            {imageError && (
              <p className={errorCls} role="alert">
                {imageError}
              </p>
            )}
          </div>
        </form>

        {/* Sticky footer – always visible, no scroll needed */}
        <div className="sticky bottom-0 shrink-0 bg-ivory border-t border-beige px-6 py-4 flex flex-col-reverse sm:flex-row gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="flex-1 sm:flex-none px-5 py-2.5 rounded-md border border-beige text-sm text-charcoal hover:bg-beige/40 transition-colors disabled:opacity-40"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="product-form"
            disabled={submitting}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-2.5 rounded-md bg-sugarcane text-ivory text-sm font-medium hover:bg-forest transition-colors disabled:opacity-60"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                {step || "Saving…"}
              </>
            ) : mode === "add" ? (
              "Add Product"
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
