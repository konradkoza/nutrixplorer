package pl.lodz.p.it.nutrixplorer.mow.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;
import pl.lodz.p.it.nutrixplorer.model.mow.Composition;
import pl.lodz.p.it.nutrixplorer.model.mow.Product;
import pl.lodz.p.it.nutrixplorer.model.mow.Unit;
import pl.lodz.p.it.nutrixplorer.mow.dto.ProductCompositionDTO;
import pl.lodz.p.it.nutrixplorer.mow.dto.ProductDetailsDTO;
import pl.lodz.p.it.nutrixplorer.mow.dto.ProductSimpleDTO;
import pl.lodz.p.it.nutrixplorer.mow.dto.UnitDTO;

import java.util.List;

@Mapper(uses = ProductMapperHelper.class)
public interface ProductMapper {

    ProductMapper INSTANCE = Mappers.getMapper( ProductMapper.class );

    ProductSimpleDTO productToProductSimpleDTO(Product product);

    UnitDTO unitToUnitDTO(Unit unit);

    List<ProductSimpleDTO> productsToProductSimpleDTOs(List<Product> products);

    ProductCompositionDTO compositionToCompositionDTO(Composition composition);

    ProductDetailsDTO productToProductDetailsDTO(Product product);


}
