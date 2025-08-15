interface ProductSize {
  size: string;
  quantity: number;
}

export interface Product {
  id: number;
  created_at: string;
  product_name: string;
  product_description: string;
  product_price: number;
  product_sale_percentage: number;
  is_featured_product: boolean;
  is_new_product: boolean;
  product_quantity: number;
  product_colors: string[];
  product_category_id: number;
  is_sold_out: boolean;
  product_image: string[];
  product_size: ProductSize[];
}

export interface ProductsResponse {
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  products: Product[];
  message: string;
}

// function to fetch all products
export const fetchAllProducts = async (
  page: number = 1,
): Promise<ProductsResponse> => {
  try {
    const response = await fetch(`https://raw-node-js.onrender.com/api/fetchAllProducts?page=${page}`);
    if(!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data:ProductsResponse = await response.json();
    return data;

  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};
