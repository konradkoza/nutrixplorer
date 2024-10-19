import { ContentLayout } from "@/components/admin-panel/content-layout";
// import { Navbar } from "@/components/admin-panel/navbar";
import { Sidebar } from "@/components/admin-panel/sidebar";
import { Card } from "@/components/ui/card";
import { useSidebar } from "@/hooks/use-sidebar";
import { useStore } from "@/hooks/use-store";
import { cn } from "@/lib/utils";
import { login, logout } from "@/redux/slices/authSlice";
import { getExpDate } from "@/utils/loginUtil";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
    const sidebar = useStore(useSidebar, (x) => x);
    if (!sidebar) return null;
    const { getOpenState, settings } = sidebar;
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
        <>
            <Sidebar />
            <main
                className={cn(
                    "min-h-screen bg-background transition-[margin-left] duration-500 ease-in-out dark:bg-background",
                    !settings.disabled &&
                        (!getOpenState() ? "lg:ml-[90px]" : "lg:ml-72")
                )}>
                <ContentLayout>
                    <Card className="p-4">Main Layout</Card>
                    <Outlet />
                </ContentLayout>
            </main>
        </>
    );
};

export default MainLayout;
