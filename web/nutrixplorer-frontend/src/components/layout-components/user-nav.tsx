import { LogIn, LogOut, User, UserPlus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useLazyGetMeQuery } from "@/redux/services/meService";
import { logout } from "@/redux/slices/authSlice";
import { RootState } from "@/redux/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { TranslationNS } from "@/utils/translationNamespaces";
import { api } from "@/redux/services/api";

export function UserNav() {
    const { token } = useSelector((state: RootState) => state.authSlice);
    const [getUserData, { data: userData, isLoading }] = useLazyGetMeQuery();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [t] = useTranslation(TranslationNS.Layout);
    useEffect(() => {
        if (token) {
            getUserData();
        }
    }, [token, getUserData]);

    return (
        <DropdownMenu>
            <TooltipProvider disableHoverableContent>
                <Tooltip delayDuration={100}>
                    <TooltipTrigger asChild>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="relative h-8 w-8 rounded-full">
                                <Avatar
                                    className={
                                        !token ? "flex h-8 w-8 items-center justify-start pl-1" : ""
                                    }>
                                    {!token && <LogIn size={20} strokeWidth={1.5} />}
                                    <AvatarImage src="#" asChild alt="Avatar"></AvatarImage>
                                    {userData && !isLoading && token && (
                                        <AvatarFallback className="bg-transparent">
                                            {userData?.firstName[0] + userData?.lastName[0]}
                                        </AvatarFallback>
                                    )}
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                        {token ? t("profile") : t("login")}
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            {token ? (
                <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">
                                {userData?.firstName} {userData?.lastName}
                            </p>
                            <p className="text-xs leading-none text-muted-foreground">
                                {userData?.email}
                            </p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        {/* <DropdownMenuItem className="hover:cursor-pointer" asChild>
                        <Link to="/dashboard" className="flex items-center">
                            <LayoutGrid className="mr-3 h-4 w-4 text-muted-foreground" />
                            Dashboard
                        </Link>
                    </DropdownMenuItem> */}
                        <DropdownMenuItem className="hover:cursor-pointer" asChild>
                            <Link to="/account" className="flex items-center">
                                <User className="mr-3 h-4 w-4 text-muted-foreground" />
                                {t("account")}
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        className="hover:cursor-pointer"
                        onClick={() => {
                            dispatch(logout());
                            dispatch(api.util.resetApiState());
                            navigate("/", { replace: true });
                        }}>
                        <LogOut className="mr-3 h-4 w-4 text-muted-foreground" />
                        {t("logout")}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            ) : (
                <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuItem
                        className="hover:cursor-pointer"
                        onClick={() => {
                            navigate("/login");
                        }}>
                        <LogIn className="mr-3 h-4 w-4 text-muted-foreground" />
                        {t("login")}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        className="hover:cursor-pointer"
                        onClick={() => {
                            navigate("/register");
                        }}>
                        <UserPlus className="mr-3 h-4 w-4 text-muted-foreground" />
                        {t("register")}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            )}
        </DropdownMenu>
    );
}
