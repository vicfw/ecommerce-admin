import { Admin, Resource } from "react-admin";
import { QueryClientProvider } from "@tanstack/react-query";
import {
  axiosDataProvider,
  queryClient,
} from "./providers/ReactQueryDataProvider";
import {
  ProductCreate,
  ProductEdit,
  ProductList,
} from "./resources/products";
import { CategoryCreate, CategoryList } from "./resources/categories";
import {
  BrandCreate,
  BrandEdit,
  BrandList,
} from "./resources/brands";
import {
  ColorImageCreate,
  ColorImageEdit,
  ColorImageList,
} from "./resources/color-images";
import { BadgeCreate, BadgeEdit, BadgeList } from "./resources/badges";
import { AppLayout } from "./layouts/AppLayout";
import { adminDarkTheme, adminLightTheme } from "./theme/adminTheme";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

function App() {
  const dataProvider = axiosDataProvider(API_URL);

  return (
    <QueryClientProvider client={queryClient}>
      <Admin
        title="Ecommerce Admin"
        dataProvider={dataProvider}
        layout={AppLayout}
        lightTheme={adminLightTheme}
        darkTheme={adminDarkTheme}
        defaultTheme="light"
      >
        <Resource name="category" list={CategoryList} create={CategoryCreate} />
        <Resource
          name="brand"
          list={BrandList}
          create={BrandCreate}
          edit={BrandEdit}
        />
        <Resource
          name="colorImage"
          list={ColorImageList}
          create={ColorImageCreate}
          edit={ColorImageEdit}
        />
        <Resource
          name="badge"
          list={BadgeList}
          create={BadgeCreate}
          edit={BadgeEdit}
        />
        <Resource
          name="product"
          list={ProductList}
          create={ProductCreate}
          edit={ProductEdit}
        />
      </Admin>
    </QueryClientProvider>
  );
}

export default App;
