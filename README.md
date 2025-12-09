# GlossAPI Website

A static website for the GlossAPI project, featuring a modern dark theme with glassmorphism effects, 3D animated backgrounds, and bilingual (Greek/English) support. The site showcases the GlossAPI initiative, displays blog articles from a WordPress backend, and presents team information.

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Technology Stack](#technology-stack)
3. [Page Overview](#page-overview)
4. [Styling System](#styling-system)
5. [JavaScript Architecture](#javascript-architecture)
6. [WordPress API Integration](#wordpress-api-integration)
7. [Internationalization](#internationalization)
8. [Common Editing Tasks](#common-editing-tasks)
9. [Assets](#assets)

---

## Project Structure

```
glossapi.github.io-2/
├── index.html          # Main landing page (4376 lines)
├── blog.html           # Blog listing page (1322 lines)
├── article.html        # Individual article view (880 lines)
├── README.md           # This documentation
└── assets/             # Static assets
    ├── glossapi_white.svg
    ├── gfoss.svg
    ├── gfoss_white.svg
    ├── discord.svg
    ├── discord_white.svg
    ├── huggingface.svg
    ├── huggingface_white.svg
    ├── github.svg
    └── [team member photos].png
```

---

## Technology Stack

All dependencies are loaded via CDN. No build process is required.

| Technology | Version | Purpose |
|------------|---------|---------|
| Tailwind CSS | CDN (latest) | Utility-first CSS framework |
| Tailwind Typography | Plugin | Prose styling for article content |
| Three.js | r128 | 3D animated background canvas |
| Chart.js | Latest | Data visualization (statistics) |
| Font Awesome | 6.4.0 | Icon library |
| Google Fonts | - | Inter, Space Grotesk, JetBrains Mono, Playfair Display |

### CDN Links (in `<head>`)

```html
<!-- Tailwind CSS -->
<script src="https://cdn.tailwindcss.com"></script>
<script src="https://cdn.tailwindcss.com?plugins=typography"></script>

<!-- Font Awesome -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

<!-- Three.js -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>

<!-- Chart.js -->
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
```

---

## Page Overview

### index.html (Landing Page)

The main landing page containing:

- **Hero Section**: Animated logos (GFOSS + GlossAPI), tagline with glitch effects
- **Pipeline Section**: Scroll-animated 3-step process visualization
- **Roadmap/Stats Section**: Timeline and statistics display
- **Team Section**: Team member cards with photos and social links
- **Social Buttons**: Discord, Hugging Face, GitHub links
- **Footer**: Copyright and links

**Key Sections by ID:**
- `#home-view` - Main content wrapper
- `#pipeline-scroll-section` - Scroll-based animation container
- `#roadmap-stats` - Statistics and roadmap
- `#team` - Team member showcase

### blog.html (Blog Listing)

Displays articles fetched from WordPress API:

- **Featured Article**: Pinned/sticky post displayed prominently
- **Article Grid**: Cards for remaining articles
- **Loading State**: Spinner while fetching
- **Empty State**: Message when no articles exist

**Key Elements:**
- `#articles-wrapper` - Container for dynamically injected content
- `#featured-article` - Featured article card (injected)
- `#articles-grid` - Grid of article cards (injected)

### article.html (Article View)

Displays a single article:

- **Hero Header**: Title, date, back button
- **Featured Image**: Full-width background cover
- **Content Body**: WordPress HTML rendered with Tailwind Typography
- **Language Toggle**: Async translation matching

**Key Elements:**
- `#article-content` - Main article container
- `#article-title` - Article title
- `#article-date` - Publication date
- `#article-body` - Content container (prose styling)
- `#loading` - Loading spinner
- `#error` - Error state (article not found)

---

## Styling System

### Color Palette

```css
/* Primary Colors */
--gloss-bg: #1a1625;       /* Page background */
--gloss-purple: #8b5cf6;   /* Primary accent (Violet-500) */
--gloss-neon: #d8b4fe;     /* Light purple accent */

/* Dark Backgrounds */
#0f0b16, #0d0814, #1a1625  /* Various dark shades */
```

### Glass Box Component

The `.glass-box` class creates the signature glassmorphism effect:

```css
.glass-box {
    background: rgba(13, 8, 20, 0.6);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    border-radius: 1rem;
}
```

**Variants:**
- `.glass-box.small-shine` - Smaller shine effect for buttons
- `.glass-box.active-dataset` - Pulsing border animation
- `.glass-box[data-theme="purple|blue|green|pink|cyan"]` - Color theming

### Mouse-Following Shine Effect

Glass boxes feature a radial gradient shine that follows the mouse cursor. This is implemented via CSS custom properties updated by JavaScript:

```css
background: radial-gradient(
    600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), 
    rgba(139, 92, 246, 0.25), 
    transparent 40%
);
```

### Typography

```javascript
// Tailwind Config
fontFamily: {
    sans: ['Inter', 'sans-serif'],           // Body text
    display: ['Space Grotesk', 'sans-serif'], // Headings
    serif: ['Playfair Display', 'serif'],     // Decorative
    mono: ['JetBrains Mono', 'monospace'],    // Code/terminal
}
```

### Tailwind Configuration

Each page includes inline Tailwind configuration in a `<script>` tag:

```javascript
tailwind.config = {
    theme: {
        extend: {
            fontFamily: { ... },
            colors: { gloss: { ... } },
            animation: { ... },
            keyframes: { ... }
        }
    }
}
```

---

## JavaScript Architecture

### Navigation

**Floating Navigation Bar:**
- Fixed position at top
- Glassmorphism styling
- Mobile hamburger menu overlay

**Key Functions:**
- `toggleMobileMenu()` - Opens/closes mobile menu
- `switchView(viewName)` - Changes active view section (index.html only)

### 3D Background (Three.js)

The `#bg-canvas` element renders an animated 3D wireframe globe/grid. Implementation is at the bottom of each HTML file.

**Canvas Setup:**
```javascript
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(...);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('bg-canvas'), alpha: true });
```

### Mouse Tracking for Shine Effects

```javascript
document.addEventListener('mousemove', (e) => {
    document.querySelectorAll('.glass-box, .floating-nav').forEach(box => {
        const rect = box.getBoundingClientRect();
        box.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
        box.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    });
});
```

### Scroll-Based Animations (index.html)

The pipeline section uses scroll position to animate elements:

```javascript
const pipelineSection = document.getElementById('pipeline-scroll-section');
// Calculate progress based on scroll position
const sectionProgress = Math.min(1, Math.max(0, scrollInSection / (sectionHeight - viewportHeight)));
```

---

## WordPress API Integration

### API Configuration

```javascript
const WP_API_BASE = 'https://blog.glossapi.gr/wp-json/wp/v2';

// Language categories
const LANG_CATEGORIES = {
    el: [7, 1],   // Greek: glossapi, uncategorized
    en: [23, 13]  // English: glossapi-en, uncategorized-en
};
```

### Fetching Posts

**Blog Listing (blog.html):**
```javascript
const apiUrl = `${WP_API_BASE}/posts?_embed&per_page=50&categories=${categoryIds}`;
```

**Single Article (article.html):**
```javascript
const apiUrl = `${WP_API_BASE}/posts?_embed&slug=${encodeURIComponent(slug)}&categories=${categoryIds}`;
```

### Data Mapping

| WordPress Field | Usage |
|----------------|-------|
| `post.title.rendered` | Article title (HTML) |
| `post.excerpt.rendered` | Short description |
| `post.content.rendered` | Full article HTML |
| `post.date` | ISO 8601 date string |
| `post.slug` | URL-friendly identifier |
| `post.sticky` | Pinned/featured status |
| `post._embedded['wp:featuredmedia'][0].source_url` | Featured image URL |

### Translation Matching (article.html)

When switching languages on an article, the system attempts to find the translated version:

1. **Match by featured_media**: Same featured image ID indicates translation
2. **Match by publication date**: Articles published within 24 hours

```javascript
async function toggleLanguage(lang) {
    // Query target language articles
    const articles = await fetch(`${WP_API_BASE}/posts?_embed&per_page=50&categories=${targetCategories}`);
    
    // Match by featured image
    translatedArticle = articles.find(a => a.featured_media === currentArticle.featured_media);
    
    // Fallback: match by date
    if (!translatedArticle) {
        translatedArticle = articles.find(a => Math.abs(new Date(a.date) - currentDate) < 24*60*60*1000);
    }
}
```

---

## Internationalization

### Language Detection

Language is determined by URL parameter:
- Greek: `page.html` or `page.html?lang=el`
- English: `page.html?lang=en`

```javascript
const urlParams = new URLSearchParams(window.location.search);
let currentLang = urlParams.get('lang') || 'el'; // Default: Greek
```

### Language Toggle Function

```javascript
function toggleLanguage(lang) {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('lang', lang);
    window.location.href = `${window.location.pathname}?${urlParams.toString()}`;
}
```

### UI Text Translations

Each page contains a translations object:

```javascript
const translations = {
    el: {
        backToBlog: 'Πισω στο Blog',
        sourceTitle: 'Πηγη',
        // ...
    },
    en: {
        backToBlog: 'Back to Blog',
        sourceTitle: 'Source',
        // ...
    }
};
```

### Updating Language Button States

```javascript
document.getElementById('lang-en').classList.toggle('text-purple-400', currentLang === 'en');
document.getElementById('lang-el').classList.toggle('text-purple-400', currentLang === 'el');
```

---

## Common Editing Tasks

### Adding a New Navigation Link

1. Find the navigation section in the HTML (search for `id="main-nav"`)
2. Add a new `<a>` element following the existing pattern:

```html
<a href="new-page.html" class="nav-link hover:text-white transition-colors">
    New Page
</a>
```

3. Duplicate for mobile menu (search for `id="mobile-menu-overlay"`)

### Changing the Color Theme

1. Update the primary purple color in Tailwind config:
```javascript
colors: {
    gloss: {
        purple: '#NEW_COLOR',  // Change this
    }
}
```

2. Update CSS custom properties (search for `rgba(139, 92, 246`)

### Adding a Team Member

In `index.html`, find the `#team` section and add a new card:

```html
<div class="glass-box p-[5px] rounded-3xl relative group">
    <div class="bg-[#0a0a0f]/50 rounded-[1.3rem] p-5 text-center relative z-10">
        <img src="assets/new-member.png" alt="Name" class="w-24 h-24 rounded-full mx-auto mb-4 object-cover">
        <h3 class="font-display font-bold text-lg text-white mb-1">Member Name</h3>
        <p class="text-sm text-purple-300 mb-3">Role Title</p>
        <div class="flex justify-center gap-3">
            <a href="https://linkedin.com/in/..." target="_blank" class="team-social-link text-gray-400">
                <i class="fa-brands fa-linkedin text-lg"></i>
            </a>
        </div>
    </div>
</div>
```

### Modifying Article Styling

Article content uses Tailwind Typography. Customize in `article.html`:

```javascript
// In Tailwind config
typography: (theme) => ({
    DEFAULT: {
        css: {
            color: '#e2e8f0',
            h1: { color: '#fff', fontFamily: 'Space Grotesk' },
            // Add more customizations
        },
    },
}),
```

### Changing the WordPress API Endpoint

Update the constant in both `blog.html` and `article.html`:

```javascript
const WP_API_BASE = 'https://your-new-domain.com/wp-json/wp/v2';
```

### Adding New Language Categories

Update the `LANG_CATEGORIES` object:

```javascript
const LANG_CATEGORIES = {
    el: [7, 1],      // Existing Greek
    en: [23, 13],    // Existing English
    de: [30, 31],    // New German categories
};
```

---

## Assets

### Logo Files

| File | Description |
|------|-------------|
| `glossapi_white.svg` | GlossAPI logo (white version) |
| `gfoss.svg` | GFOSS logo (color version) |
| `gfoss_white.svg` | GFOSS logo (white version) |

### Social Icons

| File | Platform |
|------|----------|
| `discord.svg` / `discord_white.svg` | Discord |
| `huggingface.svg` / `huggingface_white.svg` | Hugging Face |
| `github.svg` | GitHub |

### Team Photos

Team member photos should be:
- Format: PNG
- Recommended size: 400x400px minimum
- Square aspect ratio (will be displayed as circles)

---

## Development Notes

### No Build Process

This is a static site with no build step. Edit HTML files directly and refresh the browser.

### Testing Locally

Open any HTML file directly in a browser, or use a local server:

```bash
# Python 3
python -m http.server 8000

# Node.js (npx)
npx serve .
```

### Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- CSS backdrop-filter requires `-webkit-` prefix for Safari
- Three.js requires WebGL support

### Performance Considerations

- Large HTML files (index.html is 237KB)
- Multiple CDN requests on initial load
- 3D canvas runs continuously (consider pausing when tab not visible)

---

## License

[Add license information here]
