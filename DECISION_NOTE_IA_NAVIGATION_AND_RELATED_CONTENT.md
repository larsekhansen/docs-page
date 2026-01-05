# Decision note: IA, navigation and related content

## Goal
Make a multi-product documentation portal that:
- scales to many teams/products
- is easy to browse for first-time users and efficient for experts
- avoids “buried pages” and excessive click depth
- encourages maintainable, consistent content

## Decisions
### 1) Organize *within a product* by JTBD (outer structure)
**Decision:** The primary navigation inside a product is JTBD/themes (what users are trying to do).

**Why:**
- readers arrive with a purpose (“implement X”, “migrate”, “troubleshoot”), not with a document-genre preference
- it reduces cognitive load for discovery and onboarding
- it supports product-level storytelling (prereqs, success criteria, common paths)

**Tradeoffs:**
- JTBD themes require discipline to keep few, stable, and non-overlapping
- cross-cutting jobs across products can create duplication (handled later via shared pages or cross-product “journeys”)

### 2) Use Diataxis primarily as an *intra-structure* (secondary grouping)
**Decision:** Diataxis (tutorial/how-to/reference/explanation) is used to shape and classify content, and can be used as a secondary grouping within a JTBD theme.

**Why:**
- it’s a strong editorial tool that prevents “everything pages”
- it makes pages predictable (procedural vs conceptual vs lookup)
- it improves linking: “here’s the how-to”, “here’s the reference”, “here’s the concept”

**Tradeoffs:**
- Diataxis naming can be confusing as a top-level IA; we avoid making it the primary map
- some topics don’t fit perfectly; treat classification as guidance, not a straightjacket

### 3) Reduce depth friction with explicit “nearby content” affordances
**Decision:** Do not rely on the sidebar hierarchy alone. Provide lateral navigation so related pages are always “close by”.

**Why:**
- user testing commonly shows that deep hierarchies create “I won’t try again” friction
- topically related content can otherwise be separated by theme/diataxis boundaries

**Practical approach (phased):**
1. **Hand-authored links** in MDX ("See also", "Next steps") for high-quality guidance.
2. **Prev/Next** navigation within a defined track (especially tutorials and migrations).
3. Optional **tag-based related content** (simple, explainable) if we need more automation.
4. Consider **semantic similarity (embeddings)** only when content volume justifies the complexity.
5. Consider **analytics-driven recommendations** only if privacy/consent/data governance is settled.

### 4) Keep known-item lookup fast
**Decision:** Ensure “Reference” is always easy to reach (even if secondary) and keep URLs stable.

**Why:**
- many readers come for exact facts (parameters, endpoints, error codes, versions)
- strong lookup reduces frustration and support burden

## Non-goals
- Enforcing perfect Diataxis classification on day one
- Building a recommendation system before we have enough content and governance

## Success criteria
- Users can quickly answer: “Where am I, and what should I click next?”
- Users can move laterally between related pages with low friction
- Teams can add content without reorganizing the entire site
