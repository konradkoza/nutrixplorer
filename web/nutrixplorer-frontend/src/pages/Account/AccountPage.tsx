import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useBreadcrumbs } from "@/hooks/useBreadCrumbs";
import {
    useChangeEmailMutation,
    useChangeNameMutation,
    useGetMeDetailsQuery,
} from "@/redux/services/meService";
import { TranslationNS } from "@/utils/translationNamespaces";
import { useTranslation } from "react-i18next";
import ChangeEmailDialog from "./ChangeEmailDialog";
import ChangeNameDialog from "./ChangeNameDialog";
import ChangePasswordDialog from "./ChangePasswordDialog";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { LuRefreshCw } from "react-icons/lu";

const AccountPage = () => {
    const [t, i18n] = useTranslation(TranslationNS.Account);
    const { data: user, refetch } = useGetMeDetailsQuery();
    const [changeEmail] = useChangeEmailMutation();
    const [changeName] = useChangeNameMutation();
    const breadcrumbs = useBreadcrumbs([
        { title: t("breadcrumbs.home"), path: "/" },
        { title: t("breadcrumbs.account"), path: "/account" },
    ]);

    return (
        <div className="flex w-full justify-center">
            <div className="container flex w-full flex-col gap-3">
                {breadcrumbs}
                <Card className="relative">
                    <Button variant="ghost" onClick={refetch} className="absolute right-2 top-2">
                        <LuRefreshCw size={24} />
                    </Button>
                    <CardHeader>
                        <CardTitle className="text-3xl">{t("account")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl">{t("yourData")}</p>
                        <div className="p-2">
                            <Separator className="mb-2 mt-4" />
                            <div className="relative my-1">
                                <ChangeNameDialog
                                    changeName={({ firstName, lastName }) => {
                                        changeName({ firstName, lastName, etag: user?.etag || "" });
                                    }}
                                    firstName={user?.firstName || ""}
                                    lastName={user?.lastName || ""}
                                />
                                <p className="text-xl">{t("nameAndLastName")}</p>
                                <p className="font-semi-bold">
                                    {user?.firstName} {user?.lastName}
                                </p>
                            </div>
                            <Separator className="mb-2 mt-4" />
                            <div className="relative my-1">
                                <ChangeEmailDialog
                                    changeEmail={changeEmail}
                                    email={user?.email || ""}
                                />
                                <p className="text-xl">{t("email")}</p>
                                <p className="font-semi-bold">{user?.email}</p>
                            </div>
                            <Separator className="mb-2 mt-4" />
                            {!user?.oauth && <ChangePasswordDialog />}
                        </div>
                        <p className="mt-4 text-2xl">{t("loginData")}</p>
                        <div className="p-2">
                            <Separator className="mb-2 mt-4" />
                            <div className="my-1">
                                <p className="text-xl">{t("lastFailedLogin")}</p>
                                <p className="font-semi-bold">
                                    {user?.lastFailedLogin
                                        ? (i18n.language === "pl"
                                              ? format(
                                                    new Date(user?.lastFailedLogin),
                                                    "dd.MM.yyyy H:mm"
                                                )
                                              : format(
                                                    new Date(user?.lastFailedLogin),
                                                    "dd/MM/yyyy H:mm"
                                                )) +
                                          " " +
                                          t("fromIP") +
                                          " " +
                                          user?.lastFailedLoginIp
                                        : t("noFailedLogins")}
                                </p>
                            </div>
                            <div className="my-1">
                                <p className="text-xl">{t("lastSuccessfulLogin")}</p>
                                <p className="font-semi-bold">
                                    {user?.lastSuccessfulLogin
                                        ? (i18n.language === "pl"
                                              ? format(
                                                    new Date(user?.lastSuccessfulLogin),
                                                    "dd.MM.yyyy H:mm"
                                                )
                                              : format(
                                                    new Date(user?.lastSuccessfulLogin),
                                                    "dd/MM/yyyy H:mm"
                                                )) +
                                          " " +
                                          t("fromIP") +
                                          " " +
                                          user?.lastSuccessfulLoginIp
                                        : t("noSuccessfullLogins")}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                    {/* <CardContent>
                        <p className="text-2xl">Preferencje wyszukiwania</p>
                    </CardContent> */}
                </Card>
            </div>
        </div>
    );
};

export default AccountPage;
