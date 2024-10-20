import { Menu } from "@/components/admin-panel/menu";
import { SidebarToggle } from "@/components/admin-panel/sidebar-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toggleOpen } from "@/redux/slices/sideBarSlice";
import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
// import { PanelsTopLeft } from "lucide-react";
// import { Link } from "react-router-dom";
export function Sidebar() {
    const isOpen = useSelector((state: RootState) => state.sideBarSlice.isOpen);
    const dispatch = useDispatch();

    const toggle = () => {
        dispatch(toggleOpen());
    };

    return (
        <aside
            className={cn(
                "fixed left-0 top-0 z-20 h-screen -translate-x-full transition-[width] duration-300 ease-in-out lg:translate-x-0",
                !isOpen ? "w-[90px]" : "w-72"
            )}>
            <div className="relative flex h-full flex-col overflow-y-auto px-3 py-3 shadow-md dark:shadow-zinc-800">
                <div className="flex items-start gap-5 pb-2">
                    <SidebarToggle isOpen={isOpen} setIsOpen={toggle} />
                    <Button
                        className={cn(
                            "mb-1 transition-transform duration-300 ease-in-out",
                            !isOpen ? "hidden translate-x-1" : "translate-x-0"
                        )}
                        variant="link"
                        asChild>
                        <Link
                            to="/dashboard"
                            className="flex items-center gap-2 self-center">
                            {/* <PanelsTopLeft className="mr-1 h-6 w-6" /> */}
                            <h1
                                className={cn(
                                    "place-self-center justify-self-center whitespace-nowrap text-lg font-bold transition-[transform,opacity,display] duration-300 ease-in-out",
                                    !isOpen
                                        ? "hidden -translate-x-96 opacity-0"
                                        : "translate-x-0 opacity-100"
                                )}>
                                NutriXplorer
                            </h1>
                        </Link>
                    </Button>
                </div>

                <Menu isOpen={isOpen} />
            </div>
        </aside>
    );
}
