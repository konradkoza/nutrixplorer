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

    @Pointcut("within(@pl.lodz.p.it.nutrixplorer.configuration.LoggingInterceptor *)")
    public void interceptedMethod() {
    }

    @Around(value = "interceptedMethod()", argNames = "jp")
    public Object logMethodCall(ProceedingJoinPoint jp) throws Throwable {

        String username = SecurityContextUtil.getCurrentUser();
        StringBuilder builder = new StringBuilder();
        builder.append("Method call intercepted: ").append(jp.getSignature().getDeclaringTypeName()).append(".").append(jp.getSignature().getName());
        builder.append(" called by user: ").append(username);
        try {

            Object[] args = jp.getArgs();
            if (args != null && args.length > 0) {
                builder.append(" with arguments: ");
                for (Object arg : args) {
                    builder.append(arg);
                    builder.append(", ");
                }
            }
            log.info(builder.toString());
            Object obj = jp.proceed();
            builder = new StringBuilder();
            builder.append("Method call intercepted: ").append(jp.getSignature().getDeclaringTypeName()).append(".").append(jp.getSignature().getName());
            builder.append(" called by user: ").append(username);
            if (obj != null) {
                builder.append(" returned successfully with: ");
                builder.append(parseReturnValue(obj));
            } else {
                builder.append(" returned successfully");
            }
            log.info(builder.toString());
            return obj;
        } catch (Throwable e) {
            log.error("Method: {}.{} called by user: {} threw an exception: ", jp.getSignature().getDeclaringTypeName(), jp.getSignature().getName(), username, e);
            throw e;
        }

    }

    public String parseReturnValue(Object args) {
        if (args == null) {
            return null;
        }
        return switch (args) {
            case AbstractEntity entity -> parseArgument(entity);
            case List<?> entities -> {
                StringBuilder builder = new StringBuilder();
                if (entities.isEmpty()) {
                    builder.append("List<>: []");
                } else {
                    builder.append("List<").append(entities.getFirst() != null ? entities.getFirst().getClass().getName(): "").append(">: [");
                    for (Object entity : entities) {
                        builder.append(parseArgument(entity));
                    }
                    builder.append("], ");
                }
                yield builder.toString();
            }
            case Object object -> parseArgument(object);
        };
    }

    public String parseArgument(Object arg) {
        StringBuilder builder = new StringBuilder();
        if (arg == null) {
            return "null";
        } else if (arg instanceof AbstractEntity abstractEntity) {
            builder
                    .append(abstractEntity.getClass().getName())
                    .append(abstractEntity)
                    .append(", ");
        } else {
            builder.append(arg).append(", ");
        }
        return builder.toString();
    }

}
