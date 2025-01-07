import { RouteObject } from "react-router-dom";
import LoginPage from "./pages/Authentication/LoginPage";
import ProductsListPages from "./pages/Products/ProductsListPages";
import MainLayout from "./layouts/MainLayout";
import BasketsListPage from "./pages/Baskets/BasketsListPage";
import ProductDetailsPage from "./pages/Products/ProductDetailsPage";
import BasketDetails from "./pages/Baskets/BasketDetails";
import FavouritesPage from "./pages/Favourites/FavouritesPage";
import BasketComparisonPage from "./pages/Comparison/BasketComparisonPage";
import AccountPage from "./pages/Account/AccountPage";
import AuthGuard from "./layouts/AuthGuard";
import { AccessLevel } from "./types/UserTypes";
import { Navigate } from "react-router-dom";
import RegisterPage from "./pages/Authentication/RegisterPage";
import OauthCallback from "./pages/Authentication/OauthCallback";
import AccountActivationPage from "@/pages/Verification/AccountActivationPage.tsx";
import ForgotPassword from "./pages/Authentication/ForgotPassword";
import PasswordResetPage from "./pages/Verification/PasswordResetPage";
import AuthLayout from "./layouts/AuthLayout";
import ConfirmEmailChangePage from "./pages/Verification/ConfirmEmailChangePage";
import UsersPage from "./pages/Users/UsersPage";
import UserDetailsPage from "./pages/Users/UserDetailsPage";
import NotFoundPage from "./pages/NotFound/NotFoundPage";

const clientRoutes: RouteObject[] = [
    {
        path: "/baskets",
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
        path: "/favourites",
        Component: FavouritesPage,
    },
    {
        path: "/compare",
        Component: BasketComparisonPage,
    },
];

const adminRoutes: RouteObject[] = [
    {
        path: "/users",
        children: [
            {
                index: true,
                Component: UsersPage,
            },
            {
                path: ":id",
                Component: UserDetailsPage,
            },
        ],
    },
];

export const publicRoutes: RouteObject[] = [
    {
        Component: AuthLayout,
        children: [
            { path: "/login", Component: LoginPage },
            { path: "/register", Component: RegisterPage },
            { path: "forgot-password", Component: ForgotPassword },
        ],
    },

    { path: "/", Component: () => Navigate({ to: "/products", replace: true }) },
    {
        path: "/products",
        Component: MainLayout,
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

    { path: "/auth/google/callback", Component: OauthCallback },
    {
        path: "/verify/",
        children: [
            { path: "activation", Component: AccountActivationPage },
            { path: "forgot-password", Component: PasswordResetPage },
            { path: "email", Component: ConfirmEmailChangePage },
        ],
    },
];

export const protectedRoutes: RouteObject[] = [
    {
        Component: MainLayout,
        children: [
            {
                Component: () => AuthGuard({ requiredRoles: [AccessLevel.CLIENT] }),
                children: [{ path: "/", children: clientRoutes }],
            },
            {
                Component: () => AuthGuard({ requiredRoles: [AccessLevel.ADMINISTRATOR] }),
                children: [{ path: "/", children: adminRoutes }],
            },
            {
                Component: () =>
                    AuthGuard({ requiredRoles: [AccessLevel.CLIENT, AccessLevel.ADMINISTRATOR] }),
                children: [{ path: "/account", Component: AccountPage }],
            },
            { path: "*", Component: NotFoundPage },
        ],
    },
];
