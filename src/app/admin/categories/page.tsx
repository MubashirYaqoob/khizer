"use client";

import { useState, useEffect } from "react";

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  _count?: { products: number };
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    imageUrl: "",
  });

  const fetchCategories = async () => {
    setLoading(true);
    const res = await fetch("/api/categories");
    const data = await res.json();
    setCategories(data.categories || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const url = editId ? `/api/categories/${editId}` : "/api/categories";
      const method = editId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || `Failed to ${editId ? "update" : "create"} category`);
      }
      setShowForm(false);
      setEditId(null);
      setForm({ name: "", slug: "", description: "", imageUrl: "" });
      fetchCategories();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (category: Category) => {
    setForm({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
      imageUrl: category.imageUrl || "",
    });
    setEditId(category.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditId(null);
    setForm({ name: "", slug: "", description: "", imageUrl: "" });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    
    try {
      const sigRes = await fetch("/api/cloudinary-signature");
      if (!sigRes.ok) throw new Error("Failed to get upload signature");
      const { signature, timestamp, folder, cloudName, apiKey } = await sigRes.json();

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
        setForm({ ...form, imageUrl: optimizedUrl });
      }
    } catch (err) {
      console.error("Upload error", err);
      alert("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const autoSlug = (name: string) =>
    name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

  const handleDelete = async (id: string, count: number) => {
    if (count > 0) {
      alert("Cannot delete category because it contains products. Please remove or reassign them first.");
      return;
    }
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete");
      }
      fetchCategories();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-garamond text-primary">Categories</h1>
        <button
          onClick={() => {
            if (showForm) {
              handleCancel();
            } else {
              setShowForm(true);
            }
          }}
          className="btn-primary text-sm px-5 py-2.5"
        >
          {showForm ? "Cancel" : "+ Add Category"}
        </button>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 mb-6 rounded text-sm">{error}</div>}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-surface border border-outline/20 p-6 rounded-lg mb-10 space-y-4"
        >
          <h2 className="text-xl font-garamond text-primary mb-4">
            {editId ? "Edit Category" : "New Category"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-primary mb-1">Category Name *</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value, slug: editId ? form.slug : autoSlug(e.target.value) })}
                className="w-full px-4 py-2.5 border border-outline/30 focus:border-gold outline-none bg-white"
                placeholder="e.g. Unstitched"
              />
            </div>
            <div>
              <label className="block text-sm text-primary mb-1">Slug (URL key) *</label>
              <input
                required
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="w-full px-4 py-2.5 border border-outline/30 focus:border-gold outline-none bg-white"
                placeholder="e.g. unstitched"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-primary mb-1">Description</label>
            <textarea
              rows={2}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-4 py-2.5 border border-outline/30 focus:border-gold outline-none bg-white"
            />
          </div>

          <div>
            <label className="block text-sm text-primary mb-1">Category Image (for Homepage)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:bg-gold/10 file:text-gold hover:file:bg-gold/20 mb-2"
            />
            {uploading && <p className="text-sm text-gold mt-1 animate-pulse">Uploading...</p>}
            {form.imageUrl && (
              <div className="mt-2 flex items-center gap-4">
                <img src={form.imageUrl} alt="Category preview" className="h-24 w-24 object-cover rounded border border-outline/20" />
                <button
                  type="button"
                  onClick={() => setForm({ ...form, imageUrl: "" })}
                  className="text-xs text-red-500 hover:text-red-700 border border-red-200 px-2 py-1 rounded"
                >
                  Remove Image
                </button>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving || uploading} className="btn-primary disabled:opacity-50">
              {saving ? "Saving..." : editId ? "Update Category" : "Save Category"}
            </button>
            {editId && (
              <button
                type="button"
                onClick={handleCancel}
                className="border border-outline/30 px-5 py-2.5 hover:bg-gray-50 text-sm font-medium transition-colors text-primary"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-center py-16 text-on-surface-variant">Loading...</div>
      ) : categories.length === 0 ? (
        <div className="text-center py-16 text-on-surface-variant">
          <p className="text-lg font-garamond">No categories yet</p>
          <p className="text-sm mt-2">Add your first category to start organizing products.</p>
          <div className="mt-8 text-left bg-amber-50 border border-amber-200 rounded-lg p-4 max-w-lg mx-auto text-sm text-amber-800">
            <strong>Suggested Categories:</strong>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Unstitched (slug: unstitched)</li>
              <li>Ready to Wear (slug: ready-to-wear)</li>
              <li>Bridal (slug: bridal)</li>
              <li>New Arrivals (slug: new-arrivals)</li>
              <li>Sale (slug: sale)</li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div key={cat.id} className="p-5 border border-outline/20 rounded-lg bg-surface hover:border-gold/30 transition-colors relative group">
              <div className="absolute top-4 right-4 flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity bg-white/95 backdrop-blur-sm p-1.5 rounded-md border border-outline/10 shadow-sm z-10">
                <button 
                  onClick={() => handleEdit(cat)}
                  className="text-blue-500 hover:text-blue-700 p-0.5 rounded transition-colors"
                  title="Edit category"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </button>
                <button 
                  onClick={() => handleDelete(cat.id, cat._count?.products || 0)}
                  className="text-red-500 hover:text-red-700 p-0.5 rounded transition-colors"
                  title="Delete category"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
              <div className="flex gap-4">
                {cat.imageUrl && (
                  <div className="shrink-0 w-16 h-16 rounded overflow-hidden">
                    <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover" />
                  </div>
                )}
                <div>
                  <h3 className="font-garamond text-xl text-primary pr-12">{cat.name}</h3>
                  <p className="text-xs text-gold mt-1 font-medium tracking-wider">/{cat.slug}</p>
                </div>
              </div>
              {cat.description && <p className="text-sm text-on-surface-variant mt-3">{cat.description}</p>}
              <p className="text-xs text-on-surface-variant mt-3 pt-3 border-t border-outline/10">
                {cat._count?.products ?? 0} products
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
