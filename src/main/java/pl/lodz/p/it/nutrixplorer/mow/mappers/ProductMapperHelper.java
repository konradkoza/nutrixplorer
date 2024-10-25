package pl.lodz.p.it.nutrixplorer.mow.mappers;

import pl.lodz.p.it.nutrixplorer.model.mow.Addition;
import pl.lodz.p.it.nutrixplorer.model.mow.Flavour;
import pl.lodz.p.it.nutrixplorer.model.mow.Ingredient;
import pl.lodz.p.it.nutrixplorer.model.mow.Unit;

public class ProductMapperHelper {

    String unitToString(Unit unit) {
        return unit.getName();
    }

    String flavourToString(Flavour flavour) {
        return flavour.getName();
    }

    String ingredientToString(Ingredient ingredient) {
        return ingredient.getName();
    }

    String addtionToString(Addition addition) {
        return addition.getName();
    }
}
