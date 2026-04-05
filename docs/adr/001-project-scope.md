# ADR 001: Project scope and delivery phases

## Context

**BRSR** (Business Responsibility and Sustainability Reporting) is an India regulatory reporting framework. This application is an internal data-collection platform for BRSR questionnaires.

The product surface includes:

- **Master area** (`/master`): Super-admin. Manages organizations, users, roles, and question visibility. Role slug: `master`.
- **Onboarding** (`/onboarding`): First-time setup for a new org. Admins complete a multi-step wizard (create org, invite team, configure question assignments, launch). Non-admin users see a "pending" screen until the admin finishes onboarding.
- **Dashboard** (`/dashboard`): Org users. Fill the BRSR questionnaire (General Data, Section A/B/C, Principles 1–9) per organization and reporting year. Includes per-user question assignments (admin assigns specific codes to users) and BRSR export (DOCX/XLSX/JSON). Roles: `admin`, `user` (and custom).
- **Auth**: Email/password via Supabase Auth. Post-login redirect by role (master → `/master`, others → `/` where onboarding gate applies).

Original delivery was phased:

- **Phase 1**: Login, Master dashboard (orgs, users, roles, visibility), RLS.
- **Phase 2a**: Questionnaire UI, answers storage, calculations, General Data → Principle 6 autofill.

The codebase has since grown to include onboarding (multi-step org setup wizard), BRSR export (DOCX/XLSX/JSON), per-user question assignments with completion tracking, and the `brsr_questions` metadata table — functionality beyond the original Phase 2a scope.

## Decision

Treat **CONTEXT.md** as the live **inventory** of the system as built (files, routes, tables, APIs). Keep **origin story, regulatory framing, and phase history** in this ADR so CONTEXT stays a reference document without duplicating rationale.

## Consequences

- New contributors read CONTEXT.md for *what exists* and this ADR for *why the product is shaped this way* and how delivery evolved.
- Updates to routes or features still go to CONTEXT.md; changes to stated product intent or major scope shifts warrant a new ADR or an addendum here by convention.
