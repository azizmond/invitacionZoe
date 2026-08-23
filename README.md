# Landing Page Premium - 15 años de Zoe

Invitación digital premium, mobile-first y lista para desplegar en Netlify.

## Estructura

```text
/
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── main.js
├── assets/
│   ├── images/
│   │   └── hero-poster.svg
│   └── video/
│       └── README.md
└── README.md
```

## Qué incluye

- Hero a pantalla completa con video de fondo y poster de fallback.
- Countdown en vivo hasta `2026-10-23T21:00:00-03:00`.
- Secciones de evento, dress code, RSVP y mapa.
- Formulario con validación sin `alert()`.
- Botones de WhatsApp con placeholders editables.
- Respeta `prefers-reduced-motion`.

## Reemplazos rápidos

En `js/main.js` podés editar:

- `EVENT_CONFIG`
- `whatsappContacts`

En `assets/video/` podés agregar:

- `hero.webm`
- `hero.mp4`

Y en `assets/images/` podés reemplazar:

- `hero-poster.svg`

## Ejecutar localmente

Abrí `index.html` con un servidor estático.

Si tenés Node instalado:

```bash
npx serve .
```

## Desplegar en Netlify

1. Subí el proyecto a un repositorio Git.
2. Conectalo en Netlify.
3. Dejás el build command vacío.
4. Usás la carpeta raíz como publish directory.

## Notas

- El proyecto no usa frameworks ni backend.
- El video hero queda preparado para reemplazarse por una pieza real sin tocar la estructura.
