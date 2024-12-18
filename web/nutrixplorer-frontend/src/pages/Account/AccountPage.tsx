import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useBreadcrumbs } from "@/hooks/useBreadCrumbs";
import { useGetMeQuery } from "@/redux/services/meService";
import { TranslationNS } from "@/utils/translationNamespaces";
import { useTranslation } from "react-i18next";

const AccountPage = () => {
    const [t] = useTranslation(TranslationNS.Account);
    const { data: user } = useGetMeQuery();
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
                                <Button variant="ghost" className="absolute right-0 top-0">
                                    {t("edit")}
                                </Button>
                                <p className="text-xl">{t("nameAndLastName")}</p>
                                <p className="font-semi-bold">
                                    {user?.firstName} {user?.lastName}
                                </p>
                            </div>
                            <Separator className="mb-2 mt-4" />
                            <div className="relative my-1">
                                <Button variant="ghost" className="absolute right-0 top-0">
                                    {t("change")}
                                </Button>
                                <p className="text-xl">{t("email")}</p>
                                <p className="font-semi-bold">{user?.email}</p>
                            </div>
                            <Separator className="mb-2 mt-4" />
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
