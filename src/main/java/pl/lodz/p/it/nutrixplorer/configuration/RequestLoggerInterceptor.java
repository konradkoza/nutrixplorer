package pl.lodz.p.it.nutrixplorer.configuration;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.HandlerInterceptor;

@Slf4j
@Configuration
public class RequestLoggerInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        log.info("Request: {} {}, from address: {}", request.getMethod(), request.getRequestURI(), request.getRemoteAddr());
        return true;
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {
        if (ex == null) {
            log.info("Request {} {} completed, response status: {}", request.getMethod(), request.getRequestURI(), response.getStatus());
        } else {
            log.info("Request {} {} completed with exception, response status: {}, exception: {}", request.getMethod(), request.getRequestURI(), response.getStatus(), ex.getMessage());
        }

    }
}
