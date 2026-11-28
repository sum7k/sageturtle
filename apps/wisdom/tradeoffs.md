# Wisdom: tradeoffs and choices

Each line is a choice made without asking, or a risk accepted. Only the current choice is kept. Newest at the bottom.

Format: `- [where] Choice. Why. Cost / what we gave up.`

- [name] Human: the app is called Wisdom (2026-11-27). sumeet first called it Religion, then said that it sounded a little scary; Wisdom is calmer and more neutral. Cost: the name no longer says the quotations are "of god".
- [name] Human: it is the first tab, it holds quotations rewritten as moral science short stories, the stories differ by variant, and it is built last (2026-11-26).
- [name] The name is Wisdom in every variant, as Khabri is. Why: sumeet named it, and one name means the tile never opens into versions. Cost: none found.
- [home] Human: Wisdom is the top centre tile, position 2, right above Learning (2026-11-27). Why: sumeet chose it from the Cheiro layout, where 2 pairs with 7, the number of religion and philosophy. Cost: it is no longer the very first tile. See `apps/shell/tradeoffs.md`.
- [home] With eleven tiles the gold mic takes one cell, the bottom centre, and is no longer two cells wide. Why: this keeps Home on one screen. Cost: a smaller mic. In the build the mic takes whatever is left of the last row.
- [picture] An oil lamp stands for Wisdom. Why: light is common to most traditions in India, and a lamp is not one faith's sign. Cost: it is still closer to some traditions than others.
- [content] The quotation is shown word for word with its source and is never rewritten. Only the story is new writing. Why: the same rule as the root choice that a model never writes Gita verses; a changed verse breaks trust. Cost: every quotation needs a clean source and a human check.
- [content] Every variant's story ends in the same one-line moral. Why: the quotation means one thing; only the life around it changes. Cost: a moral worded for adults must also work for a kid.
- [variants] A person with several variants gets one story per variant and changes between them with round pictures at the top. Why: each story is written for one kind of life, and mixing them makes a weaker story. Cost: up to three stories for one quotation.
- [kids] A kid's story is told in three big pictures, is heard first, and has no share button and no heart. Why: kids are never handed off outside the app, and a kid's screen has few choices. Cost: a kid cannot keep a favourite.
- [list] One new quotation a day at the top, earlier ones below. No swiping and no learning from taste. Why: calm, and the same list for everyone in a variant can be saved once and served to all. Cost: no personal order.
- [ads] No ads, no comments and no scores in Wisdom. Why: an ad beside scripture reads badly, comments on religion invite quarrels, and scores are already ruled out for kids. Cost: no income from this app, and no way to talk about a story here.
- [scale] Stories are written ahead: one per quotation, variant and language (11 x 12 = 132 texts, each with audio), checked, and served as saved files from Cloudflare. Nothing is generated for one person. Why: it must hold for 100 crore users, and religious text must be checked before anyone sees it. Cost: 132 texts and audio files to make and check for each quotation.
- [design] The screens use placeholder text in brackets and show no real quotation. Why: the traditions and sources are not decided. Cost: the layout is not yet tested with real lengths, long verses above all.
- [design] Khabri's card style is reused: the quotation sits in a cream box, the moral in a mint box with the lamp. Why: one look for all apps, and the two fixed parts can be found by colour. Cost: none found.
