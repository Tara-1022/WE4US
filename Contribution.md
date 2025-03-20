**Workflow**
- You can add TODOs for minor changes that are not immediate: Comment "TODO: \<desc>"
- For major changes, discuss in standup + raise issue on git
- Once a component is ready, discuss, then merge branch to main so others can work with it. Aim to merge changes sooner than later.
- Delete unused branches
- **Always** refer practices followed, and code structure within the existing codebase before implementation. Keeping things consistent will make the review process easier, and ensure maintainability. Do not copy/paste from genAI or google/stackoverflow without proper context.
- Add screenshots to PRs so expected functionality is clear to the reviewer. Also ensure the changes have been run & tested after any change/conflict resolution to catch issues early.

**PR considerations**
- Add links and references when possible for better context
- If a PR changes after approval, **request another review** so all changes are approved.
- Keep PRs and commits logically sound and encapsulated.
	- Follow the Single Responsibility Principle - in  components (one component does one thing, independently), commits (one commit performs one logical change), and PRs (one PR performs one stable change)
	- Don't make large PRs.
	- Use `git commit --amend` to keep saving work; this way you can structure commits better without leaving all changes staged.
- Do not merge a PR without **atleast one** approval
- Ensure the branch has **no conflicts with main** when requesting review
- Always double check before merge; especially if you had rebase/merge conflicts.
- Try to keep all cleanups in a single commit withing your PR
