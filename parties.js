// Catalogue des parties, tiré du « QUESTIONNAIRE AUDIT » (modèle festival).
// Types de champs : on (Oui / Non / Non vérifié), num (nombre + unité),
// qual (grille Très bien / Moyen / Passable), liste (cases à cocher), texte.
// Maquette : un extrait des questions par partie ; la transcription complète viendra à l'étape 3.

const GRILLE_SIGNALETIQUE = ["Information", "Lisibilité", "Contraste", "Police", "Taille des caractères", "Pictogrammes"];
const HANDICAPS = ["Sourdes", "Malentendantes", "Malvoyantes", "Aveugles", "Handicap mental", "Handicap moteur"];
const OBSTACLES = ["Passages < 90 cm", "Sol glissant", "Forte pente (> 6 %)", "Sols meubles, graviers", "Pavés, dalles disjointes", "Marches", "Grilles, trous, fentes", "Obstacles à hauteur de tête"];

const PARTIES = [
  { cle: "D:gouvernance", nom: "Gouvernance et organisation", moment: "entretien", questions: [
    { t: "on", q: "Référent handicap pour l'événement" },
    { t: "on", q: "Équipe dédiée à l'accueil PSH" },
    { t: "num", q: "Nombre de bénévoles dédiés", u: "pers." },
    { t: "on", q: "Système d'identification des personnes" },
    { t: "on", q: "Process interne sur le handicap" },
    { t: "on", q: "Équipement labellisé" } ] },
  { cle: "D:tarification", nom: "Tarification", moment: "entretien", questions: [
    { t: "on", q: "Tarif spécifique PSH" },
    { t: "on", q: "Gratuité de l'accompagnant" },
    { t: "liste", q: "Logique de compensation", o: ["Socio-économique", "Accessibilité de l'offre", "Incitation tarifaire"] },
    { t: "texte", q: "Justificatifs demandés" } ] },
  { cle: "A:preparer", nom: "Gestion de l'information (préparer sa venue)", moment: "entretien", questions: [
    { t: "on", q: "Site Internet" },
    { t: "on", q: "Outil d'accessibilité numérique sur le site" },
    { t: "on", q: "Application mobile" },
    { t: "qual", q: "Affiches", o: GRILLE_SIGNALETIQUE.concat(["FALC"]) },
    { t: "liste", q: "Documents proposés", o: ["Braille", "FALC", "Gros caractères", "Plan spécifique", "Panneaux spécifiques PSH"] } ] },
  { cle: "B:se-rendre", nom: "Signalétique d'approche et transports", questions: [
    { t: "on", q: "Signalétique spécifique à plus d'1 km" },
    { t: "qual", q: "Qualité de la signalétique (moins d'1 km)", o: GRILLE_SIGNALETIQUE },
    { t: "liste", q: "Accessible par", o: ["Mobilités douces", "Transport en commun local", "Transport PSH dédié", "Train", "Avion"] },
    { t: "liste", q: "Obstacles entre dépose et accueil", o: OBSTACLES } ] },
  { cle: "B:stationnement", nom: "Stationnement", multi: true, questions: [
    { t: "liste", q: "Mode d'accès", o: ["Préinscription", "Déterminé par l'organisation", "Accès libre", "Badge / macaron", "CMI"] },
    { t: "num", q: "Nombre de places PSH", u: "places" },
    { t: "num", q: "Distance places → entrée accessible", u: "m" },
    { t: "num", q: "Largeur des places", u: "m" },
    { t: "on", q: "Toilettes PMR sur l'aire" },
    { t: "on", q: "Cheminement jusqu'à l'entrée signalé" } ] },
  { cle: "C:entree", nom: "Accueil / entrée", multi: true, questions: [
    { t: "on", q: "Site de plain-pied" },
    { t: "on", q: "Entrée spécifique PSH" },
    { t: "num", q: "Largeur de la porte ou du passage", u: "cm" },
    { t: "num", q: "Nombre de marches", u: "marches" },
    { t: "on", q: "Accueil PSH à l'entrée" },
    { t: "on", q: "Boucle magnétique" },
    { t: "num", q: "Fauteuils roulants en prêt", u: "fauteuils" } ] },
  { cle: "D:accueil", nom: "Être accueilli", rubriques: ["Préinscription", "Système d'identification", "Dispositif handicap auditif"], questions: [
    { t: "on", q: "Personne pratiquant la LSF" },
    { t: "on", q: "Bracelet ou identification PMR/PSH" },
    { t: "on", q: "Prêt d'autres dispositifs (casques anti-bruit…)" },
    { t: "on", q: "Comptoirs PMR" } ] },
  { cle: "D:circulations", nom: "Circulations", questions: [
    { t: "liste", q: "Signalétique adaptée aux personnes", o: HANDICAPS },
    { t: "on", q: "Plan spécifique PMR/PSH" },
    { t: "on", q: "Aide humaine au déplacement" },
    { t: "on", q: "Chiens guides admis" },
    { t: "num", q: "Pente des plans inclinés", u: "%" },
    { t: "num", q: "Sièges de repos", u: "sièges" },
    { t: "on", q: "Mains courantes aux normes (escaliers)" } ] },
  { cle: "E:lieu", nom: "Lieu / espace", multi: true, instances: ["Scène / zone concerts", "Espace VIP", "Restauration / foodcourt", "Bars", "Point info / billetterie", "Bureaux / production", "Loges / village artistes", "Catering pro", "Espace et camping bénévoles", "Animations / fête foraine", "Voie de liaison entre entrées", "Zone de repos", "Salle / espace de conférence", "Boutique"], questions: [
    { t: "on", q: "Accessible" },
    { t: "num", q: "Hauteur du comptoir", u: "cm" },
    { t: "num", q: "Jauge", u: "pers." },
    { t: "liste", q: "Accessible aux personnes", o: HANDICAPS },
    { t: "texte", q: "Emplacement" } ] },
  { cle: "F:plateforme", nom: "Podium / plateforme PSH", multi: true, questions: [
    { t: "num", q: "Plateau : largeur", u: "m" },
    { t: "num", q: "Plateau : longueur", u: "m" },
    { t: "num", q: "Plateau : hauteur", u: "m" },
    { t: "num", q: "Hauteur du garde-corps", u: "m" },
    { t: "num", q: "Rampe : largeur", u: "m" },
    { t: "num", q: "Rampe : longueur", u: "m" },
    { t: "liste", q: "Équipements", o: ["Abri / couverture", "Places assises", "Escalier", "Chasse-roues", "Stop-roues", "Bande d'éveil", "Boucle magnétique", "Règlement affiché", "Consignes de sécurité affichées"] } ] },
  { cle: "G:clic-collect", nom: "Clic & collect", questions: [
    { t: "on", q: "Dispositif existant" },
    { t: "on", q: "Point de retrait accessible" } ] },
  { cle: "H:toilettes", nom: "Sanitaires / toilettes", multi: true, questions: [
    { t: "num", q: "Nombre de toilettes adaptées", u: "WC" },
    { t: "on", q: "Au même emplacement que les autres" },
    { t: "on", q: "Accessibles et normées" },
    { t: "on", q: "Signalées" } ] },
  { cle: "I:hebergement", nom: "Hébergement / camping", multi: true, questions: [
    { t: "on", q: "Liaison PSH avec l'événement" },
    { t: "on", q: "Espace réservé PSH" },
    { t: "on", q: "Accompagnants admis" },
    { t: "num", q: "Douches adaptées", u: "douches" } ] },
  { cle: "D:aides", nom: "Aides techniques et équipements", questions: [
    { t: "liste", q: "Déficience visuelle", o: ["Audiodescription", "Documents sonores", "Loupe", "Guidage podotactile", "Braille", "Plan en relief"] },
    { t: "liste", q: "Déficience auditive", o: ["LSF", "LPC", "Sous-titrage", "Chansigne", "Boucle magnétique", "Alarme lumineuse"] },
    { t: "liste", q: "Handicap mental", o: ["Signalétique adaptée", "FALC"] } ] },
  { cle: "D:formation", nom: "Formation, relations et projets", moment: "entretien", questions: [
    { t: "on", q: "Personnel formé à l'accueil des PSH" },
    { t: "on", q: "Contact avec des acteurs du handicap" },
    { t: "liste", q: "Obstacles rencontrés", o: ["Personnel", "Formations", "Budget", "Soutien extérieur"] } ] },
  { cle: "X:libre", nom: "Partie libre", multi: true, libre: true, questions: [] },
  { cle: "Z:conclusion", nom: "Notes pour la conclusion", questions: [
    { t: "texte", q: "Personnes à remercier (nom, fonction)" } ] }
];
