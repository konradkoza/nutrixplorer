import { AccessLevel } from "@/types/UserTypes";
import { Heart, LucideIcon, ScaleIcon, ShoppingBag, ShoppingBasketIcon, Users } from "lucide-react";

type Submenu = {
    href: string;
    label: string;
    active?: boolean;
};

type Menu = {
    href: string;
    label: string;
    active?: boolean;
    icon: LucideIcon;
    submenus?: Submenu[];
};

type Group = {
    groupLabel: string;
    menus: Menu[];
};

export function getMenuList(authorities: AccessLevel[]): Group[] {
    const list = [];
    list.push({
        groupLabel: "",
        menus: [
            {
                href: "/products",
                label: "products",
                icon: ShoppingBag,
                submenus: [],
            },
        ],
    });
    if (authorities.includes(AccessLevel.CLIENT)) {
        list.push({
            groupLabel: "client",
            menus: [
                {
                    href: "/compare",
                    label: "compare",
                    icon: ScaleIcon,
                },
                {
                    href: "/favourites",
                    label: "favourites",
                    icon: Heart,
                },
                {
                    href: "/baskets",
                    label: "baskets",
                    icon: ShoppingBasketIcon,
                },
            ],
        });
    }
    if (authorities.includes(AccessLevel.ADMINISTRATOR)) {
        list.push({
            groupLabel: "admin",
            menus: [
                {
                    href: "/users",
                    label: "users",
                    icon: Users,
                },
            ],
        });
    }
    return list;
}
