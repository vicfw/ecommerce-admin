import { apiClient, type AxiosResponse } from "../axios";

export type DeliveryCost = {
  id: number;
  cost: number;
  createdAt: string;
  updatedAt: string;
};

export const getLatestDeliveryCost = async () => {
  const response =
    await apiClient.get<AxiosResponse<DeliveryCost | undefined>>("/deliveryCost");
  return response.data.data ?? null;
};

export const getAllDeliveryCosts = async () => {
  const response =
    await apiClient.get<AxiosResponse<DeliveryCost[]>>("/deliveryCost/all");
  return response.data.data ?? [];
};

export const createDeliveryCost = async (cost: number) => {
  const response = await apiClient.post<AxiosResponse<DeliveryCost>>(
    "/deliveryCost",
    { cost }
  );
  return response.data.data;
};

export type DashboardStats = {
  totalOrders: number;
  ordersByStatus: Record<string, number>;
  totalRevenue: number;
  totalUsers: number;
  pendingComments: number;
  lowStockProducts: Array<{
    id: number;
    prName: string;
    quantity: number;
    reservedQuantity?: number;
  }>;
  recentOrders: Array<{
    id: number;
    status: string;
    totalAmount: number;
    createdAt: string;
    user: {
      id: number;
      phoneNumber: string;
      name: string | null;
      lastName: string | null;
    };
  }>;
};

export const getDashboardStats = async () => {
  const response =
    await apiClient.get<AxiosResponse<DashboardStats>>("/admin/dashboard");
  return response.data.data;
};

export type HomepageBannerSection = {
  id: string;
  type: "banner";
  imageUrl: string;
  href?: string;
  alt?: string;
};

export type HomepageProductSliderSection = {
  id: string;
  type: "product_slider";
  title: string;
  productIds: number[];
  backgroundColor?: string;
};

export type HomepageStoryLinkItem = {
  id: string;
  imageUrl: string;
  label: string;
  href: string;
};

export type HomepageStoryLinksSection = {
  id: string;
  type: "story_links";
  items: HomepageStoryLinkItem[];
};

export type HomepageImageSlide = {
  id: string;
  imageUrl: string;
  href?: string;
  alt?: string;
};

export type HomepageImageSliderSection = {
  id: string;
  type: "image_slider";
  slides: HomepageImageSlide[];
};

export type HomepageContentBlock =
  | HomepageBannerSection
  | HomepageProductSliderSection;

export type HomepageRowSection = {
  id: string;
  type: "row";
  columns: HomepageContentBlock[];
};

export type HomepageSection =
  | HomepageContentBlock
  | HomepageRowSection
  | HomepageStoryLinksSection
  | HomepageImageSliderSection;

export type HomepageLayout = {
  desktop: HomepageSection[];
  mobile: HomepageSection[];
};

export type Homepage = {
  id: number;
  sections: HomepageLayout;
  updatedAt: string | null;
};

export const emptyHomepageLayout = (): HomepageLayout => ({
  desktop: [],
  mobile: [],
});

/** Normalize legacy flat section arrays into the desktop/mobile layout. */
export const normalizeHomepageLayout = (value: unknown): HomepageLayout => {
  if (
    value &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    Array.isArray((value as HomepageLayout).desktop) &&
    Array.isArray((value as HomepageLayout).mobile)
  ) {
    return {
      desktop: (value as HomepageLayout).desktop,
      mobile: (value as HomepageLayout).mobile,
    };
  }

  if (Array.isArray(value)) {
    return {
      desktop: value as HomepageSection[],
      mobile: [],
    };
  }

  return emptyHomepageLayout();
};

export const getHomepageAdmin = async () => {
  const response =
    await apiClient.get<AxiosResponse<Homepage>>("/homepage/admin");
  const data = response.data.data;
  return {
    ...data,
    sections: normalizeHomepageLayout(data.sections),
  };
};

export const updateHomepage = async (layout: HomepageLayout) => {
  const response = await apiClient.put<AxiosResponse<Homepage>>("/homepage", {
    desktop: layout.desktop,
    mobile: layout.mobile,
  });
  const data = response.data.data;
  return {
    ...data,
    sections: normalizeHomepageLayout(data.sections),
  };
};


export const uploadImages = async (files: File[]) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("images", file);
  });

  // Let the browser set multipart boundary (do not force Content-Type).
  const response = await apiClient.post<
    AxiosResponse<{ url: string[] }>
  >("/upload", formData, {
    headers: { "Content-Type": undefined },
    timeout: 60000,
  });

  return response.data.data.url;
};

export type SiteSettings = {
  id: number;
  siteName: string;
  logoUrl: string | null;
  logoAlt: string | null;
  faviconUrl: string | null;
  updatedAt: string | null;
};

export type UpdateSiteSettingsPayload = {
  siteName: string;
  logoUrl: string | null;
  logoAlt: string | null;
  faviconUrl: string | null;
};

export const getSiteSettingsAdmin = async () => {
  const response = await apiClient.get<AxiosResponse<SiteSettings>>(
    "/site-settings/admin"
  );
  return response.data.data;
};

export const updateSiteSettings = async (payload: UpdateSiteSettingsPayload) => {
  const response = await apiClient.put<AxiosResponse<SiteSettings>>(
    "/site-settings",
    payload
  );
  return response.data.data;
};
