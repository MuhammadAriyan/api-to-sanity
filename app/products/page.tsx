"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import TriggerButton from "@/components/triggerButton";

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  image: string;
}

const Page = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageLoadError, setImageLoadError] = useState<{ [key: string]: boolean }>({});
  const [offset, setOffset] = useState(0); // Track pagination
  const [hasMore, setHasMore] = useState(true); // Check if more products exist

  const fetchProducts = async (start = 0) => {
    try {
      const response = await client.fetch(
        `*[_type=="product"]  [${start}...${start + 3}]{
          _id,
          name,
          price,
          description,
          image
        }`
      );
      
      if (response.length === 0) setHasMore(false); 

      setProducts((prev) => [...prev, ...response]); // Append new data
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(); 
  }, []);

  const loadMore = () => {
    if (!hasMore) return;
    setOffset((prev) => prev + 3);
    fetchProducts(offset + 3);
  };

  return (
    <div className="p-5 bg-[#F9F9F9] text-slate-900">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {loading && products.length === 0 ? (
          <p className="text-center col-span-full">Fetching</p>
        ) : products.length > 0 ? (
          products.map((product) => (
            <div className="bg-[#fefefe] rounded-3xl p-4 shadow-lg transition-transform hover:scale-[1.02]" key={product._id}>
              <Image
                className="aspect-square object-cover rounded-3xl"
                src={ urlFor(product.image).url() 
                }
                alt={product.name || "Product image"}
                width={500}
                height={500}
                priority
                onError={() => setImageLoadError((prev) => ({ ...prev, [product._id]: true }))} 
              />
              <h1 className="font-bold text-lg md:text-xl lg:text-2xl pt-4">{product.name}</h1>
              <div className="price font-bold text-xl">
                <sup className="text-gray-600">$</sup>
                <span>{product.price}.00</span>
              </div>
              <span className="text-slate-800 text-sm">{product.description}</span>
            </div>
          ))
        ) : (
          <p className="text-center col-span-full">No products available! Maybe someone bought them all....</p>
        )}
      </div>

      {/* Show More Button */}
      {hasMore && (
        <div className="flex justify-center mt-6">
          <button
            onClick={loadMore}
            className="bg-blue-500 text-white px-6 py-2 rounded-xl hover:bg-blue-600 transition shadow-md"
          >
            Show More 
          </button>
        </div>
      )}

      <TriggerButton />
    </div>
  );
};

export default Page;
