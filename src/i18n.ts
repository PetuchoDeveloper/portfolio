export type Locale = 'en' | 'es';

export const localeMeta = {
  en: {
    htmlLang: 'en',
    ogLocale: 'en_US',
    dateLocale: 'en-US',
    switchLabel: 'ES',
    switchAria: 'Ver sitio en español',
    mainNav: 'Main navigation',
    homeAria: 'home',
    startProject: 'Start a project',
    startShort: 'Start',
    skip: 'Skip to content',
    site: 'Site',
    elsewhere: 'Elsewhere',
    contact: 'Contact',
    email: 'Email',
    rights: 'All rights reserved.',
    built: 'Built with Astro · No trackers, no cookies.',
    themeAria: 'Switch color theme',
    themeLight: 'Use light mode',
    themeDark: 'Use dark mode',
    languages: ['English', 'Spanish'],
  },
  es: {
    htmlLang: 'es-MX',
    ogLocale: 'es_MX',
    dateLocale: 'es-MX',
    switchLabel: 'EN',
    switchAria: 'View site in English',
    mainNav: 'Navegación principal',
    homeAria: 'inicio',
    startProject: 'Cuéntame tu proyecto',
    startShort: 'Empezar',
    skip: 'Ir al contenido',
    site: 'Sitio',
    elsewhere: 'En otros sitios',
    contact: 'Contacto',
    email: 'Correo',
    rights: 'Todos los derechos reservados.',
    built: 'Hecho con Astro · Sin rastreadores ni cookies.',
    themeAria: 'Cambiar tema de color',
    themeLight: 'Usar modo claro',
    themeDark: 'Usar modo oscuro',
    languages: ['Inglés', 'Español'],
  },
} as const;

export const localizedNav = {
  en: [
    { label: 'Work', href: '/work/' },
    { label: 'Services', href: '/services/' },
    { label: 'About', href: '/about/' },
    { label: 'Blog', href: '/blog/' },
  ],
  es: [
    { label: 'Trabajo', href: '/es/work/' },
    { label: 'Servicios', href: '/es/services/' },
    { label: 'Acerca de mí', href: '/es/about/' },
    { label: 'Notas', href: '/es/blog/' },
  ],
} as const;

export function localizedPath(pathname: string, locale: Locale): string {
  const clean = pathname.startsWith('/es') ? pathname.slice(3) || '/' : pathname;
  return locale === 'es' ? `/es${clean === '/' ? '/' : clean}` : clean;
}
