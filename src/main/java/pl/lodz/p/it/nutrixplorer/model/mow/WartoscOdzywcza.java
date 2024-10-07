package pl.lodz.p.it.nutrixplorer.model.mow;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Entity
@Table(name = "wartosc_odzywcza")
public class WartoscOdzywcza {
    @EmbeddedId
    private WartoscOdzywczaId id;

    @Column(name = "par1_nutrition", length = Integer.MAX_VALUE)
    private String par1Nutrition;

    @Column(name = "par2_nutrition", length = Integer.MAX_VALUE)
    private String par2Nutrition;

    @Column(name = "porcja")
    private BigDecimal porcja;

    @Column(name = "nazwa_grupy", length = Integer.MAX_VALUE)
    private String nazwaGrupy;

    @Column(name = "nazwa", length = Integer.MAX_VALUE)
    private String nazwa;

    @Column(name = "zawartosc")
    private BigDecimal zawartosc;

    @Column(name = "jednostka", length = Integer.MAX_VALUE)
    private String jednostka;

    @Column(name = "procent_rws")
    private BigDecimal procentRws;

    @Column(name = "zawartosc_porcja")
    private BigDecimal zawartoscPorcja;

    @Column(name = "procent_rws_porcja")
    private BigDecimal procentRwsPorcja;

    @Column(name = "indeks")
    private Integer indeks;

    @Column(name = "legenda", length = Integer.MAX_VALUE)
    private String legenda;

}