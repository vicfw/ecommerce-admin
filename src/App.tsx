import { Admin, CustomRoutes, Resource } from "react-admin";
import { QueryClientProvider } from "@tanstack/react-query";
import { Route } from "react-router-dom";
import {
  axiosDataProvider,
  queryClient,
} from "./providers/ReactQueryDataProvider";
import {
  ProductCreate,
  ProductEdit,
  ProductList,
} from "./resources/products";
import {
  CategoryCreate,
  CategoryEdit,
  CategoryList,
} from "./resources/categories";
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
import { UserEdit, UserList } from "./resources/users";
import { OrderList, OrderShow } from "./resources/orders";
import { CommentList } from "./resources/comments";
import { AppLayout } from "./layouts/AppLayout";
import { adminDarkTheme, adminLightTheme } from "./theme/adminTheme";
import { Dashboard } from "./pages/Dashboard";
import { DeliveryCostSettings } from "./pages/DeliveryCostSettings";
import { HomepageEditor } from "./pages/HomepageEditor";
import { SiteLogoSettings } from "./pages/SiteLogoSettings";
import { LoginPage } from "./pages/Login";
import { authProvider } from "./providers/authProvider";

function App() {
  const dataProvider = axiosDataProvider();

  return (
    <QueryClientProvider client={queryClient}>
      <Admin
        title="Ecommerce Admin"
        dataProvider={dataProvider}
        authProvider={authProvider}
        loginPage={LoginPage}
        layout={AppLayout}
        dashboard={Dashboard}
        lightTheme={adminLightTheme}
        darkTheme={adminDarkTheme}
        defaultTheme="light"
      >
        <Resource
          name="category"
          list={CategoryList}
          create={CategoryCreate}
          edit={CategoryEdit}
        />
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
        <Resource name="order" list={OrderList} show={OrderShow} />
        <Resource name="users" list={UserList} edit={UserEdit} />
        <Resource name="comment" list={CommentList} />
        <CustomRoutes>
          <Route path="/delivery-cost" element={<DeliveryCostSettings />} />
          <Route path="/homepage" element={<HomepageEditor />} />
          <Route path="/site-logo" element={<SiteLogoSettings />} />
        </CustomRoutes>
      </Admin>
    </QueryClientProvider>
  );
}

export default App;
