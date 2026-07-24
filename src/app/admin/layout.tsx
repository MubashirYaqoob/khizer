import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { ReactNode } from "react";
import AdminMobileNav from "@/components/AdminMobileNav";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "ADMIN") {
    redirect("/login");
  }

  const navItems = [
    { name: "Dashboard", path: "/admin" },
    { name: "Banners", path: "/admin/banners" },
    { name: "Products", path: "/admin/products" },
    { name: "Categories", path: "/admin/categories" },
    { name: "Orders", path: "/admin/orders" },
    { name: "Users", path: "/admin/users" },
    { name: "Settings", path: "/admin/settings" },
  ];

  return (
    <div className="flex min-h-[calc(100vh-80px)] bg-surface pt-10 px-6 max-w-container mx-auto">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 pr-8 hidden md:block">
        <div className="sticky top-28 space-y-2">
          <h2 className="text-sm text-gold font-semibold tracking-wider mb-6">ADMIN PANEL</h2>
          <nav className="flex flex-col space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                className="px-4 py-3 rounded-md text-primary hover:bg-black/5 hover:text-gold transition-colors font-medium text-sm"
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 flex flex-col">
        {/* Mobile Navigation Drawer */}
        <AdminMobileNav navItems={navItems} />

        <div className="bg-white rounded-xl border border-outline/10 shadow-sm p-4 sm:p-6 md:p-10 min-h-[500px]">
          {children}
        </div>
      </main>
    </div>
  );
}
