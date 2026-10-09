# Open the teaching experiment on iPad

1. In GitHub Settings → Codespaces → Secrets, create `DEEPSEEK_API_KEY` and grant access to `andyDgreat12345/SKBDebate-site`. A repository Actions secret is not a Codespaces secret.
2. Create a Codespace on branch `codex/interactive-teaching-foundation` using its checked-in devcontainer configuration. Choose the smallest available machine to start.
3. Wait for installation. The lab starts automatically after the Codespace starts.
4. In the **Ports** panel, find **5173**, keep its visibility **Private**, and open its browser link. Append `/lab.html` to the address.
5. Submit a question. A configured key only enables the form; a successful response verifies API access and balance.

If port 5173 does not appear, open a terminal and run `npm run lab`. This prints connection status, never the key. Stop the running command before restarting it. If you add or change a Codespaces secret after creation, stop and restart the Codespace to receive it. Stop the Codespace when finished to avoid unnecessary compute usage.

The launcher reads the secret directly from the server environment. No key file, Cloudflare account, second terminal, or database setup is required. `DEEPSEEK_MODEL` is optional and defaults to `deepseek-flash`. Never prefix the secret with `VITE_`; those variables can reach the browser.

The private forwarding gateway provides access control; the development server is not safe to expose as a public product. Only the tutor endpoint is available through this launcher. Existing platform database APIs are intentionally unavailable. Questions and recent conversation are sent to DeepSeek on submission. There are no automatic paid model calls at startup.

The new launcher does not use `.dev.vars`; that file belongs to the older Wrangler workflow. To use the new launcher locally, supply the same variables through your local secret manager or environment.
