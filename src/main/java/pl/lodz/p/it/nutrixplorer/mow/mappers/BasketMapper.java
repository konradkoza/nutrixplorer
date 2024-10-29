package pl.lodz.p.it.nutrixplorer.mow.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;
import pl.lodz.p.it.nutrixplorer.model.mow.Basket;
import pl.lodz.p.it.nutrixplorer.model.mow.BasketEntry;
import pl.lodz.p.it.nutrixplorer.mow.dto.BasketDTO;
import pl.lodz.p.it.nutrixplorer.mow.dto.BasketEntryDTO;
import pl.lodz.p.it.nutrixplorer.mow.dto.BasketEntryDetailsDTO;

import java.util.List;

@Mapper(uses = ProductMapperHelper.class)
public interface BasketMapper {
    BasketMapper INSTANCE = Mappers.getMapper( BasketMapper.class );

    BasketEntry basketEntryDTOtoBasketEntry(BasketEntryDTO entryDTO);

    List<BasketEntry> basketEntryDTOsToBasketEntries(List<BasketEntryDTO> entriesDTO);

    BasketEntryDetailsDTO basketEntryToBasketEntryDetailsDTO(BasketEntry entry);

    BasketDTO basketToBasketDTO(Basket basket);

    List<BasketDTO> basketsToBasketDTOs(List<Basket> baskets);
}
