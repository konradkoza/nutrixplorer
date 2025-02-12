import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import UsersFilters from "./UsersFilters";
import { UserFilters } from "@/types/UserTypes";
import { useState } from "react";
import {
    useBlockUserMutation,
    useGetUsersQuery,
    useUnblockUserMutation,
} from "@/redux/services/userService";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { useTranslation } from "react-i18next";
import { TranslationNS } from "@/utils/translationNamespaces";
import Pagination from "../Products/Pagination";
import Spinner from "@/components/common/Spinner";
import { useNavigate } from "react-router-dom";
import { useBreadcrumbs } from "@/hooks/useBreadCrumbs";

const UsersPage = () => {
    const [pageNumber, setPageNumber] = useState(0);
    const [elements, setElements] = useState(10);
    const [filters, setFilters] = useState<UserFilters>();
    const [block] = useBlockUserMutation();
    const [unblock] = useUnblockUserMutation();
    const { t } = useTranslation(TranslationNS.Users);
    const { data: usersPage, isFetching } = useGetUsersQuery({
        page: pageNumber,
        elements: elements,
        ...(filters || ({} as UserFilters)),
    });
    const navigate = useNavigate();
    const breadcrumbs = useBreadcrumbs([
        { title: t("breadcrumbs.home"), path: "/" },
        { title: t("breadcrumbs.users"), path: "/products" },
    ]);
    return (
        <div className="relative flex flex-col items-center gap-2">
            <div className="container">{breadcrumbs}</div>
            <div className="container flex flex-col items-center justify-between">
                <UsersFilters setFilters={setFilters} />

                {isFetching ? (
                    <Spinner />
                ) : (
                    usersPage && (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>{t("table.firstName")}</TableHead>
                                    <TableHead>{t("table.lastName")}</TableHead>
                                    <TableHead>{t("table.email")}</TableHead>
                                    <TableHead>{t("table.oauth")}</TableHead>
                                    <TableHead>{t("table.blocked")}</TableHead>
                                    <TableHead>{t("table.verified")}</TableHead>
                                    <TableHead>{t("table.accessLevels")}</TableHead>
                                    <TableHead></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {usersPage?.users.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>{user.firstName}</TableCell>
                                        <TableCell>{user.lastName}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            {user.oauth ? t("table.yes") : t("table.no")}
                                        </TableCell>
                                        <TableCell>
                                            {user.blocked ? t("table.yes") : t("table.no")}
                                        </TableCell>
                                        <TableCell>
                                            {user.verified ? t("table.yes") : t("table.no")}
                                        </TableCell>
                                        <TableCell>{user.accessLevels.join(", ")}</TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <span className="sr-only">
                                                            {t("table.openMenu")}
                                                        </span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>
                                                        {t("table.actions")}
                                                    </DropdownMenuLabel>
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            user.blocked
                                                                ? unblock(user.id)
                                                                : block(user.id)
                                                        }>
                                                        {user.blocked
                                                            ? t("table.unlock")
                                                            : t("table.block")}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            navigate(`/users/${user.id}`)
                                                        }>
                                                        {t("table.details")}
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )
                )}
            </div>
            <div className="mt-5 flex w-full justify-center">
                {usersPage && (usersPage?.numberOfPages > 1 || usersPage.users.length > 10) && (
                    <Pagination
                        pageNumber={pageNumber}
                        pageSize={elements}
                        setNumberOfElements={setElements}
                        setPageNumber={setPageNumber}
                        totalPages={usersPage?.numberOfPages || 0}
                    />
                )}
            </div>
        </div>
    );
};

export default UsersPage;
