'use client';

import React from 'react';
import Link from 'next/link';
import { Home } from 'lucide-react';
import { atom } from "recoil";


interface BreadcrumbsProps {
  category?: string | null;
  subcategory?: string | null;
}

export const breadcrumbState = atom<{
  category?: string;
  subcategory?: string;
}>({
  key: "breadcrumbState",
  default: {},
});


export default function Breadcrumbs({ category, subcategory }: BreadcrumbsProps) {
  if (!category) {
    console.log("No category provided, returning null");
    return null;
  }

  const formattedCategory = category;
  const formattedSubcategory = subcategory;

  return (
    <nav className="flex items-center text-sm lg:text-base  relative z-50">
      <ol className="flex items-center space-x-1 text-black">
        <li>
          <Link href="/" className="text-gray-500 hover:text-gray-700">
            <Home className="w-4 h-4" />
          </Link>
        </li>
        <li className="text-gray-400">/</li>
        <li>
          <span className={category ? "text-gray-500" : "font-semibold"}>
            {category}
          </span>
        </li>
        {formattedSubcategory && (
          <>
            <li className="text-gray-400">/</li>
            <li className="font-semibold">{formattedSubcategory}</li>
          </>
        )}
      </ol>
    </nav>
  );
}