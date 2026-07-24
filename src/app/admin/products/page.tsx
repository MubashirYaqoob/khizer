"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface SizeStock {
  size: string;
  stock: number;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  salePrice?: number;
  images: string[];
  sizes: string[];
  stock: number;
  isFeatured: boolean;
  isActive: boolean;
  category: { name: string };
  sizeStocks: SizeStock[];
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    salePrice: "",
    sizes: "XS,S,M,L,XL,XXL",
    categoryId: "",
    isFeatured: false,
    isActive: true,
    images: [] as string[],
  });

  const [details, setDetails] = useState({
    type: "",
    dupattaFabric: "",
    productId: "",
    liningAttached: "",
    numberOfPieces: "",
    productType: "",
    season: "",
    shirtFabric: "",
    topFit: "",
    topStyle: "",
    trouserFabrics: "",
    workTechnique: "",
  });

  // Per-size stock: { size: string, stock: number }[]
  const [sizeStocks, setSizeStocks] = useState<SizeStock[]>(
    "XS,S,M,L,XL,XXL".split(",").map((s) => ({ size: s.trim(), stock: 0 }))
  );

  const fetchData = async () => {
    setLoading(true);
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/categories"),
      ]);
      const productsData = await productsRes.json();
      const categoriesData = await categoriesRes.json();
      setProducts(productsData.products || []);
      setCategories(categoriesData.categories || []);
    } catch (e) {
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    const uploadedUrls: string[] = [];
    
    try {
      const sigRes = await fetch("/api/cloudinary-signature");
      if (!sigRes.ok) throw new Error("Failed to get upload signature");
      const { signature, timestamp, folder, cloudName, apiKey } = await sigRes.json();

      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("api_key", apiKey);
        formData.append("timestamp", timestamp.toString());
        formData.append("signature", signature);
        formData.append("folder", folder);

        const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: "POST",
          body: formData
        });
        const data = await uploadRes.json();
        if (data.secure_url) {
          const optimizedUrl = data.secure_url.replace("/upload/", "/upload/f_auto,q_auto/");
          uploadedUrls.push(optimizedUrl);
        }
      }
    } catch (err) {
      console.error("Upload error", err);
      alert("Failed to upload image(s).");
    }
    
    setForm((prev) => ({ ...prev, images: [...prev.images, ...uploadedUrls] }));
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (form.isFeatured) {
        if (form.name.trim().length < 5) {
          throw new Error("Featured products must have a real name (at least 5 characters).");
        }
        const placeholderPattern = /^(test|placeholder|kuch\s*b|demo|asdf|xyz|temp|dummy|abc)$/i;
        if (placeholderPattern.test(form.name.trim())) {
          throw new Error("Placeholder product names cannot be marked as featured.");
        }
        if (!form.images || form.images.length === 0) {
          throw new Error("Featured products must have at least one image.");
        }
      }

      const sizesArray = form.sizes.split(",").map((s) => s.trim()).filter(Boolean);
      // Sync sizeStocks with current sizes array
      const syncedSizeStocks = sizesArray.map((sz) => {
        const existing = sizeStocks.find((s) => s.size === sz);
        return { size: sz, stock: existing?.stock ?? 0 };
      });

      const payload = {
        ...form,
        price: parseFloat(form.price),
        salePrice: form.salePrice ? parseFloat(form.salePrice) : null,
        sizes: sizesArray,
        sizeStocks: syncedSizeStocks,
        details: details,
      };
      
      const url = editingId ? `/api/products/${editingId}` : "/api/products";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(JSON.stringify(data.error));
      }
      handleCancelForm();
      fetchData();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (product: Product) => {
    // We need to fetch the full product or just use what we have in the list.
    // The list lacks sizes and description, so ideally we'd fetch it, but we can try to find it from the API if needed.
    // Actually, since the GET /api/products returns what is needed (or we can just pre-fill what we have), let's fetch the full product first.
    fetchFullProductForEdit(product.slug);
  };

  const fetchFullProductForEdit = async (slug: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/products/${slug}`);
      const data = await res.json();
      if (data.product) {
        const p = data.product;
        setForm({
          name: p.name,
          slug: p.slug,
          description: p.description || "",
          price: p.price.toString(),
          salePrice: p.salePrice ? p.salePrice.toString() : "",
          sizes: p.sizes ? p.sizes.join(", ") : "",
          categoryId: p.categoryId,
          isFeatured: p.isFeatured,
          isActive: p.isActive,
          images: p.images || [],
        });
        // Load details
        if (p.details) {
          const d = typeof p.details === 'string' ? JSON.parse(p.details) : p.details;
          setDetails({
            type: d.type || "",
            dupattaFabric: d.dupattaFabric || "",
            productId: d.productId || "",
            liningAttached: d.liningAttached || "",
            numberOfPieces: d.numberOfPieces || "",
            productType: d.productType || "",
            season: d.season || "",
            shirtFabric: d.shirtFabric || "",
            topFit: d.topFit || "",
            topStyle: d.topStyle || "",
            trouserFabrics: d.trouserFabrics || "",
            workTechnique: d.workTechnique || "",
          });
        } else {
          setDetails({
            type: "",
            dupattaFabric: "",
            productId: "",
            liningAttached: "",
            numberOfPieces: "",
            productType: "",
            season: "",
            shirtFabric: "",
            topFit: "",
            topStyle: "",
            trouserFabrics: "",
            workTechnique: "",
          });
        }
        // Load per-size stocks
        if (p.sizeStocks && p.sizeStocks.length > 0) {
          setSizeStocks(p.sizeStocks.map((ss: SizeStock) => ({ size: ss.size, stock: ss.stock })));
        } else if (p.sizes) {
          setSizeStocks(p.sizes.map((sz: string) => ({ size: sz, stock: 0 })));
        }
        setEditingId(p.id);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      setError("Failed to fetch product details for editing");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingId(null);
    const defaultSizes = "XS,S,M,L,XL,XXL";
    setForm({ name: "", slug: "", description: "", price: "", salePrice: "", sizes: defaultSizes, categoryId: "", isFeatured: false, isActive: true, images: [] });
    setDetails({
      type: "",
      dupattaFabric: "",
      productId: "",
      liningAttached: "",
      numberOfPieces: "",
      productType: "",
      season: "",
      shirtFabric: "",
      topFit: "",
      topStyle: "",
      trouserFabrics: "",
      workTechnique: "",
    });
    setSizeStocks(defaultSizes.split(",").map((s) => ({ size: s.trim(), stock: 0 })));
  };

  // Sync sizeStocks list when sizes string changes
  const handleSizesChange = (sizesStr: string) => {
    setForm({ ...form, sizes: sizesStr });
    const newSizes = sizesStr.split(",").map((s) => s.trim()).filter(Boolean);
    setSizeStocks((prev) =>
      newSizes.map((sz) => {
        const existing = prev.find((p) => p.size === sz);
        return { size: sz, stock: existing?.stock ?? 0 };
      })
    );
  };

  const updateSizeStock = (size: string, stock: number) => {
    setSizeStocks((prev) =>
      prev.map((s) => (s.size === size ? { ...s, stock } : s))
    );
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    fetchData();
  };

  const autoSlug = (name: string) =>
    name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-garamond text-primary">Products</h1>
        <button
          onClick={() => showForm ? handleCancelForm() : setShowForm(true)}
          className="btn-primary text-sm px-5 py-2.5"
        >
          {showForm ? "Cancel" : "+ Add Product"}
        </button>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 mb-6 rounded text-sm">{error}</div>}

      {/* Add Product Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-surface border border-outline/20 p-6 rounded-lg mb-10 space-y-4"
        >
          <h2 className="text-xl font-garamond text-primary mb-4">
            {editingId ? "Edit Product" : "Add New Product"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-primary mb-1">Product Name *</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value, slug: autoSlug(e.target.value) })}
                className="w-full px-4 py-2.5 border border-outline/30 focus:border-gold outline-none bg-white"
              />
            </div>
            <div>
              <label className="block text-sm text-primary mb-1">Slug (auto-generated)</label>
              <input
                required
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="w-full px-4 py-2.5 border border-outline/30 focus:border-gold outline-none bg-white"
              />
            </div>
            <div>
              <label className="block text-sm text-primary mb-1">Price (Rs.) *</label>
              <input
                required
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full px-4 py-2.5 border border-outline/30 focus:border-gold outline-none bg-white"
              />
            </div>
            <div>
              <label className="block text-sm text-primary mb-1">Sale Price (Rs.) — optional</label>
              <input
                type="number"
                value={form.salePrice}
                onChange={(e) => setForm({ ...form, salePrice: e.target.value })}
                className="w-full px-4 py-2.5 border border-outline/30 focus:border-gold outline-none bg-white"
              />
            </div>

            <div>
              <label className="block text-sm text-primary mb-1">Category *</label>
              <select
                required
                value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                className="w-full px-4 py-2.5 border border-outline/30 focus:border-gold outline-none bg-white"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              {categories.length === 0 && (
                <p className="text-xs text-amber-600 mt-1">No categories found — add one first in the Categories section.</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm text-primary mb-1">Description *</label>
            <textarea
              required
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-4 py-2.5 border border-outline/30 focus:border-gold outline-none bg-white"
            />
          </div>

          {/* Product Specifications Details */}
          <div className="bg-surface p-4 rounded border border-outline/20 space-y-4">
            <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">Product Specifications</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs text-primary mb-1">Color / Type</label>
                <input
                  value={details.type}
                  onChange={(e) => setDetails({ ...details, type: e.target.value })}
                  placeholder="e.g. Turquoise"
                  className="w-full px-3 py-2 border border-outline/30 focus:border-gold outline-none bg-white text-xs"
                />
              </div>
              <div>
                <label className="block text-xs text-primary mb-1">Dupatta Fabric</label>
                <input
                  value={details.dupattaFabric}
                  onChange={(e) => setDetails({ ...details, dupattaFabric: e.target.value })}
                  placeholder="e.g. Chiffon"
                  className="w-full px-3 py-2 border border-outline/30 focus:border-gold outline-none bg-white text-xs"
                />
              </div>
              <div>
                <label className="block text-xs text-primary mb-1">Product ID</label>
                <input
                  value={details.productId}
                  onChange={(e) => setDetails({ ...details, productId: e.target.value })}
                  placeholder="e.g. EZD8776"
                  className="w-full px-3 py-2 border border-outline/30 focus:border-gold outline-none bg-white text-xs"
                />
              </div>
              <div>
                <label className="block text-xs text-primary mb-1">Lining Attached</label>
                <input
                  value={details.liningAttached}
                  onChange={(e) => setDetails({ ...details, liningAttached: e.target.value })}
                  placeholder="e.g. As shown in picture"
                  className="w-full px-3 py-2 border border-outline/30 focus:border-gold outline-none bg-white text-xs"
                />
              </div>
              <div>
                <label className="block text-xs text-primary mb-1">Number Of Pieces</label>
                <input
                  value={details.numberOfPieces}
                  onChange={(e) => setDetails({ ...details, numberOfPieces: e.target.value })}
                  placeholder="e.g. 3 piece - top + bottom + dupatta"
                  className="w-full px-3 py-2 border border-outline/30 focus:border-gold outline-none bg-white text-xs"
                />
              </div>
              <div>
                <label className="block text-xs text-primary mb-1">Product Type</label>
                <input
                  value={details.productType}
                  onChange={(e) => setDetails({ ...details, productType: e.target.value })}
                  placeholder="e.g. Festive/party wear"
                  className="w-full px-3 py-2 border border-outline/30 focus:border-gold outline-none bg-white text-xs"
                />
              </div>
              <div>
                <label className="block text-xs text-primary mb-1">Season</label>
                <input
                  value={details.season}
                  onChange={(e) => setDetails({ ...details, season: e.target.value })}
                  placeholder="e.g. All season"
                  className="w-full px-3 py-2 border border-outline/30 focus:border-gold outline-none bg-white text-xs"
                />
              </div>
              <div>
                <label className="block text-xs text-primary mb-1">Shirt Fabric</label>
                <input
                  value={details.shirtFabric}
                  onChange={(e) => setDetails({ ...details, shirtFabric: e.target.value })}
                  placeholder="e.g. Silk"
                  className="w-full px-3 py-2 border border-outline/30 focus:border-gold outline-none bg-white text-xs"
                />
              </div>
              <div>
                <label className="block text-xs text-primary mb-1">Top Fit</label>
                <input
                  value={details.topFit}
                  onChange={(e) => setDetails({ ...details, topFit: e.target.value })}
                  placeholder="e.g. Loose fit"
                  className="w-full px-3 py-2 border border-outline/30 focus:border-gold outline-none bg-white text-xs"
                />
              </div>
              <div>
                <label className="block text-xs text-primary mb-1">Top Style</label>
                <input
                  value={details.topStyle}
                  onChange={(e) => setDetails({ ...details, topStyle: e.target.value })}
                  placeholder="e.g. Straight cut kaftan"
                  className="w-full px-3 py-2 border border-outline/30 focus:border-gold outline-none bg-white text-xs"
                />
              </div>
              <div>
                <label className="block text-xs text-primary mb-1">Trouser Fabrics</label>
                <input
                  value={details.trouserFabrics}
                  onChange={(e) => setDetails({ ...details, trouserFabrics: e.target.value })}
                  placeholder="e.g. Silk"
                  className="w-full px-3 py-2 border border-outline/30 focus:border-gold outline-none bg-white text-xs"
                />
              </div>
              <div>
                <label className="block text-xs text-primary mb-1">Work Technique</label>
                <input
                  value={details.workTechnique}
                  onChange={(e) => setDetails({ ...details, workTechnique: e.target.value })}
                  placeholder="e.g. Embroidered"
                  className="w-full px-3 py-2 border border-outline/30 focus:border-gold outline-none bg-white text-xs"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm text-primary mb-1">Sizes (comma separated)</label>
            <input
              value={form.sizes}
              onChange={(e) => handleSizesChange(e.target.value)}
              placeholder="e.g. XS, S, M, L, XL"
              className="w-full px-4 py-2.5 border border-outline/30 focus:border-gold outline-none bg-white"
            />
          </div>

          {/* Per-size stock inputs */}
          {sizeStocks.length > 0 && (
            <div>
              <label className="block text-sm text-primary mb-3 font-medium">Stock per Size *</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {sizeStocks.map(({ size, stock }) => (
                  <div key={size} className="flex flex-col items-center gap-1.5">
                    <span className="text-xs font-semibold text-gold tracking-wider uppercase">{size}</span>
                    <input
                      type="number"
                      min="0"
                      value={stock}
                      onChange={(e) => updateSizeStock(size, parseInt(e.target.value) || 0)}
                      className={`w-full text-center px-2 py-2 border text-sm outline-none bg-white ${
                        stock === 0 ? "border-red-200 text-red-500" : "border-outline/30 focus:border-gold"
                      }`}
                    />
                    <span className={`text-xs ${stock === 0 ? "text-red-400" : "text-green-600"}`}>
                      {stock === 0 ? "Out of stock" : `${stock} pcs`}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-on-surface-variant mt-2">
                Total: {sizeStocks.reduce((sum, s) => sum + s.stock, 0)} pcs
              </p>
            </div>
          )}

          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                className="accent-gold w-4 h-4"
              />
              Featured Product
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                className="accent-gold w-4 h-4"
              />
              Active (visible on site)
            </label>
          </div>

          <div>
            <label className="block text-sm text-primary mb-2">Product Images *</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:bg-gold/10 file:text-gold hover:file:bg-gold/20"
            />
            {uploading && <p className="text-sm text-gold mt-2 animate-pulse">Uploading to Cloudinary...</p>}
            {form.images.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-3">
                {form.images.map((url, i) => (
                  <div key={i} className="relative w-20 h-20">
                    <Image src={url} alt={`img-${i}`} fill className="object-cover rounded border" />
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, images: form.images.filter((_, idx) => idx !== i) })}
                      className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={saving || uploading || form.images.length === 0}
            className="btn-primary disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Product"}
          </button>
        </form>
      )}

      {/* Products Table */}
      {loading ? (
        <div className="text-center py-16 text-on-surface-variant">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 text-on-surface-variant">
          <p className="text-lg font-garamond">No products yet</p>
          <p className="text-sm mt-2">Click "+ Add Product" to create your first listing.</p>
        </div>
      ) : (
        <>
          {/* Mobile Card Layout */}
          <div className="block sm:hidden space-y-4">
        {products.map((product) => (
          <div key={product.id} className="border border-outline/20 p-4 rounded-lg bg-surface space-y-3">
            <div className="flex gap-4">
              {product.images[0] && (
                <div className="relative w-16 h-16 shrink-0">
                  <Image src={product.images[0]} alt={product.name} fill className="object-cover rounded" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-primary truncate">{product.name}</h3>
                <p className="text-xs text-text-muted">{product.category?.name || "—"}</p>
                <p className="text-sm font-semibold text-gold mt-1">
                  Rs. {product.price.toLocaleString()}
                  {product.salePrice && <span className="text-green-600 text-xs ml-2">→ Rs. {product.salePrice.toLocaleString()}</span>}
                </p>
              </div>
            </div>
            
            <div className="pt-2 border-t border-outline/10 text-xs text-primary space-y-1">
              <span className="font-semibold block mb-1">Stock (per size):</span>
              <div className="flex flex-wrap gap-1">
                {product.sizeStocks && product.sizeStocks.length > 0 ? (
                  product.sizeStocks.map((ss) => (
                    <span key={ss.size} className={`px-1.5 py-0.5 rounded font-medium ${ss.stock === 0 ? "bg-red-50 text-red-500" : "bg-green-50 text-green-700"}`}>
                      {ss.size}: {ss.stock}
                    </span>
                  ))
                ) : (
                  <span>{product.stock}</span>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-outline/10">
              <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${product.isFeatured ? "bg-gold/10 text-gold" : "bg-gray-100 text-gray-500"}`}>
                {product.isFeatured ? "Featured" : "Regular"}
              </span>
              <div className="flex items-center gap-3">
                <button onClick={() => handleEdit(product)} className="text-blue-500 hover:text-blue-700 text-xs font-semibold">Edit</button>
                <button onClick={() => handleDelete(product.id)} className="text-red-500 hover:text-red-700 text-xs font-semibold">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table Layout */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-outline/20 text-on-surface-variant">
              <th className="text-left py-3 pr-4 font-medium">Image</th>
              <th className="text-left py-3 pr-4 font-medium">Name</th>
              <th className="text-left py-3 pr-4 font-medium">Category</th>
              <th className="text-left py-3 pr-4 font-medium">Price</th>
              <th className="text-left py-3 pr-4 font-medium">Stock (per size)</th>
              <th className="text-left py-3 pr-4 font-medium">Featured</th>
              <th className="text-left py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-outline/10 hover:bg-surface/50">
                <td className="py-3 pr-4">
                  {product.images[0] && (
                    <div className="relative w-12 h-12">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                  )}
                </td>
                <td className="py-3 pr-4 font-medium text-primary">{product.name}</td>
                <td className="py-3 pr-4 text-on-surface-variant">{product.category?.name || "—"}</td>
                <td className="py-3 pr-4">
                  Rs. {product.price.toLocaleString()}
                  {product.salePrice && (
                    <span className="text-green-600 ml-2">→ Rs. {product.salePrice.toLocaleString()}</span>
                  )}
                </td>
                <td className="py-3 pr-4">
                  {product.sizeStocks && product.sizeStocks.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {product.sizeStocks.map((ss) => (
                        <span key={ss.size} className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                          ss.stock === 0 ? "bg-red-50 text-red-500" : "bg-green-50 text-green-700"
                        }`}>
                          {ss.size}: {ss.stock}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span>{product.stock}</span>
                  )}
                </td>
                <td className="py-3 pr-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${product.isFeatured ? "bg-gold/10 text-gold" : "bg-gray-100 text-gray-500"}`}>
                    {product.isFeatured ? "Yes" : "No"}
                  </span>
                </td>
                <td className="py-3">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-blue-500 hover:text-blue-700 text-sm font-medium transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
      )}
    </div>
  );
}
