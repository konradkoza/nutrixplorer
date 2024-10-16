import { Menu } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarToggleProps {
    isOpen: boolean | undefined;
    setIsOpen?: () => void;
}

export function SidebarToggle({ isOpen, setIsOpen }: SidebarToggleProps) {
    return (
        <div className="alig invisible flex justify-start py-1 pl-5 lg:visible">
            <Button
                onClick={() => setIsOpen?.()}
                className="h-8 w-8 rounded-md"
                variant="ghost"
                size="icon">
                <Menu
                    className={cn(
                        "h-8 w-8 transition-transform duration-700 ease-in-out",
                        isOpen === false ? "" : ""
                    )}
                />
            </Button>
        </div>
    );
}
