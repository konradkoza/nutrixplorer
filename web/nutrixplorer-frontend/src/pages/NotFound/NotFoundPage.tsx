import { TranslationNS } from "@/utils/translationNamespaces";
import { useTranslation } from "react-i18next";

const NotFoundPage = () => {
    const [t] = useTranslation(TranslationNS.NotFound);

    return (
        <div className="container flex w-full justify-center">
            <h1 className="text-3xl font-bold">{t("notFound")}</h1>
        </div>
    );
};
export default NotFoundPage;
