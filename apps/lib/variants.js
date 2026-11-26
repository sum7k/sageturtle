// Who the person is decides what each app is called and which apps and lists they see.
// Names are one word and a noun, never a verb. The design map is the source: apps/docs/variant-map.html.

/** The ten apps that get a tile on Home, in order. Khabri has its own card and Me opens from the round picture. */
export const APPS = ["learn", "earn", "reminders", "hobbies", "meetings", "messages", "discussions", "events", "directory", "advertise"];

export const APP_ICON = {
  learn: "M5 4h10a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3V4z M5 17a3 3 0 0 1 3-3h10",
  earn: "M7 5h10 M7 9h10 M7 5h3a4 4 0 0 1 0 8H7l7 7",
  reminders: "M4 6h16v14H4z M4 10h16 M8 3v4 M16 3v4",
  hobbies: "M12 3l2.7 5.7 6.3.8-4.6 4.3 1.2 6.2L12 17l-5.6 3 1.2-6.2L3 9.5l6.3-.8L12 3z",
  meetings: "M3 7h12v10H3z M15 10.5l6-3v9l-6-3",
  messages: "M4 5h16v11H9l-5 4V5z",
  discussions: "M3 4h12v8H8l-5 4V4z M9 14v2h7l5 4V8h-4",
  events: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M12 7v5l3 3",
  directory: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14z M20 20l-4-4",
  advertise: "M4 10v4h3l8 4V6L7 10H4z M18 9v6",
};

const row = (...names) => Object.fromEntries(APPS.map((a, i) => [a, names[i]]));

/** `names[app]` is null when the app is off for the variant; such an app is not shown at all. */
export const VARIANTS = [
  { id: "kids", adult: false, label: "Kids, 6 to 12", lists: ["guardians"],
    names: row("Games", "Piggy", "Day", "Fun", "Classes", "Guardians", "Questions", "Contests", null, null) },
  { id: "teens", adult: false, label: "Teens, 13 to 17", lists: ["family", "friends", "class"],
    names: row("Lessons", "Scholarships", "Timetable", "Clubs", "Rooms", "Chats", "Forums", "Contests", "Coaching", "Posters") },
  { id: "college", adult: true, label: "Student", lists: ["family", "friends", "class"],
    icon: "M2 9l10-5 10 5-10 5-10-5z M6 11.5V16c2 2 10 2 12 0v-4.5 M22 9v5",
    names: row("Skills", "Gigs", "Deadlines", "Societies", "Groups", "Chats", "Forums", "Fests", "Campus", "Promos") },
  { id: "jobs", adult: true, label: "Looking for a job", lists: ["family", "friends", "work"],
    icon: "M4 8h16v11H4z M9 8V5h6v3 M4 13h16",
    names: row("Exams", "Jobs", "Dates", "Hobbies", "Interviews", "Recruiters", "Experiences", "Fairs", "Guides", "Portfolio") },
  { id: "office", adult: true, label: "Office job", lists: ["family", "friends", "work", "neighbours"],
    icon: "M5 21V4h10v17 M15 9h4v12 M3 21h18 M8 8h1 M11 8h1 M8 12h1 M11 12h1 M8 16h1 M11 16h1",
    names: row("Courses", "Money", "Planner", "Weekends", "Meetings", "Inbox", "Circles", "Events", "Services", "Offers") },
  { id: "shop", adult: true, label: "Shop or business", lists: ["family", "friends", "work", "trade", "neighbours"],
    icon: "M4 10v10h16V10 M3 10l2-6h14l2 6a3 3 0 0 1-6 0 3 3 0 0 1-6 0 3 3 0 0 1-6 0z M9 20v-6h6v6",
    names: row("Growth", "Leads", "Dues", "Breaks", "Calls", "Customers", "Trade", "Fairs", "Suppliers", "Ads") },
  { id: "gig", adult: true, label: "Daily work", lists: ["family", "friends", "trade", "neighbours"],
    icon: "M14 4l6 6-2 2-2-2-9 9-2-2 9-9-2-2 2-2z",
    names: row("Skills", "Work", "Alerts", "Leisure", "Calls", "Voice", "Talks", "Camps", "Card", "Ad") },
  { id: "farm", adult: true, label: "Farming", lists: ["family", "friends", "trade", "neighbours"],
    icon: "M12 21v-9 M12 12c0-4-3-6-7-6 0 4 3 6 7 6z M12 15c0-3 2.5-5 6.5-5 0 3.5-2.5 5-6.5 5z",
    names: row("School", "Mandi", "Calendar", "Fun", "Calls", "Messages", "Chaupal", "Melas", "Farms", "Listings") },
  { id: "home", adult: true, label: "Home", lists: ["family", "friends", "neighbours"],
    icon: "M4 11l8-7 8 7 M6 10v10h12V10 M10 20v-6h4v6",
    names: row("Lessons", "Income", "Diary", "Pastimes", "Meetups", "Family", "Circle", "Functions", "Nearby", "Shop") },
  { id: "teach", adult: true, label: "Teacher", lists: ["family", "friends", "work", "neighbours", "class"],
    icon: "M3 5h18v11H3z M8 20l4-4 4 4 M7 9h7 M7 12h4",
    names: row("Training", "Income", "Planner", "Interests", "Classes", "Parents", "Staffroom", "Calendar", "Resources", "Ads") },
  { id: "retired", adult: true, label: "Retired", lists: ["family", "friends", "neighbours"],
    icon: "M5 9h11v5a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5V9z M16 10h2a2 2 0 0 1 0 5h-2 M8 3v3 M12 3v3",
    names: row("Lessons", "Pension", "Medicines", "Leisure", "Calls", "Family", "Community", "Gatherings", "Helpers", "Listings") },
];

export const ADULT_VARIANTS = VARIANTS.filter((v) => v.adult);
export const variantById = (id) => VARIANTS.find((v) => v.id === id) ?? null;

/** The tiles a variant sees on Home: only apps that are on, with the name used for that variant. */
export function tilesFor(id) {
  const v = variantById(id);
  if (!v) return [];
  return APPS.filter((a) => v.names[a]).map((a) => ({ app: a, name: v.names[a], icon: APP_ICON[a] }));
}

/** The separate lists of people a person can keep. A variant shows only the ones that fit it. */
export const LISTS = {
  family: { name: "Family", icon: "M4 11l8-7 8 7 M6 10v10h12V10 M12 17s-3-2-3-4a1.5 1.5 0 0 1 3-.8 1.5 1.5 0 0 1 3 .8c0 2-3 4-3 4z" },
  friends: { name: "Friends", icon: "M8 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M16 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M2 19a6 6 0 0 1 12 0 M15 14.5a6 6 0 0 1 7 4.5" },
  work: { name: "Work", icon: "M4 8h16v11H4z M9 8V5h6v3 M4 13h16" },
  trade: { name: "Trade", icon: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M9 8h6 M9 11h6 M9 8h1.5a3 3 0 0 1 0 6H9l4 3.5" },
  neighbours: { name: "Neighbours", icon: "M3 20v-9l5-4 5 4v9z M13 13l4-3 4 3v7h-8" },
  class: { name: "Class", icon: "M4 5h16v11H4z M9 20l3-4 3 4 M8 9h8 M8 12h5" },
  guardians: { name: "Guardians", icon: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M4.5 20a7.5 7.5 0 0 1 15 0" },
};
/** Lists for one variant, or for everything a person does: each list once, in the order of LISTS. */
export function listsFor(ids) {
  const want = new Set([].concat(ids).flatMap((id) => variantById(id)?.lists ?? []));
  return Object.keys(LISTS).filter((l) => want.has(l)).map((l) => ({ id: l, ...LISTS[l] }));
}
