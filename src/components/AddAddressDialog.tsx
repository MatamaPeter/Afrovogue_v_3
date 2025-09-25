"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { writeClient } from "@/sanity/lib/client";
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
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }
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
      if (form.isDefault) {
        await writeClient
          .patch({
            query: `*[_type == "address" && email == "${form.email}" && isDefault == true]`,
          })
          .set({ isDefault: false })
          .commit();
      }

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

  const handleClose = () => {
    setForm(initialFormState);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-md max-h-[95vh] overflow-y-auto bg-white border-gray-200 shadow-xl rounded-2xl">
        <DialogHeader className="border-b border-gray-100 pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold text-gray-900">
              Add New Delivery Address
            </DialogTitle>
            
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6 p-1">
          <div className="space-y-2">
            <Label
              htmlFor="name"
              className="font-semibold text-gray-900 text-sm"
            >
              Address Name *
            </Label>
            <Input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Home, Office, etc."
              required
              className="border-gray-300 focus:border-kitenge-red focus:ring-kitenge-red/20 transition-colors"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="font-semibold text-gray-900 text-sm"
            >
              Email *
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="your.email@example.com"
              required
              className="border-gray-300 focus:border-kitenge-red focus:ring-kitenge-red/20 transition-colors"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="phone"
              className="font-semibold text-gray-900 text-sm"
            >
              Phone Number *
            </Label>
            <Input
              id="phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="+254712345678"
              required
              className="border-gray-300 focus:border-kitenge-red focus:ring-kitenge-red/20 transition-colors"
            />
            <p className="text-xs text-gray-500 mt-1">Format: +254XXXXXXXXX</p>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="address"
              className="font-semibold text-gray-900 text-sm"
            >
              Street Address/Building *
            </Label>
            <Input
              id="address"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Building name, street name, house number"
              required
              className="border-gray-300 focus:border-kitenge-red focus:ring-kitenge-red/20 transition-colors"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="area"
              className="font-semibold text-gray-900 text-sm"
            >
              Area/Estate *
            </Label>
            <Input
              id="area"
              name="area"
              value={form.area}
              onChange={handleChange}
              placeholder="e.g. Westlands, Karen, Kilimani"
              required
              className="border-gray-300 focus:border-kitenge-red focus:ring-kitenge-red/20 transition-colors"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="city"
              className="font-semibold text-gray-900 text-sm"
            >
              City/Town *
            </Label>
            <select
              id="city"
              name="city"
              value={form.city}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-kitenge-red/20 focus:border-kitenge-red transition-colors bg-white text-gray-900"
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
            <div className="space-y-2">
              <Label
                htmlFor="customCity"
                className="font-semibold text-gray-900 text-sm"
              >
                Custom City *
              </Label>
              <Input
                id="customCity"
                name="customCity"
                value={form.customCity}
                onChange={handleChange}
                placeholder="Enter city name"
                required
                className="border-gray-300 focus:border-kitenge-red focus:ring-kitenge-red/20 transition-colors"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label
              htmlFor="county"
              className="font-semibold text-gray-900 text-sm"
            >
              County *
            </Label>
            <select
              id="county"
              name="county"
              value={form.county}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-kitenge-red/20 focus:border-kitenge-red transition-colors bg-white text-gray-900"
            >
              <option value="">Select County</option>
              {KENYAN_COUNTIES.map((county) => (
                <option key={county} value={county.toLowerCase()}>
                  {county}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="postalCode"
              className="font-semibold text-gray-900 text-sm"
            >
              Postal Code (Optional)
            </Label>
            <Input
              id="postalCode"
              name="postalCode"
              value={form.postalCode}
              onChange={handleChange}
              placeholder="e.g. 00100"
              maxLength={5}
              className="border-gray-300 focus:border-kitenge-red focus:ring-kitenge-red/20 transition-colors"
            />
            <p className="text-xs text-gray-500 mt-1">5-digit postal code</p>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="deliveryInstructions"
              className="font-semibold text-gray-900 text-sm"
            >
              Delivery Instructions
            </Label>
            <Textarea
              id="deliveryInstructions"
              name="deliveryInstructions"
              value={form.deliveryInstructions}
              onChange={handleChange}
              rows={3}
              placeholder="Any special instructions for delivery (landmarks, gate codes, etc.)"
              className="border-gray-300 focus:border-kitenge-red focus:ring-kitenge-red/20 transition-colors resize-none"
            />
          </div>

          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <input
              id="isDefault"
              name="isDefault"
              type="checkbox"
              checked={form.isDefault}
              onChange={handleChange}
              className="cursor-pointer w-4 h-4 text-kitenge-red focus:ring-kitenge-red border-gray-300 rounded transition-colors"
            />
            <Label
              htmlFor="isDefault"
              className="cursor-pointer text-sm font-medium text-gray-900"
            >
              Set as default address
            </Label>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1 border-gray-300 text-gray-700 hover:border-kitenge-red/50 hover:text-kitenge-red transition-colors font-medium"
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-kitenge-red hover:bg-kitenge-red/90 text-white font-medium shadow-sm hover:shadow-md transition-all"
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
