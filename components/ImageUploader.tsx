import React, { useRef, useState, useEffect } from 'react';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  onClearImage: () => void;
  previewUrl: string | null;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, onClearImage, previewUrl }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isNewlyUploaded, setIsNewlyUploaded] = useState(false);

  // Effect to provide visual feedback on new image upload
  useEffect(() => {
    if (previewUrl) {
      setIsNewlyUploaded(true);
      const timer = setTimeout(() => {
        setIsNewlyUploaded(false);
      }, 1500); // Feedback duration
      return () => clearTimeout(timer);
    }
  }, [previewUrl]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      onImageUpload(event.target.files[0]);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full flex flex-col items-center">
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      
      {previewUrl ? (
        <div className="w-full text-center">
          <img 
            src={previewUrl} 
            alt="Skin preview" 
            className={`max-h-64 w-auto mx-auto rounded-md object-contain border-2 transition-all duration-500 ease-in-out ${isNewlyUploaded ? 'border-green-500 scale-105 shadow-lg' : 'border-brand-gray'}`}
          />
          <button
            onClick={onClearImage}
            className="mt-4 bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition duration-300"
          >
            Remove Image
          </button>
        </div>
      ) : (
        <div 
          className="w-full h-64 border-2 border-dashed border-brand-gray rounded-lg flex flex-col justify-center items-center cursor-pointer hover:border-brand-blue hover:bg-gray-50 transition"
          onClick={handleUploadClick}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-brand-gray" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="mt-2 text-brand-dark font-semibold">Click to upload an image</p>
          <p className="text-sm text-gray-500">PNG, JPG, or JPEG</p>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;