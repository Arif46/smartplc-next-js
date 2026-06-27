"use client";

import { useEffect, useState } from "react";
import { User, Edit2, Save, Loader2 } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/authStore";
import { updateCustomerProfile } from "@/lib/userApi";
import { fetchCurrentUser } from "@/lib/customerPanelApi";

export default function CustomerProfileTab() {
  const { user, setUser } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [memberSince, setMemberSince] = useState("");
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    const load = async () => {
      try {
        const fresh = await fetchCurrentUser();
        setUser(fresh);
        setProfileData({
          firstName: fresh.first_name || "",
          lastName: fresh.last_name || "",
          email: fresh.email || "",
          phone: fresh.phone || "",
        });
        if (fresh.created_at) {
          setMemberSince(
            new Date(fresh.created_at).toLocaleDateString("en-BD", {
              month: "long",
              year: "numeric",
            })
          );
        }
      } catch {
        setProfileData({
          firstName: user?.first_name || "",
          lastName: (user as any)?.last_name || "",
          email: user?.email || "",
          phone: (user as any)?.phone || "",
        });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [setUser, user]);

  const displayName = `${profileData.firstName} ${profileData.lastName}`.trim() || user?.name || "Customer";

  const handleSave = async () => {
    if (!user?.id) return;
    try {
      setSaving(true);
      const updated = await updateCustomerProfile(user.id, {
        name: `${profileData.firstName} ${profileData.lastName}`.trim(),
        first_name: profileData.firstName,
        last_name: profileData.lastName,
        email: profileData.email,
        phone: profileData.phone as any,
      });
      setUser(updated);
      setProfileData({
        firstName: updated.first_name,
        lastName: updated.last_name,
        email: updated.email as any,
        phone: String(updated.phone || ""),
      });
      setIsEditing(false);
      toast.success("Profile updated");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-2xl p-12 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-6 py-5 border-b border-border">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Profile Information</h2>
          <p className="text-sm text-muted-foreground">Update your personal details</p>
        </div>
        <button
          type="button"
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          disabled={saving}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:brightness-105 disabled:opacity-60"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isEditing ? (
            <Save className="h-4 w-4" />
          ) : (
            <Edit2 className="h-4 w-4" />
          )}
          {isEditing ? "Save" : "Edit"}
        </button>
      </div>

      <div className="p-6">
        <div className="flex items-center gap-5 mb-8 pb-8 border-b border-border">
          <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center overflow-hidden">
            {(user as any)?.avatar ? (
              <Image
                src={(user as any).avatar}
                alt="Profile"
                width={80}
                height={80}
                className="h-20 w-20 object-cover"
              />
            ) : (
              <User className="h-10 w-10 text-muted-foreground" />
            )}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-foreground">{displayName}</h3>
            <p className="text-sm text-muted-foreground">{profileData.email}</p>
            {memberSince && (
              <p className="text-xs text-muted-foreground mt-1">Member since {memberSince}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[
            { label: "First Name", key: "firstName" as const },
            { label: "Last Name", key: "lastName" as const },
            { label: "Email", key: "email" as const, type: "email" },
            { label: "Phone", key: "phone" as const, type: "tel" },
          ].map((field) => (
            <div key={field.key}>
              <label className="block text-sm font-medium text-foreground mb-2">
                {field.label}
              </label>
              <input
                type={field.type || "text"}
                value={profileData[field.key]}
                onChange={(e) =>
                  setProfileData({ ...profileData, [field.key]: e.target.value })
                }
                disabled={!isEditing}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:bg-muted/40 disabled:text-muted-foreground"
              />
            </div>
          ))}
        </div>

        {isEditing && (
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setProfileData({
                  firstName: user?.first_name || "",
                  lastName: (user as any)?.last_name || "",
                  email: user?.email || "",
                  phone: (user as any)?.phone || "",
                });
              }}
              className="px-4 py-2 rounded-xl border border-border text-sm hover:bg-muted/50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium disabled:opacity-60"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
