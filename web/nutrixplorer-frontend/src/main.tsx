import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App.tsx";
import "./index.css";
import { store } from "./redux/store.ts";
import "./i18n.ts";
import Spinner from "./components/common/Spinner.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <Provider store={store}>
            <Suspense fallback={<Spinner />}>
                <App />
            </Suspense>
        </Provider>
    </StrictMode>
);
