import { Meal, ShoppingItem } from '@/types';

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

// Kombinierte Einkaufsliste
export const shoppingList: ShoppingItem[] = [...breakfastShoppingList, ...dinnerShoppingList];

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
