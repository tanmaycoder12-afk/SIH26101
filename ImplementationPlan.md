# Implementation Roadmap: Development Order & Phases

> **Context:** Translating the original roadmap into Devesh's Next.js and Supabase stack.

---

### Phase A — Foundation
* **Foundation Check:** Verify current Next.js/Supabase architecture and state.
* **Framework Definition:** Finalize and validate `competency_framework.json`.
* **Type Safety:** Define TypeScript competency types and interfaces.
* **Service Abstraction:** Build the core competency framework service layer.

### Phase B — Assessment Architecture
* **Schema Design:** Design assessment and question tables.
* **Database Migration:** Create and execute assessment migrations in Supabase.
* **Config Engine:** Build the deterministic assessment configuration engine.
* **AI Service:** Build the Gemini question-generation service.
* **Validation Layer:** Implement strict Gemini response validation checks.
* **API Endpoint:** Build the assessment creation API route.
* **Persistence:** Store generated and validated questions securely.

### Phase C — Quiz & User Interface
* **UI Development:** Build responsive assessment views and quiz components.
* **Interaction Handling:** Capture and handle user answer submissions.
* **Data Storage:** Save user answers back to Supabase.

### Phase D — Intelligence & Scoring
* **Scoring Service:** Build the deterministic scoring service.
* **Granular Scoring:** Calculate individual sub-competency scores.
* **Aggregate Scoring:** Calculate parent competency scores.
* **Gap Analysis:** Build the gap analysis calculation engine.
* **Result Storage:** Store calculated competency results and gaps.

### Phase E — Learning & Recommendations
* **Course Data:** Create initial mock course dataset.
* **Tag Mapping:** Map courses to specific competencies and sub-competencies.
* **Recommendation Engine:** Build the logic to match competency gaps to courses.
* **Learning Interface:** Build the learning page and course dashboard UI.

### Phase F — Closed Loop & Growth
* **Progress Tracking:** Monitor active learning progress.
* **Reassessment:** Enable follow-up assessments for completed paths.
* **Comparative Analysis:** Compare before-and-after performance metrics.
* **Profile Updates:** Automatically update the user's competency profile.

### Phase G — Advanced Capabilities
* **Evidence Aggregation:** Combine assessments, training, and profile evidence.
* **Confidence Scoring:** Model confidence levels for skill estimates.
* **Learning Paths:** Design structured multi-step development paths.
* **iGOT Integration:** Implement the learning provider adapter layer (iGOT / mock).
* **Admin Analytics:** Build reporting and management dashboards.
