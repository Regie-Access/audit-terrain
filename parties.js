// Catalogue des parties, transcrit du « QUESTIONNAIRE AUDIT » (modèle festival), dans son ordre.
// Types de champs : on (Oui / Non / Non vérifié), num (nombre + unité), qual (grille Très bien / Moyen / Passable),
// liste (cases à cocher + « Autres »), matrice (cases à cocher en tableau), texte, titre (intertitre).
// Tout est facultatif : l'auditeur remplit ce qu'il veut, en complément de sa dictée.

const QUALITE = ["Très bien", "Moyen", "Passable"];
const SIGNALETIQUE = ["Information", "Visibilité / clarté", "Contraste", "Police de caractères", "Taille des caractères", "Pictogrammes"];
const SUPPORT = ["Information", "Lisibilité", "Contraste", "Police de caractères", "Taille des caractères", "FALC"];
const HANDICAPS = ["Personnes sourdes", "Personnes malentendantes", "Personnes malvoyantes", "Personnes aveugles", "Handicap mental", "Handicap moteur"];
const OBSTACLES = ["Circulation non stabilisée", "Passages de largeur < 90 cm", "Sol glissant", "Forte pente (> 6 %)", "Sols meubles, graviers", "Pavés, dalles disjointes", "Présence de marches", "Grilles, trous, fentes", "Obstacles à hauteur de tête"];
const AMENAGEMENTS = ["Plans inclinés mobiles", "Plans inclinés fixes", "Garde-pieds", "Mains courantes", "Bandes podotactiles", "Bornes vibrantes", "Abaissements de trottoirs", "Bandes de roulement"];

const T = q => ({ t: "titre", q });
const ON = q => ({ t: "on", q });
const NUM = (q, u) => ({ t: "num", q, u });
const TXT = q => ({ t: "texte", q });
const LISTE = (q, o) => ({ t: "liste", q, o });
const QUAL = (q, o = SIGNALETIQUE) => ({ t: "qual", q, o, cols: QUALITE });

const Q_SANITAIRES = [
  ON("Existe-t-il des blocs sanitaires ?"),
  NUM("Nombre de sanitaires adaptés", "WC"),
  ON("Installés au même emplacement que les autres WC"),
  ON("Correctement accessibles et normés"),
  ON("Aménagés par sexe (si WC séparés)"),
  ON("Signalés"),
  TXT("Descriptif (mesures et emplacements)")
];

const PARTIES = [
  { cle: "D:gouvernance", nom: "Gouvernance et organisation", moment: "entretien", questions: [
    TXT("Personne en charge du handicap (nom, fonction, service)"),
    TXT("Échanges avec les décideurs"), TXT("Échanges avec la technique"), TXT("Échanges avec d'autres services"),
    ON("Une ou plusieurs personnes en charge de la partie handicap"),
    ON("Référent handicap pour l'équipement ou l'événement"),
    T("Aide humaine pendant l'événement"),
    ON("Équipe dédiée"), ON("Salariés"), ON("Bénévoles"), NUM("Nombre de bénévoles", "pers."),
    ON("Système d'identification des personnes"), TXT("Type de dispositif d'identification"),
    ON("L'organisation applique le principe de la chaîne de l'accessibilité"),
    { t: "matrice", q: "Acteurs sensibilisés ou formés à l'accueil des PSH", o: ["Décideurs de l'organisation", "Personnes rattachées au handicap", "Personnels d'accueil", "Personnels des activités de services", "Sécurité", "Autres"], cols: ["Sensibilisés", "Formés"] },
    ON("Process interne sur le handicap"), ON("Démarche de process en cours"),
    ON("Équipement labellisé"), ON("Démarche de label en cours"),
    LISTE("Label pour quel type de handicap", ["Handicap mental", "Handicap visuel", "Handicap auditif", "Handicap moteur"])
  ] },
  { cle: "D:tarification", nom: "Tarification", moment: "entretien", questions: [
    ON("Tarification spécifique pour les PSH"), TXT("Description de la tarification"),
    ON("Logique de compensation socio-économique"),
    ON("Logique de compensation relative à l'accessibilité de l'offre"),
    ON("Logique d'incitation tarifaire"),
    ON("Gratuité de l'accompagnant"),
    TXT("Justificatifs demandés")
  ] },
  { cle: "A:preparer", nom: "Gestion de l'information (préparer sa venue)", moment: "entretien", questions: [
    T("Numérique"),
    ON("Site Internet"), ON("Dispositif d'accessibilité numérique sur le site"),
    LISTE("Dispositif utilisé sur le site", ["FACIL'iti", "Plugin d'accessibilité WordPress", "Userway"]),
    ON("Application"), ON("Dispositif d'accessibilité numérique dans l'application"),
    LISTE("Dispositif utilisé dans l'application", ["FACIL'iti", "Userway"]),
    T("Autres supports"),
    QUAL("Affiches", SUPPORT), QUAL("Flyers / tracts", SUPPORT), TXT("Autre support (à préciser)"), QUAL("Autre support", SUPPORT),
    T("Documents spécifiques"),
    ON("Documents spécifiques pour les PSH"),
    LISTE("Documents proposés", ["Braille", "FALC", "Gros caractères", "Panneau(x) d'information spécifique(s) PSH", "Plan spécifique"]),
    ON("Communication sur ces actions auprès des publics concernés")
  ] },
  { cle: "B:se-rendre", nom: "Signalétique d'approche et transports", questions: [
    TXT("Dénomination du lieu / site"),
    ON("Information en amont pour se rendre à l'événement"),
    LISTE("Support de cette information", ["Site Internet", "Tracts"]),
    T("Macro : à plus d'1 km"),
    ON("Signalétique spécifique à l'événement (> 1 km)"), TXT("Description de la signalétique (> 1 km)"), QUAL("Qualité de la signalétique (> 1 km)"),
    T("Micro : à moins d'1 km"),
    ON("Signalétique spécifique à l'événement (< 1 km)"), TXT("Description de la signalétique (< 1 km)"), QUAL("Qualité de la signalétique (< 1 km)"),
    T("Système de transport"),
    ON("Transport spécifique pour les visiteurs"),
    ON("Dispositif particulier avec les transports en commun"),
    LISTE("Accessible par", ["Mobilités douces", "Transport en commun local", "Transport PSH dédié", "SNCF / TER", "Avion"]),
    ON("Système particulier ou dédié mis en place"),
    ON("Transport spécifique pour les PSH"), TXT("Lequel"),
    ON("Événement en milieu urbain"),
    T("De la dépose au premier lieu d'accueil"),
    ON("Circulation facile"), ON("Praticable par une PMR"),
    LISTE("Si non, pourquoi", OBSTACLES), NUM("Nombre de marches", "marches"),
    ON("Aménagements spécifiques"), LISTE("Aménagements présents", AMENAGEMENTS),
    ON("Cheminement jusqu'à l'entrée signalisé"), QUAL("Qualité de la signalétique du cheminement"),
    T("Stationnement et dépose"),
    LISTE("Types de stationnement possibles", ["Véhicules", "Véhicules collectifs", "Vélos", "Collectifs groupes", "Collectifs spécifiques PSH"]),
    ON("Dépose possible à proximité immédiate de l'entrée"),
    LISTE("Dépose : information", ["Dans le système de communication", "Information préalable", "Signalétique"]),
    NUM("Temps de dépose autorisé", "min"),
    LISTE("Parkings existants pour", ["Usagers / public", "Organisation", "VIP", "Collectifs / autocars", "PSH"])
  ] },
  { cle: "B:stationnement", nom: "Stationnement", multi: true, questions: [
    TXT("Nom ou emplacement du parking"),
    LISTE("Mode d'accès", ["Préinscription", "Déterminé par l'organisation", "Accès libre", "Document spécifique requis (badge, macaron…)", "Carte CMI"]),
    NUM("Nombre de places PSH", "places"),
    NUM("Distance places réservées → entrée accessible", "m"),
    NUM("Largeur des places (norme : 3,30 m)", "m"), NUM("Longueur des places (norme : 5 m)", "m"),
    ON("Bande d'aisance de 80 cm le long du véhicule"),
    ON("Signalétique des places PSH"), ON("De plain-pied par rapport à l'entrée du site"),
    ON("Accueil sur l'aire de stationnement"), ON("Espace de repos"), ON("Toilettes sur l'aire"), ON("Toilettes PMR sur l'aire"),
    T("Cheminement jusqu'à l'entrée"),
    ON("Cheminement signalisé"), TXT("Description du cheminement"),
    ON("Largeur d'au moins 90 cm"),
    LISTE("Difficultés relevées", ["Sol glissant", "Forte pente", "Sols meubles, graviers", "Pavés, dalles", "Ressauts", "Grilles, trous, fentes"]),
    ON("Bande podotactile"),
    QUAL("Qualité de la signalétique"),
    LISTE("Dispositifs présents", ["Bandes podotactiles", "Bandes de guidage", "Système de guidage", "Plaque de stabilisation"])
  ] },
  { cle: "C:entree", nom: "Accueil / entrée", multi: true, questions: [
    ON("L'ensemble du site est de plain-pied"),
    T("Espaces et niveaux"),
    NUM("Espaces ouverts au public", "espaces"), NUM("Espaces totalement accessibles", "espaces"),
    NUM("Espaces accessibles avec un accompagnateur", "espaces"), NUM("Espaces inaccessibles en fauteuil, même accompagné", "espaces"),
    NUM("Niveaux ouverts au public", "niveaux"), NUM("Niveaux totalement accessibles", "niveaux"),
    NUM("Niveaux accessibles avec un accompagnateur", "niveaux"), NUM("Niveaux inaccessibles en fauteuil, même accompagné", "niveaux"),
    T("Entrées"),
    ON("Plusieurs entrées pour des catégories différentes"),
    LISTE("Entrées existantes", ["Public", "VIP", "Invités / pros / presse", "PSH"]),
    LISTE("Obstacles à l'entrée", OBSTACLES),
    ON("Entrée accessible (porte > 80 cm, moins de 3 marches, marches < 16 cm, pente < 5 %)"),
    ON("Entrée spécifique PSH"),
    QUAL("Qualité de la signalétique et de l'identification", ["Information", "Visibilité / lisibilité", "Contraste", "Police de caractères", "Taille des caractères", "Pictogrammes", "Signalisation des obstacles", "Éclairage des circulations"]),
    NUM("Largeur de la porte ou du passage", "cm"), NUM("Nombre de marches", "marches"),
    NUM("Hauteur des marches", "cm"), NUM("Profondeur des marches", "cm"),
    ON("Porte ou dispositif lourd à pousser"),
    ON("Sortie principale accessible"), TXT("Si non, préciser"),
    T("Plans inclinés"),
    ON("Plans inclinés autres que des rampes"), NUM("Nombre de plans inclinés", ""), ON("Pente < 5 %"), ON("Revêtement antidérapant"), ON("Paliers de repos (pente > 10 m)"),
    T("Sièges et repos"),
    ON("Sièges de repos"), NUM("Nombre de sièges", "sièges"), TXT("Localisation (ombre, soleil, accessibilité)"),
    T("Accueil PSH"),
    ON("Accueil PSH à l'entrée"), TXT("Description (dimensions, organisation, documentation, personnel, services)"),
    ON("Personne pratiquant la LSF"), ON("Borne services"), ON("Boucle magnétique"),
    ON("Bracelet ou dispositif d'identification PMR/PSH"), TXT("Description du dispositif d'identification"),
    ON("Prêt de fauteuils roulants"), NUM("Fauteuils disponibles", "fauteuils"),
    { t: "liste", q: "État des fauteuils", o: ["Bon", "Moyen", "Mauvais"] },
    ON("Autres dispositifs en prêt"), TXT("Lesquels"),
    ON("Toilettes à proximité de l'entrée"), ON("Toilettes PMR à proximité de l'entrée")
  ] },
  { cle: "D:accueil", nom: "Être accueilli", rubriques: ["Préinscription", "Système d'identification", "Dispositif handicap auditif"], questions: [
    ON("Préinscription demandée"), ON("Système d'identification (bracelet, badge…)"),
    ON("Gratuité de l'accompagnant appliquée sur place"),
    ON("Comptoirs PMR"), ON("Coupe-file"),
    ON("Boucle magnétique"), ON("Interprète LSF présent"), ON("Espace calme / repos")
  ] },
  { cle: "D:circulations", nom: "Circulations", questions: [
    ON("Signalétique spécifique pour les cheminements PMR/PSH"),
    LISTE("Signalétique adaptée aux besoins des", HANDICAPS),
    QUAL("Qualité de la signalétique"),
    ON("Cheminement spécifique ou réservé PMR/PSH"),
    ON("Plan spécifique PMR/PSH"),
    ON("Aide humaine au déplacement"), ON("Accompagnement individuel sur demande"),
    ON("Chiens guides admis"), ON("Chiens de confort admis"),
    NUM("Largeur des cheminements (norme : 1,40 m)", "m"), NUM("Hauteur libre (norme : 2 m)", "m"),
    { t: "matrice", q: "Qualité des circulations et de la signalétique pour aller vers", o: ["Activités", "Stands", "Services", "Espaces de restauration", "Toilettes", "Autres espaces"], cols: ["Cheminement bien", "Cheminement moyen", "Cheminement passable", "Signalétique bien", "Signalétique moyenne", "Signalétique passable"] },
    TXT("Activités de l'événement (une par ligne)"),
    T("Escaliers"),
    ON("Présence d'escaliers"), NUM("Nombre d'escaliers", ""), TXT("Pour accéder à"), ON("Mains courantes aux normes")
  ] },
  { cle: "E:lieu", nom: "Lieu / espace", multi: true, instances: ["Scène / zone concerts", "Espace VIP", "Restauration / foodcourt", "Bars", "Point info / billetterie", "Accueil / guichet", "Boutique", "Bornes interactives / distributeurs", "Salle / espace de conférence", "Bureaux / production", "Loges / village artistes", "Catering pro", "Espace et camping bénévoles", "Animations / fête foraine", "Voie de liaison entre entrées", "Zone de repos"], questions: [
    TXT("Emplacement"), ON("Accessible"),
    NUM("Hauteur du comptoir ou du présentoir", "cm"),
    TXT("Remarques (hauteur des présentoirs et du guichet, aire de circulation, signalisation, boucle magnétique)"),
    T("Pour une salle ou un espace de conférence"),
    TXT("Descriptif"), NUM("Jauge", "pers."), ON("Signalée"),
    LISTE("Accessible aux", HANDICAPS)
  ] },
  { cle: "F:plateforme", nom: "Podium / plateforme PSH", multi: true, questions: [
    TXT("Dénomination"), TXT("Lieu d'implantation"), TXT("Destination / objet"),
    T("Plateau"),
    NUM("Largeur", "m"), NUM("Longueur", "m"), NUM("Hauteur", "m"), NUM("Hauteur du garde-corps", "m"),
    T("Rampe"),
    NUM("Largeur de la rampe", "m"), NUM("Longueur de la rampe", "m"), NUM("Pente de la rampe", "%"),
    T("Équipements"),
    ON("Couverture / abri"), ON("Places assises"), ON("Escalier"), ON("Protections"),
    ON("Chasse-roues"), ON("Stop-roues"), ON("Bande d'éveil"), ON("Boucle magnétique"),
    ON("Règlement existant"), ON("Règlement affiché"),
    ON("Consignes de sécurité existantes"), ON("Consignes de sécurité affichées"), ON("Marquage de sécurité")
  ] },
  { cle: "G:clic-collect", nom: "Clic & collect", questions: [
    ON("Dispositif existant"), ON("Connu et annoncé en amont"), ON("Application accessible"), ON("Point de retrait accessible")
  ] },
  { cle: "H:toilettes", nom: "Sanitaires / toilettes", multi: true, questions: Q_SANITAIRES },
  { cle: "I:hebergement", nom: "Hébergement / camping", multi: true, questions: [
    ON("Hébergements prévus pour les PSH"),
    LISTE("Types d'hébergement", ["Camping", "Hébergements conventionnels (hôtels, gîtes…)"]),
    ON("Information disponible sur les supports"), LISTE("Sur quels supports", ["Site Internet", "Application", "Contact"]),
    ON("Accueil de groupes prévu"),
    T("Camping"),
    ON("Liaison PSH gérée par l'organisation entre camping et événement"),
    ON("Espace réservé aux PSH"), ON("Accompagnants admis"),
    ON("Signalétique spécifique PSH"), QUAL("Qualité de la signalétique"),
    LISTE("Accueil adapté aux besoins des", HANDICAPS),
    ON("Emplacements praticables par une PMR"), LISTE("Si non, pourquoi", OBSTACLES), NUM("Nombre de marches", "marches"),
    ON("Aménagements spécifiques"), LISTE("Aménagements présents", AMENAGEMENTS),
    T("Toilettes du camping"),
    ...Q_SANITAIRES,
    T("Douches"),
    ON("Douches adaptées"), NUM("Nombre de douches adaptées", "douches"),
    ON("Au même emplacement que les autres"), ON("Accessibles et normées"), ON("Aménagées par sexe"), ON("Signalées"),
    TXT("Descriptif des douches (mesures et emplacements)"),
    T("Autres hébergements"),
    TXT("Comment l'information est-elle disponible, sur quels supports"),
    ON("Liaison PSH gérée par l'organisation entre hébergements et événement")
  ] },
  { cle: "D:aides", nom: "Aides techniques et équipements", questions: [
    LISTE("Pour les personnes déficientes visuelles", ["Audiodescription", "Documents sonores", "Machine à lire", "Loupe", "Télé-agrandisseur", "Guidage podotactile au sol", "Éléments en relief", "Audio-guidage avec casque", "Guidage au sol", "Système audiovision", "Documents / cartels en braille", "Plan en relief"]),
    LISTE("Pour les personnes déficientes auditives", ["Interprétariat LSF", "Interprétariat LPC", "Interprétariat LSI", "Sous-titrage individuel", "Sous-titrage collectif", "Alarme lumineuse", "Vidéos sous-titrées", "Surtitrage", "Chansigne", "Boucles magnétiques, liaisons IR ou HF"]),
    LISTE("Pour les personnes en situation de handicap mental", ["Signalétique adaptée", "FALC"]),
    LISTE("Autres supports de substitution", ["Documents audio", "Documents vidéo"]),
    LISTE("Outils sensoriels ou adaptés", ["Maquettes", "Tactile", "Plans en relief", "Mallette pédagogique"]),
    LISTE("Livret, documentation", ["Gros caractères", "Intégrant la LSF", "Braille", "FALC"])
  ] },
  { cle: "D:formation", nom: "Formation, relations et projets", moment: "entretien", questions: [
    ON("Personnel formé à l'accueil des publics handicapés"),
    TXT("Catégories de personnel formées"), TXT("Type de formation (continue, in situ…)"),
    TXT("Types de handicap abordés"), TXT("Organismes formateurs"),
    ON("Contact avec des structures du handicap"), TXT("Qui, quel handicap, pourquoi"),
    T("Projets"),
    TXT("Projets d'amélioration en cours"),
    LISTE("Obstacles rencontrés", ["Manque de personnel", "Manque de formations appropriées", "Manque de budget", "Manque de soutien extérieur"]),
    ON("Souhaite un soutien extérieur pour monter des projets"),
    LISTE("Soutien souhaité pour", ["Liens avec le milieu du handicap, hospitalier", "Mise en relation avec des prestataires", "Recherche de partenaires financiers", "Constitution de fichiers"])
  ] },
  { cle: "X:libre", nom: "Partie libre", multi: true, libre: true, questions: [] },
  { cle: "Z:conclusion", nom: "Notes pour la conclusion", questions: [
    TXT("Forces à souligner"), TXT("Personnes à remercier (nom, fonction)")
  ] }
];
