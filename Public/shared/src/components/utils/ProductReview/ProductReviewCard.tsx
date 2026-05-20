import React, { useState } from 'react';
import { Star, X, ZoomIn } from 'lucide-react';

interface ProductReviewCardProps {
    rating?: number;
    title?: string;
    description?: string;
    productImage?: string;
    userImage?: string;
    userName?: string;
    date?: string;
    location?: string;
    verified?: boolean;
}

const ProductReviewCard = ({
    rating = 0,
    title,
    description,
    productImage,
    userImage,
    userName,
    date,
    location,
    verified = true
}: ProductReviewCardProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const renderStars = () => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i + 1}
                className={`w-3 h-3 ${i + 1 <= rating ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}`}
            />
        ));
    };

    return (
        <>
            <div className="group relative bg-white border border-gray-200 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-gray-300 h-full flex flex-col">
                {productImage && (
                    <div 
                        className="relative w-full aspect-video bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden cursor-pointer"
                        onClick={() => setIsModalOpen(true)}
                    >
                        <img
                            src={productImage}
                            alt="Product"
                            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        {/* Zoom icon indicator */}
                        {/* <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="bg-white/90 rounded-full p-2 shadow-lg">
                                <ZoomIn className="w-5 h-5 text-gray-800" />
                            </div>
                        </div> */}
                    </div>
                )}
                
                <div className="p-4 pt-4 flex-1 flex flex-col">
                    {(description || title) && (
                        <div className="relative text-gray-700 text-xs leading-relaxed mb-4 flex-1">
                            <span className="absolute -left-1 -top-1 text-2xl text-amber-400/20 font-serif leading-none">"</span>

                            <p
                                className="relative z-10 line-clamp-3 pl-2"
                                title={description || title}
                            >
                                {description || title}
                            </p>
                        </div>
                    )}

                    {!(description || title) && <div className="flex-1 mb-4" />}
                </div>

                <div className="px-4 pb-4 mt-auto border-t border-gray-100">
                    <div className="flex gap-2 items-center py-3">
                        <div className="relative flex-shrink-0">
                            <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full blur-sm opacity-30 group-hover:opacity-50 transition-opacity" />
                            <div className="relative size-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full overflow-hidden ring-2 ring-white shadow-sm">
                                {userImage ? (
                                    <img
                                        src={userImage}
                                        alt={userName || "User"}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600 text-xs font-semibold">
                                        {(userName || "U").charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 text-xs truncate">
                                {userName || title || "Verified Customer"}
                            </h3>

                            <div className="flex gap-0.5 mt-0.5">
                                {renderStars()}
                            </div>

                            {(date || location) && (
                                <div className="flex items-center gap-1 text-[10px] text-gray-500 mt-0.5">
                                    {location && <span className="truncate">{location}</span>}
                                    {location && date && <span>•</span>}
                                    {date && (
                                        <span className="whitespace-nowrap">
                                            {new Date(date).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Image Modal */}
            {isModalOpen && productImage && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 animate-in fade-in duration-200"
                    onClick={() => setIsModalOpen(false)}
                >
                    {/* Close button */}
                    <button
                        className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10 bg-black/50 rounded-full p-2 hover:bg-black/70"
                        onClick={() => setIsModalOpen(false)}
                        aria-label="Close modal"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    {/* Full size image */}
                    <img
                        src={productImage}
                        alt="Full size product"
                        className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </>
    );
};

export default ProductReviewCard;
