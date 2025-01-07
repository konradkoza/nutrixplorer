package pl.lodz.p.it.nutrixplorer.model.mow;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import pl.lodz.p.it.nutrixplorer.model.AbstractEntity;


@Getter
@Setter
@NoArgsConstructor
@ToString
@Entity
@Table(name = "PRODUCER")
public class Producer extends AbstractEntity {

//    @NotNull
    private String name;


    private String address;


//    @NotNull
    @Column(name = "COUNTRY_CODE")
    private Integer countryCode;

    private String NIP;

    private Integer RMSD;

    private String contact;

}
