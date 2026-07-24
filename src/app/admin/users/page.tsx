"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  phone: string | null;
  createdAt: string;
}

export default function AdminUsersPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      if (res.ok) {
        setUsers(data.users || []);
      }
    } catch (error) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (id === (session?.user as any)?.id) {
      toast.error("You cannot delete your own admin account.");
      return;
    }

    if (!confirm(`Are you sure you want to delete user "${name}"? This will permanently delete their account.`)) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to delete user");
      }

      toast.success(`User "${name}" deleted successfully`);
      setUsers(users.filter((user) => user.id !== id));
    } catch (error: any) {
      toast.error(error.message || "Failed to delete user");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-montserrat">
      <div className="flex justify-between items-center border-b border-primary/10 pb-4">
        <div>
          <h1 className="font-garamond text-display-lg-mobile md:text-headline-md text-primary">
            Users Management
          </h1>
          <p className="text-body-md text-text-muted">
            Manage user accounts and view store registrations.
          </p>
        </div>
      </div>

      <div className="bg-white border border-primary/10 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-cream text-label-caps text-gold border-b border-primary/10">
                <th className="p-4 text-xs font-semibold">Name</th>
                <th className="p-4 text-xs font-semibold">Email</th>
                <th className="p-4 text-xs font-semibold">Phone</th>
                <th className="p-4 text-xs font-semibold">Role</th>
                <th className="p-4 text-xs font-semibold">Registered Date</th>
                <th className="p-4 text-xs font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/10 text-body-md text-primary">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-text-muted">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-cream/20 transition-colors">
                    <td className="p-4 font-semibold">{user.name}</td>
                    <td className="p-4">{user.email}</td>
                    <td className="p-4">{user.phone || "N/A"}</td>
                    <td className="p-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider rounded ${
                          user.role === "ADMIN"
                            ? "bg-gold/20 text-gold-dark"
                            : "bg-primary/10 text-primary"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      {user.id !== (session?.user as any)?.id ? (
                        <button
                          onClick={() => handleDelete(user.id, user.name)}
                          disabled={deletingId === user.id}
                          className="text-xs text-red-600 hover:text-red-800 font-semibold tracking-wider uppercase disabled:opacity-50 cursor-pointer"
                        >
                          Delete
                        </button>
                      ) : (
                        <span className="text-xs text-text-muted italic">Self (Admin)</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
