export type CharmId =
  // — regular charms (shown in picker) —
  | "book"
  | "mic"
  | "babies"
  | "baking"
  | "balloons"
  | "basketball"
  | "beach"
  | "birthday-cake"
  | "boat"
  | "camera"
  | "camping-tent"
  | "car"
  | "cat-and-dog"
  | "coffee"
  | "cupcake"
  | "dress"
  | "easel"
  | "football"
  | "friends"
  | "gifts"
  | "graduation-cap"
  | "gym"
  | "hiking-boots"
  | "mountains"
  | "new-house"
  | "plane"
  | "popcorn"
  | "ramen"
  | "roadtrip-van"
  | "shopping-bags"
  | "soccer"
  | "spa"
  | "tennis"
  | "wedding-ring"
  | "wine-glass"
  | "yoga"
  | "bicycle"
  | "black-car"
  | "burger"
  | "bus"
  | "cards"
  | "chessboard"
  | "chips-and-salsa"
  | "computer"
  | "grocery-bag"
  | "hairdryer"
  | "nails"
  | "palm-trees"
  | "picnic"
  | "pink-car"
  | "pizza"
  | "rice-bowl"
  | "swimming"
  | "tuxedo"
  | "arts-and-crafts"
  | "beer"
  | "cooking"
  | "gardening"
  | "guitar"
  | "theater"
  // — extra / fallback charms (not shown in picker) —
  | "extra-flower-1"
  | "extra-flower-2"
  | "extra-flower-3"
  | "extra-flower-4"
  | "extra-heart"
  | "extra-leaf"
  | "extra-leaf-2"
  | "extra-leaf-3"
  | "extra-moon"
  | "extra-snowflake"
  | "extra-star"
  | "extra-sun";

export interface Charm {
  id: CharmId;
  label: string;
  file: string;
  keywords: string[];
}

export const DEFAULT_CHARM_ID: CharmId = "extra-star";

export const EXTRA_CHARM_IDS: CharmId[] = [
  "extra-star",
  "extra-heart",
  "extra-sun",
  "extra-moon",
  "extra-snowflake",
  "extra-flower-1",
  "extra-flower-2",
  "extra-flower-3",
  "extra-flower-4",
  "extra-leaf",
  "extra-leaf-2",
  "extra-leaf-3",
];

/** Pick a deterministic fallback charm from the extras based on a seed (event id). */
export function pickExtraCharm(seed: string): CharmId {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  return EXTRA_CHARM_IDS[Math.abs(h) % EXTRA_CHARM_IDS.length];
}

export const CHARMS: Record<CharmId, Charm> = {
  // Regular charms
  "book":          { id: "book",          label: "Book Club",    file: "book.png",          keywords: ["book", "read", "reading", "library", "bookclub", "book club", "literature", "novel"] },
  "mic":           { id: "mic",           label: "Concert",      file: "mic.png",           keywords: ["concert", "show", "music", "mic", "karaoke", "singing", "performance", "gig", "live"] },
  "babies":        { id: "babies",        label: "Baby Shower",  file: "babies.png",        keywords: ["baby", "shower", "newborn", "infant", "nursery"] },
  "baking":        { id: "baking",        label: "Baking",       file: "baking.png",         keywords: ["baking", "bake", "bread", "pastry", "cookies", "kitchen", "cake"] },
  "balloons":      { id: "balloons",      label: "Balloons",     file: "balloons.png",       keywords: ["balloon", "party", "celebration", "birthday"] },
  "basketball":    { id: "basketball",    label: "Basketball",   file: "basketball.png",     keywords: ["basketball", "game", "sport", "hoop", "nba"] },
  "beach":         { id: "beach",         label: "Beach",        file: "beach.png",          keywords: ["beach", "ocean", "sea", "swim", "sand", "coast", "summer", "waves"] },
  "birthday-cake": { id: "birthday-cake", label: "Birthday",     file: "birthday cake.png",  keywords: ["birthday", "cake", "celebration", "bday", "party", "anniversary"] },
  "boat":          { id: "boat",          label: "Boat",         file: "boat.png",           keywords: ["boat", "sailing", "sail", "cruise", "water", "lake"] },
  "camera":        { id: "camera",        label: "Camera",       file: "camera.png",         keywords: ["camera", "photo", "photography", "pictures", "film", "shoot"] },
  "camping-tent":  { id: "camping-tent",  label: "Camping",      file: "camping tent.png",   keywords: ["camping", "camp", "tent", "outdoor", "fire", "nature", "wilderness"] },
  "car":           { id: "car",           label: "Drive",        file: "car.png",            keywords: ["car", "drive", "driving", "road", "trip", "ride"] },
  "cat-and-dog":   { id: "cat-and-dog",   label: "Pets",         file: "cat and dog.png",    keywords: ["cat", "dog", "pet", "kitten", "puppy", "animals", "vet"] },
  "coffee":        { id: "coffee",        label: "Coffee",       file: "coffee.png",         keywords: ["coffee", "cafe", "latte", "espresso", "brunch", "morning", "tea"] },
  "cupcake":       { id: "cupcake",       label: "Cupcake",      file: "cupcake.png",        keywords: ["cupcake", "dessert", "sweet", "treat", "bakery"] },
  "dress":         { id: "dress",         label: "Dress Up",     file: "dress.png",          keywords: ["dress", "outfit", "fashion", "style", "gala", "formal", "gown"] },
  "easel":         { id: "easel",         label: "Art",          file: "easel.png",          keywords: ["art", "paint", "painting", "gallery", "museum", "creative", "canvas", "studio"] },
  "football":      { id: "football",      label: "Football",     file: "football.png",       keywords: ["football", "game", "sport", "superbowl", "tailgate", "nfl"] },
  "friends":       { id: "friends",       label: "Friends",      file: "friends.png",        keywords: ["friends", "hangout", "social", "get together", "people", "group"] },
  "gifts":         { id: "gifts",         label: "Gifts",        file: "gifts.png",          keywords: ["gift", "present", "christmas", "holiday", "birthday", "surprise"] },
  "graduation-cap":{ id: "graduation-cap",label: "Graduation",   file: "graduation cap.png", keywords: ["graduation", "graduate", "degree", "school", "ceremony", "commencement"] },
  "gym":           { id: "gym",           label: "Gym",          file: "gym.png",            keywords: ["gym", "workout", "lift", "weights", "fitness", "exercise", "train", "run", "marathon", "race"] },
  "hiking-boots":  { id: "hiking-boots",  label: "Hiking",       file: "hiking boots.png",   keywords: ["hiking", "hike", "trail", "trek", "boots", "outdoor", "nature", "walk"] },
  "mountains":     { id: "mountains",     label: "Mountains",    file: "mountains.png",      keywords: ["mountain", "mountains", "ski", "skiing", "snowboard", "climb", "summit", "peak"] },
  "new-house":     { id: "new-house",     label: "New Home",     file: "new house.png",      keywords: ["house", "home", "moving", "move", "keys", "new home", "housewarming"] },
  "plane":         { id: "plane",         label: "Plane",        file: "plane.png",          keywords: ["plane", "flight", "fly", "travel", "trip", "vacation", "holiday", "airport"] },
  "popcorn":       { id: "popcorn",       label: "Movie Night",  file: "popcorn.png",        keywords: ["movie", "cinema", "film", "popcorn", "theater", "show", "screening", "netflix"] },
  "ramen":         { id: "ramen",         label: "Dinner",       file: "ramen.png",          keywords: ["dinner", "restaurant", "ramen", "food", "meal", "eat", "brunch", "lunch", "sushi", "date night"] },
  "roadtrip-van":  { id: "roadtrip-van",  label: "Road Trip",    file: "roadtrip van.png",   keywords: ["road trip", "roadtrip", "van", "drive", "adventure", "camping", "travel"] },
  "shopping-bags": { id: "shopping-bags", label: "Shopping",     file: "shopping bags.png",  keywords: ["shopping", "shop", "mall", "store", "retail", "buy", "spree"] },
  "soccer":        { id: "soccer",        label: "Soccer",       file: "soccer.png",         keywords: ["soccer", "football", "sport", "game", "ball", "futbol", "mls"] },
  "spa":           { id: "spa",           label: "Spa",          file: "spa.png",            keywords: ["spa", "massage", "relax", "wellness", "self care", "facial", "pamper", "manicure", "pedicure"] },
  "tennis":        { id: "tennis",        label: "Tennis",       file: "tennis.png",         keywords: ["tennis", "sport", "racket", "game", "court", "badminton"] },
  "wedding-ring":  { id: "wedding-ring",  label: "Wedding",      file: "wedding ring.png",   keywords: ["wedding", "marriage", "engagement", "anniversary", "rings", "bride", "groom"] },
  "wine-glass":    { id: "wine-glass",    label: "Drinks",       file: "wine glass.png",     keywords: ["wine", "drinks", "drink", "dinner", "date", "cocktail", "bar", "toast", "champagne"] },
  "yoga":          { id: "yoga",          label: "Yoga",          file: "yoga.png",            keywords: ["yoga", "meditation", "wellness", "pilates", "stretch", "mindfulness"] },
  "bicycle":       { id: "bicycle",       label: "Cycling",       file: "bicycle.png",          keywords: ["bicycle", "bike", "cycling", "biking", "cycle", "ride", "spin"] },
  "black-car":     { id: "black-car",     label: "Night Out",     file: "black car.png",        keywords: ["night out", "nightout", "limo", "uber", "taxi", "chauffeur", "fancy", "gala"] },
  "burger":        { id: "burger",        label: "Burgers",       file: "burger.png",           keywords: ["burger", "hamburger", "bbq", "grill", "cookout", "barbecue", "fast food"] },
  "bus":           { id: "bus",           label: "Bus Trip",      file: "bus.png",              keywords: ["bus", "transit", "commute", "trip", "charter", "travel"] },
  "cards":         { id: "cards",         label: "Game Night",    file: "cards.png",            keywords: ["cards", "poker", "card game", "game night", "casino", "blackjack"] },
  "chessboard":    { id: "chessboard",    label: "Board Games",   file: "chessboard.png",       keywords: ["chess", "chessboard", "board game", "strategy", "checkers", "game night"] },
  "chips-and-salsa":{ id: "chips-and-salsa", label: "Snacks",    file: "chips and salsa.png",  keywords: ["chips", "salsa", "snack", "snacks", "nachos", "taco", "mexican"] },
  "computer":      { id: "computer",      label: "Work From Home",file: "computer.png",         keywords: ["computer", "work from home", "wfh", "remote", "laptop", "zoom"] },
  "grocery-bag":   { id: "grocery-bag",   label: "Grocery Run",   file: "grocery bag.png",      keywords: ["grocery", "groceries", "market", "farmers market", "errands", "food"] },
  "hairdryer":     { id: "hairdryer",     label: "Blowout",       file: "hairdryer.png",        keywords: ["hair", "hairdryer", "blowout", "salon", "hairdresser", "haircut"] },
  "nails":         { id: "nails",         label: "Nails",         file: "nails.png",            keywords: ["nails", "manicure", "pedicure", "nail salon", "gel", "polish"] },
  "palm-trees":    { id: "palm-trees",    label: "Tropical",      file: "palm trees.png",       keywords: ["tropical", "palm", "island", "resort", "vacation", "hawaii", "paradise"] },
  "picnic":        { id: "picnic",        label: "Picnic",        file: "picnic.png",           keywords: ["picnic", "park", "outdoor dining", "outdoors", "lawn", "blanket"] },
  "pink-car":      { id: "pink-car",      label: "Girls Trip",    file: "pink car.png",         keywords: ["girls trip", "girls", "ladies", "bachelorette", "road trip", "girl"] },
  "pizza":         { id: "pizza",         label: "Pizza",         file: "pizza.png",            keywords: ["pizza", "pie", "italian", "takeout", "delivery", "dinner"] },
  "rice-bowl":     { id: "rice-bowl",     label: "Lunch",         file: "rice bowl.png",        keywords: ["rice", "bowl", "lunch", "poke", "japanese", "korean", "chinese", "asian"] },
  "swimming":      { id: "swimming",      label: "Swimming",      file: "swimming.png",         keywords: ["swim", "swimming", "pool", "laps", "aqua"] },
  "tuxedo":        { id: "tuxedo",        label: "Black Tie",     file: "tuxedo.png",           keywords: ["tuxedo", "formal", "gala", "black tie", "suit", "fancy", "dress up"] },
  "arts-and-crafts":{ id: "arts-and-crafts", label: "Arts & Crafts", file: "arts and crafts.png", keywords: ["arts", "crafts", "art", "craft", "knitting", "sewing", "diy", "creative", "making"] },
  "beer":          { id: "beer",          label: "Drinks",        file: "beer.png",             keywords: ["beer", "pub", "bar", "brewery", "drinks", "happy hour", "pint", "craft beer"] },
  "cooking":       { id: "cooking",       label: "Cooking",       file: "cooking.png",          keywords: ["cooking", "cook", "kitchen", "recipe", "chef", "meal prep", "dinner", "homemade"] },
  "gardening":     { id: "gardening",     label: "Gardening",     file: "gardening.png",        keywords: ["gardening", "garden", "plants", "planting", "flowers", "outdoors", "nature"] },
  "guitar":        { id: "guitar",        label: "Music",         file: "guitar.png",           keywords: ["guitar", "music", "band", "jam", "instrument", "practice", "playing", "musician"] },
  "theater":       { id: "theater",       label: "Theater",       file: "theater.png",          keywords: ["theater", "theatre", "play", "show", "musical", "performance", "stage", "broadway"] },

  // Extra / fallback charms
  "extra-flower-1": { id: "extra-flower-1", label: "Flower",    file: "extra flower 1.png",  keywords: [] },
  "extra-flower-2": { id: "extra-flower-2", label: "Flower",    file: "extra flower 2.png",  keywords: [] },
  "extra-flower-3": { id: "extra-flower-3", label: "Flower",    file: "extra flower 3.png",  keywords: [] },
  "extra-flower-4": { id: "extra-flower-4", label: "Flower",    file: "extra flower 4.png",  keywords: [] },
  "extra-heart":    { id: "extra-heart",    label: "Heart",     file: "extra heart.png",     keywords: [] },
  "extra-leaf":     { id: "extra-leaf",     label: "Leaf",      file: "extra leaf.png",      keywords: [] },
  "extra-leaf-2":   { id: "extra-leaf-2",   label: "Leaf",      file: "extra leaf 2.png",    keywords: [] },
  "extra-leaf-3":   { id: "extra-leaf-3",   label: "Leaf",      file: "extra leaf 3.png",    keywords: [] },
  "extra-moon":     { id: "extra-moon",     label: "Moon",      file: "extra moon.png",      keywords: [] },
  "extra-snowflake":{ id: "extra-snowflake",label: "Snowflake", file: "extra snowflake.png", keywords: [] },
  "extra-star":     { id: "extra-star",     label: "Star",      file: "extra star.png",      keywords: [] },
  "extra-sun":      { id: "extra-sun",      label: "Sun",       file: "extra sun.png",       keywords: [] },
};

export const CHARM_LIST: Charm[] = [
  // Only regular charms in the picker
  CHARMS["book"],
  CHARMS["mic"],
  CHARMS["babies"],
  CHARMS["baking"],
  CHARMS["balloons"],
  CHARMS["basketball"],
  CHARMS["beach"],
  CHARMS["birthday-cake"],
  CHARMS["boat"],
  CHARMS["camera"],
  CHARMS["camping-tent"],
  CHARMS["car"],
  CHARMS["cat-and-dog"],
  CHARMS["coffee"],
  CHARMS["cupcake"],
  CHARMS["dress"],
  CHARMS["easel"],
  CHARMS["football"],
  CHARMS["friends"],
  CHARMS["gifts"],
  CHARMS["graduation-cap"],
  CHARMS["gym"],
  CHARMS["hiking-boots"],
  CHARMS["mountains"],
  CHARMS["new-house"],
  CHARMS["plane"],
  CHARMS["popcorn"],
  CHARMS["ramen"],
  CHARMS["roadtrip-van"],
  CHARMS["shopping-bags"],
  CHARMS["soccer"],
  CHARMS["spa"],
  CHARMS["tennis"],
  CHARMS["wedding-ring"],
  CHARMS["wine-glass"],
  CHARMS["yoga"],
  CHARMS["bicycle"],
  CHARMS["black-car"],
  CHARMS["burger"],
  CHARMS["bus"],
  CHARMS["cards"],
  CHARMS["chessboard"],
  CHARMS["chips-and-salsa"],
  CHARMS["computer"],
  CHARMS["grocery-bag"],
  CHARMS["hairdryer"],
  CHARMS["nails"],
  CHARMS["palm-trees"],
  CHARMS["picnic"],
  CHARMS["pink-car"],
  CHARMS["pizza"],
  CHARMS["rice-bowl"],
  CHARMS["swimming"],
  CHARMS["tuxedo"],
  CHARMS["arts-and-crafts"],
  CHARMS["beer"],
  CHARMS["cooking"],
  CHARMS["gardening"],
  CHARMS["guitar"],
  CHARMS["theater"],
];

export const CHARM_CATEGORIES: { label: string; ids: CharmId[] }[] = [
  { label: "Food & Drinks",      ids: ["coffee", "ramen", "burger", "pizza", "rice-bowl", "chips-and-salsa", "beer", "cupcake", "wine-glass", "popcorn", "picnic", "grocery-bag"] },
  { label: "Travel & Outdoors",  ids: ["plane", "roadtrip-van", "car", "bus", "boat", "beach", "palm-trees", "mountains", "camping-tent", "hiking-boots"] },
  { label: "Sports & Fitness",   ids: ["gym", "yoga", "swimming", "bicycle", "basketball", "football", "soccer", "tennis"] },
  { label: "Celebrations",       ids: ["balloons", "birthday-cake", "gifts", "graduation-cap", "wedding-ring", "tuxedo"] },
  { label: "Hobbies",            ids: ["easel", "camera", "book", "guitar", "theater", "arts-and-crafts", "baking", "cooking", "gardening"] },
  { label: "Social & Lifestyle", ids: ["friends", "mic", "cards", "chessboard", "shopping-bags", "dress", "black-car", "pink-car"] },
  { label: "Home & Family",      ids: ["new-house", "babies", "cat-and-dog", "computer"] },
  { label: "Wellness",           ids: ["spa", "nails", "hairdryer"] },
];

/** Maps old charm ids (from previous design or legacy localStorage) to current ids. */
const LEGACY_MAP: Record<string, CharmId> = {
  // old SVG-era ids
  coffee:   "coffee",
  dinner:   "ramen",
  party:    "balloons",
  movie:    "popcorn",
  travel:   "plane",
  picnic:   "picnic",
  concert:  "wine-glass",
  date:     "wine-glass",
  friends:  "friends",
  spa:      "spa",
  book:     "extra-star",
  art:      "easel",
  sports:   "basketball",
  birthday: "birthday-cake",
  sunset:   "extra-sun",
  garden:   "extra-flower-1",
  // old PNG-era ids
  "arts-and-crafts":  "easel",
  "baby":             "babies",
  "baseball":         "basketball",
  "butter":           "baking",
  "cake":             "birthday-cake",
  "camping-tent":     "camping-tent",
  "candles":          "extra-star",
  "cat":              "cat-and-dog",
  "confetti":         "balloons",
  "cooking-pot":      "ramen",
  "disco-ball":       "wine-glass",
  "dog":              "cat-and-dog",
  "dumbbells":        "gym",
  "film-camera":      "camera",
  "flour":            "baking",
  "flowers":          "extra-flower-1",
  "garlic-pot":       "ramen",
  "gym-bag":          "gym",
  "house-keys":       "new-house",
  "mixer":            "baking",
  "muffins":          "cupcake",
  "painting":         "easel",
  "paper-plane":      "plane",
  "popcorn-movie":    "popcorn",
  "presents":         "gifts",
  "ratatouille":      "ramen",
  "rollerblade":      "gym",
  "running-shoes":    "gym",
  "sewing":           "dress",
  "shuttlecock":      "tennis",
  "soccer-ball":      "soccer",
  "tea":              "coffee",
  "travel-bag":       "plane",
  "travel-van":       "roadtrip-van",
  "travel-van-2":     "roadtrip-van",
  "trophy":           "gym",
  "wedding-rings":    "wedding-ring",
  "wine-glasses":     "wine-glass",
};

export function resolveCharmId(raw: string): CharmId {
  if (raw in CHARMS) return raw as CharmId;
  if (raw in LEGACY_MAP) return LEGACY_MAP[raw];
  return DEFAULT_CHARM_ID;
}

/** Return best-matching charm for a given event title, or null if no match. */
export function suggestCharm(title: string): CharmId | null {
  const lower = title.toLowerCase();
  for (const charm of CHARM_LIST) {
    if (charm.keywords.some((kw) => lower.includes(kw))) return charm.id;
  }
  return null;
}
