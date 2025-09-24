"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { writeClient } from "@/sanity/lib/client"; // Use writeClient instead
import toast from "react-hot-toast";

interface AddAddressDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddressAdded: () => void;
}

const initialFormState = {
  name: "",
  email: "",
  phone: "",
  address: "",
  area: "",
  city: "",
  customCity: "",
  county: "",
  postalCode: "",
  deliveryInstructions: "",
  isDefault: false,
};

// Kenyan counties for validation/autocomplete
const KENYAN_COUNTIES = [
  "Nairobi",
  "Mombasa",
  "Kwale",
  "Kilifi",
  "Tana River",
  "Lamu",
  "Taita-Taveta",
  "Garissa",
  "Wajir",
  "Mandera",
  "Marsabit",
  "Isiolo",
  "Meru",
  "Tharaka-Nithi",
  "Embu",
  "Kitui",
  "Machakos",
  "Makueni",
  "Nyandarua",
  "Nyeri",
  "Kirinyaga",
  "Murang'a",
  "Kiambu",
  "Turkana",
  "West Pokot",
  "Samburu",
  "Trans-Nzoia",
  "Uasin Gishu",
  "Elgeyo-Marakwet",
  "Nandi",
  "Baringo",
  "Laikipia",
  "Nakuru",
  "Narok",
  "Kajiado",
  "Kericho",
  "Bomet",
  "Kakamega",
  "Vihiga",
  "Bungoma",
  "Busia",
  "Siaya",
  "Kisumu",
  "Homa Bay",
  "Migori",
  "Kisii",
  "Nyamira",
];

const AddAddressDialog: React.FC<AddAddressDialogProps> = ({
  isOpen,
  onClose,
  onAddressAdded,
}) => {
  const [form, setForm] = useState(initialFormState);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = () => {
    if (!form.name.trim()) {
      toast.error("Address Name is required");
      return false;
    }
    if (!form.email.trim()) {
      toast.error("Email is required");
      return false;
    }
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    // Phone number validation - fixed regex
    if (!form.phone.match(/^\+254[0-9]{9}$/)) {
      toast.error(
        "Please enter a valid Kenyan phone number (e.g. +254712345678)"
      );
      return false;
    }
    if (form.address.trim().length < 5) {
      toast.error("Street Address must be at least 5 characters");
      return false;
    }
    if (!form.area.trim()) {
      toast.error("Area/Estate is required");
      return false;
    }
    if (!form.city.trim()) {
      toast.error("City is required");
      return false;
    }
    if (form.city === "other" && !form.customCity.trim()) {
      toast.error("Please specify the city name");
      return false;
    }
    if (!form.county.trim()) {
      toast.error("County is required");
      return false;
    }
    if (form.postalCode && !form.postalCode.match(/^[0-9]{5}$/)) {
      toast.error("Please enter a valid 5-digit postal code");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      // If setting as default, first unset other default addresses for this email
      if (form.isDefault) {
        await writeClient
          .patch({
            query: `*[_type == "address" && email == "${form.email}" && isDefault == true]`,
          })
          .set({ isDefault: false })
          .commit();
      }

      // Create the new address
      const newAddress = {
        _type: "address",
        name: form.name,
        email: form.email,
        phone: form.phone,
        address: form.address,
        area: form.area,
        city: form.city,
        customCity: form.city === "other" ? form.customCity : "",
        county: form.county,
        postalCode: form.postalCode,
        deliveryInstructions: form.deliveryInstructions,
        isDefault: form.isDefault,
        createdAt: new Date().toISOString(),
      };

      await writeClient.create(newAddress);
      toast.success("Address added successfully");
      onAddressAdded();
      onClose();
      setForm(initialFormState);
    } catch (error) {
      console.error("Error adding address:", error);
      toast.error("Failed to add address. Please check your permissions.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Delivery Address</DialogTitle>
          <DialogClose asChild>
            <button
              aria-label="Close"
              className="text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
          </DialogClose>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Label htmlFor="name">Address Name *</Label>
            <Input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Home, Office, etc."
              required
            />
          </div>

          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="your.email@example.com"
              required
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="+254712345678"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Format: +254XXXXXXXXX</p>
          </div>

          <div>
            <Label htmlFor="address">Street Address/Building *</Label>
            <Input
              id="address"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Building name, street name, house number"
              required
            />
          </div>

          <div>
            <Label htmlFor="area">Area/Estate *</Label>
            <Input
              id="area"
              name="area"
              value={form.area}
              onChange={handleChange}
              placeholder="e.g. Westlands, Karen, Kilimani"
              required
            />
          </div>

          <div>
            <Label htmlFor="city">City/Town *</Label>
            <select
              id="city"
              name="city"
              value={form.city}
              onChange={handleChange}
              required
              className="w-full border rounded-md p-2 focus:ring-2 focus:ring-kitenge-red focus:border-transparent"
            >
              <option value="">Select City</option>
              <option value="nairobi">Nairobi</option>
              <option value="mombasa">Mombasa</option>
              <option value="kisumu">Kisumu</option>
              <option value="nakuru">Nakuru</option>
              <option value="eldoret">Eldoret</option>
              <option value="thika">Thika</option>
              <option value="malindi">Malindi</option>
              <option value="kitale">Kitale</option>
              <option value="garissa">Garissa</option>
              <option value="kakamega">Kakamega</option>
              <option value="machakos">Machakos</option>
              <option value="meru">Meru</option>
              <option value="nyeri">Nyeri</option>
              <option value="other">Other</option>
            </select>
          </div>

          {form.city === "other" && (
            <div>
              <Label htmlFor="customCity">Custom City *</Label>
              <Input
                id="customCity"
                name="customCity"
                value={form.customCity}
                onChange={handleChange}
                placeholder="Enter city name"
                required
              />
            </div>
          )}

          <div>
            <Label htmlFor="county">County *</Label>
            <select
              id="county"
              name="county"
              value={form.county}
              onChange={handleChange}
              required
              className="w-full border rounded-md p-2 focus:ring-2 focus:ring-kitenge-red focus:border-transparent"
            >
              <option value="">Select County</option>
              {KENYAN_COUNTIES.map((county) => (
                <option key={county} value={county.toLowerCase()}>
                  {county}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="postalCode">Postal Code (Optional)</Label>
            <Input
              id="postalCode"
              name="postalCode"
              value={form.postalCode}
              onChange={handleChange}
              placeholder="e.g. 00100"
              maxLength={5}
            />
            <p className="text-xs text-gray-500 mt-1">5-digit postal code</p>
          </div>

          <div>
            <Label htmlFor="deliveryInstructions">Delivery Instructions</Label>
            <Textarea
              id="deliveryInstructions"
              name="deliveryInstructions"
              value={form.deliveryInstructions}
              onChange={handleChange}
              rows={3}
              placeholder="Any special instructions for delivery (landmarks, gate codes, etc.)"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              id="isDefault"
              name="isDefault"
              type="checkbox"
              checked={form.isDefault}
              onChange={handleChange}
              className="cursor-pointer w-4 h-4 text-kitenge-red focus:ring-kitenge-red border-gray-300 rounded"
            />
            <Label htmlFor="isDefault" className="cursor-pointer text-sm">
              Set as default address
            </Label>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-kitenge-red hover:bg-kitenge-red/90"
            >
              {submitting ? "Saving..." : "Save Address"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddAddressDialog;
