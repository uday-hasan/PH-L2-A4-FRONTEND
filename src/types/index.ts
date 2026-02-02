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
  createdAt: string;
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

export interface CartItem {
  id: string;
  cartId: string;
  medicineId: string;
  quantity: number;
  medicine: Medicine;
}

export interface Cart {
  id: string;
  customerId: string;
  items: CartItem[];
}
