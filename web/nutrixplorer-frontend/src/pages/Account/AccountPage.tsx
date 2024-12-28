import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useBreadcrumbs } from "@/hooks/useBreadCrumbs";
import {
    useChangeEmailMutation,
    useChangeNameMutation,
    useGetMeQuery,
} from "@/redux/services/meService";
import { TranslationNS } from "@/utils/translationNamespaces";
import { useTranslation } from "react-i18next";
import ChangeEmailDialog from "./ChangeEmailDialog";
import ChangeNameDialog from "./ChangeNameDialog";
import ChangePasswordDialog from "./ChangePasswordDialog";

const AccountPage = () => {
    const [t] = useTranslation(TranslationNS.Account);
    const { data: user } = useGetMeQuery();
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
                <Card>
                    <CardHeader>
                        <CardTitle className="text-3xl">{t("account")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl">{t("yourData")}</p>
                        <div className="p-2">
                            <Separator className="mb-2 mt-4" />
                            <div className="relative my-1">
                                <ChangeNameDialog
                                    changeName={changeName}
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
