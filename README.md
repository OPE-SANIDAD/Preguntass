# Oposita Sanidad — de tu web a Google Play

Este proyecto envuelve tu app web (carpeta `www/`) con **Capacitor** para
generar una app nativa de Android, y usa **Codemagic** para compilarla,
firmarla y (opcionalmente) subirla a Google Play en la nube.

## 0. Antes de nada

- [ ] Crea tu cuenta de **Google Play Console** (pago único de 25$) en
      https://play.google.com/console/signup
- [ ] Crea una cuenta gratuita en https://codemagic.io e inicia sesión con
      GitHub.
- [ ] Crea una cuenta en https://github.com si no la tienes.

## 1. Sube este proyecto a GitHub

1. Crea un repositorio nuevo (privado o público), p. ej. `oposita-sanidad-app`.
2. Sube TODO el contenido de esta carpeta (`package.json`,
   `capacitor.config.json`, `codemagic.yaml`, `www/`, este `README.md`)
   manteniendo la estructura de carpetas.

No hace falta que ejecutes nada en tu ordenador — Codemagic instalará
Capacitor y generará el proyecto Android automáticamente en cada build.

## 2. Cambia el identificador de la app (importante)

Abre `capacitor.config.json` y `codemagic.yaml` y cambia todas las
apariciones de:

```
com.opositasanidad.app
```

por un identificador único tuyo, con el formato `com.tuempresa.tuapp`
(no puede repetirse con ninguna otra app existente). Usa este mismo
identificador en el paso 4.

## 3. Crea un keystore de firma y súbelo a Codemagic

Android exige firmar la app con un keystore propio (a diferencia de iOS,
aquí no lo gestiona Apple/Google por ti la primera vez).

1. En Codemagic → tu equipo → **Team settings → Code signing identities
   → Android keystores**.
2. Pulsa **Generate keystore** (Codemagic puede crearlo por ti) o sube uno
   que ya tengas con `keytool`.
3. Guarda bien la contraseña y el alias — Google Play exigirá el mismo
   keystore para todas las actualizaciones futuras de la app, no se puede
   cambiar después.
4. Ponle el nombre `oposita_sanidad_keystore` (o cambia el nombre en
   `codemagic.yaml`, sección `android_signing`).

## 4. Conecta Codemagic con Google Play (para publicar automáticamente)

Esto es opcional: si solo quieres el `.apk`/`.aab` para subirlo tú a mano,
puedes saltarte este paso y solo se generará el artefacto.

1. En Google Play Console, crea una **cuenta de servicio** con acceso a
   la API (Configuración → Acceso a la API → Crear cuenta de servicio),
   siguiendo la guía de Google.
2. Descarga el JSON de credenciales.
3. En Codemagic → **Team settings → Environment variables**, crea el
   grupo `googleplay_credentials` con la variable
   `GOOGLE_PLAY_SERVICE_ACCOUNT_CREDENTIALS` (pega el contenido del JSON).

## 5. Crea la app en Google Play Console

1. Ve a https://play.google.com/console → **Crear app**.
2. Nombre del paquete: el mismo que pusiste en el paso 2
   (`com.opositasanidad.app` o el tuyo).
3. Rellena nombre, idioma principal (español), categoría, ficha de la
   tienda, etc. (las capturas de pantalla y descripción las puedes
   añadir más tarde).

## 6. Lanza el build en Codemagic

1. En Codemagic, añade tu repositorio de GitHub como app nueva.
2. Detectará el `codemagic.yaml` automáticamente y verás el workflow
   **"Oposita Sanidad · Android (Google Play)"**.
3. Pulsa **Start new build**.
4. Codemagic instalará Capacitor, generará el proyecto Android, compilará
   y firmará el `.aab` (para Google Play) y el `.apk` (para probar en un
   móvil directamente). Si configuraste el paso 4, lo subirá también al
   track "internal" de Google Play como borrador.

## 7. Probar antes de publicar (recomendado)

- Descarga el `.apk` de los artefactos del build en Codemagic e instálalo
  directamente en un Android (activa "Orígenes desconocidos" si hace
  falta), o
- Si conectaste Google Play, únete al track "internal testing" desde tu
  cuenta de prueba para instalarla desde la Play Store.

## 8. Publicar en Google Play

Cuando estés conforme:

- Opción A (manual, recomendada la primera vez): en Google Play Console,
  revisa el borrador subido por Codemagic en el track interno y
  promociónalo a producción.
- Opción B (automática): cambia en `codemagic.yaml` `track: production`
  y `submit_as_draft: false`, y vuelve a lanzar el build.

Google suele tardar entre unas horas y un par de días en revisarla.

## Sobre el contenido de las preguntas

`www/index.html` sigue descargando las preguntas desde tu repositorio
de GitHub (`raw.githubusercontent.com/OPE-SANIDAD/Preguntas`) tal cual
lo tenías. No hace falta tocar nada ahí: puedes seguir actualizando las
preguntas sin volver a pasar por revisión de Google.

## Notas

- El icono y el nombre que verá el usuario salen de `capacitor.config.json`
  (`appName`) y de los iconos en `www/icons/`. Los iconos actuales están
  pensados para iOS/PWA; para Android es recomendable generar también un
  icono adaptable (foreground + background 512×512) — dímelo y te lo
  preparo.
- Ya no necesitas cuenta de Apple Developer ni CocoaPods: ese era el
  fallo que tenías en Codemagic, porque el proyecto solo estaba
  configurado para iOS. Ahora usa Gradle/Java, nativo de Android.
