package pl.lodz.p.it.nutrixplorer.mail;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;

import java.util.Map;

@Getter
public class HtmlEmailEvent extends ApplicationEvent {

    private final String recipient;
    private final Map<String, Object> model;
    private final String templateName;
    private final String lang;

    public HtmlEmailEvent(Object source, String recipient, Map<String, Object> model, String templateName, String lang) {
        super(source);
        this.recipient = recipient;
        this.model = model;
        this.templateName = templateName;
        this.lang = lang;
    }
}
