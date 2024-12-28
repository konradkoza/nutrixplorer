package pl.lodz.p.it.nutrixplorer.model.mok;

import lombok.Getter;

@Getter
public enum Language {
    PL("pl"), EN("en");
    private final String value;

    Language(String value) {
        this.value = value;
    }

}
