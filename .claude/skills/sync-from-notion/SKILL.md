---
name: sync-from-notion
description: Sync the Experience section of this portfolio site (index.html) with Nicholas's Notion "Professional Experiences" database, which is the ground-truth source for his career and project history. Use this skill whenever he says he updated Notion and wants the site refreshed, asks to "sync the site with Notion" / "atualiza o site com o notion" / "puxa as atualizações do Notion", or wants a new role/project added to the site that should come from that database rather than being typed ad-hoc in chat. Also use it proactively if he mentions adding or editing an entry in his Notion career DB and it's not obviously already reflected on the site.
---

# Sync portfolio site from Notion

Nicholas keeps his full career/project history in a Notion database and treats it as ground truth. The site (`index.html`, Experience section) is a curated, public-facing subset of it — only some rows are meant to be public, and the site's prose is deliberately tighter than Notion's. This skill keeps the two in sync without ever leaking private content or silently overwriting his judgment calls.

## 1. Query the Notion database

Data source: `collection://3ddc3993-01d0-8067-be6f-000bbf5cb583` ("Professional Experiences").

Use the Notion MCP's `notion-query-data-sources` tool in `rows` mode against that data source URL to get all rows (title, description, stack, area, company, visibility, url). If the tool name isn't in your loaded toolset, search deferred tools for "notion" — the MCP server ID prefix can change across environments/sessions, but the data source URL above stays stable.

**Filter to `Visibility == "Public"` immediately, before doing anything else.** Private rows exist on purpose — things like detailed AutoCAD irrigation design work at Makino/Tropical Estufas, sales/customer-relationship work, and an entire company (Capgemini) are kept off the public site. Never add a Private row to the site even if it reads like great content, and never suggest doing so — if Nicholas wants something public, he'll flip the Visibility field in Notion first.

## 2. Read the current site content

Read the Experience section of `index.html`. It's organized into five `company-block` divs, in this order: **Globant, Entrepreneurship & Personal Projects, Makino, Tropical Estufas, Ballagro**. Each `company-block` has a `company-header` (logo, name, link, period) and a `company-body` containing one `role-entry` `<p>` per item.

## 3. Diff Notion against the site

For each Public Notion row, find whether it has a matching `role-entry`. Match by meaning, not exact string — the site version is always a lightly condensed rewrite of the Notion description, never a copy-paste. Three outcomes:

- **New**: a Public row with no corresponding entry on the site yet → draft it (step 4).
- **Changed**: a row that matches an existing entry, but Notion's Description (or Stack) has materially changed since → update that entry to match (step 4).
- **Now-private / removed**: a `role-entry` on the site whose Notion counterpart is now Private, deleted, or just can't be found → **do not delete it yourself.** Flag it to Nicholas and let him decide — it might mean he changed the visibility on purpose, or it might mean you're missing something (e.g. the title changed in Notion). Removing content silently is the one mistake this skill must never make.

Skip anything unchanged. Don't rewrite entries just to tweak phrasing — only touch what's actually new or changed.

## 4. Write matching HTML

Match the exact markup and voice of the neighboring entries in that company block — read a couple of siblings first. The basic shape:

```html
<p class="role-entry reveal"><strong>{Short Title}.</strong> {1–3 tightened sentences, same facts as Notion, no filler}. <span class="stack-line">{Tech · Names · Joined · By · Middle Dot}</span></p>
```

- `stack-line` only appears when there's a real tech stack worth showing — omit it for narrative/soft-skill entries (this matches how existing entries already vary).
- Entries with links (GitHub repos, Medium posts, external sites) use a `links-line` span with `<a>` tags instead of/alongside `stack-line` — copy the exact pattern from an existing entry like the Kaggle Competitions or Medium Articles ones rather than inventing new markup.
- Condensing means tightening prose and cutting redundancy, not dropping facts. If you're unsure whether a cut loses something meaningful, keep it in and let the sentence run a little longer instead.
- Preserve the title case / bold-label style already used (e.g. "Data Warehouse.", "String Matching Algorithm.").

Apply the edit directly to `index.html` with the Edit tool.

## 5. Handle ambiguity by asking, not guessing

Two cases always need a question back to Nicholas instead of a silent decision:

- **New Company value**: if a Notion row's Company doesn't match any existing `company-block` name, don't invent a new section's placement, ordering, or logo — ask where it should go.
- **Visibility looks inconsistent**: if a row's Visibility seems to contradict something Nicholas said earlier in conversation (this has happened before — a field he expected to be Private showed up Public), point out the mismatch you observed and let him confirm before acting on it either way.

## 6. What this skill never touches

- **CSS/JS**: don't touch `css/style.css` or `js/script.js` for a pure content sync — there's nothing in this workflow that needs a style change. If Nicholas separately asks for a style tweak, that's outside this skill's scope, and it does NOT require bumping the `?v=N` cache-busting query params on the `<link>`/`<script>` tags in `index.html` — only actual CSS/JS edits do.
- **Git**: never run `git commit` or `git push`. Staging changes or showing a diff is fine, but stop there and ask — this repo auto-deploys to the live site on push, so a commit here is a live publish, and Nicholas's standing rule is that commits always need his explicit go-ahead in the conversation.

## 7. Report back

End with a short summary: what was added, what was updated, and what was flagged for a decision. Skip the ceremony — a few lines is enough.
