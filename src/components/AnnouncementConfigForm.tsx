"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";

interface SettingsState {
  announcement: string;
  // Spotlight
  spotlight_title: string;
  spotlight_subtitle: string;
  spotlight_category_slug: string;
  // Editorial Lookbook
  lookbook_title: string;
  lookbook_subtitle: string;
  lookbook_text: string;
  lookbook_image_1: string;
  lookbook_image_2: string;
  lookbook_cta_link: string;
  // Brand Story
  brand_story_title: string;
  brand_story_subtitle: string;
  brand_story_text: string;
  brand_story_image: string;
  // Flash Sale Banners
  flash_sale_banner_1_img: string;
  flash_sale_banner_1_link: string;
  flash_sale_banner_2_img: string;
  flash_sale_banner_2_link: string;
  flash_sale_banner_3_img: string;
  flash_sale_banner_3_link: string;
}

export default function AnnouncementConfigForm() {
  const [settings, setSettings] = useState<SettingsState>({
    announcement: "",
    spotlight_title: "",
    spotlight_subtitle: "",
    spotlight_category_slug: "",
    lookbook_title: "",
    lookbook_subtitle: "",
    lookbook_text: "",
    lookbook_image_1: "",
    lookbook_image_2: "",
    lookbook_cta_link: "",
    brand_story_title: "",
    brand_story_subtitle: "",
    brand_story_text: "",
    brand_story_image: "",
    flash_sale_banner_1_img: "",
    flash_sale_banner_1_link: "",
    flash_sale_banner_2_img: "",
    flash_sale_banner_2_link: "",
    flash_sale_banner_3_img: "",
    flash_sale_banner_3_link: "",
  });

  const [loadingKey, setLoadingKey] = useState<string | null>(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) {
          setSettings((prev) => ({
            ...prev,
            ...data.settings,
          }));
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setFetching(false));
  }, []);

  const handleSave = async (key: keyof SettingsState, value: string) => {
    setLoadingKey(key);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value }),
      });
      if (res.ok) {
        toast.success(`"${key.replace(/_/g, " ")}" updated successfully!`);
      } else {
        const data = await res.json();
        throw new Error(data.error || "Failed to update");
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoadingKey(null);
    }
  };

  const updateField = (key: keyof SettingsState, val: string) => {
    setSettings((prev) => ({ ...prev, [key]: val }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, key: keyof SettingsState, id: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    toast.loading("Uploading image...", { id });
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok) {
        updateField(key, data.url);
        toast.success("Uploaded successfully!", { id });
      } else throw new Error(data.error);
    } catch (err: any) {
      toast.error(err.message || "Upload failed", { id });
    }
  };

  const renderImageUploadField = (
    labelText: string,
    value: string,
    key: keyof SettingsState,
    toastId: string,
    fileInputId: string
  ) => {
    return (
      <div className="space-y-2">
        <label className="text-xs font-semibold text-primary block">{labelText}</label>
        
        {value ? (
          <div className="flex items-center gap-4 p-3 border border-outline/10 bg-white rounded-md">
            <div className="relative w-28 h-16 bg-[#faf7f2] rounded overflow-hidden flex-shrink-0 border">
              <img
                src={value}
                alt={labelText}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] text-text-muted truncate max-w-[180px]" title={value}>
                Image loaded successfully
              </span>
              <div className="flex gap-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, key, toastId)}
                  className="hidden"
                  id={fileInputId}
                />
                <label
                  htmlFor={fileInputId}
                  className="px-3 py-1.5 bg-primary text-white text-[10px] font-bold uppercase tracking-wider rounded cursor-pointer hover:bg-gold transition-colors inline-block text-center"
                >
                  Change Image
                </label>
              </div>
            </div>
          </div>
        ) : (
          <div className="border-2 border-dashed border-outline/25 rounded-md p-4 bg-[#faf7f2]/50 text-center flex flex-col items-center justify-center min-h-[100px]">
            <svg className="w-8 h-8 text-text-muted/65 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, key, toastId)}
              className="hidden"
              id={fileInputId}
            />
            <label
              htmlFor={fileInputId}
              className="px-4 py-2 bg-primary text-white text-[10px] font-bold uppercase tracking-wider rounded cursor-pointer hover:bg-gold transition-colors inline-block"
            >
              Choose Image File
            </label>
          </div>
        )}
      </div>
    );
  };

  if (fetching) return <div className="text-sm text-text-muted mt-4">Loading settings editor...</div>;

  return (
    <div className="space-y-8 max-w-xl">
      {/* 1. Announcement Bar */}
      <div className="bg-surface border border-outline/10 p-6 rounded-lg">
        <h3 className="font-garamond text-xl text-primary mb-3">Announcement Bar</h3>
        <p className="text-xs text-text-muted mb-4">Scrolling message at the top of the entire website.</p>
        <div className="space-y-3">
          <input
            type="text"
            value={settings.announcement}
            onChange={(e) => updateField("announcement", e.target.value)}
            placeholder="Free Delivery on Orders Above Rs. 10,000..."
            className="w-full px-4 py-2.5 border border-outline/30 focus:border-gold outline-none bg-white text-sm"
          />
          <button
            onClick={() => handleSave("announcement", settings.announcement)}
            disabled={loadingKey === "announcement"}
            className="btn-primary text-[10px] px-4 py-2"
          >
            {loadingKey === "announcement" ? "Saving..." : "Save Announcement"}
          </button>
        </div>
      </div>

      {/* 2. Spotlight Section */}
      <div className="bg-surface border border-outline/10 p-6 rounded-lg">
        <h3 className="font-garamond text-xl text-primary mb-3">Bestseller Spotlight</h3>
        <p className="text-xs text-text-muted mb-4">Configure titles and linked categories on the home page.</p>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-primary block mb-1">Spotlight Subtitle</label>
            <input
              type="text"
              value={settings.spotlight_subtitle}
              onChange={(e) => updateField("spotlight_subtitle", e.target.value)}
              placeholder="e.g. TOP RATED"
              className="w-full px-4 py-2 border border-outline/30 bg-white text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-primary block mb-1">Spotlight Title</label>
            <input
              type="text"
              value={settings.spotlight_title}
              onChange={(e) => updateField("spotlight_title", e.target.value)}
              placeholder="e.g. Our Bestsellers"
              className="w-full px-4 py-2 border border-outline/30 bg-white text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-primary block mb-1">Target Category Slug</label>
            <input
              type="text"
              value={settings.spotlight_category_slug}
              onChange={(e) => updateField("spotlight_category_slug", e.target.value)}
              placeholder="e.g. ready-to-wear"
              className="w-full px-4 py-2 border border-outline/30 bg-white text-sm"
            />
          </div>
          <button
            onClick={async () => {
              await handleSave("spotlight_subtitle", settings.spotlight_subtitle);
              await handleSave("spotlight_title", settings.spotlight_title);
              await handleSave("spotlight_category_slug", settings.spotlight_category_slug);
            }}
            disabled={!!loadingKey}
            className="btn-primary text-[10px] px-4 py-2"
          >
            {loadingKey ? "Saving..." : "Save Spotlight Settings"}
          </button>
        </div>
      </div>

      {/* 3. Flash Sale Banners (Second Carousel) */}
      <div className="bg-surface border border-outline/10 p-6 rounded-lg">
        <h3 className="font-garamond text-xl text-primary mb-3">Second Banner Carousel (Flash Sale)</h3>
        <p className="text-xs text-text-muted mb-4">Manage the secondary wide flash sale banner slides.</p>
        <div className="space-y-6">
          {/* Banner 1 */}
          <div className="border-t border-outline/10 pt-4 space-y-3">
            <h4 className="text-xs font-semibold text-gold uppercase tracking-wider">Slide 1</h4>
            {renderImageUploadField("Banner Image", settings.flash_sale_banner_1_img, "flash_sale_banner_1_img", "fs1", "fs-file-1")}
            <div>
              <label className="text-xs text-primary block mb-1">Slide Link Path</label>
              <input
                type="text"
                value={settings.flash_sale_banner_1_link}
                onChange={(e) => updateField("flash_sale_banner_1_link", e.target.value)}
                placeholder="/category/sale"
                className="w-full px-4 py-2 border border-outline/30 bg-white text-sm"
              />
            </div>
          </div>

          {/* Banner 2 */}
          <div className="border-t border-outline/10 pt-4 space-y-3">
            <h4 className="text-xs font-semibold text-gold uppercase tracking-wider">Slide 2</h4>
            {renderImageUploadField("Banner Image", settings.flash_sale_banner_2_img, "flash_sale_banner_2_img", "fs2", "fs-file-2")}
            <div>
              <label className="text-xs text-primary block mb-1">Slide Link Path</label>
              <input
                type="text"
                value={settings.flash_sale_banner_2_link}
                onChange={(e) => updateField("flash_sale_banner_2_link", e.target.value)}
                placeholder="/category/unstitched"
                className="w-full px-4 py-2 border border-outline/30 bg-white text-sm"
              />
            </div>
          </div>

          {/* Banner 3 */}
          <div className="border-t border-outline/10 pt-4 space-y-3">
            <h4 className="text-xs font-semibold text-gold uppercase tracking-wider">Slide 3</h4>
            {renderImageUploadField("Banner Image", settings.flash_sale_banner_3_img, "flash_sale_banner_3_img", "fs3", "fs-file-3")}
            <div>
              <label className="text-xs text-primary block mb-1">Slide Link Path</label>
              <input
                type="text"
                value={settings.flash_sale_banner_3_link}
                onChange={(e) => updateField("flash_sale_banner_3_link", e.target.value)}
                placeholder="/category/ready-to-wear"
                className="w-full px-4 py-2 border border-outline/30 bg-white text-sm"
              />
            </div>
          </div>

          <button
            onClick={async () => {
              await handleSave("flash_sale_banner_1_img", settings.flash_sale_banner_1_img);
              await handleSave("flash_sale_banner_1_link", settings.flash_sale_banner_1_link);
              await handleSave("flash_sale_banner_2_img", settings.flash_sale_banner_2_img);
              await handleSave("flash_sale_banner_2_link", settings.flash_sale_banner_2_link);
              await handleSave("flash_sale_banner_3_img", settings.flash_sale_banner_3_img);
              await handleSave("flash_sale_banner_3_link", settings.flash_sale_banner_3_link);
            }}
            disabled={!!loadingKey}
            className="btn-primary text-[10px] px-4 py-2 w-full mt-4"
          >
            {loadingKey ? "Saving..." : "Save All Flash Sale Slides"}
          </button>
        </div>
      </div>

      {/* 4. Editorial Lookbook */}
      <div className="bg-surface border border-outline/10 p-6 rounded-lg">
        <h3 className="font-garamond text-xl text-primary mb-3">Editorial Lookbook</h3>
        <p className="text-xs text-text-muted mb-4">Manage the lookbook banner section images and content.</p>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-primary block mb-1">Lookbook Subtitle</label>
            <input
              type="text"
              value={settings.lookbook_subtitle}
              onChange={(e) => updateField("lookbook_subtitle", e.target.value)}
              placeholder="e.g. Editor's Pick"
              className="w-full px-4 py-2 border border-outline/30 bg-white text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-primary block mb-1">Lookbook Title</label>
            <input
              type="text"
              value={settings.lookbook_title}
              onChange={(e) => updateField("lookbook_title", e.target.value)}
              placeholder="e.g. The Heritage Masterpieces"
              className="w-full px-4 py-2 border border-outline/30 bg-white text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-primary block mb-1">Lookbook Description</label>
            <textarea
              rows={3}
              value={settings.lookbook_text}
              onChange={(e) => updateField("lookbook_text", e.target.value)}
              placeholder="Enter lookbook paragraph text..."
              className="w-full px-4 py-2 border border-outline/30 bg-white text-sm"
            />
          </div>
          {renderImageUploadField("Left Image", settings.lookbook_image_1, "lookbook_image_1", "upload1", "lookbook-file-1")}
          {renderImageUploadField("Right Image", settings.lookbook_image_2, "lookbook_image_2", "upload2", "lookbook-file-2")}
          <div>
            <label className="text-xs text-primary block mb-1">CTA Target Link</label>
            <input
              type="text"
              value={settings.lookbook_cta_link}
              onChange={(e) => updateField("lookbook_cta_link", e.target.value)}
              placeholder="e.g. /category/ready-to-wear"
              className="w-full px-4 py-2 border border-outline/30 bg-white text-sm"
            />
          </div>
          <button
            onClick={async () => {
              await handleSave("lookbook_subtitle", settings.lookbook_subtitle);
              await handleSave("lookbook_title", settings.lookbook_title);
              await handleSave("lookbook_text", settings.lookbook_text);
              await handleSave("lookbook_image_1", settings.lookbook_image_1);
              await handleSave("lookbook_image_2", settings.lookbook_image_2);
              await handleSave("lookbook_cta_link", settings.lookbook_cta_link);
            }}
            disabled={!!loadingKey}
            className="btn-primary text-[10px] px-4 py-2"
          >
            {loadingKey ? "Saving..." : "Save Lookbook Settings"}
          </button>
        </div>
      </div>

      {/* 5. Brand Story */}
      <div className="bg-surface border border-outline/10 p-6 rounded-lg">
        <h3 className="font-garamond text-xl text-primary mb-3">Heritage Brand Story</h3>
        <p className="text-xs text-text-muted mb-4">Edit the central brand storytelling legacy details.</p>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-primary block mb-1">Story Subtitle</label>
            <input
              type="text"
              value={settings.brand_story_subtitle}
              onChange={(e) => updateField("brand_story_subtitle", e.target.value)}
              placeholder="e.g. Our Legacy"
              className="w-full px-4 py-2 border border-outline/30 bg-white text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-primary block mb-1">Story Title</label>
            <input
              type="text"
              value={settings.brand_story_title}
              onChange={(e) => updateField("brand_story_title", e.target.value)}
              placeholder="e.g. Crafted With Heritage"
              className="w-full px-4 py-2 border border-outline/30 bg-white text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-primary block mb-1">Story Paragraph</label>
            <textarea
              rows={4}
              value={settings.brand_story_text}
              onChange={(e) => updateField("brand_story_text", e.target.value)}
              placeholder="Describe the heritage..."
              className="w-full px-4 py-2 border border-outline/30 bg-white text-sm"
            />
          </div>
          {renderImageUploadField("Background Image", settings.brand_story_image, "brand_story_image", "upload3", "brand-story-file")}
          <button
            onClick={async () => {
              await handleSave("brand_story_subtitle", settings.brand_story_subtitle);
              await handleSave("brand_story_title", settings.brand_story_title);
              await handleSave("brand_story_text", settings.brand_story_text);
              await handleSave("brand_story_image", settings.brand_story_image);
            }}
            disabled={!!loadingKey}
            className="btn-primary text-[10px] px-4 py-2"
          >
            {loadingKey ? "Saving..." : "Save Brand Story Settings"}
          </button>
        </div>
      </div>
    </div>
  );
}
