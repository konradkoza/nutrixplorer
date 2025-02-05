import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

i18n.use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: "en",
        backend: {
            loadPath: "/locales/{{lng}}/{{ns}}.json",
        },
        ns: ["errors", "success"],
        detection: {
            convertDetectedLanguage: (lng) => {
                if (lng.includes("pl")) {
                    return "pl";
                } else {
                    return "en";
                }
            },
        },
    });

export default i18n;
