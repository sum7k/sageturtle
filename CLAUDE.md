# BodhiLabs

The app is in `apps/` (start with `apps/README.md` and `apps/docs/context/`). Work on `dev`.

## The spirit of BodhiLabs (sumeet, 2026-11-28)

Read this before writing any screen, word, story or number a learner will see.

**Each learner is an individual, and stays one at every stage.** They are in the world to learn good things, the
things they like and want to do, and to go forward with knowledge in a structured way, at their own pace. Their
learning is their own. It has nothing to do with anyone else's.

So:

- **No comparison and no competition.** No ranks, leagues, leaderboards, "top learners", "ahead of others", races or
  prizes for beating someone. Progress is shown only against the learner's own past.
- **Never "become like X".** A learner is not asked to copy, imitate or act like anyone, and is never told "you think
  like X" or "you can be the next X".
- **Lives and stories show the person's road, not a model to copy.** Tell their struggle, how they worked, what they
  valued, what was strong in them and how that grew. Do not say "they read this, so you read it too", and do not
  end with "you too can be great". The learner takes what speaks to them.
- **Greatness is not the bait.** A story is not "see how great they were, now you be great". It is "this is how one
  person lived and learned".
- **Words to the learner are calm and kind.** Say what is going well and what needs more practice. No shame, no
  pressure, no fear of falling behind.
- **This is taught again and again**, in many places in the app, not once.

If a feature, a line of copy or a number on a screen goes against this, change it or leave it out.

## Who tells a chapter (sumeet, 2026-11-28)

**Every chapter is told in the voice of a great person of its field**, at every stage, class 1 or class 10:
Brahmagupta on zero, al-Khwarizmi on algebra, Euclid on proof, Ibn al-Haytham on light, Leonardo on drawing, Gauss,
Newton, Einstein, Feynman, and Indian, Arab and other voices alike. Who explains a thing matters; each of them had
their own way of seeing and saying it. A voice may tell more than one chapter.

- **Write as that person, in the first person.** Before writing, tell yourself "I am X, and I am writing this
  chapter", and use what is known of how they thought: their own examples, their words for things, the order in
  which they reasoned. Never write in an AI's or a textbook's voice.
- **Be honest about it.** The screen says "told in the voice of X" and that the words are BodhiLabs' own
  (`apps/lib/narrators.js`). Never make up a sentence and present it as a real quotation, and never put a fact in
  their mouth that is not true. Where later people corrected them, they say so themselves.
- **The spirit above still holds.** The narrator teaches the subject; they are not held up as someone to copy, and
  they never compare the learner with anyone.
- A chapter keeps one teller from start to end, and one recorded voice (a man's or a woman's, as fits). Each
  lesson opens with the teller saying who they are (`apps/lib/lessons.js`).

The first one is `apps/lib/chapters/zero.js`: Number, stage 6, told in the voice of Brahmagupta.

## Why each app exists (sumeet, 2026-11-28)

Every app (a house on Home) has a purpose: why it is there, who it is for and what it wants to achieve. Any work on
an app follows its purpose. If a feature or a line of content goes against it, change it or leave it out. A house
whose purpose is not written yet is not built until sumeet defines it.

**ज्ञान, Gyan (Knowledge), house 1.** Learning for every child, from the year before school to class 11: a full
school year at each of the twelve stages, as good as a parallel school, so a child needs no other book. Walked by
stage, at the learner's own pace, following what they like. Each learner stays an individual: no comparison, no
competition, progress only against their own past (the spirit above). Built as a cube of twelves: twelve stages,
twelve subjects in each, twelve lesson houses in each subject.

**वर्तमान, Vartaman (Present), house 2.** People who have learned to read and write now live in the world: they work,
play, enjoy and express themselves, so they need to know what is going on that matters to them. Vartaman brings the
news of the present that has weight for a person who wants to do something in life, whether a child or an old
person, whatever their work, so they can read about many fields and understand them.
- Leave out petty crime and local incidents ("someone was killed in Kenya": nothing to do with the reader). There is
  no crime or court topic.
- Bring in big events that touch people's lives or work, such as a war that affects trade, prices or safety.
- Plain words that every age can read, children too: no brutality, violence or sexuality in detail, no
  sensationalising, no fear.
- Each house holds eleven items; its twelfth is for past news.

**जीवनी, Lives, the twelfth subject of every stage.** The lives of people of every field and land, told as their
road: their struggle, how they worked, what they valued, what was strong in them and how it grew. A life is never
bait for greatness and never "become like X" (the spirit above); the learner takes what speaks to them.

**Houses 3 to 12 on Home, and the joker in the middle.** To be defined by sumeet.
