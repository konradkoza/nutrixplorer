import { Navbar } from "@/components/admin-panel/navbar";
import { Sidebar } from "@/components/admin-panel/sidebar";
import { useSidebar } from "@/hooks/use-sidebar";
import { useStore } from "@/hooks/use-store";
import { cn } from "@/lib/utils";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
    const sidebar = useStore(useSidebar, (x) => x);
    if (!sidebar) return null;
    const { getOpenState, settings } = sidebar;
    return (
        <>
            <Sidebar />
            <main
                className={cn(
                    "min-h-screen bg-zinc-50 transition-[margin-left] duration-500 ease-in-out dark:bg-zinc-900",
                    !settings.disabled &&
                        (!getOpenState() ? "lg:ml-[90px]" : "lg:ml-72")
                )}>
                <Navbar title="NutriXplorer" />
                <Outlet />
            </main>
        </>
    );
};

export default MainLayout;
