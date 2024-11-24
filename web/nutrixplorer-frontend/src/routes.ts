import { RouteObject } from "react-router-dom";
import LoginPage from "./pages/Login/LoginPage";
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

const clientRoutes : RouteObject[] = [
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

const adminRoutes : RouteObject[] = [
]; 

export const publicRoutes : RouteObject[] = [
    {path: '/login', Component: LoginPage},
    {path: '/', Component: () => Navigate({to:"/products", replace : true})},
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
];


export const protectedRoutes : RouteObject[] = [
    {
        Component: MainLayout,
        children: [
            {
                Component: () => AuthGuard({requiredRole: AccessLevel.CLIENT}),
                children: [
                    {path: "/", children: clientRoutes},
                ],
            },
            {
                Component: () => AuthGuard({requiredRole: AccessLevel.ADMINISTRATOR}),
                children: [
                    {path: '/admin', children: adminRoutes},
                ],
            },
            {
                path: "/account",
                children: [
                    {
                        index: true,
                        Component: AccountPage,
                    },
                ],
            },
        ]
    }
    
];