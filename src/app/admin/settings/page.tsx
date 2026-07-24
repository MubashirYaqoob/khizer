import AnnouncementConfigForm from "@/components/AnnouncementConfigForm";

export default function AdminSettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-garamond text-primary mb-6 border-b pb-4">Store Settings</h1>
      <p className="text-sm text-text-muted mb-8">
        Configure the homepage announcement bar, bestsellers spotlight, second banner carousel (flash sale slides), editorial lookbook, and heritage brand story.
      </p>
      
      <div className="max-w-4xl">
        <AnnouncementConfigForm />
      </div>
    </div>
  );
}

