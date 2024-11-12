package pl.lodz.p.it.nutrixplorer.mow.services;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import pl.lodz.p.it.nutrixplorer.exceptions.NotFoundException;
import pl.lodz.p.it.nutrixplorer.exceptions.mow.codes.MowErrorCodes;
import pl.lodz.p.it.nutrixplorer.exceptions.mow.messages.ErrorMessages;
import pl.lodz.p.it.nutrixplorer.model.mow.Deal;
import pl.lodz.p.it.nutrixplorer.mok.repositories.SellerRepository;
import pl.lodz.p.it.nutrixplorer.mow.repositories.DealRepository;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(propagation = Propagation.REQUIRES_NEW)
public class DealService {

    private final DealRepository dealRepository;
    private final SellerRepository sellerRepository;

    public Page<Deal> getAllDeals(int elements, int page) {

        return dealRepository.findAll(PageRequest.of(page, elements));
    }

    public Deal getDealById(UUID id) throws NotFoundException {
        return dealRepository.findById(id).orElseThrow(() -> new NotFoundException(ErrorMessages.DEAL_NOT_FOUND, MowErrorCodes.DEAL_NOT_FOUND));
    }

    public Page<Deal> getSellersDeals(UUID userId, int elements, int page)  {
        return dealRepository.findSellerDealsByUserId(userId, PageRequest.of(page, elements));
    }

    public Page<Deal> getCurrentActiveDeals(int elements, int page) {
        return dealRepository.findCurrentActiveDeals(PageRequest.of(page, elements));
    }

    public Deal getCurrentDealById(UUID id) throws NotFoundException {
        return dealRepository.findCurrentActiveDealById(id).orElseThrow(() -> new NotFoundException(ErrorMessages.DEAL_NOT_FOUND, MowErrorCodes.DEAL_NOT_FOUND));
    }
}
