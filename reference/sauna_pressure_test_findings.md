# Sauna pressure-test: findings

Ran the v9 template against a hypothetical second business (Ember Sauna, a fixed-location wood-fired sauna in Galway). Goal: discover everything that breaks when the data does not fit the SIMply-Golf-shaped assumptions.

The good news first: about 75% of the template handled the swap without complaint. The visual identity, the hero, the stats bar, the trust pills, the gallery, the press section, the about section, the testimonial, the contact block, the footer, the entire motion system, the sticky CTA, and the typography all work for Ember as well as they do for SIMply Golf. That is the part that is truly transferable.

The breakage falls into three buckets, in order of severity.

## 1. Structurally broken: needs real variant logic before any non-mobile business ships

These are the cases where the template does not just need different data, it needs a different section component entirely, or a fallback for missing data that is not built yet.

The location section is the biggest hole. The current "Where we go" section is hardcoded for mobile-businesses with travel zones. A fixed-location business like Ember has none of the fields it needs: there is no `address_line_1`, no `eircode`, no `hours` grid, no `parking` field, no map embed. The data shape I improvised in the test file (`location: { mode: "fixed", address_line_1, address_line_2, city, eircode, parking, hours }`) is what the schema actually needs. The renderer needs a top-level branch on `location.mode === "mobile" | "fixed" | "hybrid"` that picks the right component.

I would estimate the fixed-location section is 2-3 hours of fresh design and build work. It is a real product surface: hours grid, address with `<address>` semantic markup, map embed (Google Maps iframe or Mapbox static), parking copy, public transport notes. Cannot be faked.

The mission statement is entirely hardcoded into the JSX. Lines 1052-1057 of v9 contain SIMply Golf's mission as literal text inside the `<p>` element, including the highlighted "Foresight" word as an inline span. There is no `b.mission_statement` field in the data, and there is no opt-out for businesses without a mission. For Ember, this entire section needs to either be removed at runtime or replaced with their own copy. The fix is straightforward:

- Add `mission_statement` and `mission_highlight_word` fields to the business data
- Pass them into the renderer
- Skip the section entirely if `mission_statement` is null

Probably 30 minutes of refactor work. The section currently is not transferable in any meaningful sense, every new business needs the JSX edited.

The section nav has hardcoded labels. "Inside the dome" is the gallery label. "We come to you, anywhere in Munster" is the location section h2. These came from data on the SIMply Golf side, but the location h2 turned out to be hardcoded into the renderer at line 1274. So a sauna gets "We come to you, anywhere in Munster" as their location headline, which is comically wrong. Same applies to the location subhead paragraph at line 1277 ("The dome packs into a van..."). These need to move into data fields: `location.headline`, `location.body`, `gallery.section_label`.

## 2. Looks wrong but works: visual decisions that need variant logic

These are cases where the template renders without crashing but the result looks awkward for the new business.

Two service groups in a tabbed UI looks weak. SIMply Golf has three buyer profiles (events, coaching, private), so a row of three tabs reads as deliberate. Ember has two (walk-in, private hire). Two tabs side-by-side looks like the third one is missing. There is a strong case for a `services_layout` variant: tabs for 3+, side-by-side cards for 2, single flat list for 1. The data already supports this, the renderer needs the branch.

Worse: a business with a single service group (a simple barber with five services and no groupings) would currently show a single tab, which is absurd. So the variants are: `tabs | grouped-cards | flat-list`. The flat-list is the most common case for SMBs and currently does not exist.

The "Most popular" tag placement assumes corporate ticket sizes. SIMply Golf's popular tag sits on a 1200 corporate full-day. Ember's popular tag sits on the 100 five-session pass. Both are fine in isolation, but the visual weight of the tag is identical, it dominates either way. For Ember, a more subtle treatment (perhaps just a small dot or the word "popular" in eyebrow style above the service name) would fit better. Worth thinking about whether this needs a `tag_emphasis: high | low` variant, or whether it is just always-high and we accept the mismatch.

The about portrait has a caption box overlaid on it. The caption is currently hardcoded ("Jack with a young customer inside the dome at a pop-up event"). For Ember it would be "Aoife at the front door, opening day February 2024." The caption is in the data (`about_portrait.caption`), but the renderer at line 1193 ignores it and uses a hardcoded string. Bug. 15 minutes to fix.

The gallery captions reference golf concepts. The five image captions in SIMply Golf's data describe golf situations. For Ember the captions describe a sauna. That is fine in itself, captions are data, they swap correctly. But the fallback label on the BusinessImage component is hardcoded to "Inside the dome" for every gallery slot at line 1249. If Ember has no images yet, every fallback would say "Inside the dome" which is wrong. The fallback should come from a `gallery.fallback_label` field or be passed in per-slot.

## 3. Small but worth noting

These are the kinds of things that do not break the page but reveal the template has not been fully decoupled from its first business.

The mission statement section header is hardcoded as a small italic line. The structure is a "principle" framing that may not suit every business, a sauna might want a different shape of opening, perhaps a photograph followed by one sentence, or no mission section at all. Worth thinking about whether this section is required or optional per the business config.

The booking flow CTA copy. "Book your event" works for golf but reads as too formal for a sauna ("Book a session" or just "Book" would be right). The CTA labels are data-driven on the hero ("Book your event" / "Book a lesson") but the sticky bottom button's label "Get a quote" is hardcoded at line 459, and the final-card CTA "Get a quote in 24 hrs" is hardcoded at line 1612. For Ember, those should be "Reserve a slot" or just "Book". The fix: hoist them into business data as `cta_primary_label`, `cta_sticky_label`, `cta_final_label`.

The hero subhead is opinionated copy. The phrase "rain or shine" is in SIMply Golf's hero subhead, fine for an outdoor business, irrelevant for a sauna. The subhead is in data so swaps correctly, but worth flagging that the placeholder onboarding copy the platform suggests will need to be category-aware (a sauna does not talk about weather).

Trust pills are visually too uniform across categories. SIMply Golf's pills work because the four items are roughly equal weight. Ember's pills (Wood-fired, Cold plunge 4C, 10-person capacity, Open Tue-Sun) include a fact ("10-person capacity") and a schedule note ("Open Tue-Sun"), which sit awkwardly next to qualitative claims. This is not a template bug, it is a content guidance gap. The onboarding form needs to nudge businesses toward writing pills of roughly equal weight and type.

Hero photo placeholders matter more than I assumed. Most new businesses will not have professional photography on day one. The current template's hero photo treatment (heavy gradient over a busy image) works for the SIMply Golf hero where the photo is genuinely rich. A sauna with a single iPhone-snap of their cedar wall will look amateurish under the same treatment. Worth building a "typography-led hero" variant for businesses that do not have a strong hero photo, pure type on a black ground, plus an optional small detail image to the side.

## What this means for the Claude Code brief

The findings sort into three priorities:

Priority 1 (block customer 2 from shipping):
- Build `<LocationFixed>` component with address/hours/map/parking
- Refactor mission statement into data fields with skip-if-null
- Move hardcoded location h2 + subhead into data
- Move hardcoded about portrait caption into data (already in data, just plumbing)
- Move hardcoded CTA button labels into data

Cost estimate: half a day in Claude Code, assuming the existing v9 design is the target.

Priority 2 (block customer 4 or 5):
- Build `<ServicesFlat>` and `<ServicesGroupedCards>` variants alongside the existing tabbed version
- Build `<HeroTypeLed>` variant for photo-light businesses
- Make the gallery fallback label a per-business or per-slot data field

Cost estimate: another half-day to a full day.

Priority 3 (refinements, not blockers):
- Tag emphasis variants
- Mission-section optional vs required
- Category-aware onboarding copy nudges
- The whole subject of content guidance during onboarding

These are product-design questions, not engineering ones. They can be solved after launch.

## The single most important takeaway

The v9 design is good and 75% transferable, but the renderer is still 25% hardcoded to SIMply Golf. The fix is mechanical, not creative: hoist every hardcoded string into the business data, build three or four missing section variants, branch on `location.mode` and `services_layout`. That is what the Claude Code build should do first, before any single new feature. After that work, customer 2 (a real sauna) can ship in something close to 2 hours.

If the template ships to production as-is, the second business will reveal these breakages under real customer pressure, which is the wrong place to discover them. Better to surface them now.
