import { Meal, ShoppingItem, PreparationStep } from '@/types';

// ============================================
// FRÜHSTÜCK (Breakfast) - 7 Tage
// ============================================

export const breakfastMeals: Meal[] = [
  {
    id: 1,
    day: 1,
    type: 'breakfast',
    title: "Albanisch-Brunch Deluxe",
    subtitle: "Avocado-Toast meets Speca",
    culturalOrigin: ["Albanisch", "Modern"],
    ingredients: [
      { name: "Vollkorn-Toast", amount: "2 Scheiben", category: "grains" },
      { name: "Avocado", amount: "1 reif", category: "fresh" },
      { name: "Zitronensaft", amount: "1 EL", category: "basics" },
      { name: "Ajvar", amount: "2 EL", category: "basics" },
      { name: "Rote Paprika (Speca)", amount: "1/2", category: "fresh" },
      { name: "Oliven", amount: "Handvoll", category: "basics" },
      { name: "Tomaten", amount: "1 klein", category: "fresh", forSideDish: true },
      { name: "Gurke", amount: "1/4", category: "fresh", forSideDish: true },
    ],
    sideDish: "Tomaten-Gurken-Salat",
    benefit: "Proteine + gesunde Fette + Gemüse - gleich satt und stabil",
    prepTime: 12,
    tags: ["vegetarisch", "ballaststoffreich", "omega-fette"],
  },
  {
    id: 2,
    day: 2,
    type: 'breakfast',
    title: "Französische Omelette",
    subtitle: "Mit Balkan-Twist",
    culturalOrigin: ["Französisch", "Balkan"],
    ingredients: [
      { name: "Eier", amount: "2-3", category: "protein" },
      { name: "Petersilie", amount: "frisch", category: "fresh" },
      { name: "Dill", amount: "frisch", category: "fresh" },
      { name: "Zwiebel", amount: "1/4", category: "fresh" },
      { name: "Feta/Sirene", amount: "30g", category: "dairy" },
      { name: "Pfeffer", amount: "nach Geschmack", category: "extras" },
      { name: "Baguette-Toast", amount: "1 Scheibe", category: "grains" },
      { name: "Gurke", amount: "Scheiben", category: "fresh", forSideDish: true },
    ],
    sideDish: "Gurkenscheiben",
    benefit: "Eier + Kräuter geben Volumen und Nährstoffe, Feta leicht salzig-cremig",
    prepTime: 10,
    tags: ["proteinreich", "low-carb-option", "kräuter"],
  },
  {
    id: 3,
    day: 3,
    type: 'breakfast',
    title: "Deutsch-Albanisch Power Bowl",
    subtitle: "Skyr mit herzhaftem Twist",
    culturalOrigin: ["Deutsch", "Albanisch"],
    ingredients: [
      { name: "Skyr/Magerquark", amount: "200g", category: "dairy" },
      { name: "Walnüsse", amount: "Handvoll", category: "extras" },
      { name: "Apfel", amount: "1/2", category: "fresh" },
      { name: "Zimt", amount: "Prise", category: "extras" },
      { name: "Tomaten", amount: "1 klein", category: "fresh", forSideDish: true },
      { name: "Oliven", amount: "einige", category: "basics", forSideDish: true },
    ],
    sideDish: "Tomaten + Oliven als herzhaftes Topping",
    benefit: "Eiweißbombe mit Crunch + Herzhaft-Süß kombiniert - Heißhunger-Kontrolle",
    prepTime: 8,
    tags: ["proteinreich", "schnell", "süß-herzhaft"],
  },
  {
    id: 4,
    day: 4,
    type: 'breakfast',
    title: "Lachs-Toast Provençal",
    subtitle: "Omega-3 Power",
    culturalOrigin: ["Französisch", "Skandinavisch"],
    ingredients: [
      { name: "Vollkorn-Toast", amount: "2 Scheiben", category: "grains" },
      { name: "Frischkäse (leicht)", amount: "2 EL", category: "dairy" },
      { name: "Räucherlachs", amount: "50g", category: "protein" },
      { name: "Zitronenzeste", amount: "etwas", category: "fresh" },
      { name: "Pfeffer", amount: "frisch gemahlen", category: "extras" },
      { name: "Cherry-Tomaten", amount: "Handvoll", category: "fresh", forSideDish: true },
      { name: "Dijon-Senf", amount: "1 TL", category: "basics", forSideDish: true },
      { name: "Olivenöl", amount: "1 EL", category: "basics", forSideDish: true },
    ],
    sideDish: "Cherry-Tomaten-Salat mit Dijon-Vinaigrette",
    benefit: "Omega-3 aus Lachs + Proteine + frische Aromen",
    prepTime: 10,
    tags: ["omega-3", "brain-food", "mediterran"],
  },
  {
    id: 5,
    day: 5,
    type: 'breakfast',
    title: "Balkan Egg Wrap",
    subtitle: "Zum Mitnehmen",
    culturalOrigin: ["Balkan", "Tex-Mex"],
    ingredients: [
      { name: "Weizentortilla/Wrap", amount: "1 groß", category: "grains" },
      { name: "Eier", amount: "2", category: "protein" },
      { name: "Spinat", amount: "Handvoll", category: "fresh" },
      { name: "Paprika (Speca)", amount: "1/4", category: "fresh" },
      { name: "Ajvar", amount: "1-2 EL", category: "basics" },
      { name: "Joghurt", amount: "2 EL", category: "dairy", forSideDish: true },
      { name: "Minze", amount: "frisch", category: "fresh", forSideDish: true },
    ],
    sideDish: "Minz-Joghurt Dip",
    benefit: "Komplettes Frühstück zum Mitnehmen",
    prepTime: 12,
    tags: ["to-go", "proteinreich", "praktisch"],
  },
  {
    id: 6,
    day: 6,
    type: 'breakfast',
    title: "Französisch-Albanischer Ratatouille-Toast",
    subtitle: "Gemüse-Power",
    culturalOrigin: ["Französisch", "Albanisch"],
    ingredients: [
      { name: "Zucchini", amount: "1/2", category: "fresh" },
      { name: "Aubergine", amount: "1/4", category: "fresh" },
      { name: "Paprika", amount: "1/2", category: "fresh" },
      { name: "Tomatensauce", amount: "2 EL", category: "basics" },
      { name: "Vollkorn-Toast", amount: "1 Scheibe", category: "grains" },
      { name: "Kräuter (Thymian, Oregano)", amount: "frisch", category: "fresh" },
      { name: "Ajvar", amount: "1 EL", category: "basics", forSideDish: true },
      { name: "Joghurt", amount: "1 EL", category: "dairy", forSideDish: true },
    ],
    sideDish: "Ajvar oder Joghurt-Topping",
    benefit: "Farben, Pflanzenstoffe, mediterrane Fette - satt ohne schwer",
    prepTime: 15,
    tags: ["vegetarisch", "ballaststoffreich", "mediterran"],
  },
  {
    id: 7,
    day: 7,
    type: 'breakfast',
    title: "Süß-Herzhaft Blend",
    subtitle: "Beeren + Pute",
    culturalOrigin: ["International", "Modern"],
    ingredients: [
      { name: "Beeren (frisch/TK)", amount: "100g", category: "fresh" },
      { name: "Joghurt", amount: "150g", category: "dairy" },
      { name: "Honig", amount: "1 TL", category: "extras" },
      { name: "Walnüsse", amount: "Handvoll", category: "extras" },
      { name: "Putenschinken", amount: "2-3 Scheiben", category: "protein", forSideDish: true },
      { name: "Vollkorn-Toast", amount: "1 Scheibe", category: "grains", forSideDish: true },
    ],
    sideDish: "Putenschinken + Vollkorn-Toast",
    benefit: "Mix aus Süß & Herzhaft balanciert Insulin + Energie",
    prepTime: 8,
    tags: ["süß-herzhaft", "proteinreich", "schnell"],
  },
];

// ============================================
// ABENDESSEN (Dinner) - 7 Tage
// Portions-Rule: 1/2 Gemüse · 1/4 Protein · 1/4 Beilage
// ============================================

export const dinnerMeals: Meal[] = [
  {
    id: 101,
    day: 1,
    type: 'dinner',
    title: "Hähnchen-Spieße",
    subtitle: "Mit Joghurt-Gurken-Dip",
    culturalOrigin: ["Albanisch", "Mediterran"],
    ingredients: [
      { name: "Hähnchenbrust", amount: "350-450g", category: "protein" },
      { name: "Knoblauch", amount: "2-3 Zehen", category: "fresh" },
      { name: "Zitrone", amount: "1", category: "fresh" },
      { name: "Olivenöl", amount: "2 EL", category: "basics" },
      { name: "Paprika edelsüß", amount: "1 TL", category: "extras" },
      { name: "Oregano/Thymian", amount: "1 TL", category: "extras" },
      { name: "Vollkorn-Bulgur", amount: "150-180g", category: "grains", forSideDish: true },
      { name: "Tomaten", amount: "3", category: "fresh", forSideDish: true },
      { name: "Gurke", amount: "1", category: "fresh", forSideDish: true },
      { name: "Paprika", amount: "1", category: "fresh", forSideDish: true },
      { name: "Zwiebel", amount: "1/2", category: "fresh", forSideDish: true },
      { name: "Joghurt", amount: "250g", category: "dairy", forSideDish: true },
      { name: "Dill oder Minze", amount: "frisch", category: "fresh", forSideDish: true },
    ],
    sideDish: "Großer Salat + Vollkorn-Bulgur",
    benefit: "Proteinreich, mediterrane Aromen, ausgewogene Makros",
    prepTime: 25,
    tags: ["proteinreich", "mediterran", "grillen"],
    preparationSteps: [
      { step: 1, title: "Marinade", description: "Hähnchen würfeln. In Schüssel: Olivenöl, Zitronensaft, geriebener Knoblauch, Paprika, Oregano/Thymian, Pfeffer, wenig Salz. 10-30 Min ziehen lassen.", duration: "5 Min", tip: "Mehr Marinierzeit = mehr Aroma" },
      { step: 2, title: "Bulgur kochen", description: "Bulgur mit heißem Wasser/Brühe aufkochen, dann quellen lassen. Mit Zitrone + Petersilie finishen.", duration: "10-12 Min" },
      { step: 3, title: "Dip zubereiten", description: "Joghurt + geriebene Gurke (ausdrücken!) + Knoblauch + Zitrone + Dill/Minze mischen.", duration: "3 Min", tip: "Gurke ausdrücken = kein wässriger Dip" },
      { step: 4, title: "Salat schneiden", description: "Tomate/Gurke/Paprika/Zwiebel schneiden. Dressing: Olivenöl + Zitrone, Pfeffer.", duration: "5 Min" },
      { step: 5, title: "Spieße braten", description: "Auf Spieße stecken oder als Stücke braten. Hohe Hitze, anbräunen lassen. Kerntemperatur 74°C.", duration: "8-12 Min", tip: "Nicht zu früh wenden: erst bräunen lassen → Geschmack (Maillard)" },
      { step: 6, title: "Anrichten", description: "Tellerregel: ½ Salat, ¼ Hähnchen, ¼ Bulgur, Dip daneben.", duration: "2 Min" },
    ],
  },
  {
    id: 102,
    day: 2,
    type: 'dinner',
    title: "Lachs mit Ratatouille",
    subtitle: "Französischer Klassiker",
    culturalOrigin: ["Französisch"],
    ingredients: [
      { name: "Lachsfilets", amount: "2 Stück (300-400g)", category: "protein" },
      { name: "Zucchini", amount: "1", category: "fresh" },
      { name: "Aubergine", amount: "1", category: "fresh" },
      { name: "Paprika", amount: "1-2", category: "fresh" },
      { name: "Zwiebel", amount: "1", category: "fresh" },
      { name: "Tomaten", amount: "2-3", category: "fresh" },
      { name: "Knoblauch", amount: "2-3 Zehen", category: "fresh" },
      { name: "Kräuter der Provence", amount: "1 TL", category: "extras" },
      { name: "Zitrone", amount: "1", category: "fresh" },
      { name: "Olivenöl", amount: "2-3 EL", category: "basics" },
      { name: "Kartoffeln", amount: "500-700g", category: "fresh", forSideDish: true },
    ],
    sideDish: "Ofenkartoffeln",
    benefit: "Omega-3 + viel Gemüse + komplexe Kohlenhydrate",
    prepTime: 35,
    tags: ["omega-3", "ofengericht", "französisch"],
    preparationSteps: [
      { step: 1, title: "Ofen vorheizen", description: "Ofen auf 200°C (Umluft 180-190°C) vorheizen.", duration: "2 Min" },
      { step: 2, title: "Kartoffeln vorbereiten", description: "Kartoffeln in Spalten schneiden, mit Olivenöl, wenig Salz, Pfeffer, Rosmarin/Thymian mischen. Auf Blech verteilen.", duration: "5 Min" },
      { step: 3, title: "Kartoffeln in den Ofen", description: "Kartoffeln 25-35 Min backen bis goldbraun.", duration: "25-35 Min" },
      { step: 4, title: "Ratatouille starten", description: "Zwiebel + Knoblauch in wenig Öl anschwitzen. Dann Paprika/Aubergine 5-7 Min, dann Zucchini 5 Min, dann Tomaten/Passata + Kräuter. Leise köcheln lassen.", duration: "20-25 Min", tip: "Ratatouille wird besser wenn sämig reduziert (nicht suppig)" },
      { step: 5, title: "Lachs vorbereiten", description: "Lachs sparsam salzen, pfeffern, mit Zitrone und Kräutern würzen.", duration: "2 Min" },
      { step: 6, title: "Lachs backen", description: "Lachs auf zweites Blech oder die letzten 12 Min zu den Kartoffeln legen. Kerntemperatur 63°C.", duration: "10-14 Min", tip: "Lachs bleibt saftiger wenn er nicht übergart (Thermometer = König)" },
      { step: 7, title: "Finish & Anrichten", description: "Ratatouille mit Zitronenzeste oder 1 TL Essig abrunden. Alles zusammen servieren.", duration: "2 Min" },
    ],
  },
  {
    id: 103,
    day: 3,
    type: 'dinner',
    title: "Gemüse-Wok",
    subtitle: "Asiatisch inspiriert",
    culturalOrigin: ["Asiatisch"],
    proteinOptions: ["Hähnchen", "Tofu", "Edamame"],
    ingredients: [
      { name: "Hähnchen oder Tofu", amount: "350-450g", category: "protein" },
      { name: "Edamame (optional)", amount: "150-200g TK", category: "legumes" },
      { name: "Brokkoli", amount: "1", category: "fresh" },
      { name: "Karotten", amount: "2", category: "fresh" },
      { name: "Paprika", amount: "1", category: "fresh" },
      { name: "Ingwer", amount: "1 Stück", category: "fresh" },
      { name: "Knoblauch", amount: "2 Zehen", category: "fresh" },
      { name: "Sojasauce", amount: "3-4 EL", category: "basics" },
      { name: "Sesam", amount: "optional", category: "extras" },
      { name: "Vollkornreis/Naturreis", amount: "150-180g", category: "grains", forSideDish: true },
    ],
    sideDish: "Vollkornreis",
    benefit: "Flexibles Protein + knackiges Gemüse + Vollkorn",
    prepTime: 20,
    tags: ["asiatisch", "flexibel", "wok"],
    preparationSteps: [
      { step: 1, title: "Reis starten", description: "Vollkornreis braucht länger (30-40 Min). Erst starten!", duration: "30-40 Min" },
      { step: 2, title: "Mise en place", description: "Gemüse in mundgerechte Stücke schneiden. Sauce bereit: Sojasauce + etwas Wasser + Ingwer + Knoblauch + optional Chili + Spritzer Zitrone/Limette.", duration: "10 Min", tip: "Wichtig: Alles vorbereiten bevor Wok heiß wird!" },
      { step: 3, title: "Protein anbraten", description: "Hähnchen: trocken tupfen, kurz in heißer Pfanne anbraten bis Farbe, dann rausnehmen. Tofu: gut ausdrücken, würfeln, optional mit 1 TL Stärke bestäuben, heiß anbraten, rausnehmen.", duration: "5-7 Min", tip: "Tofu mit Stärke = knuspriger" },
      { step: 4, title: "Gemüse braten", description: "In Reihenfolge (hart → weich): Karotte/Brokkoli zuerst, dann Paprika. Hohe Hitze, kurz, damit's knackig bleibt.", duration: "5-7 Min", tip: "Pfanne richtig heiß = Wok-Flavor statt Gemüse kochen" },
      { step: 5, title: "Alles zusammen", description: "Protein zurück in den Wok, Sauce rein, 1-2 Min glasieren lassen. Optional Sesam drüber.", duration: "2-3 Min", tip: "Sojasauce erst am Ende → weniger salz-lastig, mehr Aroma" },
      { step: 6, title: "Anrichten", description: "Nach Tellerregel mit Reis servieren.", duration: "2 Min" },
    ],
  },
  {
    id: 104,
    day: 4,
    type: 'dinner',
    title: "Feta-Nudeln",
    subtitle: "Mit Rucola",
    culturalOrigin: ["Vegetarisch", "Modern"],
    ingredients: [
      { name: "Vollkornpasta", amount: "160-220g", category: "grains" },
      { name: "Feta", amount: "120-180g", category: "dairy" },
      { name: "Knoblauch", amount: "2 Zehen", category: "fresh" },
      { name: "Zitrone", amount: "1 (Saft + Abrieb)", category: "fresh" },
      { name: "Rucola", amount: "100-150g", category: "fresh" },
      { name: "Kirschtomaten", amount: "200g (optional)", category: "fresh" },
      { name: "Olivenöl", amount: "2-3 EL", category: "basics" },
      { name: "Chili", amount: "optional", category: "extras" },
      { name: "Kichererbsen", amount: "1 Dose (optional)", category: "legumes", forSideDish: true },
    ],
    sideDish: "Optional: Kichererbsen für mehr Protein",
    benefit: "Schnell, vegetarisch, ballaststoffreich durch Vollkorn",
    prepTime: 20,
    tags: ["vegetarisch", "schnell", "pasta"],
    preparationSteps: [
      { step: 1, title: "Ofen vorheizen", description: "Ofen auf 200°C vorheizen.", duration: "2 Min" },
      { step: 2, title: "Blech vorbereiten", description: "Kirschtomaten + Knoblauch + 1-2 EL Olivenöl auf Blech verteilen. Feta in die Mitte legen.", duration: "3 Min" },
      { step: 3, title: "Backen", description: "20 Min backen bis Tomaten platzen und Feta weich ist.", duration: "20 Min" },
      { step: 4, title: "Pasta kochen", description: "Vollkornpasta kochen. Wichtig: 1 Tasse Nudelwasser aufheben!", duration: "10-12 Min", tip: "Nudelwasser ist dein Emulgator → cremiger ohne Sahne" },
      { step: 5, title: "Sauce bauen", description: "Feta + Tomaten zerdrücken, mit Zitronensaft + Nudelwasser cremig rühren. Optional Kichererbsen unterheben.", duration: "3 Min", tip: "Kein extra Salz (Feta ist salzig genug)" },
      { step: 6, title: "Finish", description: "Rucola erst ganz am Ende unterheben (sonst wird er matschig). Sofort servieren.", duration: "2 Min" },
    ],
  },
  {
    id: 105,
    day: 5,
    type: 'dinner',
    title: "Chicken Shawarma Bowl",
    subtitle: "Arabisch gewürzt",
    culturalOrigin: ["Arabisch"],
    ingredients: [
      { name: "Hähnchen", amount: "350-450g", category: "protein" },
      { name: "Kreuzkümmel", amount: "1 TL", category: "extras" },
      { name: "Paprika", amount: "1 TL", category: "extras" },
      { name: "Kurkuma", amount: "1/2 TL", category: "extras" },
      { name: "Knoblauch", amount: "2 Zehen", category: "fresh" },
      { name: "Zitrone", amount: "1", category: "fresh" },
      { name: "Vollkorn-Bulgur oder Reis", amount: "150-180g", category: "grains", forSideDish: true },
      { name: "Tomaten", amount: "2", category: "fresh", forSideDish: true },
      { name: "Gurke", amount: "1", category: "fresh", forSideDish: true },
      { name: "Rotkohl oder Salat", amount: "100g", category: "fresh", forSideDish: true },
      { name: "Joghurt", amount: "250g", category: "dairy", forSideDish: true },
      { name: "Petersilie", amount: "frisch", category: "fresh", forSideDish: true },
    ],
    sideDish: "Joghurt-Sauce + Vollkorn-Beilage",
    benefit: "Würzig, proteinreich, perfekte Bowl-Balance",
    prepTime: 25,
    tags: ["arabisch", "bowl", "würzig"],
    preparationSteps: [
      { step: 1, title: "Marinade", description: "Joghurt + Zitrone + Knoblauch + Kreuzkümmel + Paprika + Kurkuma + Pfeffer mischen. Hähnchen darin marinieren, 15-60 Min.", duration: "5 Min", tip: "Joghurt-Marinade macht Hähnchen zarter und schmeckt Street-Food, ohne fettig zu sein" },
      { step: 2, title: "Beilage kochen", description: "Vollkornbulgur oder Vollkornreis nach Packungsanweisung kochen.", duration: "15-25 Min" },
      { step: 3, title: "Hähnchen garen", description: "Pfanne: scharf anbraten, dann mittel fertig ziehen. ODER Ofen: 200°C, 18-25 Min (je nach Dicke). Kerntemperatur 74°C.", duration: "15-25 Min" },
      { step: 4, title: "Bowl-Gemüse", description: "Gurke/Tomate/Rotkohl schneiden.", duration: "5 Min" },
      { step: 5, title: "Sauce", description: "Joghurt + Zitrone + Knoblauch + optional Minze mischen.", duration: "3 Min" },
      { step: 6, title: "Anrichten", description: "Bowl aufbauen: Beilage, Gemüse, Hähnchen, Sauce. Optional eingelegte Zwiebeln.", duration: "3 Min" },
    ],
  },
  {
    id: 106,
    day: 6,
    type: 'dinner',
    title: "Kichererbsen-Ofenblech",
    subtitle: "Mit Tahini-Dip",
    culturalOrigin: ["Hülsenfrüchte", "Mediterran"],
    ingredients: [
      { name: "Kichererbsen", amount: "2 Dosen", category: "legumes" },
      { name: "Zucchini", amount: "1", category: "fresh" },
      { name: "Paprika", amount: "1", category: "fresh" },
      { name: "Rote Zwiebel", amount: "1", category: "fresh" },
      { name: "Karotten", amount: "2", category: "fresh" },
      { name: "Olivenöl", amount: "2-3 EL", category: "basics" },
      { name: "Paprika Gewürz", amount: "1 TL", category: "extras" },
      { name: "Kreuzkümmel", amount: "1 TL", category: "extras" },
      { name: "Joghurt", amount: "250g", category: "dairy", forSideDish: true },
      { name: "Tahini", amount: "2 EL", category: "basics", forSideDish: true },
      { name: "Zitrone", amount: "1", category: "fresh", forSideDish: true },
      { name: "Knoblauch", amount: "1 Zehe", category: "fresh", forSideDish: true },
      { name: "Vollkorn-Fladenbrot", amount: "optional", category: "grains", forSideDish: true },
    ],
    sideDish: "Joghurt-Tahini-Dip",
    benefit: "Pflanzliches Protein, ballaststoffreich, einfach",
    prepTime: 30,
    tags: ["vegetarisch", "hülsenfrüchte", "ofenblech"],
    preparationSteps: [
      { step: 1, title: "Ofen vorheizen", description: "Ofen auf 220°C vorheizen (für Röstaromen).", duration: "2 Min" },
      { step: 2, title: "Kichererbsen trocknen", description: "Kichererbsen abspülen, dann wirklich trocken tupfen!", duration: "3 Min", tip: "Trocken = röstig, nass = weich" },
      { step: 3, title: "Blech vorbereiten", description: "Kichererbsen + Gemüse aufs Blech, mit Olivenöl, Kreuzkümmel, Paprika, Pfeffer, wenig Salz mischen.", duration: "5 Min", tip: "Nicht überladenes Blech: lieber 2 Bleche als Dampfgarer" },
      { step: 4, title: "Backen", description: "25-35 Min backen, nach 15 Min einmal wenden.", duration: "25-35 Min" },
      { step: 5, title: "Tahini-Dip", description: "Joghurt + Tahini + Zitrone + Knoblauch + Wasser nach Bedarf (bis cremig) mischen.", duration: "3 Min" },
      { step: 6, title: "Finish", description: "Zitronensaft über das Blech, Kräuter (Petersilie) drüber wenn vorhanden. Mit Dip servieren.", duration: "2 Min" },
    ],
  },
  {
    id: 107,
    day: 7,
    type: 'dinner',
    title: "Rind-Kofta",
    subtitle: "Mit Ofengemüse",
    culturalOrigin: ["Albanisch", "Arabisch"],
    ingredients: [
      { name: "Rinderhack", amount: "350-450g", category: "protein" },
      { name: "Zwiebel", amount: "1 (fein gerieben)", category: "fresh" },
      { name: "Petersilie", amount: "1 Bund", category: "fresh" },
      { name: "Kreuzkümmel", amount: "1 TL", category: "extras" },
      { name: "Paprika Gewürz", amount: "1 TL", category: "extras" },
      { name: "Ei", amount: "1 (optional)", category: "protein" },
      { name: "Zucchini", amount: "1", category: "fresh", forSideDish: true },
      { name: "Paprika", amount: "1", category: "fresh", forSideDish: true },
      { name: "Zwiebel für Ofengemüse", amount: "1", category: "fresh", forSideDish: true },
      { name: "Joghurt", amount: "200-250g", category: "dairy", forSideDish: true },
      { name: "Zitrone", amount: "1", category: "fresh", forSideDish: true },
      { name: "Knoblauch", amount: "1 Zehe", category: "fresh", forSideDish: true },
      { name: "Vollkorn-Bulgur", amount: "optional, klein", category: "grains", forSideDish: true },
    ],
    sideDish: "Ofengemüse + Joghurt-Dip",
    benefit: "Hochwertiges Protein, aromatisch, ausgewogen",
    prepTime: 30,
    tags: ["fleisch", "kofta", "ofengericht"],
    preparationSteps: [
      { step: 1, title: "Ofen vorheizen", description: "Ofen auf 210°C vorheizen.", duration: "2 Min" },
      { step: 2, title: "Gemüse vorbereiten", description: "Gemüse schneiden, mit Öl + Gewürzen aufs Blech verteilen.", duration: "5 Min" },
      { step: 3, title: "Gemüse in den Ofen", description: "25-30 Min backen.", duration: "25-30 Min" },
      { step: 4, title: "Kofta-Masse", description: "Rinderhack + fein geriebene Zwiebel (ausdrücken!) + Petersilie + Kreuzkümmel + Paprika + Pfeffer + wenig Salz. Nur kurz mischen, nicht kneten wie Teig!", duration: "5 Min", tip: "Zwiebel ausdrücken → Kofta wird saftiger und fällt nicht auseinander" },
      { step: 5, title: "Formen", description: "Ovale Röllchen formen. Optional 10 Min kalt stellen (hält besser).", duration: "5 Min" },
      { step: 6, title: "Kofta braten", description: "In heißer Pfanne rundum bräunen, dann bei mittlerer Hitze fertig ziehen. Kerntemperatur 71°C.", duration: "10-12 Min", tip: "Nach dem Braten 2 Min ruhen lassen" },
      { step: 7, title: "Dip", description: "Joghurt + Zitrone + Knoblauch mischen.", duration: "2 Min" },
      { step: 8, title: "Anrichten", description: "Nach Tellerregel servieren: Gemüse, Kofta, Dip.", duration: "2 Min" },
    ],
  },
];

// Kombinierte Mahlzeiten
export const meals: Meal[] = [...breakfastMeals, ...dinnerMeals];

// ============================================
// EINKAUFSLISTEN
// ============================================

export const breakfastShoppingList: ShoppingItem[] = [
  // Frisches - Hauptgericht
  { name: "Avocados", amount: "3-4 Stück", category: "fresh", checked: false, mealType: "breakfast" },
  { name: "Paprika (Speca)", amount: "3-4 Stück", category: "fresh", checked: false, mealType: "breakfast" },
  { name: "Spinat", amount: "1 Bund/Packung", category: "fresh", checked: false, mealType: "breakfast" },
  { name: "Petersilie", amount: "1 Bund", category: "fresh", checked: false, mealType: "breakfast" },
  { name: "Dill", amount: "1 Bund", category: "fresh", checked: false, mealType: "breakfast" },
  { name: "Beeren", amount: "200g", category: "fresh", checked: false, mealType: "breakfast" },
  { name: "Äpfel", amount: "2 Stück", category: "fresh", checked: false, mealType: "breakfast" },
  { name: "Zucchini", amount: "1 Stück", category: "fresh", checked: false, mealType: "breakfast" },
  { name: "Aubergine", amount: "1 Stück", category: "fresh", checked: false, mealType: "breakfast" },
  { name: "Zwiebel", amount: "1 Stück", category: "fresh", checked: false, mealType: "breakfast" },
  { name: "Zitrone", amount: "2 Stück", category: "fresh", checked: false, mealType: "breakfast" },
  // Frisches - Beilagen
  { name: "Cherry-Tomaten", amount: "2 Packungen", category: "fresh", checked: false, mealType: "breakfast", forSideDish: true },
  { name: "Tomaten (groß)", amount: "3-4 Stück", category: "fresh", checked: false, mealType: "breakfast", forSideDish: true },
  { name: "Gurke", amount: "2 Stück", category: "fresh", checked: false, mealType: "breakfast", forSideDish: true },
  { name: "Minze", amount: "1 Bund", category: "fresh", checked: false, mealType: "breakfast", forSideDish: true },

  // Proteine - Hauptgericht
  { name: "Eier", amount: "12-16 Stück", category: "protein", checked: false, mealType: "breakfast" },
  { name: "Räucherlachs", amount: "100g", category: "protein", checked: false, mealType: "breakfast" },
  // Proteine - Beilagen
  { name: "Putenschinken", amount: "100g", category: "protein", checked: false, mealType: "breakfast", forSideDish: true },

  // Milchprodukte - Hauptgericht
  { name: "Skyr/Magerquark", amount: "500g", category: "dairy", checked: false, mealType: "breakfast" },
  { name: "Feta/Sirene", amount: "200g", category: "dairy", checked: false, mealType: "breakfast" },
  { name: "Frischkäse (leicht)", amount: "1 Packung", category: "dairy", checked: false, mealType: "breakfast" },
  // Milchprodukte - Beilagen
  { name: "Joghurt (natur)", amount: "500g", category: "dairy", checked: false, mealType: "breakfast", forSideDish: true },

  // Beilagen - alle für Beilagen
  { name: "Vollkorn-Toast", amount: "2 Packungen", category: "grains", checked: false, mealType: "breakfast" },
  { name: "Baguette", amount: "1 Stück", category: "grains", checked: false, mealType: "breakfast" },
  { name: "Wraps/Tortillas", amount: "1 Packung", category: "grains", checked: false, mealType: "breakfast" },

  // Basics - Hauptgericht
  { name: "Olivenöl", amount: "1 Flasche", category: "basics", checked: false, mealType: "both" },
  { name: "Ajvar", amount: "1 Glas", category: "basics", checked: false, mealType: "breakfast" },
  { name: "Tomatensauce", amount: "1 Dose/Glas", category: "basics", checked: false, mealType: "breakfast" },
  // Basics - Beilagen
  { name: "Oliven", amount: "1 Glas", category: "basics", checked: false, mealType: "breakfast", forSideDish: true },
  { name: "Dijon-Senf", amount: "1 Glas", category: "basics", checked: false, mealType: "breakfast", forSideDish: true },

  // Extras - alle für Hauptgerichte
  { name: "Walnüsse", amount: "100g", category: "extras", checked: false, mealType: "breakfast" },
  { name: "Honig", amount: "1 Glas", category: "extras", checked: false, mealType: "breakfast" },
  { name: "Pfeffer", amount: "1 Mühle", category: "extras", checked: false, mealType: "both" },
  { name: "Zimt", amount: "1 Dose", category: "extras", checked: false, mealType: "breakfast" },
  { name: "Thymian (getrocknet)", amount: "1 Dose", category: "extras", checked: false, mealType: "both" },
  { name: "Oregano", amount: "1 Dose", category: "extras", checked: false, mealType: "both" },
];

export const dinnerShoppingList: ShoppingItem[] = [
  // Fleisch/Fisch - Hauptgericht
  { name: "Hähnchenbrust", amount: "1.1-1.3 kg gesamt", category: "protein", checked: false, mealType: "dinner" },
  { name: "Rinderhack", amount: "350-450g", category: "protein", checked: false, mealType: "dinner" },
  { name: "Lachsfilets", amount: "2 Stück (300-400g)", category: "protein", checked: false, mealType: "dinner" },
  { name: "Tofu", amount: "300-400g (optional)", category: "protein", checked: false, mealType: "dinner" },

  // Hülsenfrüchte - Hauptgericht
  { name: "Kichererbsen (Dosen)", amount: "3 Dosen", category: "legumes", checked: false, mealType: "dinner" },
  { name: "Edamame (TK)", amount: "1 Packung (optional)", category: "legumes", checked: false, mealType: "dinner" },

  // Milchprodukte - Beilagen (Dips/Saucen)
  { name: "Joghurt (natur)", amount: "1.5-2 kg", category: "dairy", checked: false, mealType: "dinner", forSideDish: true },
  { name: "Feta", amount: "150-200g", category: "dairy", checked: false, mealType: "dinner" },

  // Gemüse/Salat - Hauptgericht
  { name: "Paprika", amount: "6-8 Stück", category: "fresh", checked: false, mealType: "dinner" },
  { name: "Zucchini", amount: "4-5 Stück", category: "fresh", checked: false, mealType: "dinner" },
  { name: "Aubergine", amount: "1 (optional)", category: "fresh", checked: false, mealType: "dinner" },
  { name: "Brokkoli", amount: "1", category: "fresh", checked: false, mealType: "dinner" },
  { name: "Karotten", amount: "6-8 Stück", category: "fresh", checked: false, mealType: "dinner" },
  { name: "Zwiebeln", amount: "6-8 Stück", category: "fresh", checked: false, mealType: "dinner" },
  { name: "Knoblauch", amount: "1 Knolle", category: "fresh", checked: false, mealType: "dinner" },
  { name: "Rucola", amount: "1-2 Packungen", category: "fresh", checked: false, mealType: "dinner" },
  { name: "Zitronen", amount: "6-8 Stück", category: "fresh", checked: false, mealType: "dinner" },
  { name: "Ingwer", amount: "1 Stück", category: "fresh", checked: false, mealType: "dinner" },
  // Gemüse/Salat - Beilagen
  { name: "Tomaten", amount: "8-10 Stück", category: "fresh", checked: false, mealType: "dinner", forSideDish: true },
  { name: "Gurken", amount: "3-4 Stück", category: "fresh", checked: false, mealType: "dinner", forSideDish: true },
  { name: "Rotkohl oder Salat", amount: "1", category: "fresh", checked: false, mealType: "dinner", forSideDish: true },
  { name: "Kartoffeln", amount: "1 kg", category: "fresh", checked: false, mealType: "dinner", forSideDish: true },
  { name: "Petersilie", amount: "2 Bund", category: "fresh", checked: false, mealType: "dinner", forSideDish: true },
  { name: "Dill/Minze", amount: "1 Bund", category: "fresh", checked: false, mealType: "dinner", forSideDish: true },

  // Beilagen (Vollkorn) - alle für Beilagen
  { name: "Vollkorn-Bulgur", amount: "500g", category: "grains", checked: false, mealType: "dinner", forSideDish: true },
  { name: "Vollkornreis/Naturreis", amount: "500g", category: "grains", checked: false, mealType: "dinner", forSideDish: true },
  { name: "Vollkornpasta", amount: "500g", category: "grains", checked: false, mealType: "dinner" },
  { name: "Vollkorn-Fladenbrot", amount: "optional", category: "grains", checked: false, mealType: "dinner", forSideDish: true },

  // Basics - Beilagen (Dips/Saucen)
  { name: "Tahini", amount: "1 Glas", category: "basics", checked: false, mealType: "dinner", forSideDish: true },
  { name: "Sojasauce", amount: "1 Flasche", category: "basics", checked: false, mealType: "dinner" },

  // Extras/Gewürze - Hauptgericht
  { name: "Kreuzkümmel", amount: "1 Dose", category: "extras", checked: false, mealType: "dinner" },
  { name: "Paprika edelsüß", amount: "1 Dose", category: "extras", checked: false, mealType: "dinner" },
  { name: "Kurkuma", amount: "1 Dose", category: "extras", checked: false, mealType: "dinner" },
  { name: "Kräuter der Provence", amount: "1 Dose", category: "extras", checked: false, mealType: "dinner" },
  { name: "Chili", amount: "optional", category: "extras", checked: false, mealType: "dinner" },
  { name: "Sesam", amount: "optional", category: "extras", checked: false, mealType: "dinner" },
];

// ============================================
// VEREINHEITLICHTE EINKAUFSLISTE
// Alle Zutaten für 7 Tage Frühstück + Abendessen kombiniert
// ============================================

export const unifiedShoppingList: ShoppingItem[] = [
  // === FRISCHES GEMÜSE & OBST ===
  // Hauptzutaten
  { name: "Avocados", amount: "3-4 Stück", category: "fresh", checked: false },
  { name: "Paprika (gemischt)", amount: "8-10 Stück", category: "fresh", checked: false }, // Frühstück + Abendessen
  { name: "Zucchini", amount: "5-6 Stück", category: "fresh", checked: false }, // Frühstück + Abendessen
  { name: "Aubergine", amount: "1-2 Stück", category: "fresh", checked: false }, // Frühstück + Abendessen
  { name: "Spinat", amount: "1-2 Packungen", category: "fresh", checked: false },
  { name: "Brokkoli", amount: "1 Stück", category: "fresh", checked: false },
  { name: "Karotten", amount: "6-8 Stück", category: "fresh", checked: false },
  { name: "Zwiebeln", amount: "7-9 Stück", category: "fresh", checked: false }, // Frühstück + Abendessen
  { name: "Knoblauch", amount: "1-2 Knollen", category: "fresh", checked: false },
  { name: "Rucola", amount: "1-2 Packungen", category: "fresh", checked: false },
  { name: "Ingwer", amount: "1 Stück", category: "fresh", checked: false },
  { name: "Beeren (frisch/TK)", amount: "200g", category: "fresh", checked: false },
  { name: "Äpfel", amount: "2 Stück", category: "fresh", checked: false },
  { name: "Zitronen", amount: "8-10 Stück", category: "fresh", checked: false }, // Frühstück + Abendessen
  // Kräuter
  { name: "Petersilie", amount: "3 Bund", category: "fresh", checked: false }, // Frühstück + Abendessen
  { name: "Dill", amount: "2 Bund", category: "fresh", checked: false }, // Frühstück + Abendessen
  { name: "Minze", amount: "1-2 Bund", category: "fresh", checked: false }, // Frühstück + Abendessen
  { name: "Thymian/Oregano (frisch)", amount: "1 Bund", category: "fresh", checked: false },
  // Beilagen/Salat
  { name: "Tomaten (groß)", amount: "10-12 Stück", category: "fresh", checked: false, forSideDish: true }, // Frühstück + Abendessen
  { name: "Cherry-Tomaten", amount: "2 Packungen", category: "fresh", checked: false, forSideDish: true },
  { name: "Gurken", amount: "4-5 Stück", category: "fresh", checked: false, forSideDish: true }, // Frühstück + Abendessen
  { name: "Rotkohl oder Salat", amount: "1 Stück", category: "fresh", checked: false, forSideDish: true },
  { name: "Kartoffeln", amount: "1 kg", category: "fresh", checked: false, forSideDish: true },

  // === FLEISCH & FISCH ===
  // Hauptzutaten
  { name: "Eier", amount: "12-18 Stück", category: "protein", checked: false },
  { name: "Hähnchenbrust", amount: "1.1-1.3 kg", category: "protein", checked: false },
  { name: "Rinderhack", amount: "350-450g", category: "protein", checked: false },
  { name: "Lachsfilets", amount: "2 Stück (300-400g)", category: "protein", checked: false },
  { name: "Räucherlachs", amount: "100g", category: "protein", checked: false },
  { name: "Tofu (optional)", amount: "300-400g", category: "protein", checked: false },
  // Beilagen
  { name: "Putenschinken", amount: "100g", category: "protein", checked: false, forSideDish: true },

  // === MILCHPRODUKTE ===
  // Hauptzutaten
  { name: "Skyr/Magerquark", amount: "500g", category: "dairy", checked: false },
  { name: "Feta/Sirene", amount: "350-400g", category: "dairy", checked: false }, // Frühstück + Abendessen
  { name: "Frischkäse (leicht)", amount: "1 Packung", category: "dairy", checked: false },
  // Beilagen/Dips
  { name: "Joghurt (natur)", amount: "2-2.5 kg", category: "dairy", checked: false, forSideDish: true }, // Frühstück + Abendessen kombiniert

  // === HÜLSENFRÜCHTE ===
  { name: "Kichererbsen (Dosen)", amount: "3 Dosen", category: "legumes", checked: false },
  { name: "Edamame (TK, optional)", amount: "1 Packung", category: "legumes", checked: false },

  // === BEILAGEN & VOLLKORN ===
  // Frühstück
  { name: "Vollkorn-Toast", amount: "2 Packungen", category: "grains", checked: false },
  { name: "Baguette", amount: "1 Stück", category: "grains", checked: false },
  { name: "Wraps/Tortillas", amount: "1 Packung", category: "grains", checked: false },
  // Abendessen
  { name: "Vollkorn-Bulgur", amount: "500g", category: "grains", checked: false, forSideDish: true },
  { name: "Vollkornreis/Naturreis", amount: "500g", category: "grains", checked: false, forSideDish: true },
  { name: "Vollkornpasta", amount: "500g", category: "grains", checked: false },
  { name: "Vollkorn-Fladenbrot (optional)", amount: "1 Packung", category: "grains", checked: false, forSideDish: true },

  // === BASICS & SAUCEN ===
  { name: "Olivenöl", amount: "1 Flasche", category: "basics", checked: false },
  { name: "Ajvar", amount: "1 Glas", category: "basics", checked: false },
  { name: "Tomatensauce", amount: "1 Dose/Glas", category: "basics", checked: false },
  { name: "Tahini", amount: "1 Glas", category: "basics", checked: false, forSideDish: true },
  { name: "Sojasauce", amount: "1 Flasche", category: "basics", checked: false },
  // Beilagen
  { name: "Oliven", amount: "1 Glas", category: "basics", checked: false, forSideDish: true },
  { name: "Dijon-Senf", amount: "1 Glas", category: "basics", checked: false, forSideDish: true },

  // === GEWÜRZE & EXTRAS ===
  { name: "Walnüsse", amount: "100g", category: "extras", checked: false },
  { name: "Honig", amount: "1 Glas", category: "extras", checked: false },
  { name: "Pfeffer (Mühle)", amount: "1 Stück", category: "extras", checked: false },
  { name: "Zimt", amount: "1 Dose", category: "extras", checked: false },
  { name: "Kreuzkümmel", amount: "1 Dose", category: "extras", checked: false },
  { name: "Paprika edelsüß", amount: "1 Dose", category: "extras", checked: false },
  { name: "Kurkuma", amount: "1 Dose", category: "extras", checked: false },
  { name: "Thymian (getrocknet)", amount: "1 Dose", category: "extras", checked: false },
  { name: "Oregano (getrocknet)", amount: "1 Dose", category: "extras", checked: false },
  { name: "Kräuter der Provence", amount: "1 Dose", category: "extras", checked: false },
  { name: "Chili (optional)", amount: "1 Dose", category: "extras", checked: false },
  { name: "Sesam (optional)", amount: "1 Packung", category: "extras", checked: false },
];

// Legacy exports für Kompatibilität (nicht mehr für Filter verwendet)
export const shoppingList: ShoppingItem[] = unifiedShoppingList;

// ============================================
// KATEGORIEN & LABELS
// ============================================

export const categoryLabels: Record<string, string> = {
  fresh: "Frisches Gemüse & Obst",
  protein: "Fleisch & Fisch",
  dairy: "Milchprodukte",
  legumes: "Hülsenfrüchte",
  grains: "Beilagen & Vollkorn",
  basics: "Basics & Saucen",
  extras: "Gewürze & Extras",
};

export const mealTypeLabels: Record<string, string> = {
  breakfast: "Frühstück",
  dinner: "Abendessen",
};

export const principles = [
  { icon: "💪", title: "Protein-reich", description: "Eier, Joghurt, Fisch, Fleisch" },
  { icon: "🥬", title: "Gemüse/Obst täglich", description: "Farben auf dem Teller" },
  { icon: "🌾", title: "Vollkorn-Standard", description: "Bulgur, Naturreis, Pasta" },
  { icon: "🥑", title: "Bewusste Fette", description: "Olivenöl, Avocado, Nüsse" },
  { icon: "🫘", title: "Hülsenfrüchte 1x/Woche", description: "Kichererbsen, Edamame" },
  { icon: "🐟", title: "Fisch 1x/Woche", description: "Omega-3 für Gehirn & Herz" },
  { icon: "🍖", title: "Rotes Fleisch max 1x", description: "Qualität vor Quantität" },
  { icon: "📐", title: "Portions-Rule", description: "½ Gemüse · ¼ Protein · ¼ Beilage" },
];

// Portions-Rule Info
export const portionsRule = {
  title: "Portions-Rule",
  description: "Pro Teller: ½ Gemüse · ¼ Protein · ¼ Beilage",
  note: "Kartoffeln zählen als Beilage, nicht als Gemüse",
};
