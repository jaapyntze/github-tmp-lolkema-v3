import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';

interface ImageUploadProps {
  onImageUploaded: (url: string) => void;
  currentImageUrl?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUploaded, currentImageUrl }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = async (file: File) => {
    try {
      setUploading(true);
      setError(null);

      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `blog-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('public')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('public')
        .getPublicUrl(filePath);

      onImageUploaded(publicUrl);
      setPreview(publicUrl);
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('Er is een fout opgetreden bij het uploaden van de afbeelding.');
    } finally {
      setUploading(false);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      if (file.size > 5 * 1024 * 1024) {
        setError('Bestand is te groot. Maximum grootte is 5MB.');
        return;
      }
      uploadImage(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxSize: 5 * 1024 * 1024,
    multiple: false
  });

  const removeImage = () => {
    setPreview(null);
    onImageUploaded('');
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-64 object-cover rounded-lg"
          />
          <button
            onClick={removeImage}
            className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 focus:outline-none"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-green-500 bg-green-50'
              : 'border-gray-300 hover:border-green-500'
          }`}
        >
          <input {...getInputProps()} />
          {uploading ? (
            <div className="flex flex-col items-center">
              <Loader2 className="h-8 w-8 text-green-600 animate-spin" />
              <p className="mt-2 text-sm text-gray-600">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Upload className="h-8 w-8 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">
                Sleep een afbeelding hierheen of klik om te uploaden
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PNG, JPG, GIF tot 5MB
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;