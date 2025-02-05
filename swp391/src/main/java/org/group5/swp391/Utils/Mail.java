package org.group5.swp391.Utils;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class Mail {
    private final JavaMailSender mailSender;

    public void sendEmail(String email, String token){
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("vn.vietfarmer@gmail.com");
            message.setTo(email);
            message.setSubject("Please Change Your Password");
            message.setText(token);
            mailSender.send(message);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
