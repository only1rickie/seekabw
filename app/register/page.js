"use client";

import { auth } from "../lib/firebase";
import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useForm } from "react-hook-form";
import { MapPin, CheckCircle } from "lucide-react";

const CATEGORIES = ["Beauty & Salons", "Mechanics", "Plumbers", "Electricians", "Caterers", "Tailors", "Supermarkets", "Pharmacies", "Other"];
const AREAS = ["Gaborone CBD", "Tlokweng", "Mogoditshane", "Gabane", "Mmopane", "Phakalane", "Broadhurst", "Naledi", "Lobatse", "Francistown", "Maun", "Other"];

export default function Register() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    if (!auth.currentUser) {
  alert("Please login first");
  return;
}
    setLoading(true);
    try {
      await addDoc(collection(db, "businesses"), {
  ...data,
  ownerId: auth.currentUser.uid,
  ownerEmail: auth.currentUser.email,
  rating: 0,
  verified: false,
  createdAt: serverTimestamp()
});
      setSubmitted(true);
    } catch (err) {
      alert("Something went wrong. Please try again.");
      console.error(err);
    }
    setLoading(false);
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-[#f8f9ff] flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">You are listed!</h2>
          <p className="text-gray-500 mb-6">Your business has been submitted. Customers can now find you on SeekaBW.</p>
          <a href="/" className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-medium transition">
            Back to Home
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f9ff]">
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <a href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <MapPin size={16} className="text-white" />
          </div>
          <span className="text-xl font-bold text-blue-600">SeekaBW</span>
        </a>
      </nav>

      <div className="max-w-xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">List your business</h1>
          <p className="text-gray-500 mt-2">Get discovered by thousands of Batswana looking for your services</p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Business Name *</label>
              <input
                {...register("name", { required: "Business name is required" })}
                placeholder="e.g. Nails by Keabetswe"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Category *</label>
              <select
                {...register("category", { required: "Please select a category" })}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
              >
                <option value="">Select a category</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Area *</label>
              <select
                {...register("area", { required: "Please select an area" })}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
              >
                <option value="">Select an area</option>
                {AREAS.map(area => (
                  <option key={area} value={area}>{area}</option>
                ))}
              </select>
              {errors.area && <p className="text-red-500 text-xs mt-1">{errors.area.message}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Phone Number *</label>
              <input
                {...register("phone", { required: "Phone number is required" })}
                placeholder="e.g. +26771234567"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">WhatsApp Number</label>
              <input
                {...register("whatsapp")}
                placeholder="e.g. +26771234567 (optional)"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Description *</label>
              <textarea
                {...register("description", { required: "Please add a short description" })}
                placeholder="What services do you offer?"
                rows={3}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
              />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Opening Hours</label>
              <input
                {...register("hours")}
                placeholder="e.g. Mon-Sat 8am - 6pm"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-4 rounded-xl font-semibold text-sm transition mt-2"
            >
              {loading ? "Submitting..." : "List my business for free"}
            </button>

            <p className="text-xs text-center text-gray-400">Free forever. No credit card needed.</p>
          </form>
        </div>
      </div>
    </main>
  );
}