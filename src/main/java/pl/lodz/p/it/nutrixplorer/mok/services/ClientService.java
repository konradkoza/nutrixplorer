package pl.lodz.p.it.nutrixplorer.mok.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import pl.lodz.p.it.nutrixplorer.exceptions.mok.AccessLevelAssignException;
import pl.lodz.p.it.nutrixplorer.exceptions.NotFoundException;
import pl.lodz.p.it.nutrixplorer.exceptions.mok.codes.MokErrorCodes;
import pl.lodz.p.it.nutrixplorer.exceptions.mok.messages.MokExceptionMessages;
import pl.lodz.p.it.nutrixplorer.model.mok.Client;
import pl.lodz.p.it.nutrixplorer.model.mok.User;
import pl.lodz.p.it.nutrixplorer.mok.repositories.ClientRepository;
import pl.lodz.p.it.nutrixplorer.mok.repositories.UserRepository;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(propagation = Propagation.REQUIRES_NEW)
public class ClientService {
    private final ClientRepository clientRepository;
    private final UserRepository userRepository;

    public Client addClientAccessLevel(UUID id) throws NotFoundException, AccessLevelAssignException {
        Optional<Client> clientOptional = clientRepository.findByUserId(id);

        Client client;
        if (clientOptional.isPresent()) {
            throw new AccessLevelAssignException(MokExceptionMessages.ACCESS_LEVEL_ASSIGNED, MokErrorCodes.ACCESS_LEVEL_ASSIGNED);
        } else {
            User user = userRepository.findById(id).orElseThrow(() -> new NotFoundException(MokExceptionMessages.NOT_FOUND, MokErrorCodes.USER_NOT_FOUND));
            client = new Client();
            client.setUser(user);
        }
        return clientRepository.saveAndFlush(client);
    }

    public void removeClientAccessLevel(UUID id) throws NotFoundException, AccessLevelAssignException {
        Optional<Client> client = clientRepository.findByUserId(id);

        if (client.isEmpty()){
            throw new AccessLevelAssignException(MokExceptionMessages.ACCESS_LEVEL_TAKEN, MokErrorCodes.ACCESS_LEVEL_TAKEN);
        }

        if(client.get().getUser().getAccessLevels().size() <= 1){
            throw new AccessLevelAssignException(MokExceptionMessages.ACCESS_LEVEL_CANNOT_BE_REMOVED, MokErrorCodes.ACCESS_LEVEL_CANNOT_BE_REMOVED);
        }

        clientRepository.delete(client.get());
    }

    public Client getClient(UUID id) throws NotFoundException {
        return clientRepository.findByUserId(id).orElseThrow(() -> new NotFoundException(MokExceptionMessages.NOT_FOUND, MokErrorCodes.USER_NOT_FOUND));
    }

}
