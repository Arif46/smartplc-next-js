"use client";

import { useEffect, useState } from "react";
import { MapPin, Plus, Pencil, Trash2, Loader2, Star } from "lucide-react";
import toast from "react-hot-toast";
import {
  fetchCustomerAddresses,
  createCustomerAddress,
  updateCustomerAddress,
  deleteCustomerAddress,
  type CustomerAddress,
} from "@/lib/customerPanelApi";

const emptyForm = {
  label: "home" as CustomerAddress["label"],
  name: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  postal_code: "",
  country: "Bangladesh",
  is_default: false,
};

export default function CustomerAddressesTab() {
  const [addresses, setAddresses] = useState<CustomerAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);

  const load = async () => {
    try {
      setLoading(true);
      const data = await fetchCustomerAddresses();
      setAddresses(data);
    } catch {
      toast.error("Failed to load addresses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async () => {
    if (!form.name || !form.address || !form.city) {
      toast.error("Please fill required fields");
      return;
    }
    try {
      setSaving(true);
      if (editingId) {
        await updateCustomerAddress(editingId, form);
        toast.success("Address updated");
      } else {
        await createCustomerAddress(form);
        toast.success("Address saved");
      }
      resetForm();
      await load();
    } catch {
      toast.error("Failed to save address");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (address: CustomerAddress) => {
    setForm({
      label: address.label,
      name: address.name,
      phone: address.phone || "",
      address: address.address,
      city: address.city,
      state: address.state || "",
      postal_code: address.postal_code || "",
      country: address.country || "Bangladesh",
      is_default: address.is_default,
    });
    setEditingId(address.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this address?")) return;
    try {
      await deleteCustomerAddress(id);
      toast.success("Address deleted");
      await load();
    } catch {
      toast.error("Failed to delete address");
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
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Saved Addresses</h2>
              <p className="text-sm text-muted-foreground">Manage delivery locations</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium"
          >
            <Plus className="h-4 w-4" />
            Add Address
          </button>
        </div>

        {addresses.length === 0 ? (
          <div className="p-10 text-center">
            <MapPin className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No saved addresses yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {addresses.map((address) => (
              <div key={address.id} className="px-6 py-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs uppercase tracking-wide font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      {address.label}
                    </span>
                    {address.is_default && (
                      <span className="inline-flex items-center gap-1 text-xs text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                        <Star className="h-3 w-3 fill-current" /> Default
                      </span>
                    )}
                  </div>
                  <p className="font-medium text-foreground">{address.name}</p>
                  <p className="text-sm text-muted-foreground mt-1">{address.address}</p>
                  <p className="text-sm text-muted-foreground">
                    {address.city}
                    {address.state ? `, ${address.state}` : ""}
                    {address.postal_code ? ` - ${address.postal_code}` : ""}
                  </p>
                  {address.phone && (
                    <p className="text-sm text-muted-foreground mt-1">Phone: {address.phone}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleEdit(address)}
                    className="p-2 rounded-lg border border-border hover:bg-muted/50"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(address.id)}
                    className="p-2 rounded-lg border border-border text-danger hover:bg-danger/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <div className="bg-card border border-border rounded-2xl shadow-sm p-6">
          <h3 className="font-semibold text-foreground mb-4">
            {editingId ? "Edit Address" : "New Address"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Label</label>
              <select
                value={form.label}
                onChange={(e) =>
                  setForm({ ...form, label: e.target.value as CustomerAddress["label"] })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background"
              >
                <option value="home">Home</option>
                <option value="work">Work</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Phone</label>
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">City</label>
              <input
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Street Address</label>
              <textarea
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">State / Division</label>
              <input
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Postal Code</label>
              <input
                value={form.postal_code}
                onChange={(e) => setForm({ ...form, postal_code: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background"
              />
            </div>
            <label className="md:col-span-2 flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.is_default}
                onChange={(e) => setForm({ ...form, is_default: e.target.checked })}
              />
              Set as default address
            </label>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 rounded-xl border border-border text-sm"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving}
              className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium disabled:opacity-60 inline-flex items-center gap-2"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {editingId ? "Update Address" : "Save Address"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
