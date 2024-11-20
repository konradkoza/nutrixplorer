import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React from "react";
type BreadCrumb = {
    title: string;
    path: string;
};

export const useBreadcrumbs = (breadcrumbs: BreadCrumb[]): React.ReactElement => {
    return (
        <Breadcrumb>
            <BreadcrumbList>
                {breadcrumbs.map((breadcrumb, index) => (
                    <React.Fragment key={index}>
                        <BreadcrumbItem>
                            <BreadcrumbLink href={breadcrumb.path}>
                                {breadcrumb.title}
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        {index !== breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                    </React.Fragment>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    );
};
