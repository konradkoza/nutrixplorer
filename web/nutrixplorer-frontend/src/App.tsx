import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import LoginPage from "./pages/Login/LoginPage";
import { ThemeProvider } from "./components/providers/theme-provider";
import ProductsListPages from "./pages/Products/ProductsListPages";
import BasketsListPage from "./pages/Baskets/BasketsListPage";
import { useDispatch } from "react-redux";
import { getExpDate } from "./utils/loginUtils";
import { login, logout } from "./redux/slices/authSlice";

const router = createBrowserRouter([
    {
        path: "/",
        Component: MainLayout,
        children: [
            {
                path: "products",
                Component: ProductsListPages,
            },
            {
                path: "baskets",
                Component: BasketsListPage,
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
