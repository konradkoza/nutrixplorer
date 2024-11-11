package pl.lodz.p.it.nutrixplorer.mow.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;
import pl.lodz.p.it.nutrixplorer.model.mow.Deal;
import pl.lodz.p.it.nutrixplorer.mow.dto.DealDetailsDTO;
import pl.lodz.p.it.nutrixplorer.mow.dto.DealSimpleDTO;

import java.util.List;

@Mapper(uses = {ProductMapperHelper.class})
public interface DealMapper {
    DealMapper INSTANCE = Mappers.getMapper( DealMapper.class );

    DealSimpleDTO dealToDealSimpleDTO(Deal deal);

    DealDetailsDTO dealToDealDetailsDTO(Deal deal);

    List<DealSimpleDTO> dealsToDealSimpleDTOs(List<Deal> deals);


}
