# Parakh: product case

For Imran, 24, in `persona.md`.

## 1. The problem
"Ten job messages come every day. One may be real. I paid once and lost it. Now I do not reply to any, and maybe I
am losing a real job too."

## 2. Jobs to be done
- When an offer comes, tell me within a minute if it is real, a trap, or not clear.
- Tell me the reason in one line, so I learn to see it myself.
- When it is not clear, tell me the one thing to ask or check before I go further.

## 3. What it is not for
- Not a job board. It does not find jobs.
- Not a resume or interview tool.
- It never asks for money from a seeker and never passes his details to a recruiter.

## 4. The number
**Checks where the seeker did what the verdict said**, as a share of all checks. Target: 80%.

Guardrails that must not get worse:
- A trap marked "real" is the worst failure. Target: none. When unsure, say "not clear".
- Real offers marked "trap" stay under 1 in 20.
- A verdict comes within 60 seconds.

## 5. The riskiest assumption
From what a seeker can forward (a message, a number, a company name, a letter), we can judge right often enough to
be trusted. One wrong "real" breaks the product.

## 6. Test with 5 real job seekers
- Who: 5 people who have been looking for work for 6 months or more. sumeet recruits them.
- How: clickable screens. Each person brings 5 job messages from their own phone. sumeet does the checking by hand
  behind the screen, with 10 minutes per message, and gives the verdict in the app's form.
- Before the test, sumeet checks the same 25 messages properly so the right answer is known.
- Pass: verdicts are right on at least 22 of 25 with no trap marked real, and 4 of 5 people say they would act on
  it.
- If it fails: narrow to the one kind we can always judge, "anyone who asks you to pay is a trap", and test that as
  a plain rule spoken aloud.
