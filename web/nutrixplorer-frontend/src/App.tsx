import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import LoginPage from "./pages/Login/LoginPage";
import { ThemeProvider } from "./components/providers/theme-provider";
import ProductsListPages from "./pages/Products/ProductsListPages";
import BasketsListPage from "./pages/Baskets/BasketsListPage";
import { useDispatch } from "react-redux";
import { getExpDate } from "./utils/loginUtils";
import { login, logout } from "./redux/slices/authSlice";
import ProductDetailsPage from "@/pages/Products/ProductDetailsPage.tsx";
import FavouritesPage from "@/pages/Favourites/FavouritesPage.tsx";
import BasketDetails from "@/pages/Baskets/BasketDetails.tsx";
import DealDetailsPage from "./pages/Deals/DealsDetailsPage";
import MyDealsListPage from "./pages/Deals/MyDealsListPage";
import DealsListPage from "./pages/Deals/DealsListPage";
import MyDealDetailsPage from "./pages/Deals/MyDealDetailsPage";
import BasketComparisonPage from "./pages/Comparison/BasketComparisonPage";

const router = createBrowserRouter([
    {
        path: "/",
        Component: MainLayout,
        children: [
            {
                path: "products",

                children: [
                    {
                        index: true,
                        Component: ProductsListPages,
                    },
                    {
                        path: ":id",
                        Component: ProductDetailsPage,
                    },
                ],
            },

            {
                path: "baskets",
                children: [
                    {
                        index: true,
                        Component: BasketsListPage,
                    },
                    {
                        path: ":id",
                        Component: BasketDetails,
                    },
                ],
            },
            {
                path: "favourites",
                Component: FavouritesPage,
            },
            {
                path: "/deals",
                children: [
                    {
                        index: true,
                        Component: DealsListPage,
                    },
                    {
                        path: ":id",
                        Component: DealDetailsPage,
                    },
                ],
            },
            {
                path: "/my-deals",
                children: [
                    {
                        index: true,
                        Component: MyDealsListPage,
                    },
                    {
                        path: ":id",
                        Component: MyDealDetailsPage,
                    },
                ],
            },
            {
                path: "/compare",
                Component: BasketComparisonPage,
            },
        ],
    },
    {
        path: "/login",
        Component: LoginPage,
    },
]);

function App() {
    const dispatch = useDispatch();

    if (
        localStorage.getItem("token") &&
        Date.now() < getExpDate(localStorage.getItem("token") || "")
    ) {
        dispatch(login({ token: localStorage.getItem("token") }));
    } else {
        dispatch(logout());
    }

    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <RouterProvider router={router} />
        </ThemeProvider>
    );
}

export default App;
