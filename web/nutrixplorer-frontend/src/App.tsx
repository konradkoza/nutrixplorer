import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import LoginPage from "./pages/Login/LoginPage";
import { ThemeProvider } from "./components/providers/theme-provider";
import ProductsListPages from "./pages/Products/ProductsListPages";

const router = createBrowserRouter([
    {
        path: "/",
        Component: MainLayout,
        children: [
            {
                path: "products",
                Component: ProductsListPages,
            },
        ],
    },
    {
        path: "/login",
        Component: LoginPage,
    },
]);

function App() {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <RouterProvider router={router} />
        </ThemeProvider>
    );
}

export default App;
