package pl.lodz.p.it.nutrixplorer.mok.services;

import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import pl.lodz.p.it.nutrixplorer.configuration.LoggingInterceptor;
import pl.lodz.p.it.nutrixplorer.exceptions.NotFoundException;
import pl.lodz.p.it.nutrixplorer.exceptions.mok.AccessLevelAssignException;
import pl.lodz.p.it.nutrixplorer.exceptions.mok.codes.MokErrorCodes;
import pl.lodz.p.it.nutrixplorer.exceptions.mok.messages.MokExceptionMessages;
import pl.lodz.p.it.nutrixplorer.mail.HtmlEmailEvent;
import pl.lodz.p.it.nutrixplorer.model.mok.Administrator;
import pl.lodz.p.it.nutrixplorer.model.mok.User;
import pl.lodz.p.it.nutrixplorer.mok.repositories.AdministratorRepository;
import pl.lodz.p.it.nutrixplorer.mok.repositories.UserRepository;
import pl.lodz.p.it.nutrixplorer.utils.SecurityContextUtil;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(propagation = Propagation.REQUIRES_NEW, isolation = Isolation.READ_COMMITTED)
@LoggingInterceptor
public class AdministratorService {
    private final AdministratorRepository administratorRepository;
    private final UserRepository userRepository;
    private final ApplicationEventPublisher eventPublisher;
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void addAdministratorAccessLevel(UUID id) throws NotFoundException, AccessLevelAssignException {
        Optional<Administrator> administratorOptional = administratorRepository.findByUserId(id);

        Administrator administrator;
        if (administratorOptional.isPresent()) {
            if (administratorOptional.get().isActive()) {
                throw new AccessLevelAssignException(MokExceptionMessages.ACCESS_LEVEL_ASSIGNED, MokErrorCodes.ACCESS_LEVEL_ASSIGNED);
            } else {
                administrator = administratorOptional.get();
                administrator.setActive(true);
            }
        } else {
            User user = userRepository.findById(id).orElseThrow(() -> new NotFoundException(MokExceptionMessages.NOT_FOUND, MokErrorCodes.USER_NOT_FOUND));
            administrator = new Administrator();
            administrator.setUser(user);
            administrator.setActive(true);
        }
        administratorRepository.saveAndFlush(administrator);
        eventPublisher.publishEvent(
                new HtmlEmailEvent(
                        this,
                        administrator.getUser().getEmail(),
                        Map.of("name", administrator.getUser().getFirstName() + " " + administrator.getUser().getLastName()),
                        "adminPermissionGained",
                        administrator.getUser().getLanguage()));
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void removeAdministratorAccessLevel(UUID id) throws AccessLevelAssignException {
        Optional<Administrator> administrator = administratorRepository.findByUserId(id);
        UUID administratorId = UUID.fromString(SecurityContextUtil.getCurrentUser());
        if (administrator.isEmpty()){
            throw new AccessLevelAssignException(MokExceptionMessages.ACCESS_LEVEL_TAKEN, MokErrorCodes.ACCESS_LEVEL_TAKEN);
        }
        Administrator administrator1 = administrator.get();
        if(administrator1.getUser().getAccessLevels().size() <= 1){
            throw new AccessLevelAssignException(MokExceptionMessages.ACCESS_LEVEL_CANNOT_BE_REMOVED, MokErrorCodes.ACCESS_LEVEL_CANNOT_BE_REMOVED);
        }

        if(administrator1.getUser().getId().equals(administratorId)){
            throw new AccessLevelAssignException(MokExceptionMessages.OWN_ADMINISTRATOR_ROLE_REMOVAL, MokErrorCodes.ADMINISTRATOR_OWN_ROLE_REMOVAL);
        }
        administrator1.setActive(false);
        administratorRepository.saveAndFlush(administrator1);
        eventPublisher.publishEvent(
                new HtmlEmailEvent(
                        this,
                        administrator1.getUser().getEmail(),
                        Map.of("name", administrator1.getUser().getFirstName() + " " + administrator1.getUser().getLastName()),
                        "permissionLost",
                        administrator1.getUser().getLanguage()));
    }
}
