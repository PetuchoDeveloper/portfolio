/**
 * Single source of truth for site identity.

 */
export const site = {
  name: 'Kevin Varick',
  handle: 'Petucho',
  tagline: 'Websites people can find. Software built to last.',
  description:
    'Kevin Varick is a full-stack developer in Mexico who builds fast websites for small businesses and reliable web applications for institutions.',
  email: 'petucho.dev@proton.me',
  location: 'Mexico',
  languages: ['English', 'Spanish'],
  github: 'https://github.com/PetuchoDeveloper',
  url: 'https://kevinvarick.dev',
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
      'A website made for your business, not a template. It tells people what you do in seconds, works great on a phone, and gives Google everything it needs to list you.',
    deliverables: [
      'A design made for your business. No templates.',
      'Built for phones first, and fast. Nobody waits for a spinner.',
      'The technical search setup: structured data, sitemap, and the local words your customers type.',
      'Clear pages for what you offer, where you are, and how to reach you.',
      'Your code, domain, and hosting, in your name.',
    ],
  },
  {
    slug: 'full-stack-web-apps',
    name: 'Full-stack web applications',
    priority: 'Primary',
    summary:
      'Got an idea for an app, or an old system that needs replacing? I build it from the first prototype to launch day: React on the front, Django or FastAPI on the back, PostgreSQL, and automatic deploys.',
    deliverables: [
      'React or Next.js frontends that stay fast.',
      'Django or FastAPI backends with automated tests.',
      'Database design, background jobs, and clear API contracts.',
      'Docker deploys to AWS, EC2, or your own server.',
      'A security review of logins, sessions, secrets, and data before launch.',
    ],
  },
] as const;

export const servicesEs = [
  {
    slug: 'sitios-web-para-pequenos-negocios',
    name: 'Sitios web para pequeños negocios',
    priority: 'Principal',
    summary:
      'Un sitio hecho para tu negocio, no una plantilla. Le dice a la gente qué haces en segundos, se ve bien en el teléfono y le da a Google todo lo que necesita para mostrarte.',
    deliverables: [
      'Un diseño hecho para tu negocio. Nada de plantillas.',
      'Pensado primero para el teléfono, y rápido. Nadie espera a que gire el loader.',
      'La configuración técnica para buscadores: datos estructurados, sitemap y las palabras locales que escriben tus clientes.',
      'Páginas claras de lo que ofreces, dónde estás y cómo contactarte.',
      'Tu código, tu dominio y tu hospedaje, a tu nombre.',
    ],
  },
  {
    slug: 'aplicaciones-web-full-stack',
    name: 'Aplicaciones web full-stack',
    priority: 'Principal',
    summary:
      '¿Tienes la idea de una app, o un sistema viejo que ya hay que cambiar? Lo construyo desde el primer prototipo hasta el día del lanzamiento: React al frente, Django o FastAPI atrás, PostgreSQL y despliegues automáticos.',
    deliverables: [
      'Frontends en React o Next.js que se mantienen rápidos.',
      'Backends en Django o FastAPI con pruebas automatizadas.',
      'Diseño de base de datos, tareas en segundo plano y contratos de API claros.',
      'Despliegues con Docker en AWS, EC2 o tu propio servidor.',
      'Una revisión de seguridad de accesos, sesiones, secretos y datos antes de lanzar.',
    ],
  },
] as const;
