import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import ProductRow from "@/components/products/ProductRow";
import Pagination from '@/components/Pagination/Pagination';
import { fetchAllProducts, type Product, type ProductsResponse } from "@/api/Product";
import { useNavigate } from 'react-router-dom';

const AllProductPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Fetch products
  const loadProducts = async (page: number = 1) => {
    try {
      setLoading(true);
      const response: ProductsResponse = await fetchAllProducts(page);
      
      setProducts(response.products);
      setCurrentPage(response.currentPage);
      setTotalPages(response.totalPages);
      setTotalProducts(response.totalProducts);
      toast.success('Products loaded successfully');
    } catch (error) {
      console.error('Error loading products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  // Load products on component mount
  useEffect(() => {
    loadProducts();
  }, []);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    loadProducts(page);
  };

  // Handle product actions
  const handleViewProduct = (product: Product) => {
    console.log('View product:', product);
    // Implement view logic
  };

  const handleEditProduct = (product: Product) => {
    navigate(`/products/update/${product.id}`,{
      state:{ product }
    });
    // Implement edit logic
  };

  const handleDeleteProduct = (product: Product) => {
    console.log('Delete product:', product);
    // Implement delete logic
    if (confirm(`Are you sure you want to delete "${product.product_name}"?`)) {
      toast.success('Product deleted successfully');
      loadProducts(currentPage);
    }
  };

  // Filter products based on search term
  const filteredProducts = products.filter(product =>
    product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.product_description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  function navigateToCreateProductPage() {
    navigate('/products/create');
  }

  return (
    <div className='space-y-6'>
      <div>
        <h1 className="text-3xl font-bold">All Products</h1>
        <p className="text-muted-foreground">
          Manage all your products.
        </p>
        <p>
          Total Products: <span className="font-semibold">{totalProducts}</span>
        </p>
      </div>

      {/* Search and Actions */}
      <div className="flex justify-between items-center gap-4">
        <div className="relative w-1/3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={navigateToCreateProductPage} className="px-6">
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Products Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Sizes</TableHead>
              <TableHead>Colors</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                  <p className="mt-2">Loading products...</p>
                </TableCell>
              </TableRow>
            ) : filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <p>No products found</p>
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => (
                <ProductRow
                  key={product.id}
                  product={product}
                  onView={handleViewProduct}
                  onEdit={handleEditProduct}
                  onDelete={handleDeleteProduct}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {!loading && totalPages >= 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default AllProductPage;