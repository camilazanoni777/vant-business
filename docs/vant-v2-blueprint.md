# VANT.Business v2 Blueprint

Status: draft operational blueprint.

This document guides the controlled rebuild of VANT.Business around the new
positioning approved on 2026-06-30: digital solutions, automation, applied AI,
digital presence, lead capture, customer intake and operational growth.

It is not a final architectural decision by itself. Move approved decisions to
`docs/decisions.md` only after Victor approves them.

## 1. Product Direction

VANT v2 should stop behaving like a mixed portfolio, AI tools catalog, blog and
newsletter hub. The public product should be a commercial entry point for
digital solutions.

Core positioning:

```txt
VANT structures digital presence, lead capture, customer intake and automation
so businesses can turn interest into an organized commercial process.
```

The public site must sell implementation, diagnosis, structure and business
outcome. Tools, news, ebooks and agents can exist as internal support,
commercial proof or future content channels, but not as the main promise.

## 2. Operating Model

Primary flow:

```txt
visitor -> positioning -> solution/diagnosis -> briefing -> lead -> admin
-> WhatsApp/follow-up -> proposal
```

The v2 should optimize for one useful business outcome: receiving qualified
commercial briefs that Victor can act on quickly.

## 3. User Value

The visitor should quickly understand:

- what problem VANT solves;
- which business areas VANT can structure;
- why presence, intake and automation need to work together;
- what the next step is;
- that VANT implements the structure, not only recommends tools.

## 4. Admin Value

The admin should quickly answer:

- who contacted VANT;
- what they need;
- where the opportunity came from;
- what status the lead is in;
- what next action is required;
- how to continue the conversation with context.

## 5. Public Routes

Recommended v2 routes:

| Route | Purpose |
| --- | --- |
| `/` | Main positioning and direct CTA |
| `/solucoes` | Service areas and solution types |
| `/diagnostico` | Commercial briefing form |
| `/cases` | Draft only; not published in this release |
| `/admin-vant` | Private internal operation |

Compatibility redirects:

| Current route | v2 target |
| --- | --- |
| `/solucoes-digitais` | `/diagnostico` or `/solucoes` |
| `/automatize` | `/diagnostico` |
| `/conversao` | `/solucoes` |
| `/recursos` | `/solucoes` |

Keep redirects until external links are updated.

## 6. First Useful Release

### Public

- Home with one clear promise.
- Solutions page with practical service areas.
- Diagnosis page with focused briefing.
- Proof/examples page only if it supports conversion.
- Footer and header aligned with the new positioning.

### Admin

- Lead list.
- Lead detail.
- Lead status.
- Internal notes.
- WhatsApp handoff link.
- Source and metadata visibility.

### Automation

- Save briefing to Supabase.
- Send internal notification.
- Generate WhatsApp continuation URL.
- Track lead source.
- Prepare future follow-up events.

## 7. Suggested Data Model

### `leads`

Core fields:

- `id`
- `nome`
- `email`
- `whatsapp`
- `empresa`
- `instagram`
- `origem`
- `lead_type`
- `solution_type`
- `main_goal`
- `project_stage`
- `budget_range`
- `message`
- `status`
- `priority`
- `notes`
- `created_at`
- `updated_at`

Expected statuses:

- `new`
- `qualified`
- `contacted`
- `proposal`
- `won`
- `lost`
- `archived`

### `lead_events`

Purpose: keep a minimal commercial history without bloating the main lead row.

- `id`
- `lead_id`
- `event_type`
- `event_note`
- `channel`
- `created_at`

### `service_requests`

Purpose: normalize the requested solution details if the briefing grows beyond
basic metadata.

- `id`
- `lead_id`
- `requested_solution`
- `problem_area`
- `urgency`
- `expected_outcome`
- `current_tools`
- `created_at`

## 8. Reuse From Current App

Reuse or adapt:

- Vite, React and Tailwind setup.
- Vercel project and serverless API structure.
- Supabase admin client pattern.
- Admin auth pattern.
- Existing lead capture API, after simplifying naming.
- Existing `buildBriefingWhatsAppUrl` utility.
- Brand assets in `public/assets/brand/`.
- Existing subscribe and lead tests as a starting point.

Do not blindly reuse:

- public blog routes;
- ebook-first capture flow;
- tools catalog narrative;
- recruiter/portfolio components;
- personal resume assets;
- news/newsletter as public primary CTA.

## 9. Legacy Classification

Use four buckets during cleanup:

| Bucket | Meaning | Action |
| --- | --- | --- |
| Core v2 | Supports the new commercial flow | Keep and strengthen |
| Commercial support | Useful proof, internal support or future content | Hide from core, preserve if useful |
| Inactive legacy | Old positioning, no current public role | Remove from navigation/routes |
| Deletable residue | No route, dependency, admin use or historical value | Delete after verification |

## 10. Implementation Sequence

1. Freeze the v2 blueprint.
2. Add v2 route map and redirects.
3. Create or rename pages around `/`, `/solucoes`, `/diagnostico`, `/cases`.
4. Simplify lead payload naming around commercial briefings.
5. Update admin lead view for commercial status and next action.
6. Update tests for the new public route contract.
7. Update README and AGENTS.
8. Remove legacy files only after dependency checks.
9. Run build and targeted tests.
10. Deploy when local verification passes.

## 11. Verification Checklist

Before calling v2 ready:

- `npm test`
- `npm run build`
- safe local submit test with invalid data
- admin route loads
- old public routes redirect correctly
- no `.env` or secret file touched
- README and AGENTS match the new positioning
- no public copy presents VANT as a tools catalog, blog or recruiter portfolio

## 12. Open Questions

- Should `/solucoes-digitais` remain as the final public URL, or should v2 use
  `/diagnostico` as the direct CTA?
- Should `/cases` show conceptual examples first, or wait for real client cases?
- Should newsletter/news/tools remain in admin only, or be fully moved to a
  future content module?
- Should the lead model extend the current newsletter/subscriber table or move
  commercial leads into a clearer dedicated schema?

## 13. Implementation Progress

### 2026-07-07 - Route contract and admin handoff

Implemented locally:

- Added v2 public routes: `/solucoes`, `/diagnostico` and `/cases`.
- Kept old public routes as compatibility redirects.
- Added an initial `/cases` page with conceptual proof/examples, without presenting them as real client cases.
- Updated header, footer and homepage CTAs to point to the v2 route contract.
- Added tests for the route contract.
- Added commercial priority calculation for service leads.
- Added WhatsApp handoff URL/message generation from existing briefing data.
- Exposed priority and "Continuar no WhatsApp" action in the admin leads panel.
- Added manual commercial priority editing in the admin leads panel, persisted in existing subscriber metadata.

Verified:

- `npm test`: 50 passing tests.
- `npm run build`: production build passing.

Still pending:

- Decide whether `/diagnostico` becomes the final CTA URL or if `/solucoes-digitais` stays public.
- Update README and AGENTS after the v2 structure is approved.
- Decide whether commercial leads need a dedicated Supabase schema or can keep using current subscriber metadata for the next release.
- Decide whether manual priority should remain metadata-only or become a dedicated database column later.

### 2026-07-09 - Diagnosis page as main commercial entry

Implemented locally:

- Repositioned `/diagnostico` around the VANT diagnosis instead of generic digital solutions.
- Changed the main form field from desired solution to main bottleneck.
- Updated service lead source to `diagnosis-page` and product identifier to `diagnostico-vant`.
- Added `mainBottleneck` to service lead metadata while keeping `solutionType` for admin compatibility.
- Updated WhatsApp continuation copy to use diagnosis language and include the main bottleneck.

Verified in focused tests:

- `node --test tests/subscribe.test.js tests/editorial-pages-copy.test.js`: 14 passing tests.

## 14. Next Patch

Recommended next patch after the README alignment:

1. Review auxiliary docs for old positioning residue.
2. Classify remaining legacy modules as core v2, commercial support, inactive legacy or deletable residue.
3. Update only the docs/components that still affect the public or admin v2 flow.
4. Remove files only after dependency checks and a passing build.

### 2026-07-09 - README as v2 source of truth

Implemented locally:

- Rewrote `README.md` around VANT v2 commercial positioning.
- Documented `/`, `/solucoes`, `/diagnostico`, `/cases` and `/admin-vant` as the active public/internal route map.
- Documented `/solucoes-digitais`, `/automatize`, `/conversao` and `/recursos` as compatibility redirects.
- Reclassified tools, news, ebooks, newsletter and agents as support/legacy modules, not the public primary promise.
- Added a route-contract test that checks the README stays aligned with the v2 direction.

Verified:

- `node --test tests/v2-route-contract.test.js`: 4 passing tests.

Still pending:

- Review auxiliary docs for old narrative residue.
- Decide whether to update local `AGENTS.md`/repo instructions if present.
- Classify legacy files before deleting anything.

### 2026-07-09 - Backup branch and inactive legacy cleanup

Implemented locally:

- Created and pushed `archive/pre-vant-v2-cleanup-2026-07-09` as the full pre-cleanup archive branch.
- Created `chore/vant-v2-cleanup` as the clean working branch for the current VANT app.
- Removed inactive public blog, ebook, portfolio/recruiter, PDF resume, old admin and associated component/data modules from the working branch.
- Removed unused `marked` and `gray-matter` dependencies.
- Updated auxiliary docs for the v2 maintenance/deploy/coding workflow.
- Added `tests/legacy-cleanup.test.js` to keep archived modules out of the current app.

Verified:

- `node --test tests/legacy-cleanup.test.js`: 3 passing tests.
- `npm test`: 54 passing tests.
- `npm run build`: production build passing with 55 transformed modules.

Still pending:

- Review active admin editorial/tooling modules before removing anything tied to APIs or Supabase.
- Decide whether news/tools/agents stay as internal commercial support or move fully to archive in another cleanup patch.

### 2026-07-09 - Cases kept as draft for main release

- Cases page is preserved in `draft/vant-cases-page` and is not published in this release.
- Main release keeps `/`, `/solucoes`, `/diagnostico` and `/admin-vant` public/internal.
