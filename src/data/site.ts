/**
 * Single source of truth for site identity.

 */
export const site = {
  name: 'Petucho',
  handle: 'Petucho',
  tagline: 'Websites people can find. Software built to last.',
  description:
    'Petucho is a full-stack developer in Mexico who builds fast websites for small businesses and reliable web applications for institutions.',
  email: 'petucho.dev@proton.me',
  location: 'Mexico',
  languages: ['English', 'Spanish'],
  github: 'https://github.com/PetuchoDeveloper',
  url: 'https://petucho.dev',
  // Current SED production host (GitHub SED_DOMAIN_NAME / live smoke target).
  sedLiveUrl: 'https://98.95.232.141.sslip.io/',
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
      'A custom website that explains what you do, works well on a phone, and gives search engines the information they need to list your business.',
    deliverables: [
      'Custom design matched to your business, not a template',
      'A mobile-first build with a strict speed budget',
      'Technical search setup: structured data, sitemap, and local service terms',
      'Clear contact, service, and location pages',
      'Your code, domain, and hosting accounts handed over to you',
    ],
  },
  {
    slug: 'full-stack-web-apps',
    name: 'Full-stack web applications',
    priority: 'Primary',
    summary:
      'Web applications built from prototype through launch, with a React frontend, a Django or FastAPI backend, PostgreSQL, and an automated deployment pipeline.',
    deliverables: [
      'React / Next.js frontends with strict performance budgets',
      'Django or FastAPI backends with automated test suites',
      'Database design, background jobs, and API contracts',
      'Docker-based deployment pipelines (AWS, EC2, or your VPS)',
      'A review of authentication, sessions, secrets, and data protection before launch',
    ],
  },
] as const;

export const servicesEs = [
  {
    slug: 'sitios-web-para-pequenos-negocios',
    name: 'Sitios web para pequeños negocios',
    priority: 'Principal',
    summary:
      'Un sitio a la medida que explica lo que haces, funciona bien en el teléfono y da a los buscadores la información necesaria para mostrar tu negocio.',
    deliverables: [
      'Diseño a la medida de tu negocio, sin plantillas genéricas',
      'Desarrollo pensado primero para móvil y sujeto a un presupuesto estricto de rendimiento',
      'Configuración técnica para buscadores: datos estructurados, sitemap y términos de servicio local',
      'Páginas claras de contacto, servicios y ubicación',
      'Entrega de tu código, dominio y cuentas de hospedaje',
    ],
  },
  {
    slug: 'aplicaciones-web-full-stack',
    name: 'Aplicaciones web full-stack',
    priority: 'Principal',
    summary:
      'Aplicaciones web desarrolladas desde el prototipo hasta el lanzamiento, con frontend en React, backend en Django, PostgreSQL y un proceso automatizado de despliegue.',
    deliverables: [
      'Frontends en React o Next.js con presupuestos estrictos de rendimiento',
      'Backends en Django con pruebas automatizadas',
      'Diseño de base de datos, tareas en segundo plano y contratos de API',
      'Despliegues con Docker en AWS, EC2 o tu VPS',
      'Revisión de autenticación, sesiones, secretos y protección de datos antes del lanzamiento',
    ],
  },
] as const;
