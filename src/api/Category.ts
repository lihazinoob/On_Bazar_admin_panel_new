interface Category{
  id: number;
  created_at: string;
  category_name: string;
  category_description: string;
  category_image: string;
  slug: string;
}

interface CategoryResponse {
  categoryInformation: Category[];
  message: string;
}

export const fetchCategories = async ():Promise<Category[]> =>{
  try {
    const response = await fetch('https://raw-node-js.onrender.com/api/fetchAllCategoryInformation');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data:CategoryResponse = await response.json();
    return data.categoryInformation;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
}