# Sudeo

Маркетинговый сайт компании по разработке ИИ-агентов, сайтов, мобильных приложений и digital-маркетингу. Проект работает на React 19, TypeScript и Vite, предварительно генерирует HTML публичных маршрутов и разворачивается через GitHub Pages.

## Правила работы

Перед изменениями прочитайте:

- `rules.md`
- `AGENTS.md`
- активный change в `openspec/changes/`
- решения в `docs/adr/`

Материальные изменения проходят отдельные OpenSpec-гейты planning, apply и archive.

## Локальный запуск

```bash
npm ci
npm run dev
```

Vite выводит адрес локального сервера. Публичный endpoint формы по умолчанию не настроен, поэтому сайт честно показывает, что онлайн-доставка обращения недоступна.

## Проверка и сборка

```bash
npm run lint
npm run check:architecture
npm run build
npm run check:site
npm run preview
```

`npm run build` выполняет:

1. очистку предыдущих генерируемых файлов с сохранением `docs/adr/`;
2. TypeScript-проверку;
3. проверку FSD-границ, page slices, lazy exports, UI-примитивов и route catalog;
4. клиентскую Vite-сборку;
5. SSR-сборку;
6. предварительный рендер всех маршрутов в `docs/<route>/index.html`;
7. генерацию `sitemap.xml` и `robots.txt`;
8. проверку маршрутов, H1, canonical, CNAME и отсутствия старого бренда.

## Контент

Первая версия использует типизированный контент в `src/shared/content/siteContent.ts`. Маршруты и SEO-метаданные находятся в `src/shared/config/routes.ts`.

Это не CMS: черновики, роли редакторов, предпросмотр, публикация и редиректы требуют отдельного выбора и интеграции CMS через новый OpenSpec change.

## Архитектура приложения

- `src/app/routes/` — типизированная конфигурация React Router и `AppRouter` на `useRoutes`.
- `src/app/providers/` — провайдеры store и управление route metadata.
- `src/app/store/` — Redux Toolkit store, типизированная схема состояния и reducer manager.
- `src/pages/<page>/model/` — реальные типы, content/view-model selectors и page-specific contracts без пустых API/reducer placeholders.
- `src/pages/<page>/ui/` — route-level UI, приватные `components/` и `<Page>.async.tsx`; внешний импорт идёт только через slice `index.ts`.
- `src/widgets/` — самостоятельные продуктовые композиции: `PageHero`, `DetailHero`, `ServiceCatalog`, `WorkStages`, `Faq`, route `Page` и форма обращения. Форма хранит UI-состояние в динамически подключаемом reducer; остальные статические widgets не получают фиктивные reducers.
- `src/shared/layouts/Container` задаёт каноническую ширину и адаптивные горизонтальные gutters; `MainContent` делегирует ему размеры route content, а `src/widgets/Page` остаётся единственным `main` landmark.
- `src/shared/ui/` — независимые `AppPadding`, `AppGrid`, `Flex`, `HStack`, `VStack`, `AppText`, `AppButton`, `AppImage`, `AppLink`, `Box`, `Section`, `Eyebrow`, `Badge`, `Card`/`LinkCard` и `Prose` с собственными SCSS modules. `shared` не знает service slugs или route composition. `Section` задаёт общий вертикальный ритм через `AppPadding`; route pages не дублируют page gutters, section rhythm, grid columns, generic card surfaces, badges, eyebrows, prose или structural gaps в локальном CSS.
- Responsive-стили строятся mobile-first: правила без media query рассчитаны на телефоны до 450px, tablet-изменения применяются только через `@media (min-width: 451px)`, desktop-изменения — только через `@media (min-width: 960px)`. Базовые props `AppPadding` и `AppGrid.columns` относятся к телефону; расширения задаются через `tablet*`/`desktop*`, `tabletColumns`/`desktopColumns`. Architecture checker запрещает width-based `max-width` и другие width breakpoints.
- `src/shared/lib/` — инфраструктурные компоненты, включая app-independent `DynamicModuleLoader`.

Направление зависимостей: `app → pages → widgets → shared`. `shared` не импортирует верхние слои, `widgets` не импортирует `pages/app`, а page slice не импортирует соседнюю page slice. Все route pages используют `Page`, `MainContent` или утверждённый shared shell и polymorphic shared primitives вместо raw layout containers. Правила автоматически проверяет `scripts/check-architecture.mjs`, включая structural spacing ownership.

Маршруты и группы visitor navigation определены в `src/shared/config/routes.ts`. Header показывает текущий route, содержит доступный dropdown всех visitor-facing страниц и эквивалентное мобильное меню; footer выводит полный сгруппированный sitemap. `/success` и `/404` не являются discovery destinations.

Hover/focus/pressed и entrance effects принадлежат соответствующим primitives/widgets/pages. Основной контент не скрывается до JavaScript, а `prefers-reduced-motion: reduce` отключает необязательное движение. Решение описано в `docs/adr/0006-reusable-ui-and-route-aware-interaction.md`.

Семантика является частью UI API: breadcrumbs используют `nav > ol > li`, нумерованные процессы — `ol > li`, роли и компетенции — `ul > li`, а reusable card/widget принимает корректный heading level от страницы. Generated route должен содержать ровно один `main`, один `h1` и логичную иерархию последующих заголовков.

Начальная загрузка сохраняет геометрию prerendered content: bootstrap loader находится поверх страницы вне потока и исчезает только через opacity/visibility, route sections не получают load-time translate/scale/stagger, а `AppImage` требует intrinsic width/height или явный aspect ratio. Стабильность проверяется при выключенном кеше через `PerformanceObserver` и сравнением координат header, H1, primary action и первой секции до/после hydration.

Клиент загружает страницы отдельными lazy chunks. При медленной клиентской навигации общий `Suspense` показывает брендированный loader из логотипа и названия Sudeo; loader публикует status для assistive technologies и отключает движение при `prefers-reduced-motion: reduce`.

Build-time renderer сначала использует React 19 `prerenderToNodeStream` для разрешения lazy-модулей, затем формирует итоговый HTML через `renderToString`. Клиентская сборка также создаёт Vite manifest; `routeManifest.clientEntry` указывает lazy entry каждой страницы, а prerender рекурсивно добавляет в `<head>` CSS страницы и импортированных widgets/shared chunks. Поэтому generated documents содержат основной route content уже в финальной геометрии — без ожидания JavaScript, loader, скрытых replacement-сегментов и inline Suspense swap-script. Решение описано в `docs/adr/0005-application-composition-and-lazy-modules.md`.

## Форма обращения

Для включения отправки задайте при сборке:

```bash
VITE_LEAD_ENDPOINT=https://example.com/api/leads npm run build
```

Endpoint должен принимать JSON и подтверждать сохранение успешным HTTP-ответом. Требования к production-обработчику описаны в `docs/adr/0003-lead-submission-boundary.md`: серверная валидация, rate limit, антиспам, идемпотентность, очередь, CRM retries, уведомления, хранение и удаление.

Нельзя помещать CRM-токены или другие секреты в `VITE_*`: такие значения попадают в браузерный bundle.

## CI/CD и GitHub Pages

Workflow: `.github/workflows/deploy.yml`.

Для pull request и push workflow запускает `npm ci`, lint и полную сборку. Успешный push в `main` явно конфигурирует Pages, загружает каталог `docs/` и запускает deployment через environment `github-pages`. Последовательность согласована с рабочим репозиторием `deorditse/tec_drive`, при этом Sudeo сохраняет дополнительные architecture и static-artifact проверки.

Владелец репозитория должен отдельно:

1. открыть **Settings → Pages**;
2. выбрать **GitHub Actions** как источник публикации;
3. указать custom domain `sudeo.ru` и включить HTTPS после выпуска сертификата;
4. настроить у DNS-провайдера apex-домен на официальные IP GitHub Pages либо записи, рекомендованные GitHub на дату настройки;
5. при необходимости настроить `www` как CNAME на Pages-hostname репозитория;
6. проверить DNS, HTTPS, главную и прямой вложенный маршрут.

GitHub Pages для репозитория включён и custom domain `sudeo.ru` зарегистрирован. Авторитетная зона находится в REG.RU (`ns1.reg.ru`, `ns2.reg.ru`), но apex пока указывает на старый `95.163.244.138`. Для завершения публикации нужно удалить конфликтующую запись и установить четыре A-записи GitHub Pages: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`, затем дождаться проверки домена и включить HTTPS.

Пример проверки после настройки:

```bash
dig +short sudeo.ru A
dig +short sudeo.ru AAAA
curl -I https://sudeo.ru/
curl -I https://sudeo.ru/services/ai-agents/
```

## Откат

Откат выполняется revert-коммитом или повторным запуском workflow для последнего проверенного commit. После отката проверяются conclusion GitHub Actions, публичная главная страница и один вложенный маршрут.

## Неподтверждённые данные перед production launch

До коммерческого запуска требуется утвердить и добавить:

- публичный контакт и ответственного;
- юридическое лицо/оператора данных и финальную правовую страницу;
- production lead endpoint и CRM-маршрут;
- согласованные кейсы, команду и права на публикацию;
- аналитику и consent-модель;
- CMS, если нужен no-code редактор.
