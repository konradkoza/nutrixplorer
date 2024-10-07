package pl.lodz.p.it.nutrixplorer.model.mow;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "dostawca")
public class Dostawca {
    @Id
    @Column(name = "id_dostawca", nullable = false)
    private Integer id;

    @Size(max = 9)
    @NotNull
    @Column(name = "pi", nullable = false, length = 9)
    private String pi;

    @NotNull
    @Column(name = "ile_kodow_ean", nullable = false)
    private Short ileKodowEan;

    @NotNull
    @Column(name = "par1", nullable = false)
    private Short par1;

    @NotNull
    @Column(name = "nazwa_dostawca", nullable = false, length = Integer.MAX_VALUE)
    private String nazwaDostawca;

    @NotNull
    @Column(name = "adres_dostawca", nullable = false, length = Integer.MAX_VALUE)
    private String adresDostawca;

    @NotNull
    @Column(name = "id_kraj", nullable = false)
    private Short idKraj;

    @NotNull
    @Column(name = "nip_dostawca", nullable = false, length = Integer.MAX_VALUE)
    private String nipDostawca;

    @NotNull
    @Column(name = "rmsd_dostawca", nullable = false)
    private Short rmsdDostawca;

    @NotNull
    @Column(name = "kontakt_dostawca", nullable = false, length = Integer.MAX_VALUE)
    private String kontaktDostawca;

    @NotNull
    @Column(name = "kod_prod_ean1", nullable = false, length = Integer.MAX_VALUE)
    private String kodProdEan1;

    @Column(name = "kod_prod_ean2", length = Integer.MAX_VALUE)
    private String kodProdEan2;

    @Column(name = "kod_prod_ean3", length = Integer.MAX_VALUE)
    private String kodProdEan3;

    @Column(name = "kod_prod_ean4", length = Integer.MAX_VALUE)
    private String kodProdEan4;

    @Column(name = "kod_prod_ean5", length = Integer.MAX_VALUE)
    private String kodProdEan5;

    @Column(name = "kod_prod_ean6", length = Integer.MAX_VALUE)
    private String kodProdEan6;

    @Column(name = "kod_prod_ean7", length = Integer.MAX_VALUE)
    private String kodProdEan7;

    @Column(name = "kod_prod_ean8", length = Integer.MAX_VALUE)
    private String kodProdEan8;

    @Column(name = "data_dodania")
    private Instant dataDodania;

}