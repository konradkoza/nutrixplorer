package pl.lodz.p.it.nutrixplorer.mok.mappers;

import pl.lodz.p.it.nutrixplorer.model.mok.AccessLevel;
import pl.lodz.p.it.nutrixplorer.model.mok.Administrator;
import pl.lodz.p.it.nutrixplorer.model.mok.User;

import java.util.List;

public class UserMapperHelper {

    boolean isOauthUser(String googleId) {
        return googleId != null;
    }

    List<String> accessLevelsToStringList(List<AccessLevel> accessLevels) {
        return accessLevels.stream().filter(AccessLevel::isActive)
                .map(accessLevel -> accessLevel instanceof Administrator ? "ADMINISTRATOR" : "CLIENT")
                .toList();
    }

}
