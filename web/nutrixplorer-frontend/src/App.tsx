import { useDispatch } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import { ThemeProvider } from "./components/providers/theme-provider";
import { login, logout } from "./redux/slices/authSlice";
import { protectedRoutes, publicRoutes } from "./routes";
import { getExpDate } from "./utils/loginUtils";

const router = createBrowserRouter([...publicRoutes, ...protectedRoutes]);

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
            <Toaster
                toastOptions={{
                    classNames: {
                        error: "bg-red-600 dark:bg-red-800 text-white",
                        success: "bg-green-600 dark:bg-green-800 text-white",
                        warning: "bg-yellow-600 dark:bg-yellow-800 text-white",
                        info: "bg-blue-600 dark:bg-blue-800 text-white",
                    },
                }}
            />
            <RouterProvider router={router} />
        </ThemeProvider>
    );
}

export default App;
