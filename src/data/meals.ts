import { Meal, ShoppingItem, PreparationStep } from '@/types';

// ============================================
// FRÜHSTÜCK (Breakfast) - 7 Tage
// Evidenzbasiert: Protein + Ballaststoffe + gesunde Fette
// Mengen für 2 Personen
// ============================================

export const breakfastMeals: Meal[] = [
  {
    id: 1,
    day: 1,
    type: 'breakfast',
    title: "Avocado-Ei-Toast",
    subtitle: "Modern meets Albanisch",
    culturalOrigin: ["Modern", "Albanisch"],
    ingredients: [
      { name: "Vollkorn-Toast", amount: "2-4 Scheiben", category: "grains" },
      { name: "Avocado", amount: "1 reif", category: "fresh" },
      { name: "Eier", amount: "2-4", category: "protein" },
      { name: "Zitrone", amount: "1", category: "fresh" },
      { name: "Pfeffer", amount: "nach Geschmack", category: "extras" },
      { name: "Chili", amount: "optional", category: "extras" },
      { name: "Tomaten", amount: "2", category: "fresh", forSideDish: true },
      { name: "Gurke", amount: "1", category: "fresh", forSideDish: true },
    ],
    sideDish: "Tomaten-Gurken-Salat mit Zitrone",
    benefit: "Avocado liefert einfach ungesättigte Fettsäuren (MUFA), die laut Studien LDL-Cholesterin senken. Eier = vollständiges Aminosäureprofil mit ~6g Protein/Ei.",
    prepTime: 10,
    tags: ["vegetarisch", "omega-fette", "proteinreich"],
    preparationSteps: [
      { step: 1, title: "Toast rösten", description: "Vollkorn-Toast im Toaster goldbraun rösten.", duration: "2-3 Min" },
      { step: 2, title: "Avocado zerdrücken", description: "Avocado in einer Schüssel zerdrücken. Zitronensaft + Pfeffer hinzufügen, Salz nur sparsam verwenden.", duration: "2 Min", tip: "Zitronensäure verhindert enzymatische Bräunung (Oxidation) und verstärkt den Geschmack ohne Salz." },
      { step: 3, title: "Eier braten", description: "Eier als Spiegelei braten oder als Rührei zubereiten. Bei mittlerer Hitze für zartes Ergebnis.", duration: "3-5 Min" },
      { step: 4, title: "Salat anmachen", description: "Tomaten und Gurke in Scheiben schneiden. Mit Zitronensaft (oder 1 TL Olivenöl) anmachen.", duration: "3 Min" },
      { step: 5, title: "Anrichten", description: "Toast mit Avocado bestreichen, Ei obendrauf. Optional: Chili für Kick.", duration: "1 Min", typicalMistake: "Zu viel Salz auf Avocado → Kombination mit salzigen Dips/Oliven später wird zur Salzfalle." },
    ],
  },
  {
    id: 2,
    day: 2,
    type: 'breakfast',
    title: "Shakshuka",
    subtitle: "Arabischer Klassiker",
    culturalOrigin: ["Arabisch", "Nordafrikanisch"],
    ingredients: [
      { name: "Zwiebel", amount: "1", category: "fresh" },
      { name: "Paprika", amount: "1", category: "fresh" },
      { name: "Knoblauch", amount: "2-3 Zehen", category: "fresh" },
      { name: "Tomaten (Dose)", amount: "1 Dose (400g)", category: "basics" },
      { name: "Eier", amount: "4", category: "protein" },
      { name: "Kreuzkümmel", amount: "1 TL", category: "extras" },
      { name: "Paprika Gewürz", amount: "1 TL", category: "extras" },
      { name: "Pfeffer", amount: "nach Geschmack", category: "extras" },
      { name: "Chili", amount: "optional", category: "extras" },
      { name: "Petersilie", amount: "frisch", category: "fresh" },
      { name: "Vollkornbrot", amount: "2-4 Scheiben", category: "grains", forSideDish: true },
    ],
    sideDish: "Vollkornbrot zum Dippen",
    benefit: "Lycopin aus gekochten Tomaten ist 4x bioverfügbarer als roh (Studie: Journal of Agricultural Chemistry). Eier liefern Cholin für Gehirnfunktion.",
    prepTime: 20,
    tags: ["proteinreich", "mediterran", "herzhaft"],
    preparationSteps: [
      { step: 1, title: "Gemüse anbraten", description: "Zwiebel + Paprika würfeln und in wenig Öl 5-7 Min anschwitzen bis weich.", duration: "5-7 Min" },
      { step: 2, title: "Knoblauch hinzufügen", description: "Knoblauch fein hacken und nur 30 Sekunden mitbraten.", duration: "30 Sek", tip: "Knoblauch verbrennt schnell bei hoher Hitze → bitter. Immer als letztes zum Gemüse." },
      { step: 3, title: "Tomatensauce kochen", description: "Dosentomaten + Kreuzkümmel + Paprikapulver + Pfeffer hinzufügen. 8-10 Min einkochen bis sämig.", duration: "8-10 Min", tip: "Sauce erst sämig reduzieren → konzentrierter Geschmack. Zu sauer? 1 Prise Zucker neutralisiert." },
      { step: 4, title: "Mulden für Eier", description: "Mit einem Löffel 4 Mulden in die Sauce drücken.", duration: "1 Min" },
      { step: 5, title: "Eier pochieren", description: "Eier vorsichtig in die Mulden gleiten lassen. Deckel drauf und 5-7 Min garen (je nach gewünschter Eigelb-Konsistenz).", duration: "5-7 Min", typicalMistake: "Eier zu früh in wässrige Sauce → werden zäh und Sauce bleibt dünn." },
      { step: 6, title: "Servieren", description: "Mit frischer Petersilie garnieren. Mit Vollkornbrot servieren.", duration: "1 Min" },
    ],
  },
  {
    id: 3,
    day: 3,
    type: 'breakfast',
    title: "Kräuter-Omelette",
    subtitle: "Französische Technik",
    culturalOrigin: ["Französisch"],
    ingredients: [
      { name: "Eier", amount: "4", category: "protein" },
      { name: "Schnittlauch", amount: "frisch", category: "fresh" },
      { name: "Petersilie", amount: "frisch", category: "fresh" },
      { name: "Dill", amount: "frisch", category: "fresh" },
      { name: "Butter oder Öl", amount: "1 TL", category: "basics" },
      { name: "Pfeffer", amount: "nach Geschmack", category: "extras" },
      { name: "Tomate", amount: "1", category: "fresh", forSideDish: true },
      { name: "Gurke", amount: "1", category: "fresh", forSideDish: true },
      { name: "Vollkornbrot", amount: "2 Scheiben", category: "grains", forSideDish: true },
    ],
    sideDish: "Rohkost (Tomate + Gurke) + Vollkornbrot",
    benefit: "Kräuter liefern Polyphenole und Antioxidantien. Französische Omelette-Technik (niedrige Hitze) = zarter, nicht gummiartiger Textur.",
    prepTime: 10,
    tags: ["proteinreich", "low-carb-option", "kräuter"],
    preparationSteps: [
      { step: 1, title: "Eier verquirlen", description: "Eier in Schüssel verquirlen. Frische Kräuter fein hacken und unterrühren. Nur pfeffern, Salz sparsam.", duration: "2 Min" },
      { step: 2, title: "Pfanne vorbereiten", description: "Pfanne auf MITTLERE Hitze stellen. Butter oder Öl hineingeben.", duration: "1 Min", tip: "Mittlere Hitze ist das Geheimnis der französischen Omelette-Technik → zart statt trocken." },
      { step: 3, title: "Omelette stocken lassen", description: "Eier in die Pfanne geben. Langsam stocken lassen, dabei mit Spatel vom Rand zur Mitte schieben.", duration: "2-3 Min" },
      { step: 4, title: "Zusammenklappen", description: "Omelette zur Hälfte zusammenklappen. Noch 30-60 Sekunden ziehen lassen.", duration: "30-60 Sek", typicalMistake: "Zu hohe Hitze → Omelette wird trocken, krümelig und verliert die cremige Textur." },
      { step: 5, title: "Rohkost vorbereiten", description: "Tomate und Gurke in Scheiben schneiden.", duration: "2 Min" },
      { step: 6, title: "Servieren", description: "Omelette mit Rohkost und Vollkornbrot anrichten.", duration: "1 Min" },
    ],
  },
  {
    id: 4,
    day: 4,
    type: 'breakfast',
    title: "Asiatische Reis-Bowl",
    subtitle: "Perfekt mit Reis-Rest",
    culturalOrigin: ["Asiatisch", "Japanisch"],
    ingredients: [
      { name: "Naturreis (gekocht)", amount: "2-3 Tassen", category: "grains" },
      { name: "Eier", amount: "2-4", category: "protein" },
      { name: "Gurke", amount: "1", category: "fresh" },
      { name: "Sojasauce", amount: "2-3 EL", category: "basics" },
      { name: "Sesam", amount: "optional", category: "extras" },
      { name: "Frühlingszwiebel", amount: "optional", category: "fresh" },
      { name: "Chili", amount: "optional", category: "extras" },
    ],
    sideDish: "Gurke als frische Komponente",
    benefit: "Naturreis hat 3x mehr Ballaststoffe als weißer Reis. Reisreste = praktisch + resistente Stärke (präbiotisch, gut für Darmmikrobiom).",
    prepTime: 12,
    tags: ["schnell", "meal-prep-freundlich", "asiatisch"],
    preparationSteps: [
      { step: 1, title: "Eier kochen", description: "Eier 7-9 Min kochen (7 Min = weich, 9 Min = wachsweich). Abschrecken und schälen.", duration: "7-9 Min", tip: "Abschrecken mit kaltem Wasser stoppt den Garprozess und erleichtert das Schälen." },
      { step: 2, title: "Reis erwärmen", description: "Reis im Topf oder in der Mikrowelle erwärmen.", duration: "2-3 Min" },
      { step: 3, title: "Gemüse schneiden", description: "Gurke in dünne Scheiben schneiden. Optional: Frühlingszwiebel in Ringe.", duration: "2 Min" },
      { step: 4, title: "Sauce verdünnen", description: "Sojasauce mit 1-2 EL Wasser verdünnen.", duration: "30 Sek", tip: "Verdünnte Sojasauce = weniger Natrium bei gleichem Umami-Geschmack. Mehr Kontrolle über Salzgehalt." },
      { step: 5, title: "Bowl zusammenstellen", description: "Reis in Schüssel, Gurkenscheiben daneben, halbierte Eier obendrauf. Verdünnte Sojasauce darüber.", duration: "2 Min", typicalMistake: "Zu viel unverdünnte Sojasauce → übersalzen, alles schmeckt gleich." },
      { step: 6, title: "Topping", description: "Optional mit Sesam und Frühlingszwiebel garnieren.", duration: "30 Sek" },
    ],
  },
  {
    id: 5,
    day: 5,
    type: 'breakfast',
    title: "Quark-Toast mit Kräutern",
    subtitle: "Deutsch-Albanisch Gjizë-Style",
    culturalOrigin: ["Deutsch", "Albanisch"],
    ingredients: [
      { name: "Magerquark", amount: "250-300g", category: "dairy" },
      { name: "Zitrone", amount: "1", category: "fresh" },
      { name: "Dill", amount: "frisch", category: "fresh" },
      { name: "Petersilie", amount: "frisch", category: "fresh" },
      { name: "Pfeffer", amount: "nach Geschmack", category: "extras" },
      { name: "Vollkornbrot", amount: "2-4 Scheiben", category: "grains" },
      { name: "Tomaten", amount: "2", category: "fresh", forSideDish: true },
      { name: "Gurke", amount: "1", category: "fresh", forSideDish: true },
      { name: "Oliven", amount: "Handvoll", category: "basics", forSideDish: true },
    ],
    sideDish: "Tomaten + Gurke + Oliven",
    benefit: "Quark = 12g Protein pro 100g bei nur 0.2g Fett. Kasein-Protein für langsame Freisetzung → länger satt.",
    prepTime: 8,
    tags: ["proteinreich", "schnell", "vegetarisch"],
    preparationSteps: [
      { step: 1, title: "Quark würzen", description: "Quark in Schüssel geben. Zitronensaft + fein gehackte Kräuter (Dill, Petersilie) + Pfeffer unterrühren. Salz nur sparsam.", duration: "2 Min", tip: "Zitrone + Kräuter = frischer Geschmack wie 'Urlaub am Mittelmeer', ohne auf Salz angewiesen zu sein." },
      { step: 2, title: "Brot toasten", description: "Vollkornbrot toasten bis goldbraun.", duration: "2-3 Min" },
      { step: 3, title: "Gemüse schneiden", description: "Tomaten in Scheiben, Gurke in Stücke schneiden.", duration: "2 Min" },
      { step: 4, title: "Zusammenstellen", description: "Quark großzügig auf Toast verteilen. Tomatenscheiben darauf legen.", duration: "1 Min", typicalMistake: "Quark ohne Säure/Kräuter schmeckt fade → man greift zu Salz. Immer aromatisieren!" },
      { step: 5, title: "Servieren", description: "Mit Gurke und Oliven als Beilage servieren.", duration: "1 Min" },
    ],
  },
  {
    id: 6,
    day: 6,
    type: 'breakfast',
    title: "Lachs-Skyr-Toast",
    subtitle: "Clean Omega-3 Power",
    culturalOrigin: ["Deutsch", "Skandinavisch"],
    ingredients: [
      { name: "Räucherlachs", amount: "150-200g", category: "protein" },
      { name: "Skyr oder Quark", amount: "250g", category: "dairy" },
      { name: "Zitrone", amount: "1", category: "fresh" },
      { name: "Dill", amount: "frisch", category: "fresh" },
      { name: "Pfeffer", amount: "nach Geschmack", category: "extras" },
      { name: "Vollkornbrot", amount: "2-4 Scheiben", category: "grains" },
      { name: "Gurke", amount: "1", category: "fresh", forSideDish: true },
    ],
    sideDish: "Gurkenscheiben",
    benefit: "Lachs = 1.5-2g Omega-3 (EPA/DHA) pro 100g. AHA empfiehlt 2x Fisch/Woche für Herzgesundheit. Skyr statt Butter = cleaner.",
    prepTime: 8,
    tags: ["omega-3", "proteinreich", "brain-food"],
    preparationSteps: [
      { step: 1, title: "Skyr-Creme zubereiten", description: "Skyr/Quark mit Zitronensaft + fein gehacktem Dill + Pfeffer verrühren.", duration: "2 Min", tip: "Skyr/Quark statt Butter oder Mayo = gleicher cremiger Genuss, deutlich weniger gesättigte Fette." },
      { step: 2, title: "Brot toasten", description: "Vollkornbrot toasten.", duration: "2-3 Min" },
      { step: 3, title: "Zusammenstellen", description: "Skyr-Creme auf Toast verteilen. Räucherlachs darauf drapieren.", duration: "2 Min" },
      { step: 4, title: "Gurke schneiden", description: "Gurke in Scheiben schneiden als frische Beilage.", duration: "1 Min" },
      { step: 5, title: "Servieren", description: "Mit Gurkenscheiben servieren.", duration: "30 Sek", typicalMistake: "Extra Salz auf Lachs → unnötig, da Räucherlachs bereits salzhaltig ist (1-3g Salz/100g)." },
    ],
  },
  {
    id: 7,
    day: 7,
    type: 'breakfast',
    title: "Overnight Oats",
    subtitle: "Low-Sugar + herzhafte Option",
    culturalOrigin: ["International", "Modern"],
    ingredients: [
      { name: "Haferflocken", amount: "80-100g", category: "grains" },
      { name: "Milch oder Joghurt", amount: "300-400ml", category: "dairy" },
      { name: "Apfel oder Beeren", amount: "1 Apfel / 100g Beeren", category: "fresh" },
      { name: "Walnüsse", amount: "Handvoll", category: "extras" },
      { name: "Leinsamen", amount: "1 EL", category: "extras" },
      { name: "Zimt", amount: "1/2 TL", category: "extras" },
      { name: "Ei (gekocht)", amount: "1-2 optional", category: "protein", forSideDish: true },
      { name: "Gurke oder Tomate", amount: "optional", category: "fresh", forSideDish: true },
    ],
    sideDish: "Optional: gekochtes Ei oder Gemüse für herzhafte Variante",
    benefit: "Hafer-Beta-Glucan senkt LDL-Cholesterin (EFSA-bestätigt bei 3g/Tag). Overnight = resistente Stärke → präbiotisch für Darmgesundheit.",
    prepTime: 5,
    tags: ["meal-prep", "ballaststoffreich", "schnell"],
    preparationSteps: [
      { step: 1, title: "Abends vorbereiten", description: "Haferflocken + Milch/Joghurt + Zimt + Leinsamen in ein Glas geben. Gut umrühren.", duration: "2 Min", tip: "Abends 2 Min investieren → morgens 0 Aufwand. Meal-Prep-Effizienz." },
      { step: 2, title: "Über Nacht kühlen", description: "Glas abdecken und über Nacht (mind. 6h) im Kühlschrank quellen lassen.", duration: "6-8 Std" },
      { step: 3, title: "Morgens: Obst schneiden", description: "Apfel würfeln oder Beeren waschen.", duration: "1-2 Min" },
      { step: 4, title: "Topping", description: "Obst und Walnüsse auf die Oats geben.", duration: "30 Sek" },
      { step: 5, title: "Herzhafte Variante", description: "Optional: gekochtes Ei und/oder Gurkenscheiben als Side für mehr Protein und Sättigung.", duration: "1 Min", typicalMistake: "Honig/Zucker draufkippen → macht's zur Dessertbombe. Obst liefert genug natürliche Süße." },
    ],
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
  // === FRISCHES GEMÜSE & OBST ===
  // Hauptzutaten
  { name: "Avocado", amount: "1 Stück", category: "fresh", checked: false, mealType: "breakfast" },
  { name: "Zwiebel", amount: "1 Stück", category: "fresh", checked: false, mealType: "breakfast" },
  { name: "Paprika", amount: "1 Stück", category: "fresh", checked: false, mealType: "breakfast" },
  { name: "Knoblauch", amount: "1 Knolle", category: "fresh", checked: false, mealType: "breakfast" },
  { name: "Zitronen", amount: "5-6 Stück", category: "fresh", checked: false, mealType: "breakfast" },
  { name: "Äpfel oder Beeren", amount: "2 Äpfel / 200g Beeren", category: "fresh", checked: false, mealType: "breakfast" },
  // Kräuter
  { name: "Petersilie", amount: "2 Bund", category: "fresh", checked: false, mealType: "breakfast" },
  { name: "Dill", amount: "2 Bund", category: "fresh", checked: false, mealType: "breakfast" },
  { name: "Schnittlauch", amount: "1 Bund", category: "fresh", checked: false, mealType: "breakfast" },
  { name: "Frühlingszwiebel", amount: "1 Bund (optional)", category: "fresh", checked: false, mealType: "breakfast" },
  // Beilagen/Salat
  { name: "Tomaten", amount: "6-8 Stück", category: "fresh", checked: false, mealType: "breakfast", forSideDish: true },
  { name: "Gurken", amount: "5-6 Stück", category: "fresh", checked: false, mealType: "breakfast", forSideDish: true },

  // === PROTEINE ===
  { name: "Eier", amount: "18-24 Stück", category: "protein", checked: false, mealType: "breakfast" },
  { name: "Räucherlachs", amount: "150-200g", category: "protein", checked: false, mealType: "breakfast" },

  // === MILCHPRODUKTE ===
  { name: "Magerquark", amount: "500-600g", category: "dairy", checked: false, mealType: "breakfast" },
  { name: "Skyr oder Quark", amount: "250g", category: "dairy", checked: false, mealType: "breakfast" },
  { name: "Milch oder Joghurt", amount: "400ml", category: "dairy", checked: false, mealType: "breakfast" },

  // === BEILAGEN & VOLLKORN ===
  { name: "Vollkorn-Toast/Brot", amount: "2 Packungen", category: "grains", checked: false, mealType: "breakfast" },
  { name: "Haferflocken", amount: "100g", category: "grains", checked: false, mealType: "breakfast" },
  { name: "Naturreis (gekocht)", amount: "2-3 Tassen", category: "grains", checked: false, mealType: "breakfast" },

  // === BASICS & SAUCEN ===
  { name: "Olivenöl", amount: "1 Flasche", category: "basics", checked: false, mealType: "both" },
  { name: "Butter", amount: "1 Stück (klein)", category: "basics", checked: false, mealType: "breakfast" },
  { name: "Tomaten (Dose)", amount: "1 Dose (400g)", category: "basics", checked: false, mealType: "breakfast" },
  { name: "Sojasauce", amount: "1 Flasche", category: "basics", checked: false, mealType: "breakfast" },
  // Beilagen
  { name: "Oliven", amount: "1 Glas", category: "basics", checked: false, mealType: "breakfast", forSideDish: true },

  // === GEWÜRZE & EXTRAS ===
  { name: "Pfeffer (Mühle)", amount: "1 Stück", category: "extras", checked: false, mealType: "both" },
  { name: "Kreuzkümmel", amount: "1 Dose", category: "extras", checked: false, mealType: "breakfast" },
  { name: "Paprika Gewürz", amount: "1 Dose", category: "extras", checked: false, mealType: "breakfast" },
  { name: "Chili (optional)", amount: "1 Dose", category: "extras", checked: false, mealType: "breakfast" },
  { name: "Zimt", amount: "1 Dose", category: "extras", checked: false, mealType: "breakfast" },
  { name: "Sesam (optional)", amount: "1 Packung", category: "extras", checked: false, mealType: "breakfast" },
  { name: "Walnüsse", amount: "100g", category: "extras", checked: false, mealType: "breakfast" },
  { name: "Leinsamen", amount: "1 Packung", category: "extras", checked: false, mealType: "breakfast" },
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
  { name: "Avocado", amount: "1 Stück", category: "fresh", checked: false },
  { name: "Paprika (gemischt)", amount: "7-9 Stück", category: "fresh", checked: false }, // Frühstück + Abendessen
  { name: "Zucchini", amount: "4-5 Stück", category: "fresh", checked: false }, // Abendessen
  { name: "Aubergine", amount: "1 Stück", category: "fresh", checked: false }, // Abendessen
  { name: "Brokkoli", amount: "1 Stück", category: "fresh", checked: false },
  { name: "Karotten", amount: "6-8 Stück", category: "fresh", checked: false },
  { name: "Zwiebeln", amount: "7-8 Stück", category: "fresh", checked: false }, // Frühstück + Abendessen
  { name: "Knoblauch", amount: "2 Knollen", category: "fresh", checked: false }, // Frühstück + Abendessen
  { name: "Rucola", amount: "1-2 Packungen", category: "fresh", checked: false },
  { name: "Ingwer", amount: "1 Stück", category: "fresh", checked: false },
  { name: "Äpfel oder Beeren", amount: "2 Äpfel / 200g Beeren", category: "fresh", checked: false },
  { name: "Zitronen", amount: "10-12 Stück", category: "fresh", checked: false }, // Frühstück + Abendessen kombiniert
  // Kräuter
  { name: "Petersilie", amount: "4 Bund", category: "fresh", checked: false }, // Frühstück + Abendessen
  { name: "Dill", amount: "3-4 Bund", category: "fresh", checked: false }, // Frühstück + Abendessen
  { name: "Schnittlauch", amount: "1 Bund", category: "fresh", checked: false },
  { name: "Minze", amount: "1-2 Bund", category: "fresh", checked: false }, // Abendessen
  { name: "Frühlingszwiebel", amount: "1 Bund (optional)", category: "fresh", checked: false },
  // Beilagen/Salat
  { name: "Tomaten", amount: "14-16 Stück", category: "fresh", checked: false, forSideDish: true }, // Frühstück + Abendessen
  { name: "Cherry-Tomaten", amount: "1 Packung", category: "fresh", checked: false, forSideDish: true },
  { name: "Gurken", amount: "8-10 Stück", category: "fresh", checked: false, forSideDish: true }, // Frühstück + Abendessen
  { name: "Rotkohl oder Salat", amount: "1 Stück", category: "fresh", checked: false, forSideDish: true },
  { name: "Kartoffeln", amount: "1 kg", category: "fresh", checked: false, forSideDish: true },

  // === FLEISCH & FISCH ===
  // Hauptzutaten
  { name: "Eier", amount: "24-30 Stück", category: "protein", checked: false }, // Frühstück braucht viele Eier
  { name: "Hähnchenbrust", amount: "1.1-1.3 kg", category: "protein", checked: false },
  { name: "Rinderhack", amount: "350-450g", category: "protein", checked: false },
  { name: "Lachsfilets", amount: "2 Stück (300-400g)", category: "protein", checked: false },
  { name: "Räucherlachs", amount: "150-200g", category: "protein", checked: false },
  { name: "Tofu (optional)", amount: "300-400g", category: "protein", checked: false },

  // === MILCHPRODUKTE ===
  // Hauptzutaten
  { name: "Magerquark/Skyr", amount: "800-1000g", category: "dairy", checked: false }, // Frühstück kombiniert
  { name: "Feta", amount: "150-200g", category: "dairy", checked: false }, // Abendessen
  { name: "Milch oder Joghurt", amount: "400ml", category: "dairy", checked: false },
  // Beilagen/Dips
  { name: "Joghurt (natur)", amount: "1.5-2 kg", category: "dairy", checked: false, forSideDish: true }, // Abendessen Dips

  // === HÜLSENFRÜCHTE ===
  { name: "Kichererbsen (Dosen)", amount: "3 Dosen", category: "legumes", checked: false },
  { name: "Edamame (TK, optional)", amount: "1 Packung", category: "legumes", checked: false },

  // === BEILAGEN & VOLLKORN ===
  // Frühstück
  { name: "Vollkorn-Toast/Brot", amount: "3 Packungen", category: "grains", checked: false }, // Frühstück braucht mehr
  { name: "Haferflocken", amount: "100g", category: "grains", checked: false },
  { name: "Naturreis", amount: "700-800g", category: "grains", checked: false }, // Frühstück + Abendessen
  // Abendessen
  { name: "Vollkorn-Bulgur", amount: "500g", category: "grains", checked: false, forSideDish: true },
  { name: "Vollkornpasta", amount: "500g", category: "grains", checked: false },
  { name: "Vollkorn-Fladenbrot (optional)", amount: "1 Packung", category: "grains", checked: false, forSideDish: true },

  // === BASICS & SAUCEN ===
  { name: "Olivenöl", amount: "1 Flasche", category: "basics", checked: false },
  { name: "Butter", amount: "1 Stück (klein)", category: "basics", checked: false },
  { name: "Tomaten (Dose)", amount: "2 Dosen (400g)", category: "basics", checked: false }, // Frühstück + Abendessen
  { name: "Tahini", amount: "1 Glas", category: "basics", checked: false, forSideDish: true },
  { name: "Sojasauce", amount: "1 Flasche", category: "basics", checked: false },
  // Beilagen
  { name: "Oliven", amount: "1 Glas", category: "basics", checked: false, forSideDish: true },

  // === GEWÜRZE & EXTRAS ===
  { name: "Walnüsse", amount: "150g", category: "extras", checked: false },
  { name: "Leinsamen", amount: "1 Packung", category: "extras", checked: false },
  { name: "Pfeffer (Mühle)", amount: "1 Stück", category: "extras", checked: false },
  { name: "Zimt", amount: "1 Dose", category: "extras", checked: false },
  { name: "Kreuzkümmel", amount: "1 Dose", category: "extras", checked: false },
  { name: "Paprika edelsüß/Gewürz", amount: "1 Dose", category: "extras", checked: false },
  { name: "Kurkuma", amount: "1 Dose", category: "extras", checked: false },
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
