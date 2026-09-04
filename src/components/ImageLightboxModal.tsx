import React, { useEffect, useState } from 'react';
import { X, ZoomIn, ZoomOut, Maximize2, MapPin } from 'lucide-react';

interface ImageLightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title: string;
  location?: string;
  caption?: string;
}

export const ImageLightboxModal: React.FC<ImageLightboxModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  title,
  location,
  caption,
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setZoomLevel(1);
    } else {
      document.body.style.overflow = 'unset';
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.3, 2.2));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.3, 1));
  };

  const resetZoom = () => {
    setZoomLevel(1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl animate-fadeIn">
      {/* Top Bar Controls */}
      <div className="absolute top-5 left-6 right-6 flex items-center justify-between z-20 text-white">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-brand-purpleLight">
          <MapPin className="w-3.5 h-3.5 text-brand-purple" />
          <span>{location || 'Delhi NCR Luxury Corridor'}</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Zoom In Button */}
          <button
            onClick={handleZoomIn}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
            title="Zoom In"
            aria-label="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          {/* Zoom Out Button */}
          <button
            onClick={handleZoomOut}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
            title="Zoom Out"
            aria-label="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          {/* Reset Zoom Button */}
          {zoomLevel > 1 && (
            <button
              onClick={resetZoom}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all text-[11px] font-semibold"
              title="Reset Zoom"
              aria-label="Reset Zoom"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/15 hover:bg-brand-purple text-white flex items-center justify-center transition-all ml-2"
            title="Close"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Center Image Container with Smooth Scale Effect */}
      <div className="relative max-w-6xl w-full max-h-[80vh] flex flex-col items-center justify-center overflow-hidden rounded-2xl shadow-2xl">
        <div className="overflow-auto max-h-[75vh] w-full flex items-center justify-center p-2">
          <img
            src={imageUrl}
            alt={title}
            style={{ transform: `scale(${zoomLevel})` }}
            className="max-h-[75vh] w-auto max-w-full object-contain rounded-xl transition-transform duration-500 ease-out select-none shadow-2xl"
          />
        </div>

        {/* Caption Bar */}
        {(title || caption) && (
          <div className="w-full text-center py-4 px-6 bg-black/60 backdrop-blur-md rounded-b-2xl border-t border-white/10">
            <h4 className="text-white text-base font-semibold tracking-tight">{title}</h4>
            {caption && <p className="text-gray-300 text-xs font-light mt-1">{caption}</p>}
          </div>
        )}
      </div>
    </div>
  );
};
