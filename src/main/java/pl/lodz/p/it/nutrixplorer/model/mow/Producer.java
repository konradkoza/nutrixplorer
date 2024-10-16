package pl.lodz.p.it.nutrixplorer.model.mow;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;


@Getter
@Setter
@NoArgsConstructor
@ToString
@Entity
public class Producer extends AbstractEntity {

//    @NotNull
    private String name;


    private String address;


//    @NotNull
    @Column(name = "country_code")
    private Integer countryCode;

    private String NIP;

    private Integer RMSD;

    private String contact;

}
