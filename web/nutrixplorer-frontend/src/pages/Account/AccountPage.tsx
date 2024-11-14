import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useGetMeQuery } from "@/redux/services/meService";

const AccountPage = () => {
    const { data: user } = useGetMeQuery();

    return (
        <div className="flex w-full justify-center">
            <div className="container flex w-full flex-col gap-3">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-3xl">Konto</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl">Twoje dane</p>
                        <div className="p-2">
                            <Separator className="mb-2 mt-4" />
                            <div className="relative my-1">
                                <Button variant="ghost" className="absolute right-0 top-0">
                                    Edytuj
                                </Button>
                                <p className="text-xl">Imię i Nazwisko</p>
                                <p className="font-semi-bold">
                                    {user?.firstName} {user?.lastName}
                                </p>
                            </div>
                            <Separator className="mb-2 mt-4" />
                            <div className="relative my-1">
                                <Button variant="ghost" className="absolute right-0 top-0">
                                    Zmień
                                </Button>
                                <p className="text-xl">Adres email</p>
                                <p className="font-semi-bold">{user?.email}</p>
                            </div>
                            <Separator className="mb-2 mt-4" />
                        </div>
                    </CardContent>
                    <CardContent>
                        <p className="text-2xl">Preferencje wyszukiwania</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AccountPage;
