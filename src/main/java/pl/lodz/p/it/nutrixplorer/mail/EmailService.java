package pl.lodz.p.it.nutrixplorer.mail;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.support.ResourceBundleMessageSource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.util.Locale;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;
    private final SpringTemplateEngine templateEngine;
    private final ResourceBundleMessageSource mailMessageSource;

    public void sendEmail(String recipient, String subject, String body) {
        MimeMessage message = mailSender.createMimeMessage();

        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(recipient);
            helper.setSubject(subject);
            helper.setText(body, true);
            mailSender.send(message);
        } catch (MessagingException e) {
            log.error("Failed to send email.", e);

        }
    }

    public void createHtmlEmail(String to, String templateName, Map<String, Object> templateModel, String lang) {
        Context thymeleafContext = new Context(Locale.of(lang));
        thymeleafContext.setVariables(templateModel);
        String htmlBody = templateEngine.process(templateName, thymeleafContext);
        String subject = mailMessageSource.getMessage(templateName + ".subject", null, Locale.of(lang));
        log.info("Sending email with template: {}, with subject: {}", templateName, subject);
        sendEmail(to, subject, htmlBody);
    }
}
