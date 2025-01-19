import * as React from "react";
import { cn } from "@/lib/utils";
import { LuEye, LuEyeOff } from "react-icons/lu";

export interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
    ({ className, ...props }, ref) => {
        const [showPassword, setShowPassword] = React.useState(false);
        return (
            <div className={cn("relative flex items-center", className)}>
                <input
                    type={showPassword ? "text" : "password"}
                    className={cn(
                        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pr-9 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    )}
                    ref={ref}
                    {...props}
                />
                <button
                    tabIndex={-1}
                    type="button"
                    className="absolute right-2 flex h-full items-center justify-center px-2"
                    onMouseDown={() => setShowPassword(true)}
                    onMouseUp={() => setShowPassword(false)}
                    onMouseLeave={() => setShowPassword(false)}>
                    {showPassword ? <LuEye /> : <LuEyeOff />}
                </button>
            </div>
        );
    }
);
PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
