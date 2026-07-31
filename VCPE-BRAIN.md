# VCPE Brain — Bower LEAD, Cohort 2

*Frameworks from Sharath's own programme, distilled for use in teardowns.
Every entry is traceable to a session so a post can cite where he learned it.*

---

## Reading status — be honest about this

| | |
|---|---|
| Sessions in the Drive folder | **20** |
| Fully read | **0** |
| Partially read | **1** — *Financial Analysis of Young Companies* (Biswadeep, 21 Mar 2026), ~40%: lines 1–850 and 860–1320 of 3,396 |
| Downloaded, not yet read | 14 Feb session · Financial Modelling I & II · Prioritising Target Industries |
| Not downloaded | 15 others |

Raw corpus is roughly 350k tokens — more than fits in one session. Plan:
read 10–20% per session and extend this file each time.

**Do not cite a framework from here in a post unless it appears below with a
timestamp.** Everything below was read directly, not skimmed or inferred.

---

## Session: Financial Analysis of Young Companies
**Biswadeep · 21 March 2026 · 189 min**

### Why young companies are analysed differently `[0:14:24]`

Five structural problems:
1. **Under three years of data** — no reliable trend baseline. Any growth
   rate could be noise or momentum, and financials alone cannot separate them.
2. **They burn cash.** Traditional profitability ratios are not merely
   uninformative, they are *misleading*.
3. **Business models change.** Financials from 18 months ago may describe a
   different company.
4. **India-specific: the MIS lives in Excel**, built by a founder or junior
   finance hire. *"Every MIS you receive should be treated as a hypothesis
   until you've audited it."*
5. **Related-party transactions** distort both P&L and balance sheet.

### The five-minute diligence check `[0:21:35]`

> *"Does the cash balance on the balance sheet match the closing balance on
> the cash flow statement?"*

Roughly **one in five** early-stage MIS documents fail this. A mismatch means
either the model was assembled from unlinked documents, or something is being
obscured. Both are problems.

Related: **always request the live Excel, never a PDF.** `[0:19:32]` A PDF
cannot be audited for formula accuracy or linkage integrity. *"If a company
gives you a PDF, you should ask why."*

### The margin cascade `[0:26:52]`

```
Gross margin %   = (revenue − COGS) / revenue
      ↓            the CEILING on all subsequent profitability
CM1              = gross margin − variable sales costs
      ↓            is this product profitable per customer?
CM2              = CM1 − allocated fixed sales costs
      ↓            is this channel self-sustaining?
EBITDA           = CM2 − G&A
                   the OUTPUT, not the first thing to look at
```

*"You cannot have a CM1% higher than your gross margin percentage."*

In startups **COGS includes all variable fulfilment cost** — logistics,
packaging, gateway fees, returns processing. `[0:23:38]` **In D2C, logistics
alone runs 8–15% of revenue.**

### The test that matters most `[0:26:19]`

> *"A large negative EBITDA can be acceptable if the unit economics are
> strong and improving — it suggests losses are a function of scale, not a
> broken business model. On the other end, a company can show revenue growth
> while its unit economics are deteriorating. **And that is a far more
> serious problem than problem number one.**"*

And `[0:46:21]`:

> *"In VC and PE analysis, the level of EBITDA is far less important than its
> trajectory."*

### CAC and LTV `[0:29:09]`

- **CAC** = *all* S&M spend ÷ net new customers. Not just digital ads —
  sales headcount, events, agency fees.
- **Split paid vs organic.** `[0:30:14]` For Indian D2C, organic CAC is
  dramatically lower. *"If the business shows improved blended CAC but
  increasing reliance on paid channels, the trend is worse than it looks."*
- **CAC payback** = CAC ÷ monthly CM1 per customer. Under **9 months** is
  strong for Series A.
- **LTV** = ARPO × frequency/yr × lifespan(yrs) × GM%.
  Biswadeep stress-tests by **cutting frequency and lifespan 20–30%**.
- **LTV/CAC ≥ 3:1** is the VC minimum. Below 1, the business destroys value
  per customer — *"not a stage issue, an issue with the business model
  itself."* Above 5, there is room to spend more and grow faster.

### Revenue slicing `[0:32:28]`

A single revenue number hides several stories. Three cuts:
1. **Volume × price** — did growth come from units or from pricing?
2. **Channel mix** — a shift toward lower-margin channels signals strategic
   pressure and can mask deterioration.
3. **Product/customer quality** — premium vs mass SKU, new vs repeat,
   promotional vs full price.

*"Revenue growth driven by deep discounting is not the same as organic
demand-led growth."*

**The question to ask a founder** `[0:35:18]`: *"Can you show me the P&L by
channel and separately by product?"* Many won't have it prepared — that's
fine. Whether they *can* prepare it tells you about their financial maturity.

### Cost normalisation — Indian specifics `[0:38:50]`

- **Founder salary**: commonly ₹1–4L/month against a ₹15–25L market rate,
  *"done deliberately to improve EBITDA presentation."* Normalise it.
- **Rent**: often the founder's own property at zero. Check whether it's a
  real number.
- **ESOP charge**: Ind AS 102 requires it in the P&L; many skip it. Ask for
  the pool, vesting schedule and implied monthly expense, then add it back.
- **Finance costs**: for NBFC-funded working-capital-heavy businesses, **3–5%
  of revenue.**
- **Discounts**: some book as contra-revenue, some as sales cost. The choice
  materially changes reported gross margin — always check which.

### Operating leverage — the worked example `[0:45:23]`

Revenue **+98%**, G&A **+14%** over six months.
> *"That is the true definition of operating leverage."*

### Cohort analysis `[0:48:24]`

Separates two effects that aggregate metrics blend:
- **Vintage improvement** — is the business getting better at acquiring?
- **Cohort maturity** — do customers get more valuable the longer they stay?

Worked example: CAC fell ₹2,400 → ₹1,600 across nine months (33% better),
month-6 CM1 rose, CAC payback fell from 5 months to ~2.5–3.

### Balance sheet: the four P&L linkages `[0:52:18]`

| P&L event | Balance-sheet consequence | Warning sign |
|---|---|---|
| Revenue on credit | trade receivables | receivables growing faster than revenue |
| COGS | inventory | rising inventory = producing more than selling |
| Purchases on credit | trade payables | high payables = supplier leverage **or** cash stress |
| Net cash flow | cash balance | must equal cash-flow closing balance |

### Working capital and the cash conversion cycle `[1:11:01]`

```
CCC = DIO + DSO − DPO

DIO = inventory / COGS × 365
DSO = receivables / revenue × 365     B2B 60–90 normal; >90 watch
DPO = payables / COGS × 365           >90 in Indian MSME = stretching, not strategy
```

> *"A rising cash conversion cycle signals cash is being absorbed by the
> working capital cycle faster than the business generates it. This is a
> leading indicator of a cash crunch, often appearing months before it shows
> up in the cash balance."* `[0:54:19]`

**Negative working capital is a structural advantage** `[1:10:40]` — the
company is funded by its suppliers and customers.

> *"Companies like Zomato and Swiggy today have a negative cash conversion
> cycle. They collect from customers and merchants before they pay their
> delivery partners and suppliers. That structural float gives them a
> significant cash advantage over companies that must fund their own working
> capital."* `[1:14:17]`

### Inventory `[1:14:48]`

- **Current** (sold within 60 days) = liquid, healthy
- **Non-moving** (>120 days) = stranded capital
- Red flag: non-moving growing **faster** than total inventory

Ask for: SKU-level aging (aggregates hide which lines are dead), the
write-off policy (*"we haven't written off any inventory"* is either
impressive or a dressed-up balance sheet), valuation method (FIFO/weighted
average — it changes reported COGS), and **insurance**.

**On perishables** `[1:17:38]` — directly relevant to dairy and food:

> *"If there are perishables, there is very little you can do. Perishables
> have a very short shelf life and liquidating them may not be an option.
> Even if perishables have to be maintained, that means additional
> warehousing costs like refrigeration… For most perishable items, they are
> written off almost immediately."*

### Receivables `[1:19:19]`

Aging buckets: 0–30 current · 31–60 acceptable · 61–90 watch zone · 90–120
requires provisioning · **>120 effectively non-performing.**

DSO above **45 days** for a product business signals aggressive credit terms
or collection problems. **Concentration risk:** top three debtors above
35–40% of receivables is a credit concentration.

### Section-one summary, in Biswadeep's words `[1:00:43]`

1. The MIS is the primary analytical tool — always the live Excel.
2. Go beyond revenue and EBITDA; the cascade is multi-layered.
3. **Gross margin, CM1 and CAC matter more than EBITDA.** EBITDA is the
   output; the others are the inputs.
4. LTV/CAC ≥ 3:1 minimum. Below 1 the thesis is broken regardless of
   anything else.
5. Revenue slicing and cohorts separate quality growth from quantity growth.
6. P&L and balance sheet are one document, linked by working capital. CCC
   measures the quality of that linkage.

**Recommended reading given in class:** Charles Melwicke (spelling
uncertain — Biswadeep flagged it himself), on early-stage financial analysis.

---

## Applying it: Sid's Farm

The company is Hyderabad-based, subscription dairy, **perishable inventory**.
The frameworks that bite:

| Framework | Sid's Farm FY25 | Reading |
|---|---|---|
| EBITDA trajectory `[0:46:21]` | loss ₹10.5 Cr → ₹27 Cr | worsening |
| Unit economics direction `[0:26:19]` | ₹1.09 → ₹1.17 spent per ₹1 earned | **deteriorating — the "far more serious" case** |
| Gross margin ceiling `[0:27:09]` | materials ₹126 Cr on ₹168 Cr revenue → **GM ≈ 25%** | the ceiling is low |
| D2C logistics 8–15% `[0:23:52]` | distribution ₹8 Cr + transport ₹5 Cr = **7.7%** | inside the band |
| Operating leverage `[0:45:23]` | revenue +38%, expenses +47% | inverted — costs outgrew revenue |
| Perishables `[1:17:38]` | milk; no salvage value | inventory risk is structural, not managerial |
| Negative CCC advantage `[1:14:17]` | subscription prepay vs farmer payment terms | **open question — the most interesting one** |

**The unresolved question worth asking publicly:** a subscription dairy could
plausibly run a *negative* cash conversion cycle — customers prepay monthly,
farmers are paid on a cycle. If so, that's the Zomato-style structural float
Biswadeep describes. With cash at ₹1 Cr against ₹45 Cr current assets, the
filing doesn't answer it. That is exactly the question this framework teaches
you to ask.

---

## Read next

Priority order for future sessions, by usefulness to teardowns:

1. **Financial Analysis** — remaining 60% (projections, scenarios, valuation, returns)
2. **Financial Modelling I & II** (Biswadeep, 14 Mar) — the modelling mechanics
3. **Setting a Structure to Evaluate Companies** (Ajay Jain, 7 Mar)
4. **Prioritising Target Industries** (Biswadeep, 22 Feb)
5. **Evaluations Check-in** I–III + **Structuring the Transaction** (Satya Bharadwaja)
6. **Navigating the Approvals** (Satya Bharadwaja, 10 Apr)
7. Masterclasses — Fintech, Enterprise SaaS, Fixed Income, AI/ML (sector lenses)
8. 14/15/21 Feb foundation sessions · Activities · Assignments
