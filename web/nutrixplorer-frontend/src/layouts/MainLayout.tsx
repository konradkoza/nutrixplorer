import { ContentLayout } from "@/components/layout-components/content-layout";
import { Sidebar } from "@/components/layout-components/sidebar";
import { cn } from "@/lib/utils";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
    const isOpen = useSelector((state: RootState) => state.sideBarSlice.isOpen);

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
