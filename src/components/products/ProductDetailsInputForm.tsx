import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "../ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Checkbox } from "../ui/checkbox";
import { fetchCategories } from "@/api/Category";
import { toast } from "sonner";

// Define types
interface ProductSize {
  size: string;
  quantity: number;
}

interface ProductData {
  name: string;
  description: string;
  productPrice: number;
  salesPercentage: number;
  calculatedPriceAfterDiscount: number;
  totalProducts: number;
  categoryId: number | null;
  sizes: ProductSize[];
  isFeatured: boolean;
  isNew: boolean;
  isSoldOut: boolean;
}

interface ProductDetailsInputFormProps {
  productData: ProductData;
  setProductData: React.Dispatch<React.SetStateAction<ProductData>>;
}

interface Category {
  id: number;
  created_at: string;
  category_name: string;
  category_description: string;
  category_image: string;
  slug: string;
}

const ProductDetailsInputForm: React.FC<ProductDetailsInputFormProps> = ({
  productData,
  setProductData,
}) => {
  // state for categories
  const [categories, setCategories] = React.useState<Category[]>([]);

  // function to load categories from API
  const loadCategories = async () => {
    try {
      const fetchedCategories = await fetchCategories();
      setCategories(fetchedCategories);
      toast.success("Categories loaded successfully");
    } catch (error) {
      // setCategoriesError(error instanceof Error ? error.message : 'Failed to load categories');
      console.error("Error loading categories:", error);
      toast.error("Failed to load categories");
    }
  };

  // Load categories when component mounts
  React.useEffect(() => {
    loadCategories();
  }, []);

  // Function to update quantity for a specific size
  const handleSizeQuantityChange = (index: number, quantity: number) => {
    const updatedSizes = [...productData.sizes];
    updatedSizes[index].quantity = quantity;
    setProductData((prev) => ({
      ...prev,
      sizes: updatedSizes,
    }));
  };

  // Function to calculate the price after discount
  const calculatePriceAfterDiscount = (price: number, discount: number) => {
    const discountAmount = (price * discount) / 100;
    return price - discountAmount;
  };

  // Calculate price after discount whenever product price or sales percentage changes
  React.useEffect(() => {
    const newPrice = calculatePriceAfterDiscount(
      productData.productPrice,
      productData.salesPercentage
    );
    setProductData((prev) => ({
      ...prev,
      calculatedPriceAfterDiscount: newPrice,
    }));
  }, [productData.productPrice, productData.salesPercentage, setProductData]);

  // Calculate total products whenever sizes change
  React.useEffect(() => {
    const total = productData.sizes.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    setProductData((prev) => ({
      ...prev,
      totalProducts: total,
    }));
  }, [productData.sizes, setProductData]);

  return (
    <div>
      {/* Header */}
      <header className="text-xl font-semibold items-center">
        Product Details
      </header>

      {/* The form */}
      <div className="space-y-4 mt-4">
        {/* Product Name */}
        <div className="space-y-2">
          <Label htmlFor="product-name">
            Product Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="product-name"
            type="text"
            placeholder="Enter a Product Name"
            className="w-1/2 mt-2"
            required
            value={productData.name}
            onChange={(e) =>
              setProductData((prev) => ({ ...prev, name: e.target.value }))
            }
          />
        </div>

        {/* Product Description */}
        <div className="space-y-2">
          <Label htmlFor="product-description">
            Product Description <span className="text-red-500">*</span>
          </Label>
          <Textarea
            value={productData.description}
            id="product-description"
            placeholder="Enter a Product Description"
            className="w-2/3 mt-2 h-48"
            required
            onChange={(e) =>
              setProductData((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
          />
        </div>

        {/* Product Price Input and Product Category Input Row */}
        <div className="space-y-2 w-1/2 flex justify-between mt-8">
          <div>
            <Label htmlFor="product-price" className="">
              Product Price(taka) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="product-price"
              type="number"
              placeholder="Enter a Product Price"
              className="mt-2"
              value={productData.productPrice}
              onChange={(e) =>
                setProductData((prev) => ({
                  ...prev,
                  productPrice: Number(e.target.value),
                }))
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="product-category" className="">
              Product Category <span className="text-red-500">*</span>
            </Label>
            <Select
              value={productData.categoryId?.toString() || ""} // Convert to string for Select component
              onValueChange={(value) =>
                setProductData((prev) => ({
                  ...prev,
                  categoryId: value ? Number(value) : null,
                }))
              }
            >
              <SelectTrigger className="w-full mt-2">
                <SelectValue placeholder="Select a Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.category_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Product Sales Percentage and Calculated Price Section */}
        <div className="space-y-2 w-1/2 flex justify-between mt-8">
          <div>
            <Label htmlFor="product-sales-percentage">Product Sales (%)</Label>
            <Input
              id="product-sales-percentage"
              type="number"
              placeholder="Enter Sales Percentage"
              className="mt-2"
              value={productData.salesPercentage}
              onChange={(e) =>
                setProductData((prev) => ({
                  ...prev,
                  salesPercentage: Number(e.target.value),
                }))
              }
            />
          </div>
          <div>
            <Label htmlFor="calculated-price">Calculated Price (taka)</Label>
            <Input
              id="calculated-price"
              type="text"
              value={productData.calculatedPriceAfterDiscount}
              className="mt-2"
              readOnly
            />
          </div>
        </div>

        {/* Checkboxes + Size Quantity */}
        <div className="w-2/3 flex justify-between items-start mt-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is-featured-product"
                checked={productData.isFeatured}
                onCheckedChange={(checked) =>
                  setProductData((prev) => ({ ...prev, isFeatured: !!checked }))
                }
              />
              <Label htmlFor="is-featured-product">Featured Product</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is-new-product"
                className="h-4 w-4"
                checked={productData.isNew}
                onCheckedChange={(checked) =>
                  setProductData((prev) => ({ ...prev, isNew: !!checked }))
                }
              />
              <Label htmlFor="is-new-product">New Product</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is-sold-out"
                className="h-4 w-4"
                checked={productData.isSoldOut}
                onCheckedChange={(checked) =>
                  setProductData((prev) => ({ ...prev, isSoldOut: !!checked }))
                }
              />
              <Label htmlFor="is-sold-out">Sold Out</Label>
            </div>
          </div>

          {/* Size and Quantity Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Sizes and Quantities</h3>
            <div className="space-y-2">
              {productData.sizes.map((size, index) => (
                <div key={size.size} className="flex items-center gap-4">
                  <Label className="w-1/6">{size.size}</Label>
                  <Input
                    type="number"
                    placeholder="Enter quantity"
                    className="w-1/3"
                    value={size.quantity}
                    onChange={(e) =>
                      handleSizeQuantityChange(index, Number(e.target.value))
                    }
                    min={0}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Total Product Count */}
        <div className="mt-4 text-lg items-center flex justify-center tracking-wider">
          <div className="text-muted-foreground">Total Product Count: </div>
          <span className="font-semibold text-xl ml-2">
            {productData.totalProducts}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsInputForm;
