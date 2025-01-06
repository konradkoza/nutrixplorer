import { Input } from "@/components/ui/input";
import { useEffect, useMemo, useRef, useState } from "react";
import { Label } from "../ui/label";
import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";

type Suggestion = {
    label: string;
    value: string;
};

type Props = {
    errorMessage?: string | undefined;
    searchValue: string;
    suggestions: Suggestion[];
    setSearchValue: (value: string) => void;
    setSelectedValue: (value: string) => void;
    isLoading?: boolean;
    emptyMessage?: string;
    label?: string;
    placeholder?: string;
    selectedValue: string;
};

const AutocompleteSelect = ({
    errorMessage,
    searchValue,
    suggestions,
    setSearchValue,
    setSelectedValue,
    emptyMessage = "No results",
    label = "Search",
    placeholder = "",
    isLoading = false,
    selectedValue,
}: Props) => {
    const [focused, setFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const suggestionListRef = useRef<HTMLDivElement>(null);
    const filteredSuggestions = useMemo(() => {
        return suggestions.filter((suggestion) =>
            suggestion.label.toLowerCase().includes(searchValue.toLowerCase())
        );
    }, [searchValue, suggestions]);

    const handleSuggestionClick = (suggestion: Suggestion) => {
        if (suggestion.value === selectedValue) {
            setSearchValue("");
            setSelectedValue("");
        } else {
            setSearchValue(suggestion.label);
            setSelectedValue(suggestion.value);
        }

        setFocused(false);
    };
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                event.target instanceof Node &&
                inputRef.current &&
                !inputRef.current.contains(event.target) &&
                suggestionListRef.current &&
                !suggestionListRef.current.contains(event.target)
            ) {
                setFocused(false);
                if (selectedValue === "") {
                    setSearchValue("");
                } else if (
                    suggestions.find((suggestion) => suggestion.value === selectedValue)?.label !==
                    searchValue
                ) {
                    setSearchValue(
                        suggestions.find((suggestion) => suggestion.value === selectedValue)
                            ?.label || ""
                    );
                }
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // useEffect(() => {
    //     if (!focused && selectedValue === "") {
    //         setSearchValue("");
    //     } else if (
    //         !focused &&
    //         suggestions.find((suggestion) => suggestion.value === selectedValue)?.label !==
    //             searchValue
    //     ) {
    //         setSearchValue(
    //             suggestions.find((suggestion) => suggestion.value === selectedValue)?.label || ""
    //         );
    //     }
    // }, [focused, setSearchValue]);

    return (
        <div className="w-full space-y-2">
            <Label className={cn(errorMessage && "text-destructive")} htmlFor={"search" + label}>
                {label}
            </Label>
            <div className="relative">
                <Input
                    ref={inputRef}
                    autoComplete="off"
                    type="text"
                    id={"search" + label}
                    placeholder={placeholder}
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    // className="pr-12"
                    onFocus={() => setFocused(true)}
                    onKeyDown={(e) => {
                        if (e.key === "Escape") setFocused(false);
                        if (e.key === "Enter") setFocused(false);
                    }}
                />
                {filteredSuggestions.length > 0 && focused ? (
                    <div
                        ref={suggestionListRef}
                        className="absolute left-0 z-10 mt-1 w-full rounded-lg border border-border">
                        <div className="overflow-y-auto rounded-lg">
                            <ul className="divide-y divide-none rounded-lg bg-popover p-1">
                                {filteredSuggestions.length > 0 &&
                                    filteredSuggestions.map((suggestion, index) => (
                                        <li
                                            key={index}
                                            id="suggestion"
                                            className={cn(
                                                "my-1 box-content flex h-5 cursor-pointer items-center gap-2 rounded px-4 py-2 hover:bg-accent",
                                                suggestion.value === selectedValue && "bg-accent"
                                            )}
                                            onClick={() => handleSuggestionClick(suggestion)}>
                                            {suggestion.label}
                                            {suggestion.value === selectedValue && (
                                                <CheckIcon size={15} />
                                            )}
                                        </li>
                                    ))}
                            </ul>
                        </div>
                    </div>
                ) : (
                    focused && (
                        <div className="absolute left-0 z-10 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-900">
                            <ul className="divide-y divide-gray-200 dark:divide-gray-800">
                                <li className="cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800">
                                    {isLoading ? (
                                        <div className="flex w-full flex-col gap-2.5">
                                            <Skeleton className="h-6 w-full" />
                                            <Skeleton className="h-6 w-full" />
                                            <Skeleton className="h-6 w-full" />
                                        </div>
                                    ) : (
                                        emptyMessage
                                    )}
                                </li>
                            </ul>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default AutocompleteSelect;
