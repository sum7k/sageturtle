# Messages: the screens

Step 2 of the SDLC. Drawn on the shell canvas at https://claude.ai/artifact/Jgem7AE3dhZSPvVkV6bqS1, in the row named
Messages (six screens, numbered 13). The source is in `apps/shell/docs/canvas/` (`Messages*.dc.html`), and the script
that made them is `work/gen_messages.py`. The rules for every screen are at the top of `apps/shell/docs/screens.md`.
Names in brackets are placeholders. Not approved yet. Claude has not looked at the renders (the canvas does not allow
it unless asked).

To click through: Home, then the Messages tile. The teen's gold chat button and the teacher's gold mic on the class
screens open screens 5 and 6.

## 1. People and rooms (an adult)

Drawn for a person who farms and runs a shop.

- Top: home, listen, and the round picture that opens Me.
- A white band holds what stays inside the app: the child's picture and the child's class. A gold dot with a number
  shows new voice notes. The band is not shown to a person with no child and no class.
- A row of round chips, one per list, by picture only: trade (chosen), family, friends, work, neighbours. The chip for
  the variant's own list comes first and is chosen when the screen opens.
- The people of the chosen list, one row each: picture, name, a handset and the mark of the app that person uses
  (WhatsApp green, Telegram blue, SMS). The handset opens the dialer. The mark opens the chat in that app. A person
  with no number has no buttons. The person reached last is on top.
- Bottom: a camera button to add a person by scanning their code (opens the list in Me), and a wide gold mic: say a
  name to call or message.

## 2. A guardian and a child

- Top: back, listen. Then the child's picture and name, and a button for a call inside the app (comes later).
- A white band with the child's guardians as round pictures: me (ringed in gold), papa, nani, the teacher. An eye shows
  that this parent can see the child's chat with each of them. Tapping another picture shows that chat, to hear only.
- The chat: voice notes with a play button, a wave and the length in seconds, stickers as pictures, and the time.
  The child is on the left, the guardian on the right.
- Bottom: a sticker button, a wide gold mic to speak a voice note, and a keyboard button to type instead.

## 3. The kid (Guardians)

- Top: home, listen.
- Four big tiles, two in a row: each guardian's picture and name. The teacher's picture carries the class mark. A gold
  dot with a number shows new voice notes.
- Bottom: a tall gold mic: say who you want to talk to.
- There is no list, no scan button, no hand-off and no way to reach anyone else.

## 4. The kid talks to a guardian

- Top: back, a peach flag ("something is wrong, tell my parent"), listen. Then the guardian's picture and name.
- Bigger voice notes and stickers. No times.
- Bottom: stickers, a tall gold mic, and a call inside the app (comes later). No keyboard.

## 5. The class chat (a teen)

- Top: back to the class, a peach flag to report, listen. Then the class name and a mark of an eye with the class
  board: the teacher sees this chat.
- Voice notes with the speaker's picture and name. A teacher's notice has a gold edge and the class mark on the
  picture. The teen's own notes are on the right.
- Bottom: a keyboard, a wide gold mic, and join the class call (comes later).

## 6. Speak to the class (a teacher)

- Top: back to the class, listen. Then the class chip, an arrow and who will get it: for a class of kids, the 32
  parents (pictures, the number and the family mark).
- A white card while recording: a gold mic in a ring, the wave, the seconds. Below it: a cross to throw it away, a play
  button to hear it first, and a gold tick to send.
- Office hours with a clock: 9 AM to 4 PM. Outside these hours nothing reaches the teacher until the next day.
- Earlier notices, one row each: play, the day, the length, and an ear with how many parents heard it (28 / 32).

## Not drawn

- A parent hearing a class notice. It uses the class screen of the parent (screen 11, the parent).
- The version picker for a person whose variants name the app differently. It is the same as "Home: a tile opened".
- Typing, the sticker picker, the flag's next step, no network, night colours. See `../backlog.md`.
