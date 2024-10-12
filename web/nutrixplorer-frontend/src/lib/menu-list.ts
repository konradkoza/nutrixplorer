import {
  ChartColumnStacked,
  Heart,
  LayoutGrid,
  LucideIcon,
  ShoppingBag,
  ShoppingBasketIcon,
  Tag,
  Users
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
// pathname or role or both?
export function getMenuList(pathname: string): Group[] {
  if (pathname === "/") {
    console.log("pathname is /");
  }
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/dashboard",
          label: "Dashboard",
          icon: LayoutGrid,
          submenus: []
        }
      ]
    },
    {
      groupLabel: "Klient",
      menus: [
        {
          href: "/categories",
          label: "Kategorie",
          icon: ChartColumnStacked
        },
        {
          href: "/deals",
          label: "Okazje",
          icon: Tag
        },
        {
          href: "/favourites",
          label: "Ulubione",
          icon: Heart
        },
        {
          href: "/baskets",
          label: "Koszyki",
          icon: ShoppingBasketIcon
        },
        {
          href: "/products",
          label: "Produkty",
          icon: ShoppingBag
        }
      ]
    },
    {
      groupLabel: "Sprzedawca",
      menus: [
        {
          href: "/my-deals",
          label: "Moje okazje",
          icon: Users
        },
        {
          href: "/deals",
          label: "Okazje",
          icon: Tag
        },
        {
          href: "/products",
          label: "Produkty",
          icon: ShoppingBag
        }
      ]
    },
    {
      groupLabel: "Administrator",
      menus: [
        {
          href: "/users",
          label: "Users",
          icon: Users
        },
      ]
    }
  ];
}
