import { Link, useLocation } from "react-router-dom";
import { Ellipsis } from "lucide-react";

import { cn } from "@/lib/utils";
import { getMenuList } from "@/lib/menu-list";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CollapseMenuButton } from "@/components/layout-components/collapse-menu-button";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { TranslationNS } from "@/utils/translationNamespaces";
import { useTranslation } from "react-i18next";

interface MenuProps {
    isOpen: boolean | undefined;
}

export function Menu({ isOpen }: MenuProps) {
    const { pathname } = useLocation();
    const { accessLevels } = useSelector((state: RootState) => state.authSlice);
    const menuList = getMenuList(accessLevels);
    const [t] = useTranslation(TranslationNS.Layout);
    return (
        <ScrollArea className="[&>div>div[style]]:!block">
            <nav className="h-full w-full">
                <ul className="flex min-h-[calc(100vh-48px-36px-16px-32px)] flex-col items-start space-y-1 px-2 lg:min-h-[calc(100vh-32px-40px-32px)]">
                    {menuList.map(({ groupLabel, menus }, index) => (
                        <li className={cn("w-full", groupLabel ? "pt-5" : "")} key={index}>
                            {(isOpen && groupLabel) || isOpen === undefined ? (
                                <p className="max-w-[248px] truncate px-4 pb-2 text-sm font-medium text-muted-foreground">
                                    {t(groupLabel)}
                                </p>
                            ) : !isOpen && isOpen !== undefined && groupLabel ? (
                                <TooltipProvider>
                                    <Tooltip delayDuration={100}>
                                        <TooltipTrigger className="w-full">
                                            <div className="flex w-full items-center justify-center">
                                                <Ellipsis className="h-5 w-5" />
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent side="right">
                                            <p>{t(groupLabel)}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            ) : (
                                <p className="pb-2"></p>
                            )}
                            {menus.map(({ href, label, icon: Icon, active, submenus }, index) =>
                                !submenus || submenus.length === 0 ? (
                                    <div className="w-full" key={index}>
                                        <TooltipProvider disableHoverableContent>
                                            <Tooltip delayDuration={100}>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant={
                                                            (active === undefined &&
                                                                pathname.startsWith(href)) ||
                                                            active
                                                                ? "secondary"
                                                                : "ghost"
                                                        }
                                                        className="mb-1 h-10 w-full justify-start"
                                                        asChild>
                                                        <Link to={href}>
                                                            <span
                                                                className={cn(
                                                                    isOpen === false ? "" : "mr-4"
                                                                )}>
                                                                <Icon size={18} />
                                                            </span>
                                                            <p
                                                                className={cn(
                                                                    "max-w-[200px] truncate",
                                                                    isOpen === false
                                                                        ? "-translate-x-96 opacity-0"
                                                                        : "translate-x-0 opacity-100"
                                                                )}>
                                                                {t(label)}
                                                            </p>
                                                        </Link>
                                                    </Button>
                                                </TooltipTrigger>
                                                {isOpen === false && (
                                                    <TooltipContent side="right">
                                                        {t(label)}
                                                    </TooltipContent>
                                                )}
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                ) : (
                                    <div className="w-full" key={index}>
                                        <CollapseMenuButton
                                            icon={Icon}
                                            label={t(label)}
                                            active={
                                                active === undefined
                                                    ? pathname.startsWith(href)
                                                    : active
                                            }
                                            submenus={submenus}
                                            isOpen={isOpen}
                                        />
                                    </div>
                                )
                            )}
                        </li>
                    ))}
                </ul>
            </nav>
        </ScrollArea>
    );
}
