"use client";

import { useState } from "react";
import { Eye, EyeOff, Shield, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { changePassword } from "@/lib/userApi";

export default function CustomerPasswordTab() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill all fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      const res = await changePassword(oldPassword, newPassword, confirmPassword);
      toast.success(res.message || "Password updated");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Security</h2>
            <p className="text-sm text-muted-foreground">Change your account password</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-5 max-w-xl">
        {[
          {
            label: "Current Password",
            value: oldPassword,
            set: setOldPassword,
            show: showOld,
            toggle: () => setShowOld(!showOld),
          },
          {
            label: "New Password",
            value: newPassword,
            set: setNewPassword,
            show: showNew,
            toggle: () => setShowNew(!showNew),
          },
          {
            label: "Confirm New Password",
            value: confirmPassword,
            set: setConfirmPassword,
            show: showConfirm,
            toggle: () => setShowConfirm(!showConfirm),
          },
        ].map((field) => (
          <div key={field.label} className="relative">
            <label className="block text-sm font-medium text-foreground mb-2">
              {field.label}
            </label>
            <input
              type={field.show ? "text" : "password"}
              value={field.value}
              onChange={(e) => field.set(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 pr-12"
            />
            <button
              type="button"
              onClick={field.toggle}
              className="absolute right-3 top-[38px] text-muted-foreground hover:text-foreground"
            >
              {field.show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:brightness-105 disabled:opacity-60 inline-flex items-center justify-center gap-2"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Update Password
        </button>
      </div>
    </div>
  );
}
