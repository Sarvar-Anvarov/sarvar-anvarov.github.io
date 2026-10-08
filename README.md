# sarvar-anvarov.github.io

Сайт разработчика: главная со списком игр и приложений и отдельная папка на каждое приложение.
Сайт статический, без сборки: GitHub Pages отдаёт файлы как есть.

## Структура

```
/                       главная: кто я и список игр и приложений
/assets/site.css        общий нейтральный стиль (главная, 404, заготовки)
/riposte/               Riposte: лендинг, поддержка, политика; свой стиль, шрифты и картинки
/templates/app/         заготовка для нового приложения (закрыта от поисковиков)
/privacy.html           старый адрес политики Riposte, перекидывает на /riposte/privacy.html
/404.html               страница «не найдено»
/robots.txt, /sitemap.xml
```

## Адреса Riposte для App Store Connect

| Поле | Адрес |
| --- | --- |
| Marketing URL | https://sarvar-anvarov.github.io/riposte/ |
| Support URL | https://sarvar-anvarov.github.io/riposte/support.html |
| Privacy Policy URL | https://sarvar-anvarov.github.io/riposte/privacy.html |

Старые адреса (`/` и `/privacy.html`) продолжают работать, так что менять их можно не спеша.

## Как добавить новое приложение

1. Скопируйте `templates/app/` в папку с коротким именем латиницей, например `/myapp/`.
2. Во всех трёх файлах замените всё в `{{ }}` (название, подзаголовок, `SLUG` = имя папки, цвет `ACCENT`, дата)
   и удалите строку `<meta name="robots" content="noindex">`.
3. Положите в папку иконки `icon-180.png` и `icon-32.png` (из иконки приложения) и картинку для превью `img/og.jpg` 1200×630.
4. На главной (`/index.html`) скопируйте блок `<li class="app">` и поменяйте ссылки, тексты и цвета `--app-accent`, `--app-bg`.
5. Добавьте новые страницы в `sitemap.xml`.
6. Политику конфиденциальности пишите по тому, что реально делает приложение и его SDK.
   Готовый пример — `/riposte/privacy.html`.

Если приложению нужен свой яркий лендинг, как у Riposte, делайте его в той же папке со своим CSS.
`assets/site.css` для этого не обязателен.

## Перед релизом Riposte

- **Кнопка App Store.** Заменить «Coming soon on iPhone» на официальный значок «Download on the App Store»
  (на `/riposte/`, на главной и в заготовке) со ссылкой на игру.
- **Smart App Banner.** Добавить в `<head>` на `/riposte/`: `<meta name="apple-itunes-app" content="app-id=ID_ИЗ_APP_STORE">`.
- **app-ads.txt.** AdMob и AppLovin проверяют файл `/app-ads.txt` в корне сайта разработчика (того, что указан в App Store).
  Строки для файла дают AdMob и AppLovin в своих кабинетах. Файл один на все приложения.
- **Иконки.** Сейчас стоят временные (буква R). Заменить `riposte/icon-180.png` и `riposte/icon-32.png` на настоящую иконку игры.

## Картинки

Картинки на страницах в WebP: они примерно на 40% легче JPG. Превью для соцсетей (`og.jpg`) остаётся в JPG, его понимают все.
Перевести картинку в WebP:

```
python3 -c "from PIL import Image; Image.open('in.jpg').save('out.webp', quality=80, method=6)"
```

## Свой домен

Если появится домен: добавьте его в Settings › Pages, положите в корень файл `CNAME` с доменом и замените
`https://sarvar-anvarov.github.io` на новый адрес во всех `canonical`, `og:url`, `og:image`, в `sitemap.xml` и `robots.txt`.
Старые ссылки на github.io GitHub сам перенаправит на новый домен.

## Шрифты

Шрифты Riposte (Grenze, Alegreya Sans) лежат в `/riposte/fonts/`, а не грузятся с Google Fonts.
Это быстрее, и браузер не отправляет IP посетителей в Google. Лицензия SIL OFL, её текст лежит рядом со шрифтами.
