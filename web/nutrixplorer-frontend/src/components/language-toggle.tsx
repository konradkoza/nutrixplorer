import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { TranslationNS } from "@/utils/translationNamespaces";
import { useChangeLanguageMutation } from "@/redux/services/meService";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export function LanguageToggle() {
    const [changeLanguage] = useChangeLanguageMutation();
    const { i18n } = useTranslation();
    const [t] = useTranslation(TranslationNS.Layout);
    const token = useSelector((state: RootState) => state.authSlice.token);
    const toggleLanguage = () => {
        const newLanguage = i18n.language === "en" ? "pl" : "en";
        i18n.changeLanguage(newLanguage);
        if (token) {
            changeLanguage(newLanguage);
        }
    };

    return (
        <TooltipProvider disableHoverableContent>
            <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                    <Button
                        className="mr-2 h-8 w-8 rounded-full bg-background"
                        variant="outline"
                        size="icon"
                        onClick={toggleLanguage}>
                        {i18n.language === "en" ? "PL" : "EN"}
                        <span className="sr-only">{t("switchLanguage")}</span>
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">{t("switchLanguage")}</TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
