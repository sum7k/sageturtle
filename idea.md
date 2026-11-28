# Surya AI Services

## Reason

Today an AI agent can write a working app in a day. But making it ready for production still takes weeks. The app needs many more parts: a database, login, a model gateway, RAG, guardrails, key management, human review, monitoring, backups and others. Each part must be built and joined by hand. Surya closes this gap. The same AI agent that writes the app also adds these parts and runs the app.

## What it is

Surya is an AI first PaaS. It gives all the building blocks needed to build and run software. We call one building block a "product".

The user develops the app on his own machine. When the app needs a product, his AI agent uses a skill of Surya to add it. Surya keeps the list of provisioned products of each app.

## Who it is for

The same platform serves three kinds of users:

- A solo builder who works with an AI agent.
- A small team or a startup.
- A big company that wants to take its AI pilots to production.

## How it works

1. The user makes an account on Surya and pays in advance.
2. The user writes the app on his own machine, with his AI agent.
3. When the app needs a product, the AI agent uses the skill of Surya for that product.
4. The skill does two things. It changes the code of the app, and it prepares a Terraform change for the resource. It does not apply the change.
5. Surya shows the plan to the user, in our own words: what will be added, what will be changed, what will be removed, and the price. The plan does not say where we host.
6. The user approves or refuses the plan on a Surya page. The AI agent cannot approve it.
7. If he approves, Surya applies the Terraform. The product stays "pending" until the apply and the code change are both done. If he refuses, or one of the two fails, Surya removes the resource.
8. Surya adds the product to the list of provisioned products of this app.
9. The app runs on Surya. The use of each product is taken from the prepaid balance of the user.

## Roles

The steps above are written for one person. A team and a big company need three roles:

- The owner of the balance. He pays money in.
- The person who may add a product to an app.
- The person who may approve the work of the AI.

A solo builder holds all three roles.

## The products

| Product | What it does |
| --- | --- |
| Storage | Keeps the files of the app while the app runs. It can keep versions of a file. |
| Database | Keeps the structured data of the app. |
| Context memory | Keeps what the AI of the app must remember from one call to the next. |
| RAG | Finds the right pieces in the documents of the user and gives them to the model. |
| Training | Trains or fine-tunes a model before the app goes to production. |
| Evaluation | Tests and scores the model after training, and watches its quality in production. |
| Key management | Keeps the keys and the secrets of the app safe. |
| Human in the loop dashboard | A page where a human checks and approves the work of the AI. |
| Monitoring | Shows the health of the app in production: errors, speed, use and cost. Logs and traces are inside it. One trace shows the model, the tool calls, the tokens and the cost of one request. The prompt is stored only when the owner of the app turns it on. |
| User analytics | Shows who uses the app and what they do in it. |
| Authentication | Login and accounts for the end users of the app. |
| Model gateway | One place for all LLM calls of the app, with a spend limit, a fallback model and a cache. The cost is taken from the prepaid balance. |
| Background jobs | Runs long tasks, queues and timed jobs. |
| Guardrails | Checks the input and the output of the model: prompt injection, private data and harmful output. |
| Rate limits | Sets a limit for each end user, so one end user cannot finish the prepaid balance of the app owner. |
| Domain | Buys the domain, and manages its DNS and its TLS certificate. |
| Email and notifications | Sends mail and alerts to the end users of the app. |
| Environments | Gives a test copy of the app, versions, and a way to go back to an older version. |
| Backup and restore | Keeps copies of the data of the app and brings them back when needed. |
| Teams and audit log | Roles, single sign-on, and a record of who did what. |

This list is not final. More products will come.

A code repo is a separate product from Storage. Both can keep versions, but they are offered for different needs. We do not support a code repo for now.

## Hard rules

These rules never break.

1. Each app sees only its own data: its files, its database, its memory and its keys. No app can read the data of another app or of another customer.
2. A secret of the platform never goes into an app, a log, or the context of the AI agent.
3. The key held by the AI agent can never apply a Terraform change, buy a domain, change DNS or read a secret.
4. A human says yes before any Terraform change is applied, and before a domain is bought, before DNS changes, and before a training run starts. He says yes on a Surya page. The AI agent cannot say yes for him.
5. For the products paid per use, a human sets a spend limit for the app once. The AI agent works freely inside this limit. It cannot cross it. Use of a product that already exists is not a Terraform change.
6. The Key management product never returns a secret to the AI agent and never writes a secret into a file.
7. Monitoring stores by default only the model, the token count and the cost of a request. It does not store the prompt. The owner of the app can turn prompt storage on. Then secrets are masked, the prompts are deleted after a short time, and only chosen roles can read them.
8. A user can never spend more than his prepaid balance. Surya stops new work while some money is still left, so that work already running cannot cross zero.
9. The token that applies Terraform, and the Terraform state, stay with Surya. They never go to the user's machine, the app, or the AI agent.

Why rules 3, 4, 5 and 9 exist: the AI agent reads code and files. A hidden instruction in them can ask the agent to add a costly product, buy a domain, point the domain to the machine of an attacker, or write a secret into the code. If the agent holds the token, it can apply that change itself and type its own yes.

## Price and billing

- The user is not told where we host. The hosting is our own inner matter.
- We set our own price for each product.
- The user gets one overall bill for everything he uses.
- The billing is prepaid. The user pays first. His use is taken from his balance.
- There are two kinds of price. Some products are paid once, like a domain. Some are paid per use, like the Model gateway. The price of each product says which kind it is.

## Open points

- The price of each product.
- What one app is.
- How the app goes from the machine of the user to Surya.
- What happens to an app and its data after the prepaid balance becomes zero.
- How the user pays money into his balance.
- Which role gives the human yes of hard rule 4 and sets the spend limit of hard rule 5.
- Training: our hosting cannot train a model. Do we add one named outside provider for training?
- How long a stored prompt is kept, in hard rule 7.
- The open source licenses.
