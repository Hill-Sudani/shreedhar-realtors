# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
The Shreedhar Group website is a premium real estate portfolio site. It features a high-end aesthetic with a focus on luxury, trust, and legacy. The site showcases various residential and commercial projects in Vastral, Ahmedabad, and surrounding areas.

## Architecture
The project is a static website consisting of:
- `index.html`: The main landing page containing a hero section, about section, project gallery, and contact form.
- `projects/`: A directory containing individual detail pages for each project (e.g., `bliss.html`, `vihar.html`).
- `images/`: Store for all visual assets, including a `projects/` subdirectory with images organized by project name.
- `brochures/`: PDF brochures for the various real estate projects.

## Technical Details
- **Styling**: CSS is embedded within `index.html` using a set of CSS variables for a consistent color palette (Charcoal, Red, Cream, Warm).
- **Animations**: Uses `IntersectionObserver` for scroll-reveal effects, CSS keyframes for preloaders and marquees, and vanilla JavaScript for 3D tilt effects and parallax.
- **Interactivity**:
    - Project filtering on the main page uses data attributes (`data-cat`).
    - Contact form is integrated with EmailJS for lead generation.
    - Direct WhatsApp integration via `wa.me` links.
- **Responsiveness**: Implemented via CSS media queries for mobile and tablet views.

## Common Tasks
- **Adding a New Project**:
    1. Create a new HTML file in `projects/` (e.g., `projects/new-project.html`).
    2. Add a project card to the `projects-grid` in `index.html` with appropriate `data-cat` for filtering.
    3. Add images to `images/projects/new-project/` and a brochure to `brochures/`.
- **Updating Visuals**: Update images in the `images/` directory. The `index.html` uses `onerror` fallbacks for missing images.
- **Modifying Theme**: Update the `:root` CSS variables in `index.html` to change the global color scheme.

## Agentic Protocol
For every task, the following protocol must be strictly followed:
1. **Context Discovery**: Use `ls`, `grep`, and `read` tools to thoroughly understand existing patterns and architectural decisions before writing any code.
2. **Structured Planning**: Propose a detailed multi-step plan for the user's approval before executing changes.
3. **Verification**: Run `npm run build` in the terminal after every major change to identify and resolve errors immediately.
4. **Proactive Optimization**: Continuously analyze the live URL (`shreedhargroup.vercel.app`) for visual regressions, performance bottlenecks, or UX gaps, and proactively suggest fixes without waiting for specific prompts.

