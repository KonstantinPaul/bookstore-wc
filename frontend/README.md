# MI-Proj-G1: TL1 Bookstore with WebComponents

**Offene TODOs:**
- ~~`app-navigation` component schreiben, z. B. um Navigation-Links zu aktualisieren~~
- ~~Evlt. "App-Header" component (including `ThemeSwitcher.js`) erstellen~~
- ~~Styling von `<app-header>`~~
- ~~Styling von `<app-navigation>`~~
- ~~Styling von `<book-adder>`~~
- ~~Styling von `<book-detail>`~~
- ~~Styling von `<book-list>`~~
- Refactor "Styling"
  - ~~Ersetzen von `animejs` durch **CSS Animations:** Implemented own `<message-box type="info" message="Some message text" />` component~~
  - ~~Entfernen von _bootstrap, fontawesome:_ Re-design a new theming~~
- ~~Remove Book from `<book-list>` (table row) noch implementieren! (Bisher wird nur ein "reload()" gemacht)~~
- Tests _"sauber machen"_ und um UI Tests ergänzen
  - ~~(UI) `<app-header>` getestet~~
  - ~~(UI) `<app-navigation>` getestet~~
  - ~~(UI) `<book-adder>` getestet ([Stand: 01.01.2022]: Probleme mit dem "submit" Trigger gehabt, dieser ist über `submitButton.click()` nur sporadisch zu triggern. Lösung: `submitButton` hat einfache ein Klick-Event bekommen, was für diese Testfälle vollkommen ausreichend ist.)~~
  - ~~(UI) `<book-list>` getestet~~
  - ~~(UI) `<book-detail>` getestet~~
  - ~~`BookAdapter`: Fix Tests~~
  - `BookController` getestet
  - `Router` getestet: Siehe `TL3` hier hast du schon mit _Sinon_ (mocking library) gearbeitet. Du muss nur diesmal prüfen ob Methoden z. B. des Controllers aufgerufen werden. Es muss nicht überprüft werden, ob ein _wirklicher_ DOM-Update stattfindet!

**Weitere Features im TDD-Stil:**
+ ~~Suche für Bücher implementieren~~
+ Rating für Bücher implementieren (vorerst nur innerhalb `BookList`)
+ _"Bücher verändern"_ implementieren, hierzu könnte `<book-adder>` erweitert werden evtl. Namen verändern in `<book-changer isbn="1569876516">`
+ Speichere das zuletzt gewählte "theme" im `localStorage`

----
# Dokumentation

## Model: Datenhaltung und -speicherung (siehe: `BookStore.js`)
Die Klasse `BookStore` ist für die _Datenhaltung_ verantwortlich, welche letztlich über `localStorage` persitiert ist.
Zunächst sind 2 potentielle Datenformate denkbar: 
1. JSON
```JSON
{[
  { "id": "978-3-8332-3539-9", 
    "isbn": "978-3-8332-3539-9",
    "title": "Star Wars: Jyn, die Rebellin",
    "author": "Beth Revis",
    /** evlt. mehr Felder **/
  },
  { "id": "978-3-03853-050-3", 
    "isbn": "978-3-03853-050-3",
    "title": "Die Fragwürdigen",
    "author": "Keller Judith",
    /** evlt. mehr Felder **/
  },
  /*** mehr Bücher ***/
]}
```
2. HTML/XML
```XML
<books>
  <book id="978-3-8332-3539-9" isbn="978-3-8332-3539-9"
        title="Star Wars: Jyn, die Rebellin" author="Beth Revis"
        description="Jyn, die Rebellin (im Original: Rebel Rising) ist ein Roman von Beth Revis, der am 2. Mai 2017 auf Englisch bei dem amerikanischen Verlag Disney–Lucasfilm Press erschienen ist. In Deutschland wurde er von Panini am 16. Oktober 2017 veröffentlicht. Der Roman behandelt die titelgebende Figur Jyn Erso aus dem Spin-Off-Film Rogue One und erzählt ihre Geschichte vor den Ereignissen des eigentlichen Filmhandlung, nachdem Erso als Kind von dem Rebellen Saw Gerrera aufgenommen wurde."
  />
  </book>
  <book id="978-3-03853-050-3" isbn="978-3-03853-050-3"
        title="Die Fragwürdigen" author="Keller Judith"
        description="Alles beginnt mit einer fliehenden Kuh. Kaum hat sie Frau Hasler über den Haufen gerannt, hebt sich der Vorhang und die Fragwürdigen betreten einer nach der anderen die Bühne. Jede und jeder ein Unikat, Künstler und Künstlerinnen des Lebens. Eine Frau, die den Zug nicht verlassen will, weil sie sich vor dem Schmutz da draussen fürchtet. Ein Mann, der mit Pralinen nicht umgehen kann. Die für zu leicht befundene Alice und der dicke Marc. Erwin, der nicht versteht, warum nicht alle so sind wie er. Die umsichtige Frau Sägisser und die vielleicht gar nicht so hilfsbereite Frau Siegentaler. Menschen, die ihre Liebe nur spüren, weil sie getrennt sind, Menschen, die nur zusammen sind, weil sie ihre Lügen lieben. Leute mit sprechenden und verschwiegenen Namen. Und natürlich die Polizei!Es herrscht ein wunderbares Durcheinander in diesem Buch. Judith Kellers Prosa gibt all jenen eine Stimme, die sonst in den Wörtlichkeiten hängen bleiben. Manchen genügt ein Kurzauftritt, andere brauchen etwas länger. Immer aber müssen sie durch jene feingeschliffene Sprache hindurch, die ihnen diese Schwyzer Autorin für einen Moment zur Verfügung stellt und sie und uns die Lage erkennen lässt. Ein Buch zum Aufblättern und Darin-Versinken."
  />
  <!-- mehr Bücher -->
</books>
```
- **+** HTML/XML hat den Vorteil, dass es mittels `(new DOMParser()).parseFromString(bookXMLString, "text/xml");` geparst und mittels `XMLSerializer()` serialisiert werden kann. In einem solches `XMLDocument` kann das _Suchen, Hinzufügen_ und _Löschen_ von Büchern mittels der DOM-API erledigt werden.
Diese aktualisieren den DOM, um anschließend das `XMLDocument` wieder serialisiert und in `localStorage` gespeichert.

- **--** JSON hat den Nachteil, dass hier Suchen und Löschen eigenhändig implementiert werden muss! 

Für unsere Implementierung war es naheliegend den Vorteil _Suchen, Hinzufügen_ und _Löschen_ innerhalb des XMLDocuments zu nutzen, deshalb entschieden wir uns für _XML_ zur Datenhaltung. 
Die Persistierung des `<books>`-XML erfolgt mittels `localStorage`.

Es ist wichtig zu erwähnen, dass die Persistierung (siehe `src/model/LocalBookStorage.js`) immer ein `XMLDocument` zurückgibt.
Demnach wird auch bei einem leeren LocalStorage von `localBookStorage.books` ein XMLDocument zurückgegeben.
Dies dient dazu trotz eines leeren Documentes auf die DOM-API-Methoden zurückzugreifen.

Das Hinzufügen von Büchern z. B. `bookStore.addBook(new Book({isbn:"978-3-8332-3539-9"}))`) erfolgt mittels eines übergebenen _"Book"_-Modell.
Dieses erzeugt ein Objekt, welches mittels setter und getter "_befüllt_" werden kann, alternativ kann auch der Konstruktor mit einem Objekt initialisiert werden.
Intern verwaltet das _"Book"_-Modell ein `<book>`-Element.
Die Speicherung von Büchern über den `BookStore` erfolgt nach dem **LIFO-Prinzip** (Last In First Out), d.h. die Bücher werden wie ein Stack angeordnet.

## Model: Transformation von `<books>` in verschiedene Views

**Problem:** Ein klassisches Problem in der Webentwicklung ist es ein einheitliches _Datenformat_ zu transformieren in verschiedene Views, also Ansichten der Daten.
Hierfür ist das Adapter Pattern: 
> "The adapter pattern convert the interface of a class into another interface clients expect. Adapter lets classes work together that couldn’t otherwise because of incompatible interfaces." (Quelle: [Adapter Pattern > Definition](https://www.geeksforgeeks.org/adapter-pattern/) aufgerufen am 1. November 2021)

Im Grunde _adaptiert_ der BookAdapter das `<books>`-XMLDocument und wandeln es (je nach Anfrage) in verschiedene Views (WebComponents) um.
Beispiel für die _"Buch-Detail-Seite"_
```XML
<book id="978-3-03853-050-3" isbn="978-3-03853-050-3"
      title="Die Fragwürdigen" author="Keller Judith"
      description="Alles beginnt mit einer fliehenden Kuh. Kaum hat sie Frau Hasler über den Haufen gerannt, hebt sich der Vorhang und die Fragwürdigen betreten einer nach der anderen die Bühne. Jede und jeder ein Unikat, Künstler und Künstlerinnen des Lebens. Eine Frau, die den Zug nicht verlassen will, weil sie sich vor dem Schmutz da draussen fürchtet. Ein Mann, der mit Pralinen nicht umgehen kann. Die für zu leicht befundene Alice und der dicke Marc. Erwin, der nicht versteht, warum nicht alle so sind wie er. Die umsichtige Frau Sägisser und die vielleicht gar nicht so hilfsbereite Frau Siegentaler. Menschen, die ihre Liebe nur spüren, weil sie getrennt sind, Menschen, die nur zusammen sind, weil sie ihre Lügen lieben. Leute mit sprechenden und verschwiegenen Namen. Und natürlich die Polizei!Es herrscht ein wunderbares Durcheinander in diesem Buch. Judith Kellers Prosa gibt all jenen eine Stimme, die sonst in den Wörtlichkeiten hängen bleiben. Manchen genügt ein Kurzauftritt, andere brauchen etwas länger. Immer aber müssen sie durch jene feingeschliffene Sprache hindurch, die ihnen diese Schwyzer Autorin für einen Moment zur Verfügung stellt und sie und uns die Lage erkennen lässt. Ein Buch zum Aufblättern und Darin-Versinken."
/>
```

```HTML
<book-detail id="978-3-03853-050-3" isbn="978-3-03853-050-3"
      title="Die Fragwürdigen" author="Keller Judith"
      ... 
/>
```


