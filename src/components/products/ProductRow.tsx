import type { Product } from "@/api/Product";
import { TableCell, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Edit, Eye, Trash2 } from "lucide-react";

interface ProductRowProps {
  product: Product;
  onView?: (product: Product) => void;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
}

const ProductRow: React.FC<ProductRowProps> = ({
  product,
  onView,
  onEdit,
  onDelete,
}) => {
  // calculate the discounted price
  const discountedPrice =
    product.product_price -
    (product.product_price * product.product_sale_percentage) / 100;

  //  Get available sizes
  const availableSizes = product.product_size
    .filter((size) => size.quantity > 0)
    .map((size) => `${size.size}(${size.quantity})`)
    .join(", ");

  return (
    <>
      <TableRow>
        {/* Product Image */}
        <TableCell>
          <div className="w-32 h-32 flex-shrink-0">
            <img
              src={product.product_image[0]}
              alt={product.product_name}
              className="w-full h-full object-cover rounded-md border"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder-image.png"; // Add fallback image
              }}
            />
          </div>
        </TableCell>

        {/* Product Name */}
        <TableCell className="font-medium">
          <div>
            <p className="font-semibold">{product.product_name}</p>
            <p className="text-sm text-muted-foreground truncate max-w-32">
              {product.product_description}
            </p>
          </div>
        </TableCell>
        {/* Product Price */}
        <TableCell>
          <div>
            <p className="font-semibold">৳{discountedPrice.toFixed(2)}</p>
            {product.product_sale_percentage > 0 && (
              <p className="text-sm text-muted-foreground line-through">
                ৳{product.product_price}
              </p>
            )}
          </div>
        </TableCell>

        {/* Quantity */}
        <TableCell>
          <Badge
            variant={product.product_quantity > 0 ? "default" : "destructive"}
          >
            {product.product_quantity}
          </Badge>
        </TableCell>

        {/* Available Sizes */}
        <TableCell>
          <p className="text-sm">{availableSizes || "No sizes available"}</p>
        </TableCell>

        {/* Colors */}
        <TableCell>
          <div className="flex gap-1 flex-wrap">
            {product.product_colors.length > 0 ? (
              product.product_colors.map((color, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {color}
                </Badge>
              ))
            ) : (
              <span className="text-sm text-muted-foreground">No colors</span>
            )}
          </div>
        </TableCell>

        {/* Status */}
        <TableCell>
          <div className="flex flex-col gap-1">
            {product.is_featured_product && (
              <Badge variant="secondary" className="text-xs">
                Featured
              </Badge>
            )}
            {product.is_new_product && (
              <Badge variant="default" className="text-xs">
                New
              </Badge>
            )}
            {product.is_sold_out && (
              <Badge variant="destructive" className="text-xs">
                Sold Out
              </Badge>
            )}
          </div>
        </TableCell>

        {/* Actions */}
        <TableCell>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onView?.(product)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit?.(product)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete?.(product)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </TableCell>
      </TableRow>
    </>
  );
};

export default ProductRow;
