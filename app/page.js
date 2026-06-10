"use client";

import { auth } from "./lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./lib/firebase";
import { Search, MapPin, Phone, MessageCircle, Star } from "lucide-react";

const CATEGORIES = ["All", "Beauty & Salons", "Mechanics", "Plumbers", "Electricians", "Caterers", "Tailors", "Supermarkets", "Pharmacies", "Other"];

export default function Home() {
  const [user, setUser] = useState(null);
  const [businesses, setBusinesses] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    {
  const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  });

  return () => unsubscribe();
}
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
        <div className="flex items-center gap-3">
  {user ? (
    <>
      <span className="text-sm text-gray-600">
        {user.email}
      </span>

      <button
        onClick={handleLogout}
        className="text-sm bg-red-500 text-white px-4 py-2 rounded-full font-medium hover:bg-red-600"
      >
        Logout
      </button>

      <a
        href="/register"
        className="text-sm bg-blue-600 text-white px-4 py-2 rounded-full font-medium hover:bg-blue-700 transition"
      >
        List your business
      </a>
    </>
  ) : (
    <>
      <a
        href="/login"
        className="text-sm text-gray-600 hover:text-blue-600"
      >
        Login
      </a>

      <a
        href="/signup"
        className="text-sm bg-gray-100 text-gray-700 px-4 py-2 rounded-full font-medium hover:bg-gray-200"
      >
        Sign Up
      </a>
    </>
  )}
</div>
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
}