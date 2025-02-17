import { Link } from "react-router-dom";
import { MenuIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Menu } from "@/components/layout-components/menu";
import { Sheet, SheetHeader, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";

export function SheetMenu() {
    return (
        <Sheet>
            <SheetTrigger className="lg:hidden" asChild>
                <Button className="h-8" variant="outline" size="icon">
                    <MenuIcon size={20} />
                </Button>
            </SheetTrigger>
            <SheetContent className="flex h-full flex-col px-3 sm:w-72" side="left">
                <SheetHeader>
                    <Button
                        className="flex items-center justify-center pb-2 pt-1"
                        variant="link"
                        asChild>
                        <Link to="/" className="flex items-center gap-2">
                            <SheetTitle className="text-lg font-bold text-primary">
                                NutriXplorer
                            </SheetTitle>
                        </Link>
                    </Button>
                </SheetHeader>
                <Menu isOpen />
            </SheetContent>
        </Sheet>
    );
}
