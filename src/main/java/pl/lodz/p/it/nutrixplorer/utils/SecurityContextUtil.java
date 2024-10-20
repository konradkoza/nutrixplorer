package pl.lodz.p.it.nutrixplorer.utils;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class SecurityContextUtil {

    public static String getCurrentUser() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }
}
