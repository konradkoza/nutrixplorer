import loadable from "@loadable/component";
import { RouteObject } from "react-router-dom";

const LoginPage = loadable(() => import("./pages/Authentication/LoginPage"));
const ProductsListPages = loadable(() => import("./pages/Products/ProductsListPages"));
const MainLayout = loadable(() => import("./layouts/MainLayout"));
const BasketsListPage = loadable(() => import("./pages/Baskets/BasketsListPage"));
const ProductDetailsPage = loadable(() => import("./pages/Products/ProductDetailsPage"));
const BasketDetails = loadable(() => import("./pages/Baskets/BasketDetails"));
const FavouritesPage = loadable(() => import("./pages/Favourites/FavouritesPage"));
const BasketComparisonPage = loadable(() => import("./pages/Comparison/BasketComparisonPage"));
const AccountPage = loadable(() => import("./pages/Account/AccountPage"));
const RegisterPage = loadable(() => import("./pages/Authentication/RegisterPage"));
const OauthCallback = loadable(() => import("./pages/Authentication/OauthCallback"));
const AccountActivationPage = loadable(
    () => import("@/pages/Verification/AccountActivationPage.tsx")
);
const ForgotPassword = loadable(() => import("./pages/Authentication/ForgotPassword"));
const PasswordResetPage = loadable(() => import("./pages/Verification/PasswordResetPage"));
const AuthLayout = loadable(() => import("./layouts/AuthLayout"));
const ConfirmEmailChangePage = loadable(
    () => import("./pages/Verification/ConfirmEmailChangePage")
);
const UsersPage = loadable(() => import("./pages/Users/UsersPage"));
const UserDetailsPage = loadable(() => import("./pages/Users/UserDetailsPage"));
const NotFoundPage = loadable(() => import("./pages/NotFound/NotFoundPage"));

import { AccessLevel } from "./types/UserTypes";
import { Navigate } from "react-router-dom";
import AuthGuard from "./layouts/AuthGuard";

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
    { path: "/", Component: MainLayout, children: [{ path: "*", Component: NotFoundPage }] },
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
        ],
    },
];
