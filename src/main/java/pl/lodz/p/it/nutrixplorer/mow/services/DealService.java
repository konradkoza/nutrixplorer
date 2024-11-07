package pl.lodz.p.it.nutrixplorer.mow.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import pl.lodz.p.it.nutrixplorer.exceptions.NotFoundException;
import pl.lodz.p.it.nutrixplorer.exceptions.mok.codes.MokErrorCodes;
import pl.lodz.p.it.nutrixplorer.exceptions.mok.messages.UserExceptionMessages;
import pl.lodz.p.it.nutrixplorer.exceptions.mow.codes.MowErrorCodes;
import pl.lodz.p.it.nutrixplorer.exceptions.mow.messages.ErrorMessages;
import pl.lodz.p.it.nutrixplorer.model.mok.Seller;
import pl.lodz.p.it.nutrixplorer.model.mow.Deal;
import pl.lodz.p.it.nutrixplorer.mok.repositories.SellerRepository;
import pl.lodz.p.it.nutrixplorer.mow.repositories.DealRepository;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(propagation = Propagation.REQUIRES_NEW)
public class DealService {

    private final DealRepository dealRepository;
    private final SellerRepository sellerRepository;

    public List<Deal> getAllDeals() {
        return dealRepository.findAll();
    }

    public Deal getDealById(UUID id) throws NotFoundException {
        return dealRepository.findById(id).orElseThrow(() -> new NotFoundException(ErrorMessages.DEAL_NOT_FOUND, MowErrorCodes.DEAL_NOT_FOUND));
    }

    public List<Deal> getSellersDeals(UUID userId) throws NotFoundException {
        Seller seller = sellerRepository.findByUserId(userId).orElseThrow(() -> new NotFoundException(UserExceptionMessages.SELLER_NOT_FOUND, MokErrorCodes.SELLER_NOT_FOUND));
        return dealRepository.findSellerDealsByUserId(seller.getId());
    }

}
