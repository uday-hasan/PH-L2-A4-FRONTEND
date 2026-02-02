export interface Category {
  id: string;
  name: string;
  _count: {
    medicine: number;
  };
}

export interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string; // ISO date string
  userId: string;
  medicineId: string;
  user?: {
    id: string;
    name: string;
    email?: string;
  };
}

export interface Medicine {
  id: string;
  name: string;
  description: string;
  category_id: string;
  seller_id: string;
  selling_price: number;
  purchase_price: number;
  available_quantity: number;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt: string;

  // Relations
  category?: Category;
  seller?: {
    id: string;
    name: string;
    email: string;
  };
  reviews?: Review[];

  // Prisma count object for relations
  _count?: {
    reviews: number;
    orderItems?: number;
    cartItems?: number;
  };
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
