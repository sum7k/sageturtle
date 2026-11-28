# CubeGullak apps: the idea

One PWA with 13 apps for Indian people of every age. Each person sees the apps in a variant that fits their life. The live design map is at https://claude.ai/artifact/KBQ1Cuj8GjVKK5e9nT5A6G and its source is in `docs/variant-map.html`.

## Launch plan (2026-11-28)

The product is CubeGullak (cubegullak.com); it was SageTurtle before. Apps are made and released one by one.
Home has 11 buttons. The first row is open: Book (a study app that teaches reading), Horoscope and Khabri. The other
eight (Earnings, Reminders, Hobbies, Meetings, Messages, Discussions, Events, Directory) are locked: a tap shows a lock
and is counted, so we see which app people want next. Icons are placeholders. The top of Home is the ad spot; for now
it asks "What functionality would you want next?" and opens a form. A simple registration is required. The owner sees
taps, distinct users and the answers on an admin panel at cubegullak.com/admin. Everything runs on Cloudflare.

The rest of this file describes the full product that the launch grows into.

## The 13 apps

Wisdom, News, Learn, Earn, Reminders, Hobbies, Meetings, Messages, Discussions, Events, Yellow Pages, Advertise, Me.

Me holds the profile, username, family, child control and friends. The other apps read from it.

Wisdom is the first tile on Home: a list of quotations, each retold as a short moral story that differs by variant. It is designed only and built last. See `wisdom/idea.md`.

## The 11 variants

Kids (6 to 12), Teens (13 to 17), College students, Job seekers, Salaried professionals, Business owners and shopkeepers, Gig and daily-wage workers, Farmers and rural users, Homemakers, Teachers, Retired and senior citizens.

- Parent is not a variant. Guardian is a role that any adult can hold.
- Each variant has its own names for the apps.
- The backend is the same for all variants. A variant is only settings: names, theme, tone, default topics, which apps are on, safety rules.

## Accounts and family

- Every account belongs to an adult. Kids and Teens are profiles that the adult creates in Me. A child cannot sign up alone.
- The owner's biometric approves any change to a child's profile.
- The owner adds teachers and others as guardians. A child can message only their guardians.

## Install and first run

- The website shows a landing page. Its only button is Install.
- Onboarding: 11 language blocks, then the lock, PIN code, the variant and khabar alerts. This is the registration.
- First open asks for biometrics. The device PIN is the fallback. Changing variant asks again.
- The 11 languages: Hindi, English, Bengali, Marathi, Telugu, Tamil, Gujarati, Urdu, Kannada, Odia, Malayalam.
- Screens use words. There is no voice. Media is used only where it truly adds value. People who cannot read are taught in Book.

## Money

- All apps are free with ads. A subscription of 1,200 rupees a year removes ads. Payment is by UPI QR through Dodo Payments.
- Kids and Teens see no ads. The News page and Wisdom have no ads.

## News

- News is called Khabri in every variant. It is the one name that binds all the variants together.
- News is pushed, one khabar at a time, and builds on the Khabri project (github.com/sum7k/Khabri).
- The aim: a person gets the good, latest things here and no longer needs social networks to find them.
- Indian news, plus global nature, science and health. Each variant also gets hit music and videos for its age group. Kids get children's news, songs and videos.
- How a khabar is made: topics come from chosen X handles (about 50 US dollars a month). Khabri picks, gathers facts, and writes each khabar from scratch as one khabar, easiest part first, with more detail as one reads on. It is produced in the 11 languages as text.
- No site crawling.
- Video plays in the YouTube player. Adults also get the Spotify player.

## Look

Khabri's theme for all 13 apps: sky ground, navy ink, gold for the main action, soft tints, drawn sun-and-hill pictures, round cards, pill buttons.
