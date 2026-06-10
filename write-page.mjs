import { writeFileSync, mkdirSync } from "fs";

// Write main home page
const homePage = `"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./lib/firebase";
import { Search, MapPin, Phone, MessageCircle, Star } from "lucide-react";

const CATEGORIES = ["All", "Beauty & Salons", "Mechanics", "Plumbers", "Electricians", "Caterers", "Tailors", "Supermarkets", "Pharmacies", "Other"];

export default function Home() {
  const [businesses, setBusinesses] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const fetchBusinesses = async () => {
      const querySnapshot = await getDocs(collection(db, "businesses"));
      const list = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBusinesses(list);
      setFiltered(list);
      setLoading(false);
    };
    fetchBusinesses();
  }, []);

  useEffect(() => {
    let results = businesses;
    if (activeCategory !== "All") {
      results = results.filter(b => b.category === activeCategory);
    }
    if (search.trim()) {
      results = results.filter(b =>
        b.name.toLowerCase().includes(search.toLowerCase()) ||
        b.area.toLowerCase().includes(search.toLowerCase()) ||
        b.category.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFiltered(results);
  }, [search, activeCategory, businesses]);

  return (
    <main className="min-h-screen bg-[#f8f9ff]">
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <MapPin size={16} className="text-white" />
          </div>
          <span className="text-xl font-bold text-blue-600">SeekaBW</span>
        </div>
        <a href="/register" className="text-sm bg-blue-600 text-white px-4 py-2 rounded-full font-medium hover:bg-blue-700 transition">
          List your business
        </a>
      </nav>

      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white px-6 py-16 text-center">
        <h1 className="text-4xl font-bold mb-3">Find anything in Botswana</h1>
        <p className="text-blue-200 mb-8 text-lg">Salons, mechanics, caterers, plumbers and more — all near you</p>
        <div className="max-w-xl mx-auto relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, area or service..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-4 rounded-2xl text-gray-800 text-sm shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex gap-2 overflow-x-auto pb-3 mb-6">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={"whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition border " + (activeCategory === cat ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-200 hover:border-blue-300")}
            >
              {cat}
            </button>
          ))}
        </div>

        <p className="text-sm text-gray-400 mb-4">
          {loading ? "Loading..." : filtered.length + " business" + (filtered.length !== 1 ? "es" : "") + " found"}
        </p>

        {loading ? (
          <div className="flex flex-col gap-4">
            {[1,2,3].map(i => (
              <div key={i} className="bg-white rounded-2xl p-5 animate-pulse h-36 border border-gray-100" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Search size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">No businesses found</p>
            <p className="text-sm mt-1">Try a different search or category</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map(biz => (
              <div key={biz.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-lg font-bold text-gray-800">{biz.name}</h2>
                      {biz.verified && (
                        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-medium">Verified</span>
                      )}
                    </div>
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">{biz.category}</span>
                  </div>
                  <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full">
                    <Star size={13} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-semibold text-gray-700">{biz.rating}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                  <MapPin size={13} className="text-blue-400" /> {biz.area}
                </p>
                <p className="text-sm text-gray-600 mb-4">{biz.description}</p>
                <div className="flex gap-2">
                  <a href={"tel:" + biz.phone} className="flex items-center gap-2 text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full transition font-medium">
                    <Phone size={14} /> Call
                  </a>
                  <a href={"https://wa.me/" + biz.whatsapp} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full transition font-medium">
                    <MessageCircle size={14} /> WhatsApp
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <footer className="text-center text-sm text-gray-400 py-10 border-t border-gray-100 mt-10">
        <p className="font-semibold text-gray-500 mb-1">SeekaBW</p>
        <p>Connecting Botswana, one business at a time</p>
      </footer>
    </main>
  );
}`;

// Write register page
mkdirSync("app/register", { recursive: true });

const registerPage = `"use client";

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
    setLoading(true);
    try {
      await addDoc(collection(db, "businesses"), {
        ...data,
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
}`;

writeFileSync("app/page.js", homePage);
writeFileSync("app/register/page.js", registerPage);
console.log("Done! Both pages written successfully.");