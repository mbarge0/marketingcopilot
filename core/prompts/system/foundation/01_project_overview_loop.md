## Metadata
- **Document Type:** System Prompt
- **Loop Type:** Project Overview Loop
- **Mode:** Ask
- **Output Path:** `/docs/foundation/project_overview.md`

---

# Project Overview Loop System Prompt

Use this loop to establish the **initial, high-level context, vision, and scope boundaries** of a project. This document is intentionally **lean** and serves as the **North Star** for the entire development effort, guiding the subsequent Product and Architecture loops.

---

## Prompt Template

We are entering the **Project Overview Loop**.

Please:
1. Ask clarifying questions about the **core purpose** and **target audience** to confirm the high-level focus.
2. Translate the project's vision into a **concise Project Purpose and Summary**.
3. Define the **measurable Core Goals** that determine overall success.
4. Document the **Loose Feature Set** as required capabilities, *not* specifications.
5. Outline the **High-Level Phases** (MVP, Expansion, Stabilization) to establish scope boundaries.
6. Generate the **Project Overview Document** in Markdown format, following the structure in the **Output Format** section below.
7. Pause before writing to confirm the **North Star (Purpose)** and **Target Audience** are accurately captured.

---

## Gauntlet Evaluation Criteria

*Note: For the Project Overview Loop, the evaluation criteria serve as a *reference* for future phases, but minimum requirements are not yet assessed. The focus is setting the stage for these criteria.*

| Category | Evaluation Focus | Reference for Future Assessment |
|---|---|---|
| **Performance** | Responsiveness, scalability, API latency | Will require quantitative benchmarks (e.g., latency $< 200\text{ms}$). |
| **Features** | Functional parity with target clone + AI enhancement | Will define all core user stories and required AI capabilities. |
| **User Flow** | Usability, flow, and story continuity | Will require defining clear navigation paths for the Target Audience. |
| **Documentation & Deployment** | Code clarity, readiness, reproducibility | Will require a phased plan for documentation and a stable deployment target. |

---

## Guidance Notes

- The Project Overview must capture ***why*** the project exists and ***what*** must be achieved.
- Avoid technical details, specific libraries, or complex user stories; those belong in the PRD and Architecture documents.
- Use **bullet points** and **clear section headers** for maximum scannability.
- This document sets the **high-level contract** and scope, minimizing premature technical commitment.
- The resulting document is the immediate input for the **Product Loop**.

---

## Output Format

The resulting document should be stored as:
`/docs/foundation/project_overview.md`

It should include the following sections, directly mapping the provided Project Overview information:

1. **Project Purpose & Summary**
   - The project's North Star/Mission.
   - The problem being solved.

2. **Core Goals**
   - List of specific, measurable outcomes required for success.

3. **Target Audience**
   - Clear definition of the primary users.

4. **Loose Feature Set**
   - High-level list of required capabilities (non-detailed).

5. **High-Level Phases**
   - Outline of the major development stages (e.g., MVP, Expansion).

---

## Output Instructions

- Before generating the document, confirm with the user:
  > "Would you like to create the foundational **Project Overview Document** for the AlphaSchool application at `/docs/foundation/project_overview.md`?"

- If confirmed, write the Markdown file to:
  `/docs/foundation/project_overview.md`

- Standard filenames for project foundation documents:
  - Project Overview: `project_overview.md`
  - PRD: `prd.md`
  - Architecture: `architecture.md`
  - Checklist: `dev_checklist.md`