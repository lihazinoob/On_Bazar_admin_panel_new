import React from "react";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Trash2 } from "lucide-react";

interface ProductImageUploadSectionProps {
  images: File[];
  setImages: React.Dispatch<React.SetStateAction<File[]>>;
  existingImages?: string[];
  setExistingImages?: React.Dispatch<React.SetStateAction<string[]>>;
}

const ProductImageUploadSection: React.FC<ProductImageUploadSectionProps> = ({ 
  images, 
  setImages, 
  existingImages = [],
  setExistingImages
  
}) => {
  // function to handle Image Upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const uploadedImages = Array.from(files);
      setImages((prevImages) => [...prevImages, ...uploadedImages]);
    }
  };

  // Handle image deletion
  const handleImageDelete = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
  };

   // Handle existing image deletion (you might want to track this for API)
  const handleExistingImageDelete = (index: number) => {
    if (setExistingImages) {
      setExistingImages((prevImages) => 
        prevImages.filter((_, i) => i !== index)
      );
    } else {
      console.log('Cannot remove existing image: setExistingImages function not provided');
    }
  };

  return (
    <div>
      {/* header section */}
      <header className="text-xl font-semibold items-center">
        Product Image Upload
      </header>

      {/* Upload Button */}
      <div className="my-4">
        <Button type="button" variant="outline" asChild>
            <Label htmlFor="product-image-upload">
              Upload an Image
            </Label>
        </Button>
        
        <Input
          id="product-image-upload"
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleImageUpload}
        />
      </div>
      {/* Existing Images Section */}
      {existingImages.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold mb-2">Existing Images</h3>
          {existingImages.map((image, index) => (
            <div
              key={`existing-${index}`}
              className="flex items-center justify-between"
            >
              {/* Image Preview - Same styling as uploaded images */}
              <img
                src={image}
                alt={`Existing ${index + 1}`}
                className="w-60 h-60 object-cover rounded-md"
              />

              {/* Delete Button - Same styling as uploaded images */}
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => handleExistingImageDelete(index)}
              >
                <Trash2 />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Display Uploaded Images */}
      <div className="space-y-4">
        {images.map((image, index) => (
          <div
            key={`new-${index}`}
            className="flex items-center justify-between"
          >
            {/* Image Preview */}
            <img
              src={URL.createObjectURL(image)}
              alt={`Uploaded ${index + 1}`}
              className="w-60 h-60 object-cover rounded-md"
            />

            {/* Delete Button */}
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => handleImageDelete(index)}
            >
              <Trash2 />
            </Button>
          </div>
        ))}
      </div>

      
    </div>
  );
};

export default ProductImageUploadSection;