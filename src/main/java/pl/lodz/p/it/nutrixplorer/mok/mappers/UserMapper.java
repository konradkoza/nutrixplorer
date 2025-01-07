package pl.lodz.p.it.nutrixplorer.mok.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;
import pl.lodz.p.it.nutrixplorer.model.mok.User;
import pl.lodz.p.it.nutrixplorer.mok.dto.SimpleUserDTO;
import pl.lodz.p.it.nutrixplorer.mok.dto.UserDTO;
import pl.lodz.p.it.nutrixplorer.mok.dto.UserDetailsDTO;

import java.util.List;

@Mapper(uses = UserMapperHelper.class)
public interface UserMapper {

    UserMapper INSTANCE = Mappers.getMapper( UserMapper.class );

    @Mapping(source = "googleId", target = "oauth")
    UserDTO userToUserDTO(User user);

    List<UserDTO> usersToUserDTOs(List<User> users);

    @Mapping(source = "googleId", target = "oauth")
    @Mapping(source = "accessLevels", target = "accessLevels")
    SimpleUserDTO userToSimpleUserDTO(User user);

    List<SimpleUserDTO> usersToSimpleUserDTOs(List<User> users);

    @Mapping(source = "googleId", target = "oauth")
    UserDetailsDTO userToUserDetailsDTO(User user);
}
