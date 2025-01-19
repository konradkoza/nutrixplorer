import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const UnitInput = React.forwardRef<HTMLInputElement, InputProps & { unit: string }>(
    ({ className, unit, type, ...props }, ref) => {
        return (
            <div className={cn("flex items-center", className)}>
                <input
                    type={type}
                    className={cn(
                        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pr-9 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    )}
                    onWheel={(e) => e.currentTarget.blur()}
                    ref={ref}
                    {...props}
                />
                <span className="-ml-9 h-10 rounded-md rounded-l-none border-input px-3 py-2 text-sm">
                    {unit}
                </span>
            </div>
        );
    }
);
UnitInput.displayName = "UnitInput";

export { UnitInput };
