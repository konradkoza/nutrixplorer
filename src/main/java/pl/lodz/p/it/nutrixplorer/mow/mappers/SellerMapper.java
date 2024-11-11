package pl.lodz.p.it.nutrixplorer.mow.mappers;

import org.mapstruct.Mapper;
import pl.lodz.p.it.nutrixplorer.model.mok.Address;
import pl.lodz.p.it.nutrixplorer.model.mok.Seller;
import pl.lodz.p.it.nutrixplorer.model.mok.User;
import pl.lodz.p.it.nutrixplorer.mow.dto.DealUserDTO;
import pl.lodz.p.it.nutrixplorer.mow.dto.PublicAddressDTO;
import pl.lodz.p.it.nutrixplorer.mow.dto.SellerAddressDTO;
import pl.lodz.p.it.nutrixplorer.mow.dto.SellerPublicDTO;

@Mapper(uses = ProductMapperHelper.class)
public interface SellerMapper {

    SellerPublicDTO sellerToSellerPublicDTO(Seller seller);

    PublicAddressDTO addressToPublicAddressDTO(Address address);
    SellerAddressDTO sellerToSellerAddressDTO(Seller seller);

    DealUserDTO userToDealUserDTO(User user);
}
