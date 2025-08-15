import ProductDetailsInputForm from "@/components/products/ProductDetailsInputForm";
import ProductImageUploadSection from "@/components/products/ProductImageUploadSection";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// define the types for the product size and quantity array of objects
interface ProductSizeQuantity {
  size: string;
  quantity: number;
}

// define the type of Product Data
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

export function CreateProductPage() {
  const [productData, setProductData] = useState<ProductData>({
    name: "",
    description: "",
    productPrice: 100,
    salesPercentage: 0,
    calculatedPriceAfterDiscount: 100,
    totalProducts: 0,
    categoryId: null, // Assuming categoryId is optional
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
    colors:[]
  });

  // state for images
  const [images, setImages] = useState<File[]>([]);

    const [isSubmitting, setIsSubmitting] = useState(false);

  // reset the all states
  const resetData = () => {
    setProductData({
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
      colors: []
    });
    setImages([]);
  };

  // handle form submission
  const handleSubmit = async () => {
    if(isSubmitting) return; // Prevent multiple submissions

    if (
      !productData.name ||
      !productData.description ||
      !productData.categoryId
    ) {
      alert("Please fill in all required fields (Name, Description, Category)");
      return;
    }

    //prepare the data for the FormData
    const formData = new FormData();

    // add the productData to the FormData
    formData.append("productData", JSON.stringify(productData));

    // Add images seperately
    images.forEach((image, index) => {
      formData.append(`image_${index}`, image);
    });
    setIsSubmitting(true);
    console.log("Submitting product data:", productData);

    try {
      // Make the API call
      const response = await fetch(
        "https://raw-node-js.onrender.com/api/createProduct",
        {
          method: "POST",
          body: formData,
          // Don't set Content-Type header - let the browser set it with boundary for FormData
        }
      );

      // parse the response
      const result = await response.json();
      if (response.ok) {
        toast.success("Product created successfully!");
        resetData(); // Reset the form after successful submission
      } else {
        toast.error(`Error: ${result.message || "Failed to create product"}`);
      }
    } catch (error) {
      toast.error("Network error or server issue. Please try again later.");
      console.error("Error creating product:", error);
    } finally {
      setIsSubmitting(false); // Reset submitting state
      resetData();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create Product</h1>
        <p className="text-muted-foreground">
          Add a new product to your inventory
        </p>
      </div>

      {/* Product Form to create a product */}
      <div className="grid grid-cols-3 gap-6">
        {/* Product Image Upload and Image show column */}
        <div className="col-span-1">
          <ProductImageUploadSection images={images} setImages={setImages} />
        </div>
        <div className="col-span-2">
          <ProductDetailsInputForm
            productData={productData}
            setProductData={setProductData}
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-start px-12 gap-4 pt-6 border-t">
        <Button
          type="button"
          variant={"destructive"}
          onClick={() => resetData()}
          disabled={isSubmitting} // Disable during submission
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant="default"
          onClick={handleSubmit}
          className="px-8"
          disabled={isSubmitting} // Disable during submission
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Product...
            </>
          ) : (
            "Create Product"
          )}
        </Button>
      </div>
    </div>
  );
}
