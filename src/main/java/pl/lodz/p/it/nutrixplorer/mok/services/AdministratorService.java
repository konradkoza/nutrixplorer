package pl.lodz.p.it.nutrixplorer.mok.services;

import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import pl.lodz.p.it.nutrixplorer.exceptions.AccessLevelAssignException;
import pl.lodz.p.it.nutrixplorer.exceptions.NotFoundException;
import pl.lodz.p.it.nutrixplorer.exceptions.codes.ErrorCodes;
import pl.lodz.p.it.nutrixplorer.exceptions.messages.UserExceptionMessages;
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
            throw new AccessLevelAssignException(UserExceptionMessages.ACCESS_LEVEL_ASSIGNED, ErrorCodes.ACCESS_LEVEL_ASSIGNED);
        } else {
            User user = userRepository.findById(id).orElseThrow(() -> new NotFoundException(UserExceptionMessages.NOT_FOUND, ErrorCodes.USER_NOT_FOUND));
            administrator = new Administrator();
            administrator.setUser(user);
        }
        return administratorRepository.saveAndFlush(administrator);
    }

    public void removeAdministratorAccessLevel(UUID id, UUID administratorId) throws NotFoundException, AccessLevelAssignException {
        Optional<Administrator> administrator = administratorRepository.findByUserId(id);

        if (administrator.isEmpty()){
            throw new AccessLevelAssignException(UserExceptionMessages.ACCESS_LEVEL_TAKEN, ErrorCodes.ACCESS_LEVEL_TAKEN);
        }

        if(administrator.get().getUser().getAccessLevels().size() <= 1){
            throw new AccessLevelAssignException(UserExceptionMessages.ACCESS_LEVEL_CANNOT_BE_REMOVED, ErrorCodes.ACCESS_LEVEL_CANNOT_BE_REMOVED);
        }

        if(administrator.get().getUser().getId().equals(administratorId)){
            throw new AccessLevelAssignException(UserExceptionMessages.OWN_ADMINISTRATOR_ROLE_REMOVAL, ErrorCodes.ADMINISTRATOR_OWN_ROLE_REMOVAL);
        }
        administratorRepository.delete(administrator.get());
    }
}
