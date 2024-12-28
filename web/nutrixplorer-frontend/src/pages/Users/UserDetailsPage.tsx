import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
    useAssignAdminAccessLevelMutation,
    useAssignClientAccessLevelMutation,
    useBlockUserMutation,
    useChangeUserEmailMutation,
    useChangeUserNameMutation,
    useGetUserQuery,
    useRemoveAdminAccessLevelMutation,
    useRemoveClientAccessLevelMutation,
    useUnblockUserMutation,
} from "@/redux/services/userService";
import { useParams } from "react-router-dom";
import Spinner from "@/components/common/Spinner";
import { useTranslation } from "react-i18next";
import { TranslationNS } from "@/utils/translationNamespaces";
import ChangeNameDialog from "../Account/ChangeNameDialog";
import ChangeEmailDialog from "../Account/ChangeEmailDialog";
import { Button } from "@/components/ui/button";
import { AccessLevel } from "@/types/UserTypes";

const UserDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const { data: user, isLoading } = useGetUserQuery(id!, {
        skip: !id,
    });
    const { t } = useTranslation(TranslationNS.Users);
    const [changeEmail] = useChangeUserEmailMutation();
    const [changeName] = useChangeUserNameMutation();
    const [takeAdmin] = useRemoveAdminAccessLevelMutation();
    const [takeClient] = useRemoveClientAccessLevelMutation();
    const [giveAdmin] = useAssignAdminAccessLevelMutation();
    const [giveClient] = useAssignClientAccessLevelMutation();
    const [block] = useBlockUserMutation();
    const [unblock] = useUnblockUserMutation();
    return (
        <div className="flex w-full justify-center">
            <div className="container flex w-full flex-col gap-3">
                {isLoading ? (
                    <Spinner />
                ) : (
                    user && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-3xl">{t("userDetails")}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="relative my-1">
                                    <p className="text-2xl">{t("personalData")}</p>
                                    <Button
                                        className="absolute right-0 top-0"
                                        variant={user.blocked ? "default" : "destructive"}
                                        onClick={() =>
                                            user.blocked ? unblock(user.id!) : block(user.id!)
                                        }>
                                        {user.blocked ? t("unblock") : t("block")}
                                    </Button>
                                </div>
                                <div className="p-2">
                                    <Separator className="mb-2 mt-4" />
                                    <div className="relative my-1">
                                        <ChangeNameDialog
                                            changeName={(data) =>
                                                changeName({ id: user.id!, ...data })
                                            }
                                            firstName={user?.firstName || ""}
                                            lastName={user?.lastName || ""}
                                        />
                                        <p className="text-xl">{t("fullName")}</p>
                                        <p className="font-semi-bold">
                                            {user?.firstName} {user?.lastName}{" "}
                                        </p>
                                    </div>
                                    <Separator className="mb-2 mt-4" />
                                    <div className="relative my-1">
                                        <ChangeEmailDialog
                                            changeEmail={(email) =>
                                                changeEmail({ id: user.id!, email: email })
                                            }
                                            email={user?.email || ""}
                                        />
                                        <p className="text-xl">{t("email")}</p>
                                        <p className="font-semi-bold">{user?.email}</p>
                                    </div>
                                    <Separator className="mb-2 mt-4" />
                                    <div className="relative my-1">
                                        <p className="text-xl">{t("oauth")}</p>
                                        <p className="font-semi-bold">
                                            {user?.oauth ? t("yes") : t("no")}
                                        </p>
                                    </div>
                                    <Separator className="mb-2 mt-4" />
                                    <div className="relative my-1">
                                        <p className="text-xl">{t("accessLevels")}</p>
                                        <p className="font-semi-bold">
                                            {user?.accessLevels.join(", ")}
                                        </p>
                                        <div className="absolute right-0 top-0 flex gap-2">
                                            {user.accessLevels.includes(
                                                AccessLevel.ADMINISTRATOR
                                            ) ? (
                                                user.accessLevels.length > 1 && (
                                                    <Button onClick={() => takeAdmin(user.id!)}>
                                                        {t("takeAdmin")}
                                                    </Button>
                                                )
                                            ) : (
                                                <Button onClick={() => giveAdmin(user.id!)}>
                                                    {t("giveAdmin")}
                                                </Button>
                                            )}
                                            {user.accessLevels.includes(AccessLevel.CLIENT) ? (
                                                user.accessLevels.length > 1 && (
                                                    <Button onClick={() => takeClient(user.id!)}>
                                                        {t("takeClient")}
                                                    </Button>
                                                )
                                            ) : (
                                                <Button onClick={() => giveClient(user.id!)}>
                                                    {t("giveClient")}
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )
                )}
            </div>
        </div>
    );
};

export default UserDetailsPage;
