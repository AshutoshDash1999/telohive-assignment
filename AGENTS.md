<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Project Practices

- Keep app route pages focused on section framing and compose feature logic from colocated route-level components under `_components`.
- Use `zustand` for client-only cross-route UI state; persist durable UI state (such as saved-space IDs) with explicit storage keys.
- Reuse shared query/filter contracts from `src/types/api.ts` and `src/lib/discovery/query-state.ts` instead of creating route-specific query formats.
- Keep feature UIs modular: separate toolbar, grid/list, and empty/error/loading states into dedicated components.
