package pl.lodz.p.it.nutrixplorer.mow.mappers;

import pl.lodz.p.it.nutrixplorer.model.mok.Seller;
import pl.lodz.p.it.nutrixplorer.model.mow.*;
import pl.lodz.p.it.nutrixplorer.mow.dto.ProductIndexDTO;
import pl.lodz.p.it.nutrixplorer.mow.dto.SellerAddressDTO;

import java.util.List;

public class ProductMapperHelper {

    String unitToString(Unit unit) {
        return unit != null ? unit.getName() : null;
    }

    String flavourToString(Flavour flavour) {
        return flavour != null ? flavour.getName() : null;
    }

    String ingredientToString(Ingredient ingredient) {
        return ingredient.getName();
    }

    String addtionToString(Addition addition) {
        return addition.getName();
    }

    String packageTypeToString(PackageType packageType) {
        return packageType != null ? packageType.getName() : null;
    }

    String nutritionalValueNameToString(NutritionalValueName nutritionalValueName) {
        return nutritionalValueName != null ? nutritionalValueName.getName() : null;
    }

    String nutritionalValueGroupNameToString(NutritionalValueGroup nutritionalValueGroup) {
        return nutritionalValueGroup != null ? nutritionalValueGroup.getGroupName() : null;
    }

    List<ProductIndexDTO> productToProductIndexesDTO(Product product) {
        return product.getProductIndexes().stream()
                .map(index -> new ProductIndexDTO(
                        index.getIndexName(),
                        index.getIndexValue()
                ))
                .toList();
    }

    SellerAddressDTO sellerToSellerAddressDTO(Seller seller) {
        return new SellerAddressDTO(seller.getAddress().getShopName(), seller.getAddress().getCity());
    }
}
