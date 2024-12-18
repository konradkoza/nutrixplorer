import { Input } from "@/components/ui/input";
import { useEffect, useMemo, useRef, useState } from "react";
import { Label } from "../ui/label";
import { Skeleton } from "../ui/skeleton";

type Props = {
    searchValue: string;
    suggestions: string[];
    setSearchValue: (value: string) => void;
    isLoading?: boolean;
    emptyMessage?: string;
    label?: string;
    placeholder?: string;
};

const AutocompleteTextInput = ({
    searchValue,
    suggestions,
    setSearchValue,
    emptyMessage = "No results",
    label = "Search",
    placeholder = "",
    isLoading = false,
}: Props) => {
    const [focused, setFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const suggestionListRef = useRef<HTMLDivElement>(null);
    const filteredSuggestions = useMemo(() => {
        return suggestions.filter((suggestion) =>
            suggestion.toLowerCase().includes(searchValue.toLowerCase())
        );
    }, [searchValue, suggestions]);

    const handleSuggestionClick = (suggestion: string) => {
        setSearchValue(suggestion);
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
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    return (
        <div className="grid w-full items-center gap-1.5">
            <Label className="mb-2" htmlFor={"search" + label}>
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
                        className="absolute left-0 z-10 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-900">
                        <div className="max-h-[200px] overflow-y-auto">
                            <ul className="divide-y divide-gray-200 dark:divide-gray-800">
                                {filteredSuggestions.length > 0 &&
                                    filteredSuggestions.map((suggestion, index) => (
                                        <li
                                            key={index}
                                            id="suggestion"
                                            className="cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                                            onClick={() => {
                                                setFocused(false);
                                                handleSuggestionClick(suggestion);
                                            }}>
                                            {suggestion}
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

export default AutocompleteTextInput;
