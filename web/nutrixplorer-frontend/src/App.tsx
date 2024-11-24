import { useDispatch } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
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
            <RouterProvider router={router} />
        </ThemeProvider>
    );
}

export default App;
