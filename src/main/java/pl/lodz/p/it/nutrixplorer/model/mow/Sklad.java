package pl.lodz.p.it.nutrixplorer.model.mow;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "sklad")
public class Sklad {
    @Id
    @Column(name = "id_produkt", nullable = false)
    private Integer id;

    @Column(name = "skladnik1", length = Integer.MAX_VALUE)
    private String skladnik1;

    @Column(name = "skladnik2", length = Integer.MAX_VALUE)
    private String skladnik2;

    @Column(name = "skladnik3", length = Integer.MAX_VALUE)
    private String skladnik3;

    @Column(name = "skladnik4", length = Integer.MAX_VALUE)
    private String skladnik4;

    @Column(name = "skladnik5", length = Integer.MAX_VALUE)
    private String skladnik5;

    @Column(name = "skladnik6", length = Integer.MAX_VALUE)
    private String skladnik6;

    @Column(name = "skladnik7", length = Integer.MAX_VALUE)
    private String skladnik7;

    @Column(name = "skladnik8", length = Integer.MAX_VALUE)
    private String skladnik8;

    @Column(name = "id_dodatek1")
    private Short idDodatek1;

    @Column(name = "id_dodatek2")
    private Short idDodatek2;

    @Column(name = "id_dodatek3")
    private Short idDodatek3;

    @Column(name = "id_dodatek4")
    private Short idDodatek4;

    @Column(name = "id_dodatek5")
    private Short idDodatek5;

    @Column(name = "id_dodatek6")
    private Short idDodatek6;

    @Column(name = "id_dodatek7")
    private Short idDodatek7;

    @Column(name = "id_dodatek8")
    private Short idDodatek8;

    @Column(name = "aromat", length = Integer.MAX_VALUE)
    private String aromat;

    @OneToOne
    @JoinColumn(name = "id_produkt", referencedColumnName = "id_produkt")
    @JsonBackReference
    private Produkt product;

}