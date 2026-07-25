"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  phone: string | null;
  createdAt: string;
}

interface ResetModalProps {
  user: User;
  onClose: () => void;
}

function ResetPasswordModal({ user, onClose }: ResetModalProps) {
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetUrl, setResetUrl] = useState<string | null>(null);

  const handleDirectReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to reset password");
      toast.success(`Password for "${user.name}" has been updated!`);
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateLink = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate link");
      if (data.resetUrl) {
        setResetUrl(data.resetUrl);
        toast.success("Reset link generated!");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to generate link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white max-w-md w-full p-6 rounded-lg shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-garamond text-xl text-primary">Reset Password</h2>
          <button onClick={onClose} className="text-text-muted hover:text-primary text-xl font-bold cursor-pointer">×</button>
        </div>
        <p className="text-sm text-text-muted mb-6">
          User: <span className="font-semibold text-primary">{user.name}</span> ({user.email})
        </p>

        {/* Option 1: Set directly */}
        <form onSubmit={handleDirectReset} className="space-y-3 mb-6">
          <p className="text-sm font-semibold text-primary">Option 1: Set a new password directly</p>
          <input
            type="password"
            placeholder="New password (min 6 chars)"
            value={newPassword}
            minLength={6}
            required
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-2 border border-outline/30 focus:border-gold outline-none text-sm bg-surface"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary disabled:opacity-50 text-sm cursor-pointer py-2"
          >
            {loading ? "Updating..." : "Set Password"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 border-t border-outline/20" />
          <span className="text-xs text-text-muted uppercase tracking-wider">Or</span>
          <div className="flex-1 border-t border-outline/20" />
        </div>

        {/* Option 2: Generate link */}
        <div className="space-y-3">
          <p className="text-sm font-semibold text-primary">Option 2: Generate a reset link for the user</p>
          {resetUrl ? (
            <>
              <div className="bg-surface border border-outline/20 rounded p-2 break-all text-xs font-mono select-all text-primary">
                {resetUrl}
              </div>
              <a
                href={resetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center text-sm text-gold hover:underline"
              >
                Open Link →
              </a>
              <p className="text-xs text-text-muted">This link expires in 1 hour. Share it with the user.</p>
            </>
          ) : (
            <button
              onClick={handleGenerateLink}
              disabled={loading}
              className="w-full border border-gold text-gold text-sm py-2 hover:bg-gold/5 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Generating..." : "Generate Reset Link"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminUsersPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [resetModalUser, setResetModalUser] = useState<User | null>(null);

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

  const handleRoleChange = async (id: string, newRole: string) => {
    if (id === (session?.user as any)?.id) {
      toast.error("You cannot change your own admin role.");
      return;
    }
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update role");
      toast.success(`Role updated to ${newRole}`);
      setUsers(users.map((u) => (u.id === id ? { ...u, role: newRole } : u)));
    } catch (error: any) {
      toast.error(error.message || "Failed to update role");
    } finally {
      setUpdatingId(null);
    }
  };

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
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete user");
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
      {resetModalUser && (
        <ResetPasswordModal user={resetModalUser} onClose={() => setResetModalUser(null)} />
      )}

      <div className="flex justify-between items-center border-b border-primary/10 pb-4">
        <div>
          <h1 className="font-garamond text-display-lg-mobile md:text-headline-md text-primary">
            Users Management
          </h1>
          <p className="text-body-md text-text-muted">
            Manage user accounts, roles, and passwords.
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
                    <td className="p-4 text-sm">{user.email}</td>
                    <td className="p-4">{user.phone || "N/A"}</td>
                    <td className="p-4">
                      {user.id === (session?.user as any)?.id ? (
                        <span className="inline-block px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider rounded bg-gold/20 text-gold-dark">
                          {user.role}
                        </span>
                      ) : (
                        <select
                          value={user.role}
                          disabled={updatingId === user.id}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          className="bg-surface border border-outline/30 text-xs font-semibold px-2 py-1 focus:border-gold outline-none transition-colors rounded cursor-pointer uppercase"
                        >
                          <option value="CUSTOMER">CUSTOMER</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
                      )}
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      {user.id !== (session?.user as any)?.id ? (
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => setResetModalUser(user)}
                            className="text-xs text-blue-600 hover:text-blue-800 font-semibold tracking-wider uppercase cursor-pointer"
                          >
                            Reset Password
                          </button>
                          <button
                            onClick={() => handleDelete(user.id, user.name)}
                            disabled={deletingId === user.id}
                            className="text-xs text-red-600 hover:text-red-800 font-semibold tracking-wider uppercase disabled:opacity-50 cursor-pointer"
                          >
                            {deletingId === user.id ? "..." : "Delete"}
                          </button>
                        </div>
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
