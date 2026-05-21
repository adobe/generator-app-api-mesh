# AGENTS.md — generator-app-api-mesh

Yeoman generator invoked via AIO CLI (`aio app init`) to scaffold API Mesh + App Builder projects. It is not a running service — it generates code and optionally creates a mesh in the target workspace.

---

## Domain Concepts

### Three sub-generators with distinct ownership
`index.js` writes no files itself — it composes three sub-generators and passes paths via options:
- `generator-add-action-api-mesh`: writes action files, copies `mesh.json` template, adds `.env` stub
- `generator-create-api-mesh`: runs `aio` CLI to create the mesh and writes `MESH_ID` into `.env`
- External UI assets generator (optional, only in Experience Cloud UI mode)

When changing generated output, edit the relevant sub-generator, not `index.js`.

### Two output modes produce different layouts
The UI mode choice at prompt time determines where generated files land and which config file is used:
- **Headless**: actions under `src/api-mesh/`, registered in `app.config.yaml` directly
- **Experience Cloud UI**: actions under `src/dx-excshell-1/api-mesh/`, registered in `ext.config.yaml` which is `$include`d from root `app.config.yaml`

Any change to templates or paths must handle both modes.

### `install.yml` is the App Builder template registry entry
This file is not a build or install script. It is the schema that surfaces this generator in `aio app init`. The `categories` and `apis` fields control discoverability.

---

## Critical Gotchas

### 1. Mesh creation fails if a mesh already exists in the workspace
`generator-create-api-mesh` runs `aio api-mesh get` before creating. If a mesh already exists, it throws — it does not update. The user must delete the existing mesh manually before re-running.

### 2. `mesh.json` lands in `conf/`, one level above `actions/`
The action generator copies `mesh.json` to `{actionFolder}/../conf/`. This places it at `src/api-mesh/conf/` (headless) or `src/dx-excshell-1/api-mesh/conf/` (UI). Tests asserting on generated file paths must account for this sibling-directory placement.

### 3. Skipping mesh creation leaves `MESH_ID` empty in `.env`
If the user declines mesh creation at the prompt, the action generator still writes `MESH_ID=` to `.env` as an empty stub. The generated action will fail at runtime until the user runs `aio api-mesh create` manually and populates it.
