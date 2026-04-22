# UBUS 670: Day 7 - Introduction to Agentic AI


---

### Slide 1

## Introduction to Agentic AI

From Single AI to AI Teams

UBUS 670 — Day 7 • Week 3

> *Speaker notes: Welcome to Day 7 and the start of Week 3. Over the past two weeks, you've built AI systems, tested them, and hardened them. Today we take a fundamentally different step: instead of making one AI better, we're going to make multiple AIs work together. This is agentic AI — and it's how the most powerful business AI systems actually work.*


---

### Slide 2

### Learning Objectives
- **Define** what makes an AI agent different from a simple LLM call
- **Explain** agent anatomy using the perception-reasoning-action framework
- **Identify** the three orchestration patterns and when to use each
- **Build** a two-agent sequential workflow extending Beacon's email triage


> *Speaker notes: Four objectives today. First two are conceptual — understanding what agents are and how they work internally. Third is about patterns — the blueprints for organizing multiple agents. Fourth is hands-on — you'll actually build a two-agent system in the lab. By the end of today, you'll have built your first multi-agent AI system.*


---

### Slide 3

### From Day 6 to Day 7

**Day 6:** You hardened Beacon's email triage system against adversarial attacks.

**Day 7:** What if you added a second AI to check the first — automatically?

| Day 6 (One AI, Hardened) | Day 7 (Two AIs, Collaborating) |
| --- | --- |
| Humans red-team the AI | A second AI checks the first AI |
| Manual adversarial testing | Automated quality verification |
| One system prompt, hardened | Two agents, each with a specialized role |

> *Speaker notes: Remember how Day 6 ended? We previewed today: "What if one AI could check another?" That's exactly what we're building. On Day 6, YOU were the red team — humans testing AI. Today, we're going to make AI test AI. Agent 1 classifies emails. Agent 2 double-checks the classification. Disagreements get flagged for human review. This is the verification pattern, and it's one of the most practical multi-agent architectures in business.*


---

### Slide 4

### The Limits of a Single AI
- **No self-correction:** If it makes a mistake, it doesn't know
- **No verification:** No one checks its work
- **No persistent memory:** Each conversation starts fresh
- **No tool access:** Can't look things up, send emails, or take actions


**Beacon example:** Your Day 5 email triage system could misclassify an email and never realize it. There's no second opinion, no quality check, no audit trail.

> *Speaker notes: Think about what we built on Day 5. A single AI reading emails and classifying them. It works well most of the time, but it has no way to know when it's wrong. It's like having one employee do every job — triage, quality check, escalation — with no oversight. In any real business, you'd never let one person handle everything without review. The same principle applies to AI. A single LLM call is powerful but fundamentally limited.*


---

### Slide 5

### The Vision: AI Teams

What if AI could work like a well-organized department?

| Single AI | AI Team |
| --- | --- |
| One employee doing everything | Specialized roles with clear handoffs |
| No oversight or review | Built-in quality checks |
| Fails silently | Catches errors before they reach customers |
| One point of failure | Redundancy and verification |

> *Speaker notes: This is the core insight of agentic AI: instead of asking one AI to do everything, you build a team of specialized AIs — each with a clear role, clear inputs and outputs, and clear handoffs. Just like a well-organized business unit. Agent 1 is your triage specialist. Agent 2 is your quality reviewer. Agent 3 might be your escalation manager. Each one does one thing well, and together they create a system that's more reliable than any single AI could be.*


---

### Slide 6

### Agent vs. LLM Call

|  | LLM Call (Stranger) | Agent (Employee) |
| --- | --- | --- |
| Identity | Anonymous, no role | Named role with responsibilities |
| Memory | Forgets after each call | Maintains context across tasks |
| Tools | Can only generate text | Can use tools, databases, APIs |
| Collaboration | Works alone | Passes work to other agents |
| Judgment | Answers once | Can iterate and improve |

> *Speaker notes: Here's the key distinction. An LLM call is like asking a stranger on the street a question. They might give you a great answer, but they don't know your business, they can't look things up, and they'll forget you immediately. An agent is like hiring an employee. They have a defined role, they remember context, they can use tools, and they can hand work off to colleagues. Your Day 5 system was closer to an LLM call — you gave it instructions and it responded. Today we're turning it into an agent with a role, tools, and the ability to collaborate with a second agent.*

****
****
****
****
****


---

### Slide 7

### Agent Anatomy

#### Perception → Reasoning → Action

| Component | What It Does | Beacon Example |
| --- | --- | --- |
| Perception | Receives and understands input | Reads the customer email |
| Reasoning | Analyzes and decides | Classifies category and urgency |
| Action | Produces output or takes action | Routes email, drafts response |

****
****
****


Every agent follows this cycle: perceive the world, reason about what to do, then act. It's how your Beacon triage agent will work — and it's how the Quality Checker will work too.

> *Speaker notes: Think of this like how a customer service representative works. First, they perceive — they read the email. Then they reason — they figure out what kind of issue it is, how urgent it is, what the right response should be. Then they act — they classify the email, route it, and draft a response. Every agent follows this same cycle. Your Triage Agent perceives the email, reasons about its classification, and acts by producing a structured output. Your Quality Checker perceives the original email plus the classification, reasons about whether the classification is correct, and acts by either agreeing or flagging a disagreement.*


---

### Slide 8

### Agent Instructions

#### System Prompts, Evolved

| Day 5: System Prompt | Day 7: Agent Instructions |
| --- | --- |
| Role description | Role + collaboration rules |
| Output format | Output format + handoff format |
| Behavioral rules | Behavioral rules + tool access |
| Works alone | Knows about other agents |

Your Day 5 system prompt becomes Agent 1's instructions. We add: "Pass your classification to the Quality Checker agent for verification."

> *Speaker notes: Agent instructions are an evolution of the system prompts you wrote on Day 5 and hardened on Day 6. They include everything a system prompt has — role, output format, behavioral rules — plus three new things. First, collaboration rules: who does this agent hand off to? Second, tool access: can this agent look things up, send emails, update databases? Third, awareness of other agents: this agent knows it's part of a team. Your Day 5 Beacon system prompt is about to become Agent 1's instructions, with one key addition: "After classifying, pass your output to the Quality Checker."*


---

### Slide 9

### Business Agents in the Wild

| Agent | Perception | Reasoning | Action |
| --- | --- | --- | --- |
| Email Triage | Reads email | Classifies category/urgency | Routes to queue |
| Expense Processing | Reads receipt | Checks policy compliance | Approves or flags |
| Compliance Review | Reads document | Checks against regulations | Flags violations |
| Resume Screening | Reads resume | Matches to job requirements | Ranks candidates |

> *Speaker notes: Agents aren't just for email triage. Look at these business examples — each one follows the same perception-reasoning-action pattern. Expense processing: the agent reads a receipt, checks it against company policy, and either approves or flags it. Compliance review: reads a document, checks regulations, flags violations. Resume screening — and this is a preview of your Days 8-9 capstone — reads a resume, matches it against job requirements, and ranks candidates. The pattern is universal. Once you understand how to build one agent, you can build agents for almost any structured business process.*

****
****
****
****


---

### Slide 10

### Agent Governance

#### Agents Need Oversight, Just Like Employees
- **Trust boundaries:** What can each agent do? What's off-limits?
- **Human-in-the-loop:** When should an agent escalate to a human?
- **Monitoring:** How do you track what agents are doing?
- **Audit trail:** Can you reconstruct why an agent made a decision?


**Key principle:** More agents = more power, but also more governance needed. The Quality Checker isn't just checking Agent 1 — it's also creating an audit trail of every decision.

> *Speaker notes: Here's a critical point that connects back to Day 6's governance discussion. Agents need oversight just like employees do. You wouldn't give a new employee unlimited authority — you'd define what they can and can't do, when they need to ask a manager, and how to track their decisions. Same with agents. Trust boundaries define what each agent is allowed to do. Human-in-the-loop defines when agents should stop and ask a human. Monitoring lets you track what agents are doing in real time. And the audit trail — this is crucial — lets you go back and understand why the system made a particular decision. Your Quality Checker is actually creating this audit trail automatically: for every email, you have Agent 1's classification AND Agent 2's verification.*


---

### Slide 11

#### Checkpoint Quiz 1: Agent Concepts

What is the most accurate distinction between an AI agent and a simple LLM call?

A) An agent uses a newer, more powerful model

B) An agent has a role, memory, tools, and can collaborate with other agents

C) An agent always produces better output than an LLM call

D) An agent requires specialized hardware to run

Correct! An agent has a defined role, persistent memory, tool access, and the ability to collaborate — making it fundamentally different from a one-shot LLM call.

Not quite. The key distinction is that an agent has a defined role, persistent memory, tool access, and the ability to collaborate with other agents — not just model power or output quality.

> *Speaker notes: Let's do a quick check. This question tests whether students grasp the core distinction we've been building. The answer is B — agents have a role, memory, tools, and collaboration ability. It's not about model power, output quality, or hardware.*


---

### Slide 12

## Orchestration Patterns

How Agents Work Together

> *Speaker notes: Now that we understand what agents are, let's talk about how they work together. There are three fundamental patterns for organizing multiple agents: sequential, parallel, and loop. Each pattern fits different business scenarios, and knowing which to use is a crucial architectural skill.*


---

### Slide 13

### Sequential Pattern

#### The Assembly Line

Agent A → Agent B → Agent C

**Beacon example:**

Email → **Triage Agent** (classifies) → **Quality Checker** (verifies) → Final output


Each agent's output becomes the next agent's input. Like an assembly line, work flows in one direction.

**Best for:** Tasks with natural dependencies where step B needs step A's output.

> *Speaker notes: The sequential pattern is like an assembly line. Work flows from Agent A to Agent B to Agent C, each one adding value. This is what you'll build today in the lab: the email goes to the Triage Agent, which classifies it, then the classification goes to the Quality Checker, which verifies it. Each agent's output becomes the next agent's input. It's the simplest multi-agent pattern, and it's the one that maps most naturally to the verification use case. Sequential is best when there are natural dependencies — Agent B can't start until Agent A is done.*


---

### Slide 14

### Parallel Pattern

#### Multiple Analysts Working Simultaneously

Multiple agents process different inputs at the same time, then results are merged.

**Beacon example:**

100 emails arrive → 5 Triage Agents work simultaneously → Results merged


**Trade-off:** Faster processing, but agents don't share context.

**Best for:** Independent tasks that don't need each other's output.

> *Speaker notes: The parallel pattern is like having five analysts each working on different reports at the same time. Instead of processing 100 emails one by one, you spin up 5 triage agents that each handle 20 emails simultaneously. It's dramatically faster, but there's a trade-off: the agents don't share context with each other. Agent 1 doesn't know what Agent 3 classified. This is fine when tasks are independent — each email can be classified on its own. But if tasks need to share information, parallel won't work.*


---

### Slide 15

### Loop Pattern

#### Iterative Refinement

Agent produces output → Reviewer checks → If not good enough, try again.

**Beacon example:**

Triage Agent classifies email → Quality Checker reviews → If DISAGREE, Triage Agent reclassifies → Repeat until AGREE or max attempts reached.


**Trade-off:** Higher quality output, but costs more (each loop = more API calls).

**Best for:** Tasks where output quality matters more than speed or cost.

> *Speaker notes: The loop pattern is like iterative editing. An agent produces a draft, a reviewer checks it, and if it's not good enough, the agent tries again. In our Beacon example, imagine the Triage Agent classifies an email, the Quality Checker disagrees, so the Triage Agent gets the feedback and reclassifies. This repeats until they agree or you hit a maximum number of attempts. The trade-off is clear: higher quality, but more expensive — each loop iteration costs another round of API calls. Use loops when quality matters more than speed, like in compliance review or legal document analysis.*


---

### Slide 16

### Which Pattern Should You Use?

| Pattern | Use When | Tradeoff | Example |
| --- | --- | --- | --- |
| Sequential | Tasks have dependencies | Slower but reliable | Triage → Quality Check |
| Parallel | Tasks are independent | Fast but no shared context | Batch email processing |
| Loop | Quality > speed | Better output but costly | Draft → Review → Revise |

****
****
****


**Today's lab:** You'll build a **sequential** pipeline. The dependency is clear: the Quality Checker needs the Triage Agent's output to do its job.

> *Speaker notes: Here's your decision matrix. When choosing a pattern, ask: Are the tasks dependent on each other? Use sequential. Are they independent? Use parallel. Does quality matter more than speed? Use a loop. In today's lab, you'll build sequential because the dependency is obvious — the Quality Checker can't check a classification that doesn't exist yet. But in the Days 8-9 capstone, you might use a combination: parallel agents to parse multiple resumes simultaneously, then a sequential pipeline to evaluate and rank them.*


---

### Slide 17

#### Checkpoint Quiz 2: Pattern Selection

Beacon needs to process 500 emails overnight. Each email can be classified independently. Which pattern is most appropriate?

A) Sequential — process each email one after another

B) Parallel — multiple agents process emails simultaneously

C) Loop — keep reclassifying each email until perfect

D) No pattern needed — one agent can handle 500 emails

Correct! Since each email can be classified independently, the parallel pattern is ideal — multiple agents working simultaneously for maximum throughput.

Not quite. Since the emails are independent — no email's classification depends on another — the parallel pattern is the best fit. Multiple agents process emails simultaneously for speed.

> *Speaker notes: This tests pattern selection. The key phrase is "each email can be classified independently." That means no dependencies between tasks, which points directly to parallel. Sequential would work but would be unnecessarily slow. Loop adds cost without clear benefit for straightforward classification. The answer is B.*


---

### Slide 18

### Today's Lab Preview

#### Building Your First Multi-Agent System

| Part | What You'll Build | Time |
| --- | --- | --- |
| Part 0 | Setup — tool account and interface tour | 15 min |
| Part 1 | Agent 1 — Triage Agent (your Day 5 system prompt) | 25 min |
| Part 2 | Agent 2 — Quality Checker (new verification agent) | 25 min |
| Part 3 | Connect — sequential pipeline, end-to-end testing | 20 min |
| Part 4 | Document — architecture doc and CTO pitch | 15 min |

> *Speaker notes: Here's what you'll build in the lab. Five parts, 100 minutes total. You'll start by setting up your tool — either ADK Visual Builder or MindStudio, depending on which version your instructor assigns. Then you'll build Agent 1, which is basically your Day 5 system prompt turned into an agent. Agent 2 is new — a Quality Checker that reviews Agent 1's work. Part 3 is the exciting part: you connect them into a sequential pipeline and test with 5 emails, including one that has an embedded misclassification trap from Day 6. Part 4 is documentation and reflection.*


---

### Slide 19

### Key Takeaways
1. **Agents > LLM calls** for complex business tasks — roles, memory, tools, collaboration
1. **Perception → Reasoning → Action:** every agent follows this cycle
1. **Three patterns:** Sequential (dependencies), Parallel (independent), Loop (quality)
1. **Start with verification:** The most practical first step in multi-agent AI


> *Speaker notes: Four takeaways. First, agents are fundamentally more capable than LLM calls for real business tasks because they have roles, memory, tools, and can collaborate. Second, every agent follows the perception-reasoning-action cycle — once you see this pattern, you can design agents for any business process. Third, the three orchestration patterns — sequential, parallel, and loop — are your architectural toolkit. Know which to use when. Fourth, the verification pattern — one agent checking another — is the most practical starting point for any business deploying AI. It's simple, it adds immediate value, and it builds trust in AI decisions.*


---

### Slide 20

### Coming Next: Days 8-9

#### Resume Screening Capstone

From email triage to talent acquisition — 3+ agents working together:

| Agent | Role |
| --- | --- |
| Parser Agent | Extracts structured data from resumes |
| Evaluator Agent | Scores candidates against job requirements |
| Ranker Agent | Ranks candidates and generates shortlist |

****
****
****


Today you build a 2-agent pipeline. On Days 8-9, you'll build a 3+ agent system that screens real resumes. Same patterns, bigger scale.

> *Speaker notes: On Days 8-9, we scale up. You'll build a resume screening system with three or more agents. The Parser Agent reads resumes and extracts structured data — name, skills, experience. The Evaluator Agent scores each candidate against the job requirements. The Ranker Agent takes all the scores and produces a ranked shortlist. It's the same patterns you learn today — sequential pipeline, verification — but at a bigger scale. Today's lab gives you the foundation you need for the capstone.*


---

### Slide 21

## Questions?

Before we head into the lab...

> *Speaker notes: Open the floor for questions before the lab. Common questions: "Is this how ChatGPT works?" (Partially — ChatGPT uses agents internally for tool use.) "How much does a multi-agent system cost?" (More than single-agent, but the verification pattern catches errors that are far more expensive.) "Will we build the capstone from scratch?" (You'll build on today's foundations.)*
