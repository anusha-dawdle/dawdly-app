export type CharmId =
  | "arts-and-crafts"
  | "baby"
  | "balloons"
  | "baseball"
  | "basketball"
  | "beach"
  | "boat"
  | "butter"
  | "cake"
  | "camping-tent"
  | "candles"
  | "cat"
  | "coffee"
  | "confetti"
  | "cooking-pot"
  | "disco-ball"
  | "dog"
  | "dumbbells"
  | "extra-flower-1"
  | "extra-flower-2"
  | "extra-flower-3"
  | "extra-flower-4"
  | "extra-heart"
  | "extra-leaf-2"
  | "extra-leaf-3"
  | "extra-leaf"
  | "extra-moon"
  | "extra-snowflake"
  | "extra-star"
  | "extra-sun"
  | "film-camera"
  | "flour"
  | "flowers"
  | "football"
  | "friends"
  | "garlic-pot"
  | "graduation-cap"
  | "gym-bag"
  | "house-keys"
  | "mixer"
  | "mountains"
  | "muffins"
  | "painting"
  | "paper-plane"
  | "plane"
  | "popcorn-movie"
  | "presents"
  | "ratatouille"
  | "rollerblade"
  | "running-shoes"
  | "sewing"
  | "shuttlecock"
  | "soccer-ball"
  | "spa"
  | "tea"
  | "tennis"
  | "travel-bag"
  | "travel-van-2"
  | "travel-van"
  | "trophy"
  | "wedding-rings"
  | "wine-glasses"
  | "yoga";

export interface Charm {
  id: CharmId;
  label: string;
  file: string; // filename in public/pngs/
  keywords: string[];
}

export const DEFAULT_CHARM_ID: CharmId = "extra-star";

export const CHARMS: Record<CharmId, Charm> = {
  "arts-and-crafts": { id: "arts-and-crafts", label: "Arts & Crafts", file: "arts and crafts.png", keywords: ["arts", "crafts", "art", "craft", "creative", "make", "diy"] },
  "baby":            { id: "baby",            label: "Baby",          file: "baby.png",            keywords: ["baby", "shower", "newborn", "infant"] },
  "balloons":        { id: "balloons",        label: "Balloons",      file: "balloons.png",        keywords: ["balloon", "party", "celebration", "birthday"] },
  "baseball":        { id: "baseball",        label: "Baseball",      file: "baseball.png",        keywords: ["baseball", "game", "sport"] },
  "basketball":      { id: "basketball",      label: "Basketball",    file: "basketball.png",      keywords: ["basketball", "game", "sport", "hoop"] },
  "beach":           { id: "beach",           label: "Beach",         file: "beach.png",           keywords: ["beach", "ocean", "sea", "swim", "sand", "coast", "summer"] },
  "boat":            { id: "boat",            label: "Boat",          file: "boat.png",            keywords: ["boat", "sailing", "sail", "cruise", "water"] },
  "butter":          { id: "butter",          label: "Baking",        file: "butter.png",          keywords: ["baking", "butter", "cook", "kitchen", "pastry"] },
  "cake":            { id: "cake",            label: "Cake",          file: "cake.png",            keywords: ["cake", "birthday", "bake", "celebration", "dessert"] },
  "camping-tent":    { id: "camping-tent",    label: "Camping",       file: "camping tent.png",    keywords: ["camping", "camp", "tent", "outdoor", "hike", "nature"] },
  "candles":         { id: "candles",         label: "Candles",       file: "candles.png",         keywords: ["candles", "dinner", "romantic", "evening", "birthday"] },
  "cat":             { id: "cat",             label: "Cat",           file: "cat.png",             keywords: ["cat", "kitten", "pet"] },
  "coffee":          { id: "coffee",          label: "Coffee",        file: "coffee.png",          keywords: ["coffee", "cafe", "latte", "espresso", "brunch", "morning"] },
  "confetti":        { id: "confetti",        label: "Confetti",      file: "confetti.png",        keywords: ["confetti", "party", "celebration", "birthday", "new year"] },
  "cooking-pot":     { id: "cooking-pot",     label: "Cooking",       file: "cooking pot.png",     keywords: ["cooking", "cook", "dinner", "meal", "soup", "kitchen"] },
  "disco-ball":      { id: "disco-ball",      label: "Disco",         file: "disco ball.png",      keywords: ["disco", "dance", "party", "club", "music", "night out"] },
  "dog":             { id: "dog",             label: "Dog",           file: "dog.png",             keywords: ["dog", "puppy", "pet", "walk"] },
  "dumbbells":       { id: "dumbbells",       label: "Gym",           file: "dumbbells.png",       keywords: ["gym", "workout", "lift", "weights", "fitness", "exercise", "train"] },
  "extra-flower-1":  { id: "extra-flower-1",  label: "Flower",        file: "extra flower 1.png",  keywords: ["flower", "garden", "bloom", "floral", "spring"] },
  "extra-flower-2":  { id: "extra-flower-2",  label: "Flower",        file: "extra flower 2.png",  keywords: ["flower", "garden", "bloom", "floral", "spring"] },
  "extra-flower-3":  { id: "extra-flower-3",  label: "Flower",        file: "extra flower 3.png",  keywords: ["flower", "garden", "bloom", "floral", "spring"] },
  "extra-flower-4":  { id: "extra-flower-4",  label: "Flower",        file: "extra flower 4.png",  keywords: ["flower", "garden", "bloom", "floral", "spring"] },
  "extra-heart":     { id: "extra-heart",     label: "Heart",         file: "extra heart.png",     keywords: ["heart", "love", "valentine", "date", "romance", "anniversary"] },
  "extra-leaf-2":    { id: "extra-leaf-2",    label: "Leaf",          file: "extra leaf 2.png",    keywords: ["leaf", "nature", "fall", "autumn", "garden"] },
  "extra-leaf-3":    { id: "extra-leaf-3",    label: "Leaf",          file: "extra leaf 3.png",    keywords: ["leaf", "nature", "fall", "autumn", "garden"] },
  "extra-leaf":      { id: "extra-leaf",      label: "Leaf",          file: "extra leaf.png",      keywords: ["leaf", "nature", "fall", "autumn", "garden"] },
  "extra-moon":      { id: "extra-moon",      label: "Moon",          file: "extra moon.png",      keywords: ["moon", "night", "evening", "stars", "late"] },
  "extra-snowflake": { id: "extra-snowflake", label: "Snowflake",     file: "extra snowflake.png", keywords: ["snowflake", "snow", "winter", "christmas", "holiday"] },
  "extra-star":      { id: "extra-star",      label: "Star",          file: "extra star.png",      keywords: ["star", "special", "night", "concert", "show"] },
  "extra-sun":       { id: "extra-sun",       label: "Sun",           file: "extra sun.png",       keywords: ["sun", "sunny", "summer", "beach", "outdoor", "picnic", "morning"] },
  "film-camera":     { id: "film-camera",     label: "Film Camera",   file: "film camera.png",     keywords: ["film", "camera", "photo", "photography", "movie", "cinema"] },
  "flour":           { id: "flour",           label: "Flour",         file: "flour.png",           keywords: ["baking", "flour", "bread", "cook", "pastry"] },
  "flowers":         { id: "flowers",         label: "Flowers",       file: "flowers.png",         keywords: ["flowers", "garden", "bouquet", "bloom", "floral", "spring"] },
  "football":        { id: "football",        label: "Football",      file: "football.png",        keywords: ["football", "game", "sport", "superbowl", "tailgate"] },
  "friends":         { id: "friends",         label: "Friends",       file: "friends.png",         keywords: ["friends", "hangout", "social", "get together", "people"] },
  "garlic-pot":      { id: "garlic-pot",      label: "Garlic Pot",    file: "garlic pot.png",      keywords: ["cooking", "dinner", "meal", "kitchen", "food", "garlic"] },
  "graduation-cap":  { id: "graduation-cap",  label: "Graduation",    file: "graduation cap.png",  keywords: ["graduation", "graduate", "degree", "school", "ceremony", "commencement"] },
  "gym-bag":         { id: "gym-bag",         label: "Gym Bag",       file: "gym bag.png",         keywords: ["gym", "workout", "fitness", "exercise", "sport", "training"] },
  "house-keys":      { id: "house-keys",      label: "House Keys",    file: "house keys.png",      keywords: ["house", "home", "moving", "keys", "new home", "move"] },
  "mixer":           { id: "mixer",           label: "Mixer",         file: "mixer.png",           keywords: ["baking", "mixer", "cook", "kitchen", "cake", "dessert"] },
  "mountains":       { id: "mountains",       label: "Mountains",     file: "mountains.png",       keywords: ["mountains", "hike", "hiking", "outdoor", "nature", "climb", "ski", "trek"] },
  "muffins":         { id: "muffins",         label: "Muffins",       file: "muffins.png",         keywords: ["muffins", "baking", "breakfast", "brunch", "coffee"] },
  "painting":        { id: "painting",        label: "Painting",      file: "painting.png",        keywords: ["painting", "art", "gallery", "museum", "creative", "draw", "canvas"] },
  "paper-plane":     { id: "paper-plane",     label: "Paper Plane",   file: "paper plane.png",     keywords: ["travel", "flight", "trip", "adventure", "journey", "send"] },
  "plane":           { id: "plane",           label: "Plane",         file: "plane.png",           keywords: ["plane", "flight", "travel", "trip", "fly", "vacation", "holiday"] },
  "popcorn-movie":   { id: "popcorn-movie",   label: "Movie",         file: "popcorn movie.png",   keywords: ["movie", "cinema", "film", "popcorn", "theater", "show", "screening"] },
  "presents":        { id: "presents",        label: "Presents",      file: "presents.png",        keywords: ["present", "gift", "birthday", "christmas", "holiday", "celebration"] },
  "ratatouille":     { id: "ratatouille",     label: "Dinner",        file: "ratatouille.png",     keywords: ["cooking", "dinner", "food", "restaurant", "meal", "french"] },
  "rollerblade":     { id: "rollerblade",     label: "Rollerblade",   file: "rollerblade.png",     keywords: ["rollerblade", "skating", "skate", "outdoor", "fitness"] },
  "running-shoes":   { id: "running-shoes",   label: "Running",       file: "running shoes.png",   keywords: ["run", "running", "race", "marathon", "jog", "5k", "10k", "fitness"] },
  "sewing":          { id: "sewing",          label: "Sewing",        file: "sewing.png",          keywords: ["sewing", "craft", "making", "design", "creative", "diy", "stitch"] },
  "shuttlecock":     { id: "shuttlecock",     label: "Badminton",     file: "shuttlecock.png",     keywords: ["badminton", "sport", "shuttlecock", "racket"] },
  "soccer-ball":     { id: "soccer-ball",     label: "Soccer",        file: "soccer ball.png",     keywords: ["soccer", "football", "sport", "game", "ball", "futbol"] },
  "spa":             { id: "spa",             label: "Spa",           file: "spa.png",             keywords: ["spa", "massage", "relax", "wellness", "self care", "facial", "pamper"] },
  "tea":             { id: "tea",             label: "Tea",           file: "tea.png",             keywords: ["tea", "cafe", "brunch", "morning", "afternoon", "drink"] },
  "tennis":          { id: "tennis",          label: "Tennis",        file: "tennis.png",          keywords: ["tennis", "sport", "racket", "game", "court"] },
  "travel-bag":      { id: "travel-bag",      label: "Travel",        file: "travel bag.png",      keywords: ["travel", "trip", "vacation", "bag", "luggage", "pack", "holiday"] },
  "travel-van-2":    { id: "travel-van-2",    label: "Road Trip",     file: "travel van 2.png",    keywords: ["road trip", "camping", "van", "drive", "travel", "adventure"] },
  "travel-van":      { id: "travel-van",      label: "Road Trip",     file: "travel van.png",      keywords: ["road trip", "camping", "van", "drive", "travel", "adventure"] },
  "trophy":          { id: "trophy",          label: "Trophy",        file: "trophy.png",          keywords: ["trophy", "award", "win", "competition", "race", "achievement"] },
  "wedding-rings":   { id: "wedding-rings",   label: "Wedding",       file: "wedding rings.png",   keywords: ["wedding", "marriage", "engagement", "anniversary", "rings", "bride", "groom"] },
  "wine-glasses":    { id: "wine-glasses",    label: "Wine",          file: "wine glasses.png",    keywords: ["wine", "dinner", "date", "drinks", "restaurant", "toast", "anniversary"] },
  "yoga":            { id: "yoga",            label: "Yoga",          file: "yoga.png",            keywords: ["yoga", "meditation", "wellness", "fitness", "stretch", "mindfulness"] },
};

export const CHARM_LIST: Charm[] = Object.values(CHARMS);

export const CHARM_CATEGORIES: { label: string; ids: CharmId[] }[] = [
  { label: "Food & Drinks",      ids: ["coffee", "tea", "wine-glasses", "cake", "muffins", "cooking-pot", "garlic-pot", "ratatouille", "butter", "flour", "mixer", "popcorn-movie", "candles"] },
  { label: "Travel & Outdoors",  ids: ["plane", "paper-plane", "travel-bag", "travel-van", "travel-van-2", "beach", "mountains", "camping-tent", "boat", "extra-sun"] },
  { label: "Sports & Fitness",   ids: ["running-shoes", "dumbbells", "gym-bag", "yoga", "tennis", "basketball", "baseball", "football", "soccer-ball", "shuttlecock", "rollerblade", "trophy"] },
  { label: "Celebrations",       ids: ["balloons", "confetti", "presents", "graduation-cap", "wedding-rings"] },
  { label: "Arts & Creativity",  ids: ["arts-and-crafts", "painting", "sewing", "film-camera"] },
  { label: "Social",             ids: ["friends", "disco-ball"] },
  { label: "Nature & Seasons",   ids: ["flowers", "extra-flower-1", "extra-flower-2", "extra-flower-3", "extra-flower-4", "extra-leaf", "extra-leaf-2", "extra-leaf-3", "extra-snowflake", "extra-moon"] },
  { label: "Home & Pets",        ids: ["house-keys", "baby", "cat", "dog"] },
  { label: "Wellness",           ids: ["spa"] },
  { label: "Special",            ids: ["extra-star", "extra-heart"] },
];

/** Legacy id map — for migrating old localStorage events */
const LEGACY_MAP: Record<string, CharmId> = {
  coffee:  "coffee",
  dinner:  "ratatouille",
  party:   "confetti",
  movie:   "popcorn-movie",
  travel:  "plane",
  picnic:  "extra-sun",
  concert: "disco-ball",
  date:    "wine-glasses",
  friends: "friends",
  spa:     "spa",
  book:    "extra-star",
  art:     "painting",
  sports:  "trophy",
  birthday:"cake",
  sunset:  "extra-sun",
  garden:  "flowers",
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
