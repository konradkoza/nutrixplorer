import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Sidebar } from "@/components/admin-panel/sidebar";
import { cn } from "@/lib/utils";
import { login, logout } from "@/redux/slices/authSlice";
import { RootState } from "@/redux/store";
import { getExpDate } from "@/utils/loginUtils";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
    const isOpen = useSelector((state: RootState) => state.sideBarSlice.isOpen);
    const dispatch = useDispatch();

    useEffect(() => {
        if (
            localStorage.getItem("token") &&
            Date.now() < getExpDate(localStorage.getItem("token") || "")
        ) {
            dispatch(login({ token: localStorage.getItem("token") }));
        } else {
            dispatch(logout());
        }
    }, []);

    return (
        <>
            <Sidebar />
            <main
                className={cn(
                    "min-h-screen bg-background transition-[margin-left] duration-500 ease-in-out dark:bg-background",

                    !isOpen ? "lg:ml-[90px]" : "lg:ml-72"
                )}>
                <ContentLayout>
                    <Outlet />
                </ContentLayout>
            </main>
        </>
    );
};

export default MainLayout;
