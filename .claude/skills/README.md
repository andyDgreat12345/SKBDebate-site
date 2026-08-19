# Superpowers skills (vendored)

These skills come from [obra/superpowers](https://github.com/obra/superpowers)
v6.3.0 (upstream commit `b36e082`, 2026-08-12), MIT licensed — see `LICENSE`.

They are installed at the **project** level, so anyone who opens this repo with
Claude Code gets them automatically; no plugin install is required.

## What's here

| Skill | Use it when |
|---|---|
| `using-superpowers` | Entry point — how to find and invoke the rest |
| `brainstorming` | Turning a vague idea into an agreed spec |
| `writing-plans` | Turning a spec into a task-by-task implementation plan |
| `executing-plans` | Working a plan yourself, task by task |
| `subagent-driven-development` | Working a plan via subagents (preferred when available) |
| `dispatching-parallel-agents` | Fanning work out across several agents |
| `test-driven-development` | Red/green/refactor discipline |
| `systematic-debugging` | Root-causing a bug instead of guessing |
| `verification-before-completion` | Proving work is done before saying so |
| `requesting-code-review` | Getting a change reviewed |
| `receiving-code-review` | Acting on review feedback |
| `using-git-worktrees` | Isolating work in a worktree |
| `finishing-a-development-branch` | Landing and cleaning up a branch |
| `writing-skills` | Authoring new skills |

## How it's wired up

- `.claude/skills/<name>/SKILL.md` — Claude Code discovers these automatically.
- `.claude/hooks/superpowers/session-start` — SessionStart hook that injects the
  `using-superpowers` skill so the others get invoked proactively. Registered in
  `.claude/settings.json`. Adapted from upstream `hooks/session-start`: it
  resolves the skill path relative to itself instead of `$CLAUDE_PLUGIN_ROOT`,
  and always emits Claude Code's `hookSpecificOutput` shape.
- `.claude/hooks/superpowers/run-hook.cmd` — upstream's unmodified polyglot
  bash/cmd wrapper, so the hook also works on Windows.

## Local deviation from upstream

Upstream refers to its skills as `superpowers:<name>` (the plugin namespace).
Project-level skills have no namespace prefix, so the references were rewritten:

```bash
grep -rl 'superpowers:[a-z-]' . | xargs sed -i 's/superpowers:\([a-z]\)/\1/g'
```

Re-apply that after any re-vendor.

## Updating

```bash
git clone --depth 1 https://github.com/obra/superpowers.git /tmp/superpowers
rm -rf .claude/skills/*/ && cp -R /tmp/superpowers/skills/. .claude/skills/
cp /tmp/superpowers/LICENSE .claude/skills/LICENSE
cp /tmp/superpowers/hooks/run-hook.cmd .claude/hooks/superpowers/run-hook.cmd
# then re-apply the sed above, and re-check .claude/hooks/superpowers/session-start
```

## Alternative: install as a plugin instead

If you'd rather have it user-wide and auto-updating, install the upstream plugin
in your own Claude Code and drop this directory:

```
/plugin install superpowers@claude-plugins-official
```
