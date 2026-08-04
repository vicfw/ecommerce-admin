export type CreateCategoryPayload = {
  description: string;
  isActive: boolean;
  name: string;
  parentBanner: string;
  parentImage: string;
  slug: string;
  sortOrder: number;
  parentId?: string;
};

export type Category = {
  id: number;
  name: string;
  slug: string;
  description: string;
  isParent: boolean;
  parentImage: string;
  parentBanner: string;
  image: string;
  color: unknown;
  icon: number;
  parentId?: number;
  level: number;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type CreateCategoryResponse = Category[];
