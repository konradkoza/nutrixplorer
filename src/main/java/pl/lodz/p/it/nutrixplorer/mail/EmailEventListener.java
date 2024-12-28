package pl.lodz.p.it.nutrixplorer.mail;

import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
public class EmailEventListener {

    private final EmailService emailService;

    public EmailEventListener(EmailService emailService) {
        this.emailService = emailService;
    }


    @Async // Makes the email-sending process asynchronous
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleEmailEvent(HtmlEmailEvent event) {
        emailService.createHtmlEmail(event.getRecipient(), event.getTemplateName(), event.getModel(), event.getLang());
    }
}