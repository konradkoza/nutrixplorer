import { Navbar } from "@/components/layout-components/navbar";

interface ContentLayoutProps {
    children: React.ReactNode;
}

export function ContentLayout({ children }: ContentLayoutProps) {
    return (
        <div>
            <Navbar title="NutriXplorer" />
            <div className="px-4 pb-8 pt-8 sm:px-8">{children}</div>
        </div>
    );
}
