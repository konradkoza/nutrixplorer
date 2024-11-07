import { NutritionalIndex, ProductIndex } from "@/types/ProductTypes.ts";
import { getEnergyIndex, returnIndexValue } from "@/utils/productUtils";

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
    return (
        <div>
            <div className="mb-5">
                <p>Indeks EN: {getEnergyIndex(energy)}</p>
                <p>Indeks VIT: {returnIndexValue("V", indexes)}</p>
                <p>Indeks MIN: {returnIndexValue("M", indexes)}</p>
                <p>Indeks OM3: {returnIndexValue("O", indexes)}</p>
                <p>Indeks PRT: {returnIndexValue("P", indexes)}</p>
                <p>Indeks FIB: {returnIndexValue("F", indexes)}</p>
                <p>Indeks SUM: {returnIndexValue("S", indexes)}</p>
                <p>Indeks FF: {returnIndexValue("T", indexes)}</p>
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
