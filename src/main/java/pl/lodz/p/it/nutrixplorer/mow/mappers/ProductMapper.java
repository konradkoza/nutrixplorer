package pl.lodz.p.it.nutrixplorer.mow.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;
import pl.lodz.p.it.nutrixplorer.model.mow.*;
import pl.lodz.p.it.nutrixplorer.mow.dto.*;

import java.util.List;

@Mapper(uses = ProductMapperHelper.class)
public interface ProductMapper {

    ProductMapper INSTANCE = Mappers.getMapper(ProductMapper.class);

    ProductSimpleDTO productToProductSimpleDTO(Product product);

    List<ProductSimpleDTO> productsToProductSimpleDTOs(List<Product> products);

    ProductCompositionDTO compositionToCompositionDTO(Composition composition);

    ProductDetailsDTO productToProductDetailsDTO(Product product);

    ProducerDTO producerToProducerDTO(Producer producer);

    ProductRatingDTO ratingToRatingDTO(Rating rating);

    ProductLabelDTO labelToLabelDTO(Label label);

    ProductIndexDTO productIndexToProductIndexDTO(ProductIndex productIndex);

    NutritionalIndexDTO nutritionalIndexToNutritionalIndexDTO(NutritionalIndex nutritionalIndex);


    NutritionalValueDTO nutritionalValueToNutritionalValueDTO(NutritionalValue nutritionalValue);

    List<NutritionalValueDTO> nutritionalValuesToNutritionalValueDTOs(List<NutritionalValue> nutritionalValues);

    PortionDTO portionToPortionDTO(Portion portion);

    NutritionalValueNameDTO nutritionalValueNameToNutritionalValueNameDTO(NutritionalValueName nutritionalValueName);

    List<String> packageTypesToStrings(List<PackageType> packageTypes);

    List<String> allergensToStrings(List<Allergen> allAllergens);
}
