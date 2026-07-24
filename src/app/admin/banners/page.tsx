"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface Banner {
  id: string;
  imageUrl: string;
  title: string;
  subtitle: string | null;
  ctaText: string | null;
  ctaLink: string | null;
  order: number;
  isActive: boolean;
}

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    imageUrl: "",
    title: "",
    subtitle: "",
    ctaText: "",
    ctaLink: "",
    order: "0",
    isActive: true,
  });

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/banners");
      const data = await res.json();
      if (res.ok) {
        setBanners(data.banners || []);
      }
    } catch (e) {
      setError("Failed to load banners");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    
    try {
      const sigRes = await fetch("/api/cloudinary-signature");
      if (!sigRes.ok) throw new Error("Failed to get upload signature");
      const { signature, timestamp, folder, cloudName, apiKey } = await sigRes.json();

      const formData = new FormData();
      formData.append("file", files[0]);
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
        setForm((prev) => ({ ...prev, imageUrl: optimizedUrl }));
      }
    } catch (err) {
      console.error("Upload error", err);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.imageUrl) {
      setError("Please upload an image first.");
      return;
    }
    
    setSaving(true);
    setError("");
    try {
      const payload = {
        ...form,
        order: parseInt(form.order) || 0,
      };
      
      const url = editId ? `/api/banners/${editId}` : "/api/banners";
      const method = editId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      if (!res.ok) {
        throw new Error(`Failed to ${editId ? "update" : "save"} banner`);
      }
      
      setShowForm(false);
      setEditId(null);
      setForm({ imageUrl: "", title: "", subtitle: "", ctaText: "", ctaLink: "", order: "0", isActive: true });
      fetchBanners();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (banner: Banner) => {
    setForm({
      imageUrl: banner.imageUrl,
      title: banner.title,
      subtitle: banner.subtitle || "",
      ctaText: banner.ctaText || "",
      ctaLink: banner.ctaLink || "",
      order: String(banner.order),
      isActive: banner.isActive,
    });
    setEditId(banner.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditId(null);
    setForm({ imageUrl: "", title: "", subtitle: "", ctaText: "", ctaLink: "", order: "0", isActive: true });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this banner?")) return;
    await fetch(`/api/banners/${id}`, { method: "DELETE" });
    fetchBanners();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-garamond text-primary">Hero Banners</h1>
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
          {showForm ? "Cancel" : "+ Add Banner"}
        </button>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 mb-6 rounded text-sm">{error}</div>}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-surface border border-outline/20 p-6 rounded-lg mb-10 space-y-4"
        >
          <h2 className="text-xl font-garamond text-primary mb-4">
            {editId ? "Edit Banner" : "Add New Banner"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-primary mb-1">Title *</label>
              <input
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-2.5 border border-outline/30 focus:border-gold outline-none bg-white"
                placeholder="e.g. The Summer Collection"
              />
            </div>
            <div>
              <label className="block text-sm text-primary mb-1">Subtitle</label>
              <input
                value={form.subtitle}
                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                className="w-full px-4 py-2.5 border border-outline/30 focus:border-gold outline-none bg-white"
                placeholder="e.g. Seasonal Exclusive"
              />
            </div>
            <div>
              <label className="block text-sm text-primary mb-1">CTA Text</label>
              <input
                value={form.ctaText}
                onChange={(e) => setForm({ ...form, ctaText: e.target.value })}
                className="w-full px-4 py-2.5 border border-outline/30 focus:border-gold outline-none bg-white"
                placeholder="e.g. Shop Now"
              />
            </div>
            <div>
              <label className="block text-sm text-primary mb-1">CTA Link</label>
              <input
                value={form.ctaLink}
                onChange={(e) => setForm({ ...form, ctaLink: e.target.value })}
                className="w-full px-4 py-2.5 border border-outline/30 focus:border-gold outline-none bg-white"
                placeholder="e.g. /category/unstitched"
              />
            </div>
            <div>
              <label className="block text-sm text-primary mb-1">Display Order</label>
              <input
                type="number"
                value={form.order}
                onChange={(e) => setForm({ ...form, order: e.target.value })}
                className="w-full px-4 py-2.5 border border-outline/30 focus:border-gold outline-none bg-white"
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-primary mb-2">Banner Background Image *</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:bg-gold/10 file:text-gold hover:file:bg-gold/20"
            />
            {uploading && <p className="text-sm text-gold mt-2 animate-pulse">Uploading...</p>}
            {form.imageUrl && (
              <div className="relative w-48 h-24 mt-3">
                <Image src={form.imageUrl} alt="Banner Preview" fill className="object-cover rounded border" />
              </div>
            )}
          </div>

          <div className="flex gap-6 mt-4">
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

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving || uploading || !form.imageUrl}
              className="btn-primary disabled:opacity-50"
            >
              {saving ? "Saving..." : editId ? "Update Banner" : "Save Banner"}
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
        <div className="text-center py-16 text-on-surface-variant">Loading banners...</div>
      ) : banners.length === 0 ? (
        <div className="text-center py-16 text-on-surface-variant">
          <p className="text-lg font-garamond">No banners yet</p>
          <p className="text-sm mt-2">Click "+ Add Banner" to create your first homepage carousel slide.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {banners.map((banner) => (
            <div key={banner.id} className="border border-outline/20 rounded-lg overflow-hidden bg-white shadow-sm">
              <div className="relative w-full aspect-[2/1]">
                <Image src={banner.imageUrl} alt={banner.title} fill className="object-cover" />
                {!banner.isActive && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold tracking-widest uppercase">
                    Inactive
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-garamond text-xl text-primary font-medium">{banner.title}</h3>
                  <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded font-mono">Ord: {banner.order}</span>
                </div>
                {banner.subtitle && <p className="text-sm text-text-muted mb-2">{banner.subtitle}</p>}
                
                <div className="mt-4 pt-4 border-t border-outline/10 flex justify-end gap-3">
                  <button
                    onClick={() => handleEdit(banner)}
                    className="text-blue-500 hover:text-blue-700 text-sm font-medium transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(banner.id)}
                    className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
