# Oposita Sanidad — de tu web a la App Store

Este proyecto envuelve tu app web (carpeta `www/`) con **Capacitor** para
generar una app nativa de iOS, y usa **Codemagic** para compilarla y
firmarla en la nube (no necesitas un Mac propio).

## 0. Antes de nada

- [ ] Crea tu cuenta de **Apple Developer Program** (99$/año) en
      https://developer.apple.com/programs/ — necesitas verificar tu
      identidad, puede tardar 24–48h en aprobarse.
- [ ] Crea una cuenta gratuita en https://codemagic.io e inicia sesión con
      GitHub.
- [ ] Crea una cuenta en https://github.com si no la tienes.

## 1. Sube este proyecto a GitHub

1. Crea un repositorio nuevo (privado o público), p. ej. `oposita-sanidad-app`.
2. Sube TODO el contenido de esta carpeta (`package.json`,
   `capacitor.config.json`, `codemagic.yaml`, `www/`, este `README.md`)
   manteniendo la estructura de carpetas.

No hace falta que ejecutes nada en tu ordenador — Codemagic instalará
Capacitor y generará el proyecto iOS automáticamente en cada build.

## 2. Cambia el identificador de la app (importante)

Abre `capacitor.config.json` y cambia:

```json
"appId": "com.opositasanidad.app"
```

por un identificador único tuyo, con el formato `com.tuempresa.tuapp`
(no puede repetirse con ninguna otra app existente). Usa este mismo
identificador en el paso 4.

## 3. Conecta Codemagic con tu cuenta de Apple

En Codemagic → tu equipo → **Team settings → Integrations → App Store Connect**:

1. Sigue el asistente para crear una **API Key de App Store Connect**
   (se genera desde appstoreconnect.apple.com → Users and Access → Keys).
2. Súbela a Codemagic con el nombre `integration` (así coincide con
   `auth: integration` del `codemagic.yaml`).

Esto permite que Codemagic firme la app automáticamente sin que tengas
que gestionar certificados a mano.

## 4. Crea la app en App Store Connect

1. Ve a https://appstoreconnect.apple.com → **Mis apps → +**.
2. Bundle ID: el mismo que pusiste en el paso 2
   (`com.opositasanidad.app` o el tuyo).
3. Rellena nombre, idioma principal (español), categoría, etc.
   (las capturas de pantalla y descripción las puedes añadir más tarde,
   antes de enviar a revisión).

## 5. Lanza el build en Codemagic

1. En Codemagic, añade tu repositorio de GitHub como app nueva.
2. Detectará el `codemagic.yaml` automáticamente y verás el workflow
   **"Oposita Sanidad · iOS (App Store)"**.
3. Pulsa **Start new build**.
4. Codemagic instalará Capacitor, generará el proyecto Xcode, compilará,
   firmará y subirá el `.ipa` a **TestFlight** automáticamente
   (`submit_to_testflight: true` en el yaml).

## 6. Probar antes de publicar (recomendado)

Con la app en TestFlight puedes instalarla en tu iPhone real desde la
app TestFlight de Apple, para comprobar que todo funciona bien antes
de mandarla a revisión pública.

## 7. Enviar a revisión de la App Store

Cuando estés conforme:

- Opción A (manual, recomendada la primera vez): en App Store Connect,
  selecciona el build subido por Codemagic y pulsa **Submit for Review**.
- Opción B (automática): cambia en `codemagic.yaml`
  `submit_to_app_store: true` y vuelve a lanzar el build.

Apple suele tardar entre 24h y unos pocos días en revisarla.

## Sobre el contenido de las preguntas

`www/index.html` sigue descargando las preguntas desde tu repositorio
de GitHub (`raw.githubusercontent.com/OPE-SANIDAD/Preguntas`) tal cual
lo tenías. No hace falta tocar nada ahí: puedes seguir actualizando las
preguntas sin volver a pasar por revisión de Apple.

## Notas

- El icono y el nombre que verá el usuario salen de `capacitor.config.json`
  (`appName`) y de los iconos en `www/icons/`. Si quieres iconos con más
  resolución nativa iOS (1024×1024 para App Store), dímelo y te los genero.
- Necesitarás capturas de pantalla del dispositivo para la ficha de
  App Store Connect — se pueden sacar directamente desde TestFlight o
  el simulador de Xcode que usa Codemagic (te puedo ayudar a montar ese
  paso si hace falta).
