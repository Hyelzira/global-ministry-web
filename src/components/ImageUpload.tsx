import React, { useState, useRef } from 'react';
import { Upload, X, Image, Loader2 } from 'lucide-react';

const CLOUD_NAME = 'dveeb0yop';
const UPLOAD_PRESET = 'gfm_uploads';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  label = 'Image'
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadToCloudinary = async (file: File) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', UPLOAD_PRESET);
      formData.append('folder', 'global-flame-ministry');

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData }
      );

      const data = await response.json();

      if (data.secure_url) {
        onChange(data.secure_url);
      } else {
        alert('Upload failed. Please try again.');
      }
    } catch {
      alert('Upload failed. Please check your connection.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadToCloudinary(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      uploadToCloudinary(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
        {label}
      </label>

      {/* Preview */}
      {value && !isUploading && (
        <div className="relative mb-3 rounded-xl overflow-hidden border border-slate-200 aspect-video bg-slate-100">
          <img
            src={value}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Upload Area */}
      {!value && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
            isDragging
              ? 'border-fuchsia-500 bg-fuchsia-50'
              : 'border-slate-200 hover:border-fuchsia-400 hover:bg-slate-50'
          } ${isUploading ? 'cursor-not-allowed' : ''}`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 text-fuchsia-500 animate-spin" />
              <p className="text-sm font-medium text-slate-600">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                <Upload className="w-6 h-6 text-slate-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-700">
                  Click to upload or drag & drop
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  PNG, JPG, WebP up to 10MB
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Change image button when image exists */}
      {value && !isUploading && (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="mt-2 flex items-center gap-2 text-xs font-bold text-fuchsia-600 hover:text-fuchsia-800 uppercase tracking-widest transition-colors"
        >
          <Image className="w-3.5 h-3.5" />
          Change Image
        </button>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Manual URL fallback */}
      <div className="mt-3">
        <p className="text-xs text-slate-400 mb-1">Or paste an image URL directly:</p>
        <input
          type="url"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-fuchsia-500 transition-all text-slate-600 placeholder:text-slate-300"
        />
      </div>
    </div>
  );
};

export default ImageUpload;