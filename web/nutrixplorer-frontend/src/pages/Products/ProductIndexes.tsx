import { NutritionalIndex, ProductIndex } from "@/types/ProductTypes.ts";
import { getEnergyIndex } from "@/utils/productUtils";

type ProductIndexesProps = {
    indexes: ProductIndex[];
    nutritionalIndexes: NutritionalIndex[];
    energy: number;
};

const ProductIndexes = ({
    indexes,
    nutritionalIndexes,
    energy,
}: ProductIndexesProps) => {
    const returnIndexValue = (indexName: string) => {
        const index = indexes.find((index) => index.indexName === indexName);
        if (index) {
            return index.indexValue;
        } else {
            return 0;
        }
    };

    return (
        <div>
            <div className="mb-5">
                <p>Indeks EN: {getEnergyIndex(energy)}</p>
                <p>Indeks VIT: {returnIndexValue("V")}</p>
                <p>Indeks MIN: {returnIndexValue("M")}</p>
                <p>Indeks OM3: {returnIndexValue("O")}</p>
                <p>Indeks PRT: {returnIndexValue("P")}</p>
                <p>Indeks FIB: {returnIndexValue("F")}</p>
                <p>Indeks SUM: {returnIndexValue("S")}</p>
                <p>Indeks FF: {returnIndexValue("T")}</p>
            </div>
            <p>Dodatkowe informacje: </p>
            {nutritionalIndexes.map(
                (element) =>
                    element.legend && (
                        <p key={element.legend}>{element.legend}</p>
                    )
            )}
        </div>
    );
};

export default ProductIndexes;
