# NEON NEXUS — MK EDITION

Luxury-futuristic responsive portfolio for Mayank Virani.

## Run locally
Open `index.html` in a modern browser, or serve this folder with a static web server. GitHub live repository cards require an internet connection.

## Included features
- Supplied profile photo in a rotating 3D glass portrait frame
- Luxury-futuristic dark visual system with cyan, violet and champagne-gold accents
- Magnetic desktop cursor and pointer-responsive portrait
- Optional synthesized interface sounds (off until enabled)
- Three-way theme switcher and reduced-motion control
- Interactive orbit lab: 7 orbiting worlds, linked detail panel, shortcuts to related certificates
- Live public GitHub repository integration for `mayankvirani777-sys` (no token required)
- Certificate gallery with filters, 3D hover tilt and full-size lightbox (4 certificates)
- Achievement / learning timeline using the supplied portfolio details
- Interactive skill dashboard (learning-stage indicators, not verified proficiency scores)
- Project filters and expandable case-study panels
- Terminal, responsive navigation, contact mailto form, and MK AI scripted assistant

## Personal assets
- `assets/mayank-profile.jpg` — supplied portrait
- `resume.pdf` — supplied resume

## Certificates
Certificates live in `assets/certificates/`. To add one, drop the image there and add an entry to the `certs` array in `script.js`.

## MK AI
MK AI is a local scripted FAQ assistant. It is not connected to an external AI model and does not transmit chat messages.

## GitHub integration
The site fetches public repositories from `https://api.github.com/users/mayankvirani777-sys/repos`. The profile link remains usable if the API is offline or rate-limited.
