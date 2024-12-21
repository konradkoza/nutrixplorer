package pl.lodz.p.it.nutrixplorer.mail;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

//    @Async
    public void sendEmail(String recipient, String subject, String body) {
        log.info("Sending email to {} with subject {}", recipient, subject);
        SimpleMailMessage message = new SimpleMailMessage();
//        message.setFrom("nutrixplorer@email.com");
        message.setTo(recipient);
        message.setSubject(subject);
        message.setText(body);
        mailSender.send(message);
        // Logic to send email (e.g., using JavaMailSender)

    }
}
