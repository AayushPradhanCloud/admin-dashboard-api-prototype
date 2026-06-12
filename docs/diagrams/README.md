# Diagrams

Source `.mmd` files. Render them in any of three ways:

1. **GitHub/GitLab** — `.mmd` files render directly when linked from a markdown page using the Mermaid code fence (see `ARCHITECTURE.md`).
2. **VSCode** — install the *Markdown Preview Mermaid Support* extension.
3. **SVG export** for handing to non-engineers:
   ```bash
   pnpm dlx @mermaid-js/mermaid-cli -i docs/diagrams/system-context.mmd -o docs/diagrams/system-context.svg
   ```
   A small `scripts/render-diagrams.sh` can loop over `*.mmd`.

The diagrams in this folder cover, in order: system context, hexagonal layers, request lifecycle, event flow with outbox, Keycloak auth, deployment topology, folder layout, and ERD. Update them whenever a structural change lands.
