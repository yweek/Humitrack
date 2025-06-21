import React, { useRef, useState, useEffect } from 'react';
import { Camera, Upload, X, Check, Image, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PhotoCaptureProps {
  onPhotoCapture: (photo: string) => void;
  onClose: () => void;
  existingPhoto?: string;
}

export default function PhotoCapture({ onPhotoCapture, onClose, existingPhoto }: PhotoCaptureProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string>(existingPhoto || '');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (existingPhoto) {
      setPreview(existingPhoto);
    }
  }, [existingPhoto]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsLoading(true);
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreview(result);
        setIsLoading(false);
      };
      reader.readAsDataURL(file);
    } else {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    if (preview) {
      onPhotoCapture(preview);
    }
    onClose();
  };

  const handleCameraCapture = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemovePhoto = () => {
    setPreview('');
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-lg shadow-2xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-serif font-bold text-amber-900">
              Add a Photo
            </h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="mb-6">
            {isLoading ? (
              <div className="h-64 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
              </div>
            ) : preview ? (
              <div className="relative">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-lg border-2 border-amber-200"
                />
                <button
                  onClick={handleRemovePhoto}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 shadow-md"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="h-64 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center">
                <Camera className="h-12 w-12 text-gray-400 mb-2" />
                <p className="text-gray-500 mb-4">No photo selected</p>
                <button
                  onClick={handleCameraCapture}
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 flex items-center space-x-2"
                >
                  <Camera className="h-5 w-5" />
                  <span>Take a photo</span>
                </button>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleCameraCapture}
                className="flex items-center justify-center space-x-2 bg-amber-600 text-white py-3 px-4 rounded-lg hover:bg-amber-700 transition-colors"
              >
                <Camera className="h-5 w-5" />
                <span>Camera</span>
              </button>

              <button
                onClick={handleCameraCapture}
                className="flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Image className="h-5 w-5" />
                <span>Gallery</span>
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileSelect}
              className="hidden"
            />

            <div className="flex space-x-3 pt-2">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!preview}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Check className="h-4 w-4" />
                <span>Save</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}