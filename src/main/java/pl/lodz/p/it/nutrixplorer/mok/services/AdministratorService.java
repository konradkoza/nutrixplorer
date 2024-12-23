package pl.lodz.p.it.nutrixplorer.mok.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import pl.lodz.p.it.nutrixplorer.exceptions.mok.AccessLevelAssignException;
import pl.lodz.p.it.nutrixplorer.exceptions.NotFoundException;
import pl.lodz.p.it.nutrixplorer.exceptions.mok.codes.MokErrorCodes;
import pl.lodz.p.it.nutrixplorer.exceptions.mok.messages.MokExceptionMessages;
import pl.lodz.p.it.nutrixplorer.model.mok.Administrator;
import pl.lodz.p.it.nutrixplorer.model.mok.User;
import pl.lodz.p.it.nutrixplorer.mok.repositories.AdministratorRepository;
import pl.lodz.p.it.nutrixplorer.mok.repositories.UserRepository;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(propagation = Propagation.REQUIRES_NEW)
public class AdministratorService {
    private final AdministratorRepository administratorRepository;
    private final UserRepository userRepository;

    public Administrator addAdministratorAccessLevel(UUID id) throws NotFoundException, AccessLevelAssignException {
        Optional<Administrator> administratorOptional = administratorRepository.findByUserId(id);

        Administrator administrator;
        if (administratorOptional.isPresent()) {
            throw new AccessLevelAssignException(MokExceptionMessages.ACCESS_LEVEL_ASSIGNED, MokErrorCodes.ACCESS_LEVEL_ASSIGNED);
        } else {
            User user = userRepository.findById(id).orElseThrow(() -> new NotFoundException(MokExceptionMessages.NOT_FOUND, MokErrorCodes.USER_NOT_FOUND));
            administrator = new Administrator();
            administrator.setUser(user);
        }
        return administratorRepository.saveAndFlush(administrator);
    }

    public void removeAdministratorAccessLevel(UUID id, UUID administratorId) throws NotFoundException, AccessLevelAssignException {
        Optional<Administrator> administrator = administratorRepository.findByUserId(id);

        if (administrator.isEmpty()){
            throw new AccessLevelAssignException(MokExceptionMessages.ACCESS_LEVEL_TAKEN, MokErrorCodes.ACCESS_LEVEL_TAKEN);
        }

        if(administrator.get().getUser().getAccessLevels().size() <= 1){
            throw new AccessLevelAssignException(MokExceptionMessages.ACCESS_LEVEL_CANNOT_BE_REMOVED, MokErrorCodes.ACCESS_LEVEL_CANNOT_BE_REMOVED);
        }

        if(administrator.get().getUser().getId().equals(administratorId)){
            throw new AccessLevelAssignException(MokExceptionMessages.OWN_ADMINISTRATOR_ROLE_REMOVAL, MokErrorCodes.ADMINISTRATOR_OWN_ROLE_REMOVAL);
        }
        administratorRepository.delete(administrator.get());
    }
}
