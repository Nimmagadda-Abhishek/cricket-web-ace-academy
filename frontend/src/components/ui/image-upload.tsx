import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  onImageUploaded: (imageUrl: string) => void;
  currentImageUrl?: string;
  folder?: string;
  className?: string;
  label?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageUploaded,
  currentImageUrl = '',
  folder = 'achievements',
  className = '',
  label = 'Image'
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>(currentImageUrl);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (JPEG, PNG, etc.)');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      // Create a preview URL
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);

      // Create form data for upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      // Upload the file
      const response = await fetch('https://cricket-web-ace-academy.onrender.com/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      
      // Call the callback with the uploaded image URL
      onImageUploaded(data.url);
      
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Failed to upload image. Please try again.');
      // Keep the preview if there was an error
    } finally {
      setIsUploading(false);
    }
  };

  // Handle removing the image
  const handleRemoveImage = () => {
    setPreviewUrl('');
    onImageUploaded('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor="image-upload">{label}</Label>
      
      <div className="flex flex-col gap-4">
        {/* Image preview */}
        {previewUrl && (
          <div className="relative w-full h-48 bg-gray-100 rounded-md overflow-hidden">
            <img 
              src={previewUrl.startsWith('blob:') || previewUrl.startsWith('http') ? previewUrl : `https://cricket-web-ace-academy.onrender.com${previewUrl}`} 
              alt="Preview" 
              className="w-full h-full object-cover"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8 rounded-full"
              onClick={handleRemoveImage}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
        
        {/* Upload controls */}
        <div className="flex gap-2">
          <Input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading}
            className="hidden"
            ref={fileInputRef}
          />
          
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex-1"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : previewUrl ? (
              <>
                <ImageIcon className="mr-2 h-4 w-4" />
                Change Image
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload Image
              </>
            )}
          </Button>
        </div>
        
        {/* Error message */}
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
      </div>
    </div>
  );
};

export { ImageUpload };