import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { TranslationNS } from "@/types/TranslationNamespaces";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { RiExpandUpDownLine } from "react-icons/ri";

interface PaginationProps {
    pageSize: number;
    totalPages: number;
    pageNumber: number;
    setPageNumber: (pageNumber: number) => void;
    setNumberOfElements: (numberOfElements: number) => void;
    className?: string;
    children?: React.ReactNode;
    elements?: number[];
}

const PageChangerComponent: FC<PaginationProps> = ({
    pageSize,
    totalPages,
    pageNumber,
    setPageNumber,
    setNumberOfElements,
    className,
    children,
    elements = [10, 20, 30],
}) => {
    const handleElementChange = (numberOfElements: number) => {
        setNumberOfElements(numberOfElements);
        setPageNumber(0);
    };
    const [t] = useTranslation(TranslationNS.Pagination);
    return (
        <div className={cn("flex items-center", className)}>
            <div className="flex items-center justify-start gap-2">{children}</div>
            <div className="flex items-center justify-end gap-12">
                <div className="flex items-center gap-1">
                    <p className="mr-1">{t("numberOfElements")}</p>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                className="flex h-8 items-center px-2"
                                variant="outline"
                                role="combobox">
                                {pageSize}
                                <RiExpandUpDownLine className="ml-3 text-sm" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            {elements.map((number) => (
                                <DropdownMenuItem
                                    key={number + "pagination"}
                                    onSelect={() => handleElementChange(number)}
                                    className="h-8 px-2">
                                    {number}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <p>
                    {t("page")} {pageNumber + 1} {t("of")} {totalPages === 0 ? 1 : totalPages}
                </p>
                <div className="flex gap-1">
                    <Button
                        className="h-8 px-2"
                        onClick={() => setPageNumber(0)}
                        variant="outline"
                        disabled={pageNumber === 0}>
                        <FaAngleDoubleLeft />
                    </Button>
                    <Button
                        className="h-8 px-2"
                        onClick={() => setPageNumber(pageNumber - 1)}
                        variant="outline"
                        disabled={pageNumber === 0}>
                        <FaAngleLeft />
                    </Button>
                    <Button
                        className="h-8 px-2"
                        onClick={() => setPageNumber(pageNumber + 1)}
                        variant="outline"
                        disabled={pageNumber >= totalPages - 1}>
                        <FaAngleRight />
                    </Button>
                    <Button
                        className="h-8 px-2"
                        onClick={() => setPageNumber(totalPages - 1)}
                        variant="outline"
                        disabled={pageNumber >= totalPages - 1}>
                        <FaAngleDoubleRight />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default PageChangerComponent;
