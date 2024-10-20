package pl.lodz.p.it.nutrixplorer.mok.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import pl.lodz.p.it.nutrixplorer.exceptions.mok.AccessLevelAssignException;
import pl.lodz.p.it.nutrixplorer.exceptions.NotFoundException;
import pl.lodz.p.it.nutrixplorer.exceptions.mok.codes.ErrorCodes;
import pl.lodz.p.it.nutrixplorer.exceptions.mok.messages.UserExceptionMessages;
import pl.lodz.p.it.nutrixplorer.model.mok.Seller;
import pl.lodz.p.it.nutrixplorer.model.mok.User;
import pl.lodz.p.it.nutrixplorer.mok.repositories.SellerRepository;
import pl.lodz.p.it.nutrixplorer.mok.repositories.UserRepository;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(propagation = Propagation.REQUIRES_NEW)
public class SellerService {
    private final SellerRepository sellerRepository;
    private final UserRepository userRepository;

    public Seller addSellerAccessLevel(UUID id) throws NotFoundException, AccessLevelAssignException {
        Optional<Seller> sellerOptional = sellerRepository.findByUserId(id);

        Seller seller;
        if (sellerOptional.isPresent()) {
            throw new AccessLevelAssignException(UserExceptionMessages.ACCESS_LEVEL_ASSIGNED, ErrorCodes.ACCESS_LEVEL_ASSIGNED);
        } else {
            User user = userRepository.findById(id).orElseThrow(() -> new NotFoundException(UserExceptionMessages.NOT_FOUND, ErrorCodes.USER_NOT_FOUND));
            seller = new Seller();
            seller.setUser(user);
        }
        return sellerRepository.saveAndFlush(seller);
    }

    public void removeSellerAccessLevel(UUID id) throws NotFoundException, AccessLevelAssignException {
        Optional<Seller> client = sellerRepository.findByUserId(id);
        if (client.isEmpty()){
            throw new AccessLevelAssignException(UserExceptionMessages.ACCESS_LEVEL_TAKEN, ErrorCodes.ACCESS_LEVEL_TAKEN);
        }
        if(client.get().getUser().getAccessLevels().size() <= 1){
            throw new AccessLevelAssignException(UserExceptionMessages.ACCESS_LEVEL_CANNOT_BE_REMOVED, ErrorCodes.ACCESS_LEVEL_CANNOT_BE_REMOVED);
        }
        sellerRepository.delete(client.get());
    }
}
