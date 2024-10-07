package pl.lodz.p.it.nutrixplorer.model.mow;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "produkt")
public class Produkt {
    @Id
    @Column(name = "id_produkt", nullable = false)
    private Integer id;

    @Size(max = 13)
    @NotNull
    @Column(name = "kod_ean", nullable = false, length = 13)
    private String kodEan;

    @NotNull
    @Column(name = "par1", nullable = false)
    private Short par1;

    @Column(name = "par2")
    private Boolean par2;

    @NotNull
    @Column(name = "id_dostawca", nullable = false)
    private Short idDostawca;

    @NotNull
    @Column(name = "nazwa_produkt", nullable = false, length = Integer.MAX_VALUE)
    private String nazwaProdukt;

    @Column(name = "opis_produkt", length = Integer.MAX_VALUE)
    private String opisProdukt;

    @Column(name = "waga_produkt", length = Integer.MAX_VALUE)
    private String wagaProdukt;

    @Column(name = "opakowanie", length = Integer.MAX_VALUE)
    private String opakowanie;

    @Column(name = "kraj", length = Integer.MAX_VALUE)
    private String kraj;

    @Column(name = "liczba_kat")
    private Short liczbaKat;

    @Column(name = "kategoria", length = Integer.MAX_VALUE)
    private String kategoria;

    @Column(name = "kat1", length = Integer.MAX_VALUE)
    private String kat1;

    @Column(name = "kat2", length = Integer.MAX_VALUE)
    private String kat2;

    @Column(name = "kat3", length = Integer.MAX_VALUE)
    private String kat3;

    @Column(name = "kat4", length = Integer.MAX_VALUE)
    private String kat4;

    @Column(name = "data_dodania")
    private Instant dataDodania;


    @OneToOne(mappedBy = "product")
    @JsonManagedReference
    private Indeksy indicesEntity;

    @OneToOne(mappedBy = "product")
    @JsonManagedReference
    private Sklad ingredientsEntity;


}