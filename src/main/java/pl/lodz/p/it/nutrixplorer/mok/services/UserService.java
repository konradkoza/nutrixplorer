package pl.lodz.p.it.nutrixplorer.mok.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import pl.lodz.p.it.nutrixplorer.exceptions.BlockUserException;
import pl.lodz.p.it.nutrixplorer.exceptions.NotFoundException;
import pl.lodz.p.it.nutrixplorer.exceptions.UserVerificationException;
import pl.lodz.p.it.nutrixplorer.exceptions.codes.ErrorCodes;
import pl.lodz.p.it.nutrixplorer.exceptions.messages.UserExceptionMessages;
import pl.lodz.p.it.nutrixplorer.model.mok.Administrator;
import pl.lodz.p.it.nutrixplorer.model.mok.User;
import pl.lodz.p.it.nutrixplorer.mok.repositories.AdministratorRepository;
import pl.lodz.p.it.nutrixplorer.mok.repositories.UserRepository;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(propagation = Propagation.REQUIRES_NEW)
public class UserService {
    private final AdministratorRepository administratorRepository;
    private final UserRepository repository;


    public List<User> getUsers() {
        return repository.findAll();
    }

    public void blockUser(UUID id) throws NotFoundException, BlockUserException {
        User user = repository.findById(id).orElseThrow(() -> new NotFoundException(UserExceptionMessages.NOT_FOUND, ErrorCodes.USER_NOT_FOUND));
        if (user.isBlocked()) {
            throw new BlockUserException(UserExceptionMessages.ACCOUNT_BLOCKED, ErrorCodes.ACCOUNT_BLOCKED);
        }

        user.setBlocked(true);
        repository.save(user);
    }

    public void unblockUser(UUID id) throws NotFoundException, BlockUserException {
        User user = repository.findById(id).orElseThrow(() -> new NotFoundException(UserExceptionMessages.NOT_FOUND, ErrorCodes.USER_NOT_FOUND));
        if (!user.isBlocked()) {
            throw new BlockUserException(UserExceptionMessages.USER_UNBLOCKED, ErrorCodes.USER_UNBLOCKED);
        }
        user.setBlocked(false);
        repository.save(user);
    }

    public void verifyUser(UUID id) throws UserVerificationException, NotFoundException {
        User user = repository.findById(id).orElseThrow(() -> new NotFoundException(UserExceptionMessages.NOT_FOUND, ErrorCodes.USER_NOT_FOUND));
        if (user.isVerified()) {
            throw new UserVerificationException(UserExceptionMessages.USER_VERIFIED, ErrorCodes.USER_VERIFIED);
        }
        user.setVerified(true);
        repository.save(user);
    }


    public User findById(UUID id) throws NotFoundException {
        return repository.findById(id).orElseThrow(() -> new NotFoundException(UserExceptionMessages.NOT_FOUND, ErrorCodes.USER_NOT_FOUND));
    }
}
