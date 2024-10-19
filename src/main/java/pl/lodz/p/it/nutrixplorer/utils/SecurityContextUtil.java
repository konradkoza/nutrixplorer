package pl.lodz.p.it.nutrixplorer.utils;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class SecurityContextUtil {

    public static UUID getCurrentUser() {
        return UUID.fromString(SecurityContextHolder.getContext().getAuthentication().getName());
    }
}
