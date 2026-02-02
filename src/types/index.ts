export interface Category {
  id: string;
  name: string;
}

export interface Medicine {
  id: string;
  name: string;
  description?: string;
  category_id?: string;
  selling_price: number;
  purchase_price: number;
  available_quantity: number;
  status: "ACTIVE" | "INACTIVE";
  category?: Category;
  seller?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
