import { ModeToggle } from "@/components/mode-toggle";
import { UserNav } from "@/components/admin-panel/user-nav";
import { SheetMenu } from "@/components/admin-panel/sheet-menu";
import { useStore } from "@/hooks/use-store";
import { useSidebar } from "@/hooks/use-sidebar";

interface NavbarProps {
    title: string;
    children?: React.ReactNode[];
}

export function Navbar({ title, children }: NavbarProps) {
    const sidebar = useStore(useSidebar, (x) => x);
    if (!sidebar) return null;
    const { getOpenState } = sidebar;
    return (
        <header className="sticky top-0 z-10 w-full bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:shadow-secondary">
            <div className="mx-4 flex h-14 items-center sm:mx-8">
                <div className="flex items-center space-x-4 lg:space-x-0">
                    <SheetMenu />
                    {getOpenState() || <h1 className="font-bold">{title}</h1>}
                </div>
                <div className="flex flex-1 items-center justify-end">
                    {children}
                    <ModeToggle />
                    <UserNav />
                </div>
            </div>
        </header>
    );
}
