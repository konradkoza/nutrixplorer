import { AccessLevel } from "@/types/UserTypes";
import {
    ChartColumnStacked,
    Heart,
    LucideIcon,
    ShoppingBag,
    ShoppingBasketIcon,
    Tag,
    Users,
} from "lucide-react";

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
                label: "Produkty",
                icon: ShoppingBag,
                submenus: [],
            },
        ],
    });
    if (authorities.includes(AccessLevel.CLIENT)) {
        list.push({
            groupLabel: "Klient",
            menus: [
                {
                    href: "/categories",
                    label: "Kategorie",
                    icon: ChartColumnStacked,
                },
                {
                    href: "/deals",
                    label: "Okazje",
                    icon: Tag,
                },
                {
                    href: "/favourites",
                    label: "Ulubione",
                    icon: Heart,
                },
                {
                    href: "/baskets",
                    label: "Koszyki",
                    icon: ShoppingBasketIcon,
                },
            ],
        });
    }
    if (authorities.includes(AccessLevel.SELLER)) {
        list.push({
            groupLabel: "Sprzedawca",
            menus: [
                {
                    href: "/my-deals",
                    label: "Moje okazje",
                    icon: Users,
                },
                {
                    href: "/deals",
                    label: "Okazje",
                    icon: Tag,
                },
            ],
        });
    }
    if (authorities.includes(AccessLevel.ADMINISTRATOR)) {
        list.push({
            groupLabel: "Administrator",
            menus: [
                {
                    href: "/users",
                    label: "Users",
                    icon: Users,
                },
            ],
        });
    }
    return list;
}
