# Messages: the product case

One page, part of step 1 of the SDLC. Written 2026-11-28. What the app does is in `../idea.md`.

## The problem

- A person who cannot read cannot find a name in a phone book or in WhatsApp. They ask someone else to dial.
- A shopkeeper, a farmer or a teacher deals with people whose numbers they never saved: a customer, a buyer, a parent.
- A child under 13 has no safe way to send a message. WhatsApp does not allow them, and nothing outside lets a parent
  see who the child talks to.
- A teacher's phone number ends up with every parent, and messages come at all hours.

## The job, for each variant

| Variant | "Help me..." |
| :--- | :--- |
| Kids | talk to mummy, papa, nani and my teacher, by pressing a face and speaking |
| Teens | reach my friends and family, and talk to my class where the teacher can see |
| College students | reach my friends and my batch |
| Job seekers | reach the people who can refer me |
| Salaried professionals | reach a colleague or my family without mixing the two |
| Shopkeepers | reach a customer or supplier whose number I never saved |
| Gig and daily-wage workers | call my payer in one tap, without reading |
| Farmers | call a buyer or the seed seller by face or by saying the name |
| Homemakers | reach family and neighbours, and hear from my child and the child's teacher |
| Teachers | tell the whole class once, and not be disturbed after school |
| Retired | call my family with one large button, and hear from my grandchildren |

## Not goals

- Replacing WhatsApp, Telegram or SMS for adults. We hand off to them.
- An inbox, history or unread count for talk that happens outside CubeGullak.
- Open groups (they belong to Discussions) and calls inside the app (they belong to Meetings).
- Time spent in the app. A good visit to Messages is a short one.

## The one number

**People who reach someone through Messages each week**: a tap on a handset or an app mark, or a voice note sent or
heard. Counted per profile, once a week. Until the backend exists it can only be counted on each phone.

Guardrails, which must not get worse while that number grows:

- Messages that reach a kid from anyone who is not a guardian: always zero.
- Alerts that reach a teacher outside office hours: always zero.
- Hand-off taps that fail, because the number is wrong or the app is not installed.
- Flags raised, per 1,000 in-app chats.

## The riskiest assumption

**An adult will open CubeGullak to reach someone, instead of going straight to WhatsApp or the dialer.** sumeet asked
this himself on 2026-11-28. It is most likely true for people who cannot read and for people whose contacts are not
saved, and most likely false for everyone else.

Next most risky: people will fill Reach me, and will scan each other's codes. Without both, a row has no buttons.

## The test, with 5 people, before building

- **Who:** a shopkeeper, a farmer, a parent of a child under 13, a teacher and a person over 60. At least two who do
  not read comfortably.
- **With what:** the clickable screens on the canvas, on a phone, in their language as far as the screens allow.
- **Ask them to:** 1. call a named buyer or customer; 2. add a new person by scanning a code; 3. (parent) hear the
  child's voice note and answer it; 4. (teacher) tell the whole class something.
- **Then ask:** "Tomorrow, would you open this or WhatsApp to do the same thing? Why?"
- **Pass:** 4 of 5 finish their tasks without help, and at least 2 of the 5 say they would open this.
- **If it fails:** hide the Messages tile for adults who have no child and no class, and keep the hand-off buttons only
  inside the other apps and in Me.

Not run yet. It needs five people; sumeet to find them.
