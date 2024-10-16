"use client";
import { Menu } from "@/components/admin-panel/menu";
import { SidebarToggle } from "@/components/admin-panel/sidebar-toggle";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/hooks/use-sidebar";
import { useStore } from "@/hooks/use-store";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
// import { PanelsTopLeft } from "lucide-react";
// import { Link } from "react-router-dom";
export function Sidebar() {
    const sidebar = useStore(useSidebar, (x) => x);
    if (!sidebar) return null;
    const { isOpen, toggleOpen, getOpenState, setIsHover, settings } = sidebar;
    return (
        <aside
            className={cn(
                "fixed left-0 top-0 z-20 h-screen -translate-x-full transition-[width] duration-300 ease-in-out lg:translate-x-0",
                !getOpenState() ? "w-[90px]" : "w-72",
                settings.disabled && "hidden"
            )}>
            <div
                onMouseEnter={() => setIsHover(true)}
                onMouseLeave={() => setIsHover(false)}
                className="relative flex h-full flex-col overflow-y-auto px-3 py-3 shadow-md dark:shadow-zinc-800">
                <div className="flex items-start gap-5 pb-2">
                    <SidebarToggle isOpen={isOpen} setIsOpen={toggleOpen} />
                    <Button
                        className={cn(
                            "mb-1 transition-transform duration-300 ease-in-out",
                            !getOpenState()
                                  ? "hidden translate-x-1"
                                  : "translate-x-0"
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
                                    !getOpenState()
                                        ? "hidden -translate-x-96 opacity-0"
                                        : "translate-x-0 opacity-100"
                                )}>
                                NutriXplorer
                            </h1>
                        </Link>
                    </Button>
                </div>

                <Menu isOpen={getOpenState()} />
            </div>
        </aside>
    );
}
