package pl.lodz.p.it.nutrixplorer.mok.dto;

import java.util.List;

public record SimpleUserDTO(
        String id,
        String firstName,
        String lastName,
        String email,
        boolean verified,
        boolean oauth,
        List<String> accessLevels,
        boolean blocked
) {

    @Override
    public String toString() {
        return "SimpleUserDTO{" + "id='" + id + '\'' + ", firstName='" + "******" + '\'' + ", lastName='" + "******" + '\'' + ", email='*****@***" + ", verified=" + verified + ", oauth=" + oauth + ", accessLevels=" + accessLevels + ", blocked=" + blocked + '}';
    }
}
