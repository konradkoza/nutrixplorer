package pl.lodz.p.it.nutrixplorer.mow.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;
import pl.lodz.p.it.nutrixplorer.model.mow.*;
import pl.lodz.p.it.nutrixplorer.mow.dto.*;

import java.util.List;

@Mapper(uses = ProductMapperHelper.class)
public interface ProductMapper {

    ProductMapper INSTANCE = Mappers.getMapper( ProductMapper.class );

    ProductSimpleDTO productToProductSimpleDTO(Product product);

    UnitDTO unitToUnitDTO(Unit unit);

    List<ProductSimpleDTO> productsToProductSimpleDTOs(List<Product> products);

    ProductCompositionDTO compositionToCompositionDTO(Composition composition);

    ProductDetailsDTO productToProductDetailsDTO(Product product);

    ProducerDTO producerToProducerDTO(Producer producer);

    ProductRatingDTO ratingToRatingDTO(Rating rating);

    List<ProductRatingDTO> ratingsToRatingDTOs(List<Rating> ratings);

    ProductLabelDTO labelToLabelDTO(Label label);

    ProductIndexDTO productIndexToProductIndexDTO(ProductIndex productIndex);

    List<ProductIndexDTO> productIndexesToProductIndexDTOs(List<ProductIndex> productIndexes);

    NutritionalIndexDTO nutritionalIndexToNutritionalIndexDTO(NutritionalIndex nutritionalIndex);

    List<NutritionalIndexDTO> nutritionalIndexesToNutritionalIndexDTOs(List<NutritionalIndex> nutritionalIndexes);
}
