/*
 *
 * One book object for a row look like: 
 * {
    "title": "new title",
    "isbn": "3866801929", // Typ: ISBN-10
    "author": "author",
    "description": "Some description about the book ..."
   }
   Hint: The order of keys should be irrelevant.
 **/
const sampleBookPreviewList = [{
    "title": "Ahren: Der 13. Paladin Band I",
    "isbn": "3866801929",
    "author": "Torsten Weitze",
    "rating": 0,
    "description": "Von seinem trunksüchtigen Vater verprügelt und von der Dorfjugend schikaniert, kann der heranwachsende Ahren sein Glück kaum fassen, als er bei der alljährlichen Eignungsprüfung von Falk dem Waldläufer als Lehrling auserwählt wird.Bei ihm lernt er das Bogenschießen und den Kampf gegen Dunkelwesen, bis am Tag der Frühlingszeremonie etwas Unerwartetes geschieht: Als Ahren den Götterstein berührt, beginnt dieser zu leuchten. Kurze Zeit später taucht ein mürrischer Magier auf und treibt Falk und Ahren zur Eile an, denn etwas Böses ist dabei, zu erwachen. Gemeinsam mit seinen ungleichen Gefährten begibt sich der junge Waldläufer auf eine gefahrvolle Reise zum Immergrün, dem Reich der Elfen, um deren Hilfe zu erbitten. Doch die Zeit ist knapp, denn ER, DER ZWINGT hat es auf Ahren abgesehen und ER setzt alles daran, ihn zu vernichten."
  },
  {
    "title": "Die Ernennung: Der 13. Paladin Band II",
    "isbn": "3866801930",
    "author": "Torsten Weitze",
    "description": "Zwei Einhan sind gefunden, einer steht noch aus. Ahren und seine Gefährten müssen ein von Unruhen geplagtes Reich durchqueren und die gefahrvolle Ostküste Joraths entlangsegeln, um die Zwergenenklave des Silbernen Kliffs zu erreichen. Ahrens Meister Falk hofft, in dessen Tiefen einen zwergischen Freund aus Söldnertagen als dritten Einhan für das Ritual der Ernennung seines Waldläuferlehrlings gewinnen zu können. Um dessen Hilfe zu erlangen, müssen sie ihm bei seiner einsamen Wacht helfen, jener Tradition des kleinen Volkes, die es einem Zwerg erlaubt, einen eigenen Namen zu erwerben. Doch die Zeit drängt. Denn sollte Ahrens Ernennung zum 13. Paladin mit Hilfe der drei Einhan nicht bis zur Wintersonnenwende erfolgt sein, wird ER, DER ZWINGT vorzeitig erwachen und die unvorbereiteten Völker Joraths ins Dunkel stürzen."
  },
  {
    "title": "Die Eherne Stadt: Der 13. Paladin Band III",
    "isbn": "3866801931",
    "author": "Torsten Weitze",
    "description": "Kaum sind die ungleichen Gefährten nach der Ernennung Ahrens zum 13. Paladin in Tiefstein eingekehrt, droht neues Ungemach. Über die Alten erfahren sie, dass einer der Ihren, der Paladin Bergen Olgitram sowie seine Söldnertruppe Die blaue Kohorte von dem eigenwilligen Sonnenkaiser in der Ehernen Stadt festgehalten werden. Nicht genug, dass Ahren und seine Gefährten sich schnellstmöglich auf den Weg in die Sonnenebenen machen müssen, um die Eherne Stadt und ihre kostbaren Schmieden vor der Zerstörung durch den Sonnenkaiser zu bewahren, auch das Triumvirat der Stadt muss von einem friedlichen Ende der Auseinandersetzung überzeugt werden. Alles halb so wild, wenn der Sonnenkaiser nicht darauf bestünde, den abtrünnigen Hauptmann und seine Söldner hinrichten zu lassen. Doch Jorath braucht im Kampf gegen ihn, der zwingt, jeden einzelnen der dreizehn Paladine. Auch, wenn es sich dabei um einen störrischen Kommandanten handelt."
  },
  {
    "title": "Die Schlafende Mutter: Der 13. Paladin Band IV",
    "isbn": "3866801932",
    "author": "Torsten Weitze",
    "description": "Die Belagerung der Ehernen Stadt ist beendet und der Paladin Bergen bleibt auf freiem Fuß. Nach diesem Erfolg zieht es Ahren und seine Gefährten in den südlichen Dschungel, wo sie Hinweisen über den Verbleib eines weiblichen Paladins nachgehen wollen. Die Reise ist lang und gefahrvoll, denn nicht nur müssen sie die Namenlose Wüste und den ungezähmten Urwald durchqueren, auch die Gefahr durch gedungene Attentäter bleibt auf dem Schwertpfad eine konstante Bedrohung und schließlich fordert Jelninolans lange Abwesenheit aus dem Immergrün ihren Tribut und es drohen tödliche Konsequenzen ..."
  },
  {
    "title": "Die Inseln der Klingensee: Der 13. Paladin Band V",
    "isbn": "3866801933",
    "author": "Torsten Weitze",
    "description": "Ahren kann sein Glück kaum fassen: Seine Lehrzeit geht endlich zu Ende und Kharas Zuneigung zu ihm scheint mit jeder Minute zu wachsen. Von den südlichen Dschungeln aus segeln die Gefährten westwärts und sind dabei gleich zwei Paladinen auf der Spur, die auf einer der Inseln der Klingensee ein friedliches Leben führen sollen. Doch die Suche erweist sich als schwierig, denn ein Krieg unter Piraten verwandelt die Klingensee in einen Hexenkessel, der ein tragisches Drama verbirgt. Während Ahren und seine Freunde alles daran setzen, die zwei Paladine für ihr Vorhaben zu gewinnen, gegen Ihn, der zwingt, in den Kampf zu ziehen, kommt der Hochfang Sven der Vollendung seines teuflischen Plans immer näher."
  },
  {
    "title": "Der Kampf um Hjalgar: Der 13. Paladin Band VI",
    "isbn": "3866801934",
    "author": "Torsten Weitze",
    "description": "Ahren und seine Gefährten sind in heller Aufregung. Nachdem sie auf den Inseln der Klingensee die beiden Paladine Fisker und Aluna im Kampf gegen den Widersacher für sich gewonnen haben, geschieht etwas Beunruhigendes mit der Bannsäule. Unwissend, dass der Hochfang Sven seinem Meister ein grausiges Opfer dargebracht hat, eilen die Gefährten zur Königsinsel, um am ersten Konklave seit Jahrhunderten teilzunehmen. Doch dort angekommen, erwarten sie furchtbare Neuigkeiten: Unbekannte Dunkelwesen haben Hjalgar überrannt und drohen, sämtliche Bewohner des kleinen Reiches umzubringen. Ahren steht seine düsterste Prüfung bevor, denn die gefürchteten Dunklen Tage sind nach Jorath zurückgekehrt."
  },
  {
    "title": "Im Ewigen Reich: Der 13. Paladin Band VII",
    "isbn": "3866801935",
    "author": "Torsten Weitze",
    "description": "Ahren lässt seine Gefährten zurück und macht sich mit Khara auf den Weg ins Ewige Reich, denn die Zeit rennt: Die Bannwolke breitet sich immer weiter aus und noch immer sind nicht alle 13 Paladine vereint. Doch der verzweifelte Versuch, im Alleingang bis zur drakonisch abgeschottet lebenden Kaiserin vorzudringen, um ihre Hilfe im Kampf gegen den Widersacher einzufordern, droht zu scheitern, als Ahren in die Fänge von Quin-Was Friedenswachen gerät. Während Ahrens Gefährten noch einen Weg suchen, Quin-Was Zaubernetz zu unterlaufen, um ihnen zu Hilfe zu eilen, befinden sich Ahren und Khara längst in einem Kampf um Leben und Tod."
  },
  {
    "title": "Der Vater des Berges: Der 13. Paladin Band VIII",
    "isbn": "3866801936",
    "author": "Torsten Weitze",
    "description": "Ahren und seine Gefährten sind endlich wiedervereint und habe in der Ewigen Kaiserin eine wertvolle Verbündete und einen weiteren Paladin für den Kampf gegen den Widersacher gewonnen. Doch die Reise des dreizehnten Paladins ist nicht ohne Spuren an ihm vorübergezogen. In der Hoffnung, der mysteriöse Vater des Berges kann Ahren bei seiner Genesung helfen, reisen die Freunde nach Tausend Hallen, zum Ursprung der Zwerge. Dort soll die Allianz der Völker Joraths geschlossen werden, um endlich eine gemeinsame Front gegen die noch immer wachsende Bannwolke bilden zu können. Doch Ahren und die anderen haben ihren Gegner unterschätzt, denn der dunkle Gott hat längst eine Falle für sie vorbereitet, die nur darauf wartet, zuzuschnappen."
  },
  {
    "title": "Im Herzen des Wutwaldes: Der 13. Paladin Band IX",
    "isbn": "3866801937",
    "author": "Torsten Weitze",
    "description": "Es ist vollbracht - Ahren und seine Freunde haben die Allianz der Völker Joraths wiederbelebt. Während der Verteidigungsring um die Bannwolke mit Hilfe der Zwerge geschlossen und befestigt wird, kommen die Gefährten dem Hilferuf der Wutelfen aus dem Wutwald nach, in dessen Tiefen geheimnisvolle Bedrohungen lauern, die den Elfenwald und alles Leben in ihm zu zerstören drohen. Die Zeit drängt, denn nicht nur schreitet die Ausbreitung der Bannwolke bedrohlich schnell voran, auch muss der heimgesuchte Wutwald um jeden Preis gerettet werden, denn wenn der Wald fällt, fällt mit ihm auch der Verteidigungsring und alle Hoffnung auf einen Sieg gegen Ihn, der zwingt, wäre verloren."
  },
  {
    "title": "Das Grüne Meer: Der 13. Paladin Band X",
    "isbn": "3866801938",
    "author": "Torsten Weitze",
    "description": "Kaum liegen die Gräuel des Wutwaldes hinter ihnen, da beschließt der Dreizehnte Paladin, mit seinen Freunden ins Grüne Meer zu reisen, um sein altes Versprechen einzulösen, jenen Nekromanten zur Strecke zu bringen, der die fruchtbaren Lande des Reitervolkes rund um deren Paladin Feuer-im-Blick schon viel zu lange in seinem knöchernen Würgegriff hält. Doch nicht nur der Nekromant hält die Gefährten mit seinen tödlichen Fallen auf Trab, auch Er, der zwingt, treibt seine eigenen Ränke voran, um Tod und Verderben über die Paladine zu bringen. Und dann offenbart sich zu allem Überfluss auch noch ein Winkelzug der Götter, mit dem keiner gerechnet hat."
  },
  {
    "title": "Die Stadt der Schurken: Der 13. Paladin Band XI",
    "isbn": "3866801939",
    "author": "Torsten Weitze",
    "description": "Ahren und seine Gefährten reisen in den Immergrün, um nach den tragischen Ereignissen im Grünen Meer neuen Mut zu finden. Als sie schließlich aufbrechen, um den Kontinent auf der Suche nach dem verschollenen Paladin Yollock zu durchqueren, geraten sie unversehens in einen Sog der Ereignisse rund um eine geraubte Frau, einen verzweifelten Granden aus Kap Verstaad und eine mörderische Stadt voller Schurken. Kontrolliert vom brillanten Meuchler Reik Silbermantel, stellt dieser Ort ohne Gesetze oder Moral Ahren und seine Freunde vor eine ihrer schwersten Prüfungen ..."
  }
];

export { sampleBookPreviewList };
