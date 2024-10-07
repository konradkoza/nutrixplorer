package pl.lodz.p.it.nutrixplorer.model.mow;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "etykieta")
public class Etykieta {
    @Id
    @Column(name = "id_produkt", nullable = false)
    private Integer id;

    @Column(name = "przechowywanie", length = Integer.MAX_VALUE)
    private String przechowywanie;

    @Column(name = "trwalosc", length = Integer.MAX_VALUE)
    private String trwalosc;

    @Column(name = "id_sprzedawca", length = Integer.MAX_VALUE)
    private String idSprzedawca;

    @Column(name = "po_otwarciu", length = Integer.MAX_VALUE)
    private String poOtwarciu;

    @Column(name = "przygotowanie", length = Integer.MAX_VALUE)
    private String przygotowanie;

    @Column(name = "alergeny", length = Integer.MAX_VALUE)
    private String alergeny;

    @Column(name = "obraz")
    private byte[] obraz;

}