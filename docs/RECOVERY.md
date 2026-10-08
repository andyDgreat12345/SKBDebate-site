# Recovery record — 8 October 2026

## Repositories examined

| Repository | Recovered content | Limitation |
|---|---|---|
| SKBDebate-site | Complete Git history; Claude/Superpowers tooling | Its only accessible branch contained no application or simulator source. No pull requests or releases supplied a simulator. |
| SKBDebate-Organization | Full TypeScript/React community app, server, schema/migrations, admin guide, resource pages, tournaments, volunteers, community feedback, AI helper, speech evaluation, and history | No database credential or full data export was configured. A few historical database-query results are not a complete database backup. |
| Ai-case-writer-tool | CaseForge PF editor, block model, evidence/citation fields, exports/import migrations, coaching API design, policies, history | Browser-local cases from the Windows machine are not in Git. No round simulator was found here. |

The connected GitHub integration denied access to deployment metadata and some Actions artifacts. No claim is made that the broken computer's unpushed files, browser storage, recordings, or original database records have been recovered.

## Preserved versus rebuilt

Recovered CaseForge logic drives the new case workshop. The original community source remains intact in its original private repository and in a separate owner recovery backup. Full Git bundles preserve accessible history for all three repositories.

The PF simulator has been rebuilt because no committed simulator was found. It uses the standard eleven-segment practice order, separate speaking order/side, 4-minute constructives and rebuttals, 3-minute summaries and crossfires, 2-minute final focuses, and a 3-minute preparation bank per team. Tournament variations should be checked against the event's current rules.

New teaching scripts and the editorial starter library were authored for this restoration. They are not presented as the user's lost material. Prepared opposing cases are teaching scaffolds without fabricated empirical citations. New private work and submissions are stored in the new D1 database, not the unrecovered Manus database.

## Additional recoverable material

If an old disk, browser-profile backup, exported JSON case backup, or Manus database export becomes available, preserve it before repair attempts. CaseForge JSON backups can be imported directly into the case workshop. A database import would require mapping legacy categories/resources/content, tournaments, volunteers, and users, with explicit identity linking rather than guessing that emails prove account ownership.

## Backup verification

The owner backup contains `SKBDebate-site-before-restoration.bundle`, `SKBDebate-Organization.bundle`, and `Ai-case-writer-tool.bundle`. These are full Git backups, not runtime database backups. Restore a bundle using `git clone <bundle-file> <new-directory>`. Run `git bundle verify <bundle-file>` from a Git repository to inspect it.
