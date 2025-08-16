import type { Product } from "@/api/Product";
import ProductDetailsInputForm from "@/components/products/ProductDetailsInputForm";
import ProductImageUploadSection from "@/components/products/ProductImageUploadSection";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

interface ProductSizeQuantity {
  size: string;
  quantity: number;
}

// Define the type of Product Data
interface ProductData {
  name: string;
  description: string;
  productPrice: number;
  salesPercentage: number;
  calculatedPriceAfterDiscount: number;
  totalProducts: number;
  categoryId: number | null;
  sizes: ProductSizeQuantity[];
  isFeatured: boolean;
  isNew: boolean;
  isSoldOut: boolean;
  colors: string[];
}

const UpdateProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigation = useNavigate();
  const location = useLocation();

  // Get the product data from the navigation state
  const productFromState = location.state?.product as Product;

  const [productData, setProductData] = useState<ProductData>({
    name: "",
    description: "",
    productPrice: 100,
    salesPercentage: 0,
    calculatedPriceAfterDiscount: 100,
    totalProducts: 0,
    categoryId: null,
    sizes: [
      { size: "S", quantity: 0 },
      { size: "M", quantity: 0 },
      { size: "L", quantity: 0 },
      { size: "XL", quantity: 0 },
      { size: "XXL", quantity: 0 },
    ],
    isFeatured: false,
    isNew: false,
    isSoldOut: false,
    colors: [],
  });

  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load product data when component mounts
  useEffect(() => {
    if (!id) {
      toast.error("No product ID provided");
      navigation("/products/all");
      return;
    }

    if (!productFromState) {
      toast.error(
        "No product data found. Please navigate from the products list."
      );
      navigation("/products/all");
      return;
    }

    // Map product data from state to form data
    setProductData({
      name: productFromState.product_name,
      description: productFromState.product_description,
      productPrice: productFromState.product_price,
      salesPercentage: productFromState.product_sale_percentage,
      calculatedPriceAfterDiscount:
        productFromState.product_price -
        (productFromState.product_price *
          productFromState.product_sale_percentage) /
          100,
      totalProducts: productFromState.product_quantity,
      categoryId: productFromState.product_category_id,
      sizes: productFromState.product_size,
      isFeatured: productFromState.is_featured_product,
      isNew: productFromState.is_new_product,
      isSoldOut: productFromState.is_sold_out,
      colors: productFromState.product_colors || [],
    });

    setExistingImages(productFromState.product_image);
  }, [id, productFromState, navigation]);

  // handle form submission
  const handleSubmit = async () => {
    if (
      !productData.name ||
      !productData.description ||
      !productData.categoryId
    ) {
      toast.error(
        "Please fill in all required fields (Name, Description, Category)"
      );
      return;
    }

    setIsSubmitting(true);

    // Here you would typically send the productData and images to your API
    try {
      // Simulate API call
      

      const formData = new FormData();
      
      formData.append("productData", JSON.stringify(productData));
      images.forEach((image, index) => {
        formData.append(`image_${index}`, image);
      });

      formData.append("existingImages", JSON.stringify(existingImages));

      // Actual API call would go here
      const response = await fetch(`https://raw-node-js.onrender.com/api/updateProduct/${id}`,{
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Failed to update product");
      }


      console.log("=== FORMDATA CONTENTS ===");
      for (const [key, value] of formData.entries()) {
        console.log(key, value);
      }

      toast.success("Product updated successfully!");
      navigation("/products/all");
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product.");
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleBack = () => {
    navigation("/products/all");
  };

  // Show loading if no product data (shouldn't happen with proper navigation)
  if (!productFromState) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="mt-2">Loading product data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Update product</h1>
          <p className="text-muted-foreground">Update the product details</p>
        </div>
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Button>
      </div>

      {/* Product Form */}
      <div className="grid grid-cols-3 gap-6">
        {/* Product Image Upload and Image Show Column */}
        <div className="col-span-1">
          <ProductImageUploadSection
            images={images}
            setImages={setImages}
            existingImages={existingImages}
            setExistingImages={setExistingImages}
          />
        </div>
        {/* Product Details Column */}
        <div className="col-span-2">
          <ProductDetailsInputForm
            productData={productData}
            setProductData={setProductData}
          />
        </div>
      </div>

      {/* Submit button and cancel button */}
      <div className="flex justify-start px-12 gap-4 pt-6 border-t">
        <Button
          type="button"
          variant="destructive"
          onClick={handleBack}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant="default"
          onClick={handleSubmit}
          className="px-8"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating Product...
            </>
          ) : (
            "Update Product"
          )}
        </Button>
      </div>
    </div>
  );
};

export default UpdateProductPage;
