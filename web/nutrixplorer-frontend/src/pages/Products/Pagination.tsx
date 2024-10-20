import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { t } from "i18next";
import { FC } from "react";
import {
    FaAngleDoubleLeft,
    FaAngleDoubleRight,
    FaAngleLeft,
    FaAngleRight,
} from "react-icons/fa";
import { RiExpandUpDownLine } from "react-icons/ri";

interface PaginationProps {
    pageSize: number;
    totalPages: number;
    pageNumber: number;
    setPageNumber: (pageNumber: number) => void;
    setNumberOfElements: (numberOfElements: number) => void;
    className?: string;
    children?: React.ReactNode;
}

const PageChangerComponent: FC<PaginationProps> = ({
    pageSize,
    totalPages,
    pageNumber,
    setPageNumber,
    setNumberOfElements,
    className,
    children,
}) => {
    const handleElementChange = (numberOfElements: number) => {
        setNumberOfElements(numberOfElements);
        setPageNumber(0);
    };

    return (
        <div className={cn("flex items-center", className)}>
            <div className="flex items-center justify-start gap-2">
                {children}
            </div>
            <div className="flex items-center justify-end gap-12">
                <div className="flex items-center gap-1">
                    <p className="mr-1">{t("pageChanger.numberOfElements")}</p>
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
                            <DropdownMenuItem
                                onSelect={() => handleElementChange(10)}
                                className="h-8 px-2">
                                10
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onSelect={() => handleElementChange(20)}
                                className="h-8 px-2">
                                20
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onSelect={() => handleElementChange(30)}
                                className="h-8 px-2">
                                30
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <p>
                    Strona {pageNumber + 1} z{" "}
                    {totalPages === 0 ? 1 : totalPages}
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
