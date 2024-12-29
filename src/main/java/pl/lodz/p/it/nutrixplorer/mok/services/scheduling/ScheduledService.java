package pl.lodz.p.it.nutrixplorer.mok.services.scheduling;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
@Slf4j
@RequiredArgsConstructor
public class ScheduledService {

    private final AccountSchedulingService userService;

    @Scheduled(fixedRate = 5, timeUnit = TimeUnit.MINUTES)
    public void removeExpiredAccounts() {
        log.info("Removing expired accounts");
        userService.deleteNonVerifiedUsers();
    }

    @Scheduled(fixedRate = 10, timeUnit = TimeUnit.MINUTES)
    public void resendVerificationEmails() {
        log.info("Resending verification emails");
        userService.sendEmailVerifyAccount();
    }

}
