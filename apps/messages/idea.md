# Messages: idea

Step 1 of the SDLC, written 2026-11-28. Why it should exist, its one number and its test are in `docs/case.md`. The screens are in `docs/screens.md`, what it stores and calls is in
`docs/data-flows.md`, choices are in `tradeoffs.md` and parked work is in `backlog.md`.

## What it is

Messages is the door to people. It does two things.

1. **Reach a person.** It shows the lists of people from Me. A row hands off: the handset opens the phone's dialer, and
   the mark opens that person's chat in WhatsApp, Telegram or SMS. The number and the app come from that person's
   Reach me in Me (sumeet, 2026-11-28); a person who left it empty has no buttons. CubeGullak carries no one-to-one talk for adults and
   keeps none of it (sumeet, 2026-11-26).
2. **Talk inside the app, only where an outside app cannot keep the rules.** There are two such places:
   - a child and a guardian (a kid is never handed off, and a parent can see the chats);
   - the class (the teacher sees it, office hours hold, and a notice to a class of kids goes to the parents).

Inside the app a message is a voice note or a sticker. Typing is one tap away. There are no ads in a chat.

## What it does for each variant

Every adult variant gets the same screen. The variant sets the name of the tile and which list is shown first. Any adult
who is a guardian also gets the chats with the child, and any adult with a class gets the class.

| Variant | Name | List shown first | Inside the app |
| :--- | :--- | :--- | :--- |
| Kids (6 to 12) | Guardians | Guardians, as big faces. No other list | Everything. Voice notes and stickers with each guardian. Never handed off. A flag tells the parent |
| Teens (13 to 17) | Chats | Friends, then Family and Class | The class chat, which the teacher sees. One-to-one is handed off, if the guardian has filled the teen's Reach me |
| College students | Chats | Friends, then Family and Class | The class chat of the batch |
| Job seekers | Recruiters | Work (past colleagues and referrers), then Family and Friends | Chats with their own children, if any |
| Salaried professionals | Inbox | Work, then Family, Friends and Neighbours | Chats with their own children, the child's class |
| Business owners and shopkeepers | Customers | Trade (customers and suppliers), then Work (staff), Family and Friends | Chats with their own children, the child's class |
| Gig and daily-wage workers | Voice | Trade (payers and contractors), then Family, Friends and Neighbours | Chats with their own children, the child's class |
| Farmers and rural users | Messages | Trade (buyers and input sellers), then Family, Friends and Neighbours | Chats with their own children, the child's class |
| Homemakers | Family | Family, then Friends and Neighbours | Chats with their own children, the child's class |
| Teachers | Parents | Class, one chip per class, then Work (staffroom), Family and Friends | Speak to the whole class. For kids the notice goes to the parents. Chats with each kid as a guardian |
| Retired and senior citizens | Family | Family, then Friends and Neighbours. Larger rows | Chats with grandchildren, where the parent added them as a guardian |

A person with more than one variant sees one Messages tile. Where the names differ (Messages for farming, Customers for
a shop) the tile opens into those versions. A version is the same screen with that variant's list first.

## What it does not do

- It does not show what was said in WhatsApp, Telegram, SMS or on a call. CubeGullak cannot see it.
- So an adult has no inbox and no unread count for those. People are ordered by who was reached last from this phone.
- Strangers cannot appear. A person is in a list only after both scanned each other's code.
- Open groups (neighbours, a self-help group, staff, a project team) are not here. See `backlog.md`.
- Things the design map once promised that cannot hold in another company's app: quick replies, a catalogue, payment
  links, file sharing, a verified recruiter badge, scam warnings, flags on fake forwards, quiet hours. All parked in
  `backlog.md` with what each needs.

## Scale

- Hand-off costs nothing and holds for 100 crore people: it is a link.
- Inside the app, each chat is small and closed: a child with one guardian, or one class. No chat grows with the number
  of users. A voice note is a saved file, sent once and played from storage.
