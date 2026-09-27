/**
 * ============================================================================
 *  RECHTLICHE ZAHLEN & FRISTEN  –  ACHTUNG: KÖNNEN SICH ÄNDERN!
 * ============================================================================
 *  Steuersätze, Provisionsregeln, Fristen und Gebühren werden vom Gesetzgeber
 *  (Bund/Land) regelmäßig angepasst. Die Werte hier sind der Stand, den die
 *  App beim Bau kannte. VOR PRÜFUNGEN UND PRAXISEINSATZ IMMER AKTUELL PRÜFEN
 *  (Gesetzestexte, Finanzamt, Notar, IHK Hannover / Berufsschule).
 *
 *  Der Kaufnebenkosten-Rechner und die Anzeige "Stand" in der App lesen ihre
 *  Werte aus dieser Datei. Die Fragen in src/data/questions/*.json nennen
 *  dieselben Zahlen im Text – bei einer Änderung dort bitte mit anpassen
 *  (Suche nach dem alten Wert, z. B. "5 %" oder "3,57 %").
 * ============================================================================
 */

/** Stand der Angaben in der ganzen App (bitte bei Prüfung aktualisieren). */
export const LEGAL_STAND = "Stand: 2025 – bitte vor Verwendung aktuell prüfen";
export const LEGAL_STAND_SHORT = "Stand 2025";

export const LEGAL = {
  /**
   * Grunderwerbsteuer Niedersachsen: 5,0 % vom Kaufpreis.
   * Die Länder legen den Satz selbst fest (Art. 105 Abs. 2a GG, GrEStG).
   * Niedersachsen: 5,0 % seit 01.01.2014. Andere Länder: 3,5 % bis 6,5 %.
   * ÄNDERUNG MÖGLICH – Landesgesetzgeber!
   */
  grunderwerbsteuerNiedersachsen: 5.0,

  /**
   * Notarkosten: grob 1,0–1,5 % des Kaufpreises (GNotKG, Gebührentabelle).
   * Rechner nutzt eine Faustregel; die echte Rechnung hängt vom Geschäftswert ab.
   */
  notarProzent: 1.5,

  /**
   * Grundbuchkosten (Eintragung Auflassungsvormerkung, Eigentumsumschreibung,
   * ggf. Grundschuld): grob 0,5 % des Kaufpreises (GNotKG).
   * Faustregel gesamt Notar + Grundbuch: 1,5–2,0 %.
   */
  grundbuchProzent: 0.5,

  /**
   * Maklerprovision (Wohnungen und Einfamilienhäuser, §§ 656a–656d BGB seit 23.12.2020):
   *  - Ist die Provision hälftig geteilt, zahlt jede Seite denselben Anteil.
   *  - Beauftragt nur eine Seite den Makler, darf die andere höchstens die Hälfte
   *    übernehmen. Der Auftraggeber muss mindestens den gleichen Anteil tragen.
   *  - Der Vertrag braucht Textform (§ 656a BGB).
   * Die Höhe ist gesetzlich NICHT festgelegt, sondern Verhandlungssache.
   * In Niedersachsen üblich: 7,14 % inkl. 19 % MwSt. gesamt = 3,57 % je Seite.
   */
  maklerGesamtProzent: 7.14,
  maklerKaeuferProzent: 3.57,

  /** Kaution: höchstens 3 Nettokaltmieten (§ 551 BGB). */
  kautionMaxMonatsmieten: 3,

  /** Nebenkostenabrechnung: spätestens 12 Monate nach Ende des Abrechnungszeitraums (§ 556 Abs. 3 BGB). */
  nebenkostenabrechnungFristMonate: 12,

  /** Kaufvertragsentwurf muss Verbrauchern i. d. R. 2 Wochen vor dem Notartermin vorliegen (§ 17 Abs. 2a BeurkG). */
  entwurfFristWochen: 2,

  /** Vorkaufsrecht der Gemeinde: Ausübung binnen 2 Monaten nach Mitteilung des Kaufvertrags (§ 28 BauGB). */
  vorkaufsrechtFristMonate: 2,

  /** Energieausweis: 10 Jahre gültig (§ 80 GEG). */
  energieausweisGueltigJahre: 10,

  /** Sonderkündigungsrecht Darlehen: nach 10 Jahren mit 6 Monaten Frist (§ 489 BGB). */
  sonderkuendigungNachJahren: 10,

  /** Weiterbildungspflicht Makler: 20 Stunden innerhalb von 3 Jahren (§ 34c Abs. 2a GewO, § 15b MaBV). */
  weiterbildungStunden: 20,
  weiterbildungJahre: 3,
} as const;
