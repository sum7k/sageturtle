# Messages: tradeoffs and choices

Choices made without asking, 2026-11-28. Only the current choice is kept. Lines with `Human:` were decided by sumeet.

Format: `- [where] Choice. Why. Cost.`

- [scope] Human: one-to-one talk for adults is handed off by link, and Kids and groups stay inside the app (2026-11-26). The number comes from Reach me in Me (2026-11-28). Why and cost are in `apps/shell/tradeoffs.md` under [handoff].
- [scope] Messages is one screen for every adult variant: the lists from Me, with hand-off buttons. The variant changes only the tile's name and which list comes first. Why: the backend is one, and a variant is only settings. Cost: the special things the design map gave each variant (quick replies, catalogue, recruiter badge and others) are not here; they are parked in `backlog.md`.
- [lists] The list shown first: Friends for Teens and College students; Work for Job seekers and Office job; Trade for Shop, Daily work and Farming; Family for Home and Retired; Class for Teachers. Why: it is the list the variant's name points at. Cost: a guess about what each person opens most; not checked with users.
- [lists] A person whose variants name the app differently gets versions that are the same screen with a different list first. Why: the Home rule (one tile, opens into versions) stays true without a second design. Cost: for a farmer with a shop both versions start on Trade, so the extra tap gives nothing.
- [order] People are ordered by who was last reached from this phone. There is no inbox and no unread count for adults. Why: CubeGullak cannot see WhatsApp, Telegram, SMS or calls. Cost: a person who expects an inbox will not find one; Messages is a phone book with fast buttons.
- [rooms] Only two kinds of chat live inside the app: a child with a guardian, and a class. Why: these are the only places with rules an outside app cannot keep. Each is small and closed, so nothing grows with the number of users. Cost: no family group, no neighbours group, no staff or project group; people will use WhatsApp groups for those.
- [rooms] Open groups belong to Discussions, not Messages. Why: Discussions is already the app for many people talking (Chaupal for farming). Cost: nothing is designed for them yet.
- [content] An in-app message is a voice note, a sticker or typed text. No photos, no files, no written transcript of a voice note. Why: voice first; photos in a child's chat need checking by someone; the price of speech is still parked. Cost: a note cannot be skimmed, homework photos cannot be sent, and college batches cannot share files.
- [kids] A kid has one chat per guardian, not one family room. Why: the map says a parent can see "these chats", and a kid may want to tell nani something. Cost: more chats for a parent to look at.
- [kids] The owner of the child's account hears every chat of the child. Other guardians hear only their own. Why: the owner gave the consent and holds the lock. Cost: a second parent who is only a guardian sees less than the owner.
- [kids] A kid's chat has no keyboard and no times. Why: many kids of 6 cannot read or type. Cost: an older kid of 11 cannot type.
- [kids] The flag in a kid's chat tells the owner. Why: the owner is the adult in charge. Cost: it does not help when the owner is the trouble; parked in `backlog.md`.
- [class] For a class of kids, the class chat is between parents and teachers; for teens and college it is between students and teachers. Why: kids talk only to guardians. Cost: two shapes of the same chat.
- [class] A teen's parent cannot hear the teen's class chat. Why: sumeet's rule names only the teacher as the one who sees it. Cost: a parent has no view of it. Flagged in `backlog.md` because it is a safety choice.
- [class] Office hours stop alerts to the teacher; messages wait and arrive when hours start. Why: "messages stop outside office hours" without losing anything said. Cost: an urgent message waits until morning.
- [class] The teacher sees how many heard a notice, as a count, not as names. Why: enough to know if it landed. Cost: the teacher cannot chase the four parents who did not hear it.
- [marks] New in-app messages show as a gold dot with a number. Why: numbers may stay as text. Cost: gold is also the colour of the main action.
- [calls] The handset always hands off to the dialer. The camera-shaped call buttons in the child chat and the class are drawn but come later, with Meetings. Why: calls inside the app need Cloudflare Realtime and the Meetings design. Cost: a kid cannot call a guardian in the first build.
- [build] Until the backend (step 9), the in-app chats are a demo on one phone with made-up notes; only hand-off is real. Why: a voice note cannot reach another phone without a server. Cost: the first preview shows the kid and class screens without real talk.
