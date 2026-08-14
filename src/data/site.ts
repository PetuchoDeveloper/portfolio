/**
 * Single source of truth for site identity.
 * TODO(owner): update handle, email, and links here — every page reads from this file.
 */
export const site = {
  name: 'Petucho',
  handle: 'Petucho',
  tagline: 'Websites that get found. Software that holds up.',
  description:
    'Petucho is a full-stack developer building fast, search-friendly websites for small businesses and production-grade web applications with security baked in.',
  // TODO(owner): put your real contact email before launch.
  email: 'hello@petucho.dev',
  location: 'Mexico',
  languages: ['English', 'Spanish'],
  github: 'https://github.com/PetuchoDeveloper',
  url: 'https://petucho.dev',
} as const;

export const nav = [
  { label: 'Work', href: '/work/' },
  { label: 'Services', href: '/services/' },
  { label: 'About', href: '/about/' },
  { label: 'Blog', href: '/blog/' },
] as const;

export const services = [
  {
    slug: 'small-business-websites',
    name: 'Websites for small businesses',
    priority: 'Primary',
    summary:
      'A complete website — designed, built, and tuned so customers can actually find you. Fast pages, clear pages, and search engines that understand what you do.',
    deliverables: [
      'Custom design matched to your business, not a template',
      'Mobile-first build that loads in under a second',
      'Search-engine setup: structured data, sitemaps, local keywords',
      'Contact, services, and location pages that convert visitors',
      'Everything handed over: you own the code and the domain',
    ],
  },
  {
    slug: 'full-stack-web-apps',
    name: 'Full-stack web applications',
    priority: 'Primary',
    summary:
      'Production web applications from prototype to launch: React frontends, Django and FastAPI backends, PostgreSQL, and cloud deployment with CI/CD.',
    deliverables: [
      'React / Next.js frontends with strict performance budgets',
      'Django or FastAPI backends with automated test suites',
      'Database design, background jobs, and API contracts',
      'Docker-based deployment pipelines (AWS, EC2, or your VPS)',
      'Security review included in every build — auth, sessions, and data protection checked before launch',
    ],
  },
] as const;
