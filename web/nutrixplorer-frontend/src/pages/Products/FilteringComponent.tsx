import { useForm } from "react-hook-form";

type FilteringFormType = {
    name: string;
    description: string;
    ean: string;
    country: string;
} & {
    [key in Vitamin]: boolean;
};

type Vitamin = "B7" | "K" | "B2" | "B6" | "C" | "B1" | "B5" | "D" | "B9" | "E" | "A" | "B12" | "B3";
type VitaminType = {
    name: Vitamin;
    value: boolean;
};

const vitaminsDefault = {
    B7: false,
    K: false,
    B2: false,
    B6: false,
    C: false,
    B1: false,
    B5: false,
    D: false,
    B9: false,
    E: false,
    A: false,
    B12: false,
    B3: false,
};

const FilteringComponent = () => {
    const form = useForm<FilteringFormType>({
        values: {
            name: "",
            description: "",
            ean: "",
            country: "",
            ...vitaminsDefault,
        },
    });

    return (
        <div>
            <h1>Filtering Component</h1>
        </div>
    );
};

export default FilteringComponent;
