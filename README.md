# Visitor Dashboard

A dashboard that shows who has visited a website: how many unique visitors there are, which
devices and operating systems they use, and where they come from. Every visitor is drawn as a
hexagon in a hive.

**Live:** <https://cu2023.camp.lnu.se> (requires the LNU network or VPN)

## Vision

I am applying for jobs and send the link to my portfolio to recruiters, but I never know whether
anyone actually opens it. Visitor Dashboard is meant to answer that. It shows every unique visitor
to the portfolio, with device type, operating system and location. If a visitor from Gothenburg
shows up the day after I applied for a job there, I know the application was read.

In this first version the dashboard counts its own visitors, which shows that the tracking works.
Placing it in front of the portfolio is planned (see [Planned](#planned)).

## Requirements

| ID | Requirement |
| --- | --- |
| R1 | Every visit to the dashboard is registered as a visitor. |
| R2 | A returning visitor (same browser from the same address) is not counted again. |
| R3 | The dashboard shows the number of unique visitors. |
| R4 | The dashboard shows the number of visitors per device type (desktop, mobile, tablet). |
| R5 | Every visitor is shown as a hexagon with id, device type, operating system and location. |
| R6 | The colour of a visitor's hexagon shows the device type. |
| R7 | The application is reachable at <https://cu2023.camp.lnu.se>. |

How each requirement was tested is described in [TEST_REPORT.md](TEST_REPORT.md).

## How to use it

Open <https://cu2023.camp.lnu.se>. Your visit is registered and you appear as a new hexagon under
**Visitors**. Open the page in another browser or on your phone to see a new visitor appear.
Reloading the page in the same browser does not add a visitor.

| Hexagon border | Device type |
| --- | --- |
| Green | Desktop |
| Blue | Mobile |
| Orange | Tablet |
| Grey | TV or unknown |

## Modules used

| Module | Role in the application |
| --- | --- |
| [visitor-module](https://github.com/FelixJrB/VisitorModule) ([npm](https://www.npmjs.com/package/visitor-module)) | My own module. Registers visitors and reads device type and operating system from the user agent. |
| [midgard-hex-grid](https://github.com/niklasgolf/1dv610-labb2-midgard-hex-grid) ([npm](https://www.npmjs.com/package/midgard-hex-grid)) | Another student's module. Calculates the position and corners of every hexagon. |

Both are installed from npm as ordinary dependencies, so they stay separate projects.

## Run it locally

Requires Node.js 24 or later.

```bash
git clone https://github.com/FelixJrB/laboration-3.git
cd laboration-3
npm install
npm run dev
```

Open <http://localhost:3000>. Locally every visit comes from your own machine, so the address is
`::1` and the location is `Unknown`.

## Deployment

The application runs in Docker behind Caddy, which handles HTTPS with a certificate from LNU's CA.

```bash
npm run docker:prod   # build and start server + caddy
npm run docker:down   # stop
```

The LNU root certificate must be placed in `certs/` on the server. It is not part of the
repository.

## Development

```bash
npm run dev           # run with automatic restart
npm run build         # compile src/ to dist/
npm start             # run the compiled version
npm run typecheck     # check types
npm run lint          # ESLint with @lnu/eslint-config
npm run format        # Prettier with @lnu/prettier-config
```

## Project structure

The application follows MVC. `App` creates every object and hands each class what it needs
through its constructor.

```text
src/
├── server.ts                        # starts the application
├── App.ts                           # sets up Express and wires the parts together
├── routes/router.ts                 # maps URLs to controller methods
├── controller/DashBoardController.ts
├── model/
│   ├── VisitorRegistry.ts           # wraps visitor-module
│   ├── VisitorHive.ts               # wraps midgard-hex-grid
│   └── LocationService.ts           # planned: IP address → place
└── view/Dashboard.ts                # renders the page and the hexagons as SVG
public/css/styles.css                # colours and themes
```

## Known limitations

- Visitors are kept in memory and are lost when the server restarts.
- The location is always `Unknown`, since address lookup is not implemented yet.
- The dashboard is public, so anyone with the link can see it. It does not show IP addresses.
- A visitor is identified by address and browser, so one person in two browsers counts as two
  visitors.
- The site is only reachable from the LNU network or VPN.

## Planned

- Look up the city from the visitor's IP address (`LocationService`).
- A map with a pin for every visitor.
- Place the dashboard in front of the portfolio as a reverse proxy, so that visits to the
  portfolio are tracked without changing the portfolio, and move the dashboard to a
  password-protected `/dashboard`.
- Store visits in a database so they survive restarts, and show visits from the last few days.
- A table of all stored visitors.
- Notify me when a new visitor arrives, and make the dashboard an installable PWA.

## License

MIT

Built as part of the course 1DV610 at Linnaeus University.
