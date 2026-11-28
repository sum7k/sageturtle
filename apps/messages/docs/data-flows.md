# Messages: data and flows

Step 3 of the SDLC, written 2026-11-28. It says what Messages stores, who sees it and what it calls. It names no
servers or tables: that is the platform design (step 7). Anything not settled is listed at the end and parked in
`../backlog.md`, not guessed here.

## What Messages reads from Me

Messages owns none of this. It only reads it.

| Thing | Used for |
| :--- | :--- |
| The person's variants | The name of the tile and which list comes first |
| The lists of people (family, friends, work, trade, neighbours, class) | The chips and the rows |
| Each listed person's Reach me: an optional number and one app | The two buttons on a row |
| The child profiles and each child's guardians | The chats between a child and a guardian |
| The classes, their members by role, and the office hours | The class chat and the notices |

## What Messages stores

| Thing | What is in it | Kept where until step 9 | Who can see it |
| :--- | :--- | :--- | :--- |
| Last reached | For each listed person, the time this phone last tapped the handset or the mark | On the phone | Only this person |
| Child chat | One per child and guardian pair. Its messages | On the phone, as a demo with made-up notes | The child, that guardian, and the owner of the child's account |
| Class chat | One per class. Its messages | On the phone, as a demo | Teens' class: the students and teachers of the class. Kids' class: the parents and teachers |
| Notice | A teacher's message to the whole class, and who has heard it | On the phone, as a demo | Same as the class chat. The heard count: the teacher only |
| Message | Who sent it, when, and one of: a voice note (sound and its length), a sticker (which one), typed text | With its chat | Whoever sees the chat |
| Heard mark | For each chat and person, the last message they heard | With its chat | Drives the gold dot. Not shown to others, except the notice count |
| Report | Which chat, which message, who raised the flag, when | On the phone, as a demo | The owner of the child's account, or the class teacher |

Messages stores nothing about one-to-one talk between adults. No text, no call record, no number of its own.

## Flows

**Reach a person (adult or teen).**
1. The person opens Messages. The variant's list is chosen. Rows are ordered by last reached.
2. A tap on the handset opens `tel:<number>`. A tap on the mark opens `https://wa.me/<number>`,
   `https://t.me/+<number>` or `sms:<number>`, by the app that person chose.
3. The phone leaves BodhiLabs. Messages saves only the time of the tap.
4. A person with no number has no buttons. A kid's row never has buttons.

**A kid and a guardian.**
1. The kid taps a guardian's face, presses the mic, speaks and lets go. The note is sent.
2. The guardian sees a gold dot on the child's picture in the band, opens the chat and hears it.
3. The owner of the child's account can open the child's chat with any guardian and hear it. The owner cannot speak in
   another guardian's chat.
4. A guardian who is removed in child control loses the chat at once.
5. The flag in a kid's chat makes a report that goes to the owner.

**The class chat (teens and older students).**
1. A member presses the mic and speaks. Every member of the class can hear it, the teachers too.
2. The flag makes a report that goes to the class teacher.

**A notice to the class (a teacher).**
1. The teacher picks a class, presses the mic, speaks, hears it if they wish, and taps the tick.
2. For a class of kids the notice goes to the parents, not to the kids. For older classes it goes into the class chat
   with a gold edge.
3. The teacher sees how many have heard it.
4. Outside office hours nothing alerts the teacher. What was sent waits until office hours start.

## What Messages calls

| Call | When | Cost |
| :--- | :--- | :--- |
| `tel:`, `sms:`, `wa.me`, `t.me` links | A tap on a row's button | None. No API, no key, no fee |
| The phone's microphone | Recording a voice note. Asked for on first use | None |
| The phone's camera, through Me | Scanning a person's code | None |
| The shell's spoken lines | Each screen speaks itself; each control speaks its name | Counted under the shell ("price of voice") |

Messages calls no outside service of its own. Sending a voice note to another phone needs the backend, which comes in
step 9. Until then the in-app chats are a demo on one phone, and only hand-off is real.

## The rules the backend must hold (for step 6 and 7)

These are checked on every request, not only on the screen.

- A kid's profile can send to, and get from, its guardians only.
- Only the owner of the child's account, the child and that guardian can read a child chat.
- Only members of a class can read or send in its chat. A notice to a class of kids is delivered to parents only.
- Nothing is delivered to a teacher as an alert outside office hours.
- No chat holds more people than one class.

## Not settled (parked in `../backlog.md`)

- How long voice notes are kept, and who can delete them.
- What happens after a report, and what a kid does when the trouble is the owner.
- Whether a teen's parent can hear the teen's class chat.
- Calls inside the app.
