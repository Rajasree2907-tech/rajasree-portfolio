# Rajasree M — Personal Portfolio Website

A responsive, accessible developer portfolio for **Rajasree M**, B.Tech Information Technology student at PKIET College, Karaikal. Built with semantic HTML5, CSS3 variables, and vanilla JavaScript (no frameworks or build steps).

## Project structure

```text
rajasree-portfolio/
├── index.html      # Page structure and content
├── style.css       # Design system, light/dark themes, responsive styles
├── script.js       # Navigation, theme toggle, modals, form validation + sending
├── README.md
└── assets/images/
    ├── project-pcos.svg
    ├── project-arcova.svg
    └── project-portfolio.svg
```

## Run locally

Use the **Live Server** extension in VS Code (right-click `index.html` → *Open with Live Server*), or run `python -m http.server 8000` in the folder and open `http://localhost:8000`.
Open the site this way, not by double-clicking the file, so the contact form can reach its email service.

## Contact form (messages go to Gmail)

The form validates input, then sends it to [Web3Forms](https://web3forms.com), which emails the message to the address registered with the access key.

- The key is in `index.html`: `<input type="hidden" name="access_key" value="...">`.
- The key is public by design. To change the receiving inbox, create a new key at web3forms.com and replace the value.
- Submissions also appear in the Web3Forms dashboard.

## Customize

- **Links and email:** search `index.html` for `rajasree2907@gmail.com`, `linkedin.com/in/`, and `github.com/` and edit them.
- **Hero initials:** the circle in the hero section is the `.avatar-monogram` block in `index.html`. Change the letters inside `<span>MR</span>` to edit it.
- **Certificate links:** each certificate modal in `index.html` has its LinkedIn link. The Effective Learning modal has a TODO comment for its link.
- **Colors:** edit the CSS variables at the top of `style.css`.

## Deploy on GitHub Pages

1. Create a public repo named `rajasree-portfolio` and upload all files, including `assets/`.
2. Go to **Settings → Pages → Deploy from a branch**, choose `main` and `/ (root)`, then Save.
3. After 1–2 minutes the site is live at `https://rajasree2907-tech.github.io/rajasree-portfolio/`.

## Design and structure notes

- **Layout:** CSS Grid for page sections and Flexbox for components.
- **Responsive:** breakpoints at 1024px (tablet), 860px (mobile menu), and 640px (small phones).
- **Theme:** light by default with a dark mode toggle; the choice is remembered.
- **Accessibility:** semantic landmarks, skip link, visible focus rings, ARIA on the menu and modals, Esc closes dialogs, and reduced-motion support.