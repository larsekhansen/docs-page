# IA rationale: JTBD-first navigation, Diataxis as intra-structure

## Summary decision
We organize the documentation primarily by **Jobs To Be Done (JTBD)** ("what am I trying to accomplish?") and use **Diataxis** (tutorial/how-to/reference/explanation) as a **secondary, intra-structure** once the reader is already in the right "job track".

In short:
- **JTBD answers:** “Why am I here / what do I need to get done?”
- **Diataxis answers:** “What kind of doc is the best vehicle for this piece of knowledge?”

## Why JTBD should be the outer structure
### 1) People navigate by purpose, not by document genre
A typical visit starts with an intention:
- “What is this product/capability?”
- “How do I implement X?”
- “Why did my integration fail?”
- “Where is the exact API field definition for Y?”

These are *goals* (jobs). JTBD aligns the left navigation and landing pages with those goals, so users can quickly orient themselves and choose the path that matches their situation.

### 2) Diataxis behaves more like an organization model than a discovery model
Diataxis categories can be useful for clarity and editorial discipline, but as a *primary* navigation system it often feels like:
- a folder/archive taxonomy
- a library classification system
- “how the docs are stored” rather than “how the docs are used”

In practice, users rarely arrive thinking “I need an Explanation” or “I need a Reference”; they arrive with a problem to solve.

### 3) Testing and experience: Diataxis naming is often a hurdle
The category names (especially “Explanation”) can be ambiguous to many readers. When used as the top-level navigation, it can increase cognitive load and create friction:
- users must interpret the taxonomy before they can start searching for content
- teams disagree on where content belongs
- “misfiling” becomes common, which erodes trust in the navigation

### 4) JTBD supports product-level storytelling and coherence
JTBD-first structure makes it easier to:
- define what “success” looks like for the reader
- surface the right prerequisites
- ensure the path from “new here” to “shipping” is obvious
- maintain consistency across products

## Why Diataxis still matters (as intra-structure)
### 1) It’s good editorial scaffolding
Once a user is in the right JTBD area, Diataxis can help ensure content is written in the right form:
- tutorials for onboarding and learning-by-doing
- how-to guides for task completion
- reference for precise facts and specifications (e.g. API fields)
- explanation for conceptual grounding, tradeoffs, and “why”

### 2) It fits well as a filter/sectioning mechanism
Within a JTBD theme, Diataxis categories can be used to:
- group pages into predictable sub-sections
- provide stable anchors for scanning
- support “I know what I want now” behavior without forcing it at the very top

### 3) Many pages can still be classified cleanly
Especially for API/platform documentation, a lot of content can be categorized reasonably well. The key is *not* requiring readers to pick the taxonomy before they’ve found the right area.

## Mental model (book vs library)
A useful analogy:
- **Diataxis** is like organizing the *contents of a single book*:
  - “how to use this book” (tutorial)
  - “procedures” (how-to)
  - “index / glossary / specifications” (reference)
  - “theory / background chapters” (explanation)
- **JTBD** is like organizing a *library of many books*:
  - first you find the right book/topic by your purpose
  - then you use the right parts (index/reference/how-to) once you’re in it

## Practical implications for this docs portal
### Navigation
- Left sidebar (product scope) should lead with **JTBD themes**.
- Within a theme, pages can be grouped/filtered by **Diataxis**.

### URLs and metadata (guiding principles)
- URLs should reflect the JTBD grouping so the structure is visible and stable.
- Each page should declare its Diataxis type for consistency and future filtering.

### Expected future friction (and how we handle it)
When we later import real-world content (messier, legacy content), we expect:
- pages that don’t fit neatly
- mixed-genre pages (part reference, part how-to)
- inconsistent headings

We handle this by:
- keeping JTBD themes stable as the primary map
- using Diataxis as guidance, not a straightjacket
- allowing a temporary “Diverse / Legacy / Misc” bucket during migration, with a plan to split/refactor later

## Non-goals
- We do not aim to force every page perfectly into a Diataxis bucket on day one.
- We do not aim to make the navigation mirror the repo folder structure.
