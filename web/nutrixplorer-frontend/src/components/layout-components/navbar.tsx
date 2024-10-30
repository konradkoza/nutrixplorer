import { SheetMenu } from "@/components/layout-components/sheet-menu";
import { UserNav } from "@/components/layout-components/user-nav";
import { ModeToggle } from "@/components/mode-toggle";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

interface NavbarProps {
    title: string;
    children?: React.ReactNode[];
}

export function Navbar({ title, children }: NavbarProps) {
    const isOpen = useSelector((state: RootState) => state.sideBarSlice.isOpen);
    return (
        <header className="sticky top-0 z-10 w-full bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:shadow-secondary">
            <div className="mx-4 flex h-14 items-center sm:mx-8">
                <div className="flex items-center space-x-4 lg:space-x-0">
                    <SheetMenu />
                    {isOpen || <h1 className="font-bold">{title}</h1>}
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
