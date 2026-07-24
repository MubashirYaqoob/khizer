import { prisma } from "@/lib/prisma";
import AnnouncementConfigForm from "@/components/AnnouncementConfigForm";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  // Fetch some quick stats
  const productsCount = await prisma.product.count({
    where: { isActive: true }
  });
  const categoriesCount = await prisma.category.count();
  const ordersCount = await prisma.order.count();
  const usersCount = await prisma.user.count();

  return (
    <div>
      <h1 className="text-3xl font-garamond text-primary mb-8">Dashboard Overview</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 bg-surface border border-outline/10 rounded-lg">
          <p className="text-sm text-on-surface-variant font-medium mb-1">Total Products</p>
          <p className="text-3xl font-bold text-primary">{productsCount}</p>
        </div>
        
        <div className="p-6 bg-surface border border-outline/10 rounded-lg">
          <p className="text-sm text-on-surface-variant font-medium mb-1">Total Categories</p>
          <p className="text-3xl font-bold text-primary">{categoriesCount}</p>
        </div>
        
        <div className="p-6 bg-surface border border-outline/10 rounded-lg">
          <p className="text-sm text-on-surface-variant font-medium mb-1">Total Orders</p>
          <p className="text-3xl font-bold text-primary">{ordersCount}</p>
        </div>

        <div className="p-6 bg-surface border border-outline/10 rounded-lg">
          <p className="text-sm text-on-surface-variant font-medium mb-1">Total Users</p>
          <p className="text-3xl font-bold text-primary">{usersCount}</p>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-garamond text-primary mb-4">Welcome to Khizar Fabric Store Admin</h2>
          <p className="text-on-surface-variant text-sm leading-relaxed">
            Use the sidebar to manage your products, categories, view incoming orders, and handle customer accounts. 
            To add a new suit, navigate to the <strong>Products</strong> section.
          </p>
        </div>
        <div>
          <AnnouncementConfigForm />
        </div>
      </div>
    </div>
  );
}
