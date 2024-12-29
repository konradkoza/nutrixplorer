package pl.lodz.p.it.nutrixplorer.configuration;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;
import pl.lodz.p.it.nutrixplorer.model.AbstractEntity;
import pl.lodz.p.it.nutrixplorer.utils.SecurityContextUtil;

import java.util.List;

@Aspect
@Component
@Slf4j
public class ServiceLoggingAspect {

    //    pointcut on methods of class with LoggingInterceptor annotation
    @Pointcut("within(@pl.lodz.p.it.nutrixplorer.configuration.LoggingInterceptor *)")
    private void interceptedMethod() {
    }

    //    interceptor around defined pointcut
    @Around(value = "interceptedMethod()", argNames = "jp")
    private Object logMethodCall(ProceedingJoinPoint jp) throws Throwable {
        String callerClass = jp.getTarget().getClass().getName();
        String callerMethod = jp.getSignature().getName();
        String username = SecurityContextUtil.getCurrentUser();
        if (username == null) {
            username = "<anonymous>";
        }

        try {
            log.info("Method call: {}", jp.getSignature());
            String args = parsArgs(jp.getArgs());
            if (args != null) {
                log.info("Method {}.{} called by {} with args: {}", callerClass, callerMethod, username, args);
            } else {
                log.info("Method {}.{} called by {}", callerClass, callerMethod, username);
            }
            Object obj = jp.proceed();
            String returnValue = parseReturnValue(obj);
            if (returnValue != null) {
                log.info("Method {}.{} called by user with id: {} returned with: {}", callerClass, callerMethod, username, returnValue);
            } else {
                log.info("Method {}.{} called by user with id: {} returned", callerClass, callerMethod, username);
            }
            return obj;
        } catch (
                Throwable e) {
            log.error("Method {}.{} called by user with id: {}  due {} with message {}", callerClass, callerMethod, username, e.getClass().getName(), e.getMessage());
            throw e;
        }
    }
    private String parsArgs(Object[] args) {
        if (args == null || args.length == 0) {
            return null;
        }
        StringBuilder sb = new StringBuilder();
        for (Object arg : args) {
            if(arg == null) {
                continue;
            }
            if (arg instanceof AbstractEntity abstractEntity) {
                sb
                        .append(abstractEntity.getClass().getName())
                        .append(abstractEntity)
                        .append(", ");
            } else {
                sb.append(arg).append(", ");
            }

            if (arg instanceof List<?> entities) {
                for (Object entity : entities) {
                    if(entity == null) {
                        continue;
                    }
                    if (entity instanceof AbstractEntity abstractEntity) {
                        sb
                                .append(abstractEntity.getClass().getName())
                                .append(abstractEntity)
                                .append(", ");
                    } else {
                        sb.append(entity).append(", ");
                    }
                }
            }
        }
        if (sb.isEmpty()) {
            return null;
        }
        return sb.toString();
    }

    private String parseReturnValue(Object args) {
        if (args == null) {
            return null;
        }

        return switch (args) {
            case AbstractEntity entity -> entity.getClass().getName() + entity;
            case List<?> entities -> {
                StringBuilder sb = new StringBuilder();
                for (Object entity : entities) {
                    if (entity instanceof AbstractEntity abstractEntity) {
                        sb.append(abstractEntity).append(", ");
                    } else if (entity == null) {
                        sb.append("null, ");
                    } else {
                        sb.append(entity.toString()).append(", ");
                    }
                }
                yield sb.toString();
            }
            case Object object -> object.toString();
        };
    }

}
