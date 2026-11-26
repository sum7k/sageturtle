// What Home shows: one tile per app. A person with several variants sees each app once;
// where their variants call the app by different names, the tile opens into those versions.
import { APPS, APP_ICON, variantById } from "./variants.js";

/** The app's own name, used on a tile that groups differently named versions. One word, a noun. */
export const GROUP_NAME = {
  learn: "Learning", earn: "Earnings", reminders: "Reminders", hobbies: "Hobbies", meetings: "Meetings",
  messages: "Messages", discussions: "Discussions", events: "Events", directory: "Directory", advertise: "Adverts",
};

export const blankTiles = () => ({ order: [], pinned: [], hidden: [] });

/**
 * The tiles for a person. Each has `versions`, one per differently named variant version of the app.
 * One version: the tile carries that name and opens the app. Several: it carries the app's own name and opens into them.
 * Order: pinned tiles first, then the person's own order, then the usual order. Hidden tiles are returned apart.
 */
export function homeTiles(variants, prefs = blankTiles()) {
  const mine = variants.map(variantById).filter(Boolean);
  const all = APPS.map((app) => {
    const versions = [];
    for (const v of mine) {
      const name = v.names[app];
      if (!name) continue;
      const same = versions.find((x) => x.name === name);
      if (same) same.variants.push(v.id); // two variants that use the same name share one version
      else versions.push({ name, variants: [v.id], icon: v.icon ?? APP_ICON[app] });
    }
    if (!versions.length) return null;
    return { app, icon: APP_ICON[app], name: versions.length > 1 ? GROUP_NAME[app] : versions[0].name, versions, pinned: prefs.pinned.includes(app) };
  }).filter(Boolean);
  const rank = (t) => {
    const i = prefs.order.indexOf(t.app);
    return (t.pinned ? 0 : 1000) + (i === -1 ? 100 + APPS.indexOf(t.app) : i);
  };
  const sorted = all.sort((a, b) => rank(a) - rank(b));
  return { tiles: sorted.filter((t) => !prefs.hidden.includes(t.app)), hidden: sorted.filter((t) => prefs.hidden.includes(t.app)) };
}

const without = (list, app) => list.filter((x) => x !== app);

/** Pin a tile to the top, or let it go. */
export function togglePin(prefs, app) {
  return { ...prefs, pinned: prefs.pinned.includes(app) ? without(prefs.pinned, app) : [...prefs.pinned, app] };
}
/** Hide a tile, or bring it back. Nothing is deleted: a hidden tile waits behind the last tile on Home. */
export function toggleHide(prefs, app) {
  return { ...prefs, hidden: prefs.hidden.includes(app) ? without(prefs.hidden, app) : [...prefs.hidden, app] };
}
/** Move a tile one place earlier (-1) or later (+1) among the tiles now showing. A tile stays inside its pinned or unpinned group. */
export function move(variants, prefs, app, by) {
  const { tiles } = homeTiles(variants, prefs);
  const i = tiles.findIndex((t) => t.app === app);
  const j = i + by;
  if (i === -1 || j < 0 || j >= tiles.length || tiles[i].pinned !== tiles[j].pinned) return prefs;
  const order = tiles.map((t) => t.app);
  [order[i], order[j]] = [order[j], order[i]];
  return { ...prefs, order };
}
