package pl.lodz.p.it.nutrixplorer.mow.mappers;

import pl.lodz.p.it.nutrixplorer.model.mow.*;

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
}
