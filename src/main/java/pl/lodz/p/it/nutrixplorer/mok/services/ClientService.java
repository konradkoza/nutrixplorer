package pl.lodz.p.it.nutrixplorer.mok.services;

import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import pl.lodz.p.it.nutrixplorer.configuration.LoggingInterceptor;
import pl.lodz.p.it.nutrixplorer.exceptions.mok.AccessLevelAssignException;
import pl.lodz.p.it.nutrixplorer.exceptions.NotFoundException;
import pl.lodz.p.it.nutrixplorer.exceptions.mok.codes.MokErrorCodes;
import pl.lodz.p.it.nutrixplorer.exceptions.mok.messages.MokExceptionMessages;
import pl.lodz.p.it.nutrixplorer.mail.HtmlEmailEvent;
import pl.lodz.p.it.nutrixplorer.model.mok.Client;
import pl.lodz.p.it.nutrixplorer.model.mok.User;
import pl.lodz.p.it.nutrixplorer.mok.repositories.ClientRepository;
import pl.lodz.p.it.nutrixplorer.mok.repositories.UserRepository;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(propagation = Propagation.REQUIRES_NEW, isolation = Isolation.READ_COMMITTED)
@LoggingInterceptor
public class ClientService {
    private final ClientRepository clientRepository;
    private final UserRepository userRepository;
    private final ApplicationEventPublisher eventPublisher;

    public void addClientAccessLevel(UUID id) throws NotFoundException, AccessLevelAssignException {
        Optional<Client> clientOptional = clientRepository.findByUserId(id);

        Client client;
        if (clientOptional.isPresent()) {
            if (clientOptional.get().isActive()) {
                throw new AccessLevelAssignException(MokExceptionMessages.ACCESS_LEVEL_ASSIGNED, MokErrorCodes.ACCESS_LEVEL_ASSIGNED);
            } else {
                client = clientOptional.get();
                client.setActive(true);
            }
        } else {
            User user = userRepository.findById(id).orElseThrow(() -> new NotFoundException(MokExceptionMessages.NOT_FOUND, MokErrorCodes.USER_NOT_FOUND));
            client = new Client();
            client.setUser(user);
            client.setActive(true);
        }
        clientRepository.saveAndFlush(client);
        eventPublisher.publishEvent(
                new HtmlEmailEvent(
                        this,
                        client.getUser().getEmail(),
                         Map.of("name", client.getUser().getFirstName() + " " + client.getUser().getLastName()),
                        "clientPermissionGained",
                        client.getUser().getLanguage())
        );
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void removeClientAccessLevel(UUID id) throws AccessLevelAssignException {
        Optional<Client> client = clientRepository.findByUserId(id);

        if (client.isEmpty()) {
            throw new AccessLevelAssignException(MokExceptionMessages.ACCESS_LEVEL_TAKEN, MokErrorCodes.ACCESS_LEVEL_TAKEN);
        }
        Client client1 = client.get();
        if (client1.getUser().getAccessLevels().size() <= 1) {
            throw new AccessLevelAssignException(MokExceptionMessages.ACCESS_LEVEL_CANNOT_BE_REMOVED, MokErrorCodes.ACCESS_LEVEL_CANNOT_BE_REMOVED);
        }
        client1.setActive(false);
        clientRepository.saveAndFlush(client1);
        eventPublisher.publishEvent(
                new HtmlEmailEvent(
                        this,
                        client1.getUser().getEmail(),
                        Map.of("name", client1.getUser().getFirstName() + " " + client1.getUser().getLastName()),
                        "clientPermissionLost",
                        client1.getUser().getLanguage()));
    }

}
