<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep homepage presentation-only referral samples separate from activity records so updating its table does not alter statistics or chart data.
- Calculate dashboard mock card totals by calibrating the existing dated click activity to one all-time baseline; keep chart records unchanged to isolate card-only adjustments.
- Keep support authentication independent of Supabase and temporary admin/marketer gates; validate server-only credentials and protect every support payload with a dedicated encrypted HttpOnly session so existing accounts never confer support access.
- Admin ad creation and management use one browser-only mock store with locally persisted metadata; local media URLs stay session-only to avoid implying uploaded files or changing real marketer ads.
- Admin program management uses an isolated in-memory mock dataset and pure filter, statistics, pagination, and status helpers; this keeps trial actions independent of real programs and other pages.
- External marketer list and profiles share a validated browser-local mock store; immutable membership IDs and pure reward/validation helpers keep edits isolated from real accounts.
- Commercial font files are uploaded as Lovable Assets and declared with real @font-face rules in src/styles.css; never reference a font family whose file is not loaded, and keep font-specific weights scoped to the page that asked for them.
