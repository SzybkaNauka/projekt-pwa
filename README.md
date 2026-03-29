# StreamBox PWA

Desktop-first aplikacja VOD zbudowana w `Nuxt 4`, z warstwą `PWA` i widocznym użyciem `Bulma`.

## Stack

- `Nuxt 4`
- `@vite-pwa/nuxt`
- `Bulma`
- `Vue 3`

## Uruchomienie

Zainstaluj zależności:

```bash
npm install
```

Uruchom development:

```bash
npm run dev
```

Zbuduj wersję produkcyjną:

```bash
npm run build
```

Uruchom gotowy build:

```bash
node .output/server/index.mjs
```

## Instalacja jako aplikacja w Chrome

Po uruchomieniu buildu wejdź na:

```text
http://localhost:3000
```

Następnie w Chrome:

- kliknij ikonę instalacji w pasku adresu, albo
- wybierz `Zainstaluj StreamBox` z menu Chrome.

## Założenia projektu

- interfejs jest przygotowany pod desktop, bez wersji mobile
- PWA działa przez `manifest.webmanifest` i `service worker`
- Bulma jest podłączona globalnie i użyta bezpośrednio w UI, żeby była widoczna przy ocenie
