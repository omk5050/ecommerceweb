# Demo Backend & Admin Product Management Plan

**Project:** Earthform Eco-Friendly Dinnerware (Bagasse Plates & Bowls)  
**Goal:** Build a simple Admin Product-Management system for the first demo (Add Product → Upload Image to Cloudinary → Enter Details → Save to MongoDB Atlas → Display in Admin Panel).  
**Status:** Inspection & Architectural Planning Phase (No implementation or code modifications performed yet).

---

## 1. Existing Frontend Inspection & Findings

A comprehensive inspection of the existing codebase under `Ecofriendly website/src` yielded the following findings:

### 1.1 Frontend Framework & Tooling
* **Framework:** **Next.js 16.4.0** (App Router architecture).
* **React Version:** **React 19.3.0** with **React DOM 19.3.0**.
* **Language:** **TypeScript 5**.
* **Styling:** **Tailwind CSS v4** with `@tailwindcss/turbopack`. Custom theme colors defined in `src/app/globals.css`:
  * `ivory` (`#F8F6F0`)
  * `beige` (`#E9DFCE`)
  * `sugarcane` (`#354B37`)
  * `forest` (`#20372B`)
  * `sage` (`#A8B49A`)
  * `charcoal` (`#252923`)
* **Animation & Icons:** `framer-motion` (v14.1.0) and `lucide-react` (v1.55.0).
* **Existing Database Driver:** `mysql2` and `better-sqlite3` are installed in `package.json`. Next.js API routes (`src/app/api/`) currently run raw SQL queries against a local MySQL database (`src/lib/db.ts`).

---

### 1.2 Existing Folder Structure
```
Ecofriendly website/
├── .env                                  # Contains local MySQL configuration
├── package.json                          # Next.js 16, React 19, mysql2, framer-motion, lucide-react
├── next.config.ts                        # Turbopack & cache config (No Cloudinary remotePatterns yet)
├── tsconfig.json
├── public/
│   └── images/                           # Static sample assets (plates.jpg, bowls.jpg, etc.)
└── src/
    ├── app/
    │   ├── admin/
    │   │   └── page.tsx                  # Admin Dashboard (Orders & Products views)
    │   ├── api/
    │   │   ├── checkout/route.ts         # MySQL-based checkout simulation
    │   │   ├── orders/route.ts           # MySQL-based orders endpoint
    │   │   └── products/route.ts         # MySQL-based products GET endpoint
    │   ├── collections/
    │   │   ├── [category]/page.tsx       # Dynamic route (currently redirects to /collections)
    │   │   └── page.tsx                  # Catalog view fetching /api/products
    │   ├── product/
    │   │   └── [id]/page.tsx             # PDP (Product Detail Page) fetching /api/products?id=...
    │   ├── shop/page.tsx                 # Redirects to /collections
    │   ├── b2b/page.tsx                  # B2B inquiry page
    │   ├── contact/page.tsx              # Contact page
    │   ├── globals.css                   # Tailwind v4 theme definitions
    │   ├── layout.tsx                    # Root layout with Playfair & Inter fonts
    │   └── page.tsx                      # Landing page
    ├── components/
    │   ├── home/
    │   │   └── HomeSections.tsx          # Hero, ValueStrip, FeaturedCollections, Bestsellers
    │   └── layout/
    │       ├── Footer.tsx                # Global footer
    │       └── Navbar.tsx                # Global header & navigation
    └── lib/
        └── db.ts                         # MySQL connection pool & table seeding logic
```

---

### 1.3 Existing Admin / Dashboard Pages
* **File:** `src/app/admin/page.tsx`.
* **Current UI:**
  * Sidebar navigation with two tabs: **"Orders"** and **"Products"**.
  * **Orders Tab:** Displays a table of mock/fetched orders (Order ID, Customer, Date, Total, Status).
  * **Products Tab:** Displays a responsive 3-column grid (`grid-cols-1 md:grid-cols-3 gap-6`) showing:
    * Product image (`aspect-video`)
    * Product name (`font-medium text-lg`)
    * Product price (`₹{product.price}`)
    * An inactive button labeled **"Edit Product"**.
* **Current Limitations:**
  * **No "Add Product" button or modal.**
  * **No product creation or edit forms.**
  * **No image upload functionality.**

---

### 1.4 Existing Product Components
1. **`src/components/home/HomeSections.tsx` (`Bestsellers` section):**
   * Displays 4 hardcoded items (`Premium Classic Plate 9"`, `Deep Salad Bowl 500ml`, `Clamshell Container 3-Comp`, `Everyday Cup 250ml`).
2. **`src/app/collections/page.tsx`:**
   * Fetches data from `/api/products` using `fetch()` inside a `useEffect` hook.
   * Renders product grid with motion animations (`framer-motion`).
3. **`src/app/product/[id]/page.tsx`:**
   * Single product detail view (PDP). Fetches `/api/products?id=${productId}`.
   * Renders image gallery, price, pack size buttons (`50`, `250`, `1000` pcs), quantity counter, and a specifications list (Dimensions, Material, Capacity, Compostability).

---

### 1.5 Existing Product Cards
* Product cards are **not modularized** into a reusable component (e.g., `ProductCard.tsx`).
* Instead, card markup is duplicated in three different places:
  1. `src/components/home/HomeSections.tsx` (Hover quick-view layout)
  2. `src/app/collections/page.tsx` (E-commerce grid card with Next.js `<Image>`, title, description, price, link)
  3. `src/app/admin/page.tsx` (Admin card with thumbnail, title, price, "Edit Product" button)

---

### 1.6 Existing Product Forms
* **None exist.**
* There are no forms for adding, editing, or deleting products in the current codebase.

---

### 1.7 Existing Routing
* **App Router (`src/app`):**
  * Storefront catalog: `/collections` (with `/shop` and `/collections/[category]` redirecting to `/collections`).
  * Product Detail: `/product/[id]`.
  * Admin Portal: `/admin`.
  * Internal Next.js API route handlers: `/api/products`, `/api/orders`, `/api/checkout`.

---

### 1.8 Existing Mock / Seed Product Data
1. **Hardcoded in `HomeSections.tsx`:**
   * 4 items with basic fields: `id`, `name`, `desc`, `price`, `image`.
2. **Seeded in MySQL via `src/lib/db.ts`:**
   * `premium-classic-plate-9`: 9" plate, ₹450, `/images/plates.jpg`
   * `deep-salad-bowl-500ml`: 500ml bowl, ₹550, `/images/bowls.jpg`
   * `clamshell-container-3-comp`: 3-comp container, ₹750, `/images/containers.jpg`
   * `everyday-cup-250ml`: 250ml cup, ₹350, `/images/cups.jpg`

---

### 1.9 Existing State Management
* **No global state library** (No Redux, Zustand, Recoil, or React Context).
* All state is handled locally per page using React `useState` and `useEffect`.

---

### 1.10 Existing API / Fetch / Axios Code
* `axios` is **not installed**.
* The codebase exclusively uses native browser `fetch()`:
  * `fetch("/api/products")`
  * `fetch("/api/products?id=${productId}")`
  * `fetch("/api/orders")`
  * `fetch("/api/checkout", { method: "POST", ... })`

---

### 1.11 Product Fields Comparison

| Field Required for Demo | Present in Current UI? | Notes on Existing UI |
| :--- | :---: | :--- |
| **Product Name** | Yes | Displayed everywhere (`name`). |
| **Product Description** | Yes | Used in PDP and catalog (`description`). |
| **Category** | Partial | Featured in home page categories ("Plates", "Bowls", etc.), but not stored in database records. |
| **Price** | Yes | Numeric value displayed with rupee symbol (`₹{price}`). |
| **Size / Dimensions** | Partial | Existing UI calls this `dimensions` (e.g. `'9" diameter x 0.6" depth'`) or `capacity` (`500ml`). |
| **Material** | Yes | Displayed in PDP specifications (`"100% Sugarcane Bagasse"`). |
| **Color** | **No** | Not present in UI or database. (e.g., "Natural Ivory", "Bleached White"). |
| **Stock Quantity** | **No** | UI displays a static `"In Stock"` badge; no numeric stock quantity is tracked. |
| **Product Image** | Partial | Static string path (`/images/plates.jpg`). No Cloudinary URL support or upload mechanism. |

---

### 1.12 Image Upload Component
* **Does not exist.**
* There are no `<input type="file" />` elements, drag-and-drop zones, or image upload handlers anywhere in the current project.

---

### 1.13 Reusability of Existing Admin Page
* **Highly reusable.**
* `src/app/admin/page.tsx` already has:
  * Proper styling adhering to the design system (Forest, Ivory, Beige, Charcoal).
  * A working sidebar with a dedicated "Products" view.
  * A product grid layout ready to display newly created products.
* We can directly enhance `src/app/admin/page.tsx` by:
  1. Adding a clean **"+ Add Product"** button at the top header of the Products tab.
  2. Rendering an **"Add Product" Modal / Drawer / Form** right inside the admin view.
  3. Including an interactive image upload zone with Cloudinary preview.
  4. Automatically refreshing the admin product grid upon successful creation.

---

## 2. Product Fields Needed for First Demo

To satisfy the requirements of the demo and maintain compatibility with the existing UI, the Product schema will support:

1. **`name`** (String, required): Display name of the product (e.g., `Premium Bagasse Round Plate 10"`).
2. **`description`** (String, required): Detailed product description.
3. **`category`** (String, required): Product category (e.g., `Plates`, `Bowls`, `Containers`, `Cups & Trays`, `Cutlery`).
4. **`price`** (Number, required): Unit or pack price in INR (e.g., `450`).
5. **`size`** (String, required): Dimensions or physical size (e.g., `10 inch`, `500 ml`, `8x8 inch`).
6. **`material`** (String, required, default: `"100% Sugarcane Bagasse"`): Eco-friendly material specification.
7. **`color`** (String, required, default: `"Natural Ivory"`): Color finish (e.g., `Natural Ivory`, `Kraft Brown`, `White`).
8. **`stockQuantity`** (Number, required, default: `100`): Available inventory count.
9. **`imageUrl`** (String, required): Cloudinary secure URL (`https://res.cloudinary.com/...`).
10. **`imagePublicId`** (String, optional): Cloudinary asset ID (enables future image updates/deletions).
11. **`dimensions`** (String, optional alias/fallback for existing PDP compatibility).
12. **`capacity`** (String, optional alias/fallback for existing PDP compatibility).
13. **`compostability`** (String, optional, default: `"100% Compostable & Biodegradable"`).

---

## 3. Recommended Backend Structure (Node.js + Express)

To keep the architecture modular, robust, and clean, create a dedicated backend directory (e.g., `backend/` or `server/` alongside or inside the project).

```
backend/
├── config/
│   ├── db.js                 # MongoDB Atlas connection via Mongoose
│   └── cloudinary.js         # Cloudinary SDK configuration
├── controllers/
│   ├── productController.js  # Controller for create, list, and get products
│   └── uploadController.js   # Controller for handling Cloudinary image upload
├── middleware/
│   └── upload.js             # Multer middleware (in-memory buffer storage)
├── models/
│   └── Product.js            # Mongoose Product model schema
├── routes/
│   ├── productRoutes.js      # /api/products routes
│   └── uploadRoutes.js       # /api/upload routes
├── .env                      # MONGO_URI, CLOUDINARY_*, PORT
├── package.json              # express, mongoose, cloudinary, multer, cors, dotenv
└── server.js                 # Express app initialization & server entry point
```

---

## 4. Recommended MongoDB Mongoose Product Schema

```javascript
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Plates', 'Bowls', 'Containers', 'Cups & Trays', 'Cutlery', 'Other'],
      default: 'Plates',
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be a positive number'],
    },
    size: {
      type: String,
      required: [true, 'Size/Dimensions are required'],
      trim: true,
    },
    material: {
      type: String,
      required: [true, 'Material is required'],
      default: '100% Sugarcane Bagasse',
      trim: true,
    },
    color: {
      type: String,
      required: [true, 'Color is required'],
      default: 'Natural Ivory',
      trim: true,
    },
    stockQuantity: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    imageUrl: {
      type: String,
      required: [true, 'Product image URL is required'],
    },
    imagePublicId: {
      type: String,
      default: '',
    },
    // Optional compatibility fields with existing PDP
    dimensions: {
      type: String,
      default: '',
    },
    capacity: {
      type: String,
      default: '',
    },
    compostability: {
      type: String,
      default: '100% Compostable & Biodegradable',
    },
  },
  {
    timestamps: true, // Auto adds createdAt and updatedAt
  }
);

// Virtual for compatibility with existing UI that uses product.image instead of product.imageUrl
productSchema.virtual('image').get(function () {
  return this.imageUrl;
});

productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

export default mongoose.model('Product', productSchema);
```

---

## 5. Required API Endpoints

| Method | Endpoint | Description | Payload / Parameters | Response |
| :--- | :--- | :--- | :--- | :--- |
| **POST** | `/api/upload` | Upload single product image to Cloudinary | `multipart/form-data` with field `image` (binary file) | `{ success: true, imageUrl: string, publicId: string }` |
| **POST** | `/api/products` | Create a new product in MongoDB Atlas | JSON body with all 9 product fields | `{ success: true, product: Object }` |
| **GET** | `/api/products` | Get list of all products (for Admin & Catalog) | Optional query: `?category=...` | `[ { ...product }, ... ]` or `{ success: true, products: [...] }` |
| **GET** | `/api/products/:id`| Get single product details by MongoDB `_id` | Path param `id` | `{ success: true, product: Object }` |

*(Optional for future extensions: `PUT /api/products/:id` to edit and `DELETE /api/products/:id` to delete).*

---

## 6. Cloudinary Integration Requirements

### 6.1 Environment Variables Required
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 6.2 Upload Flow Recommendation
* **Server-side Upload with Multer Memory Storage (Recommended):**
  1. Frontend selects an image file and sends a `POST` request to `/api/upload` (`multipart/form-data`).
  2. Multer parses the image into memory buffer (`memoryStorage`).
  3. Express server streams buffer directly to Cloudinary using `cloudinary.v2.uploader.upload_stream`:
     * Folder: `earthform/products`
     * Allowed formats: `jpg`, `jpeg`, `png`, `webp`
     * Transformations: Auto optimization (`q_auto`, `f_auto`).
  4. Cloudinary returns secure HTTPS URL (`res.secure_url`) and `public_id`.
  5. Frontend receives the URL, populates the image preview, and submits the final product form to `/api/products`.

* **Benefit:** Keeps Cloudinary API secret safe on the server and avoids client-side credential exposure.

---

## 7. Frontend Changes That Will Eventually Be Required

*(Note: These will be implemented when instructed; documenting here for the plan)*

1. **Configure Cloudinary Remote Images in `next.config.ts`:**
   * Next.js `<Image />` will throw an error if loading an external URL without host permission.
   * Add `res.cloudinary.com` to `images.remotePatterns` in `next.config.ts`.
2. **Add "Add Product" Modal / Form to `src/app/admin/page.tsx`:**
   * Add a `"+ Add Product"` button in the Product Management header.
   * Add an interactive form modal/drawer containing inputs for:
     * Product Name (Text input)
     * Category (Select dropdown: Plates, Bowls, Containers, Cups & Trays, Cutlery, Other)
     * Description (Textarea)
     * Price (Number input with ₹ prefix)
     * Size / Dimensions (Text input, e.g., `10 inch` / `500 ml`)
     * Material (Text input, default: `100% Sugarcane Bagasse`)
     * Color (Select/Text input, e.g., `Natural Ivory`, `White`, `Kraft Brown`)
     * Stock Quantity (Number input, default: `100`)
     * Drag-and-drop / File Picker Image Upload box with live preview.
3. **Create an Image Upload Sub-component:**
   * File selection with instant preview.
   * Progress or loading indicator while uploading to Cloudinary.
   * Display of uploaded Cloudinary thumbnail with option to remove or replace.
4. **Update Frontend API Fetch URL:**
   * Connect Admin frontend to the Express backend endpoint (e.g. `http://localhost:5000/api/products` or via Next.js proxy/rewrites).
5. **Update Storefront PDP (`src/app/product/[id]/page.tsx`):**
   * Support both MongoDB `_id` and existing slug-based routing.
   * Read `product.imageUrl || product.image`.
   * Display the newly added `color` and `stockQuantity` fields.

---

## 8. Summary & Next Steps
This plan covers the entire blueprint for building the demo admin product management system without breaking the existing aesthetics or customer-facing pages.
Waiting for user instruction before writing any code or setting up the backend.
