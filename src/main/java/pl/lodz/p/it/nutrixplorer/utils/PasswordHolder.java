package pl.lodz.p.it.nutrixplorer.utils;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class PasswordHolder {
    private String password;

    @Override
    public String toString() {
        return "PasswordHolder{" +
                "password=**********" +
                '}';
    }
}
