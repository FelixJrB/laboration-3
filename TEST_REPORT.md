# Test Report

## Summary

The application was tested manually through its interface, in the browser, against the deployed
version at <https://cu2023.camp.lnu.se>. Every requirement in [README.md](README.md) (R1–R7) has at
least one test case below.

To repeat the tests:

1. Open <https://cu2023.camp.lnu.se> from the LNU network or VPN.
2. Note the numbers under **Visitor Statistics** and the hexagons under **Visitors**.
3. Reload the page in the same browser and check that nothing changes.
4. Open the page in a second browser on the same computer, on another computer, and in Chrome's device emulation (DevTools → Toggle device toolbar → iPhone), and reload the first browser after each visit.

The server log can be used to confirm which requests actually reached the server:

```bash
docker logs laboration-3-caddy-1 2>&1 | grep -o '"remote_ip":"[^"]*"\|"User-Agent":\["[^"]*' | sort | uniq -c
```

The hardest part to test was telling visitors apart. Locally every request comes from the same
machine (`::1`), so a real second visitor needs another computer on the network. The deployed app
also sits behind a reverse proxy (Caddy), and without `trust proxy` in Express every visitor would
have had the proxy's address and been counted as one. Testing with a classmate on a Windows
computer confirmed that different visitors get different ids. During testing I also mixed up the
local version and the deployed one: the local dashboard only shows local visits, so the
classmate's visit only appeared on the deployed page.

## Test Results

| Test case | Requirement | Input | Expected outcome | Actual outcome |
| --------- | ----------- | ----- | ---------------- | -------------- |
| First visit is registered | R1 | Opened <https://cu2023.camp.lnu.se> in Firefox on a Mac. | A new visitor appears as hexagon #1 and the visitor count is 1. | ✅ As expected. |
| Visit from another computer is registered | R1 | A classmate opened the page in Opera on a Windows computer. | A new visitor appears with operating system `Windows`. | ✅ The classmate appeared as #2, `Desktop` / `Windows`. The server log showed a different IP address for the classmate. |
| Same person in a second browser | R1, R2 | Opened the page in Chrome on the same Mac. | A new visitor, since visitors are identified by address and browser. | ✅ Appeared as #3, `Desktop` / `MacOs`. This is the documented trade-off: one person in two browsers counts as two visitors. |
| Returning visitor is not counted again | R2 | Reloaded the page several times in the same browser. | The visitor count and the hexagons do not change. | ✅ As expected. |
| Number of unique visitors is shown | R3 | Looked at **Total visitors** after the three visits above. | 3 | ✅ 3. |
| Visitors per device type | R4 | Looked at **Desktop**, **Mobile** and **Tablet** after the three visits above. | Desktop 3, Mobile 0, Tablet 0. | ✅ As expected. |
| Mobile visit is counted as mobile | R4 | Opened the page in Chrome with DevTools device emulation set to iPhone, then reloaded. | **Mobile** goes up by one and a new hexagon shows `Mobile`. | ✅ As expected. A real phone could not be used, since it cannot reach the LNU network. |
| Visitor hexagon shows id, device, OS and location | R5 | Looked at the hexagons under **Visitors**. | Each hexagon shows `#id`, device type, operating system and location. | ✅ All four are shown. The location is `Unknown`, since address lookup is not implemented (see Known limitations in the README). |
| Desktop hexagon is green | R6 | Looked at the hexagons for the three desktop visitors. | Green border. | ✅ As expected. |
| Mobile hexagon is blue | R6 | Looked at the new hexagon from the iPhone emulation. | Blue border. | ✅ As expected. |
| Application is reachable | R7 | Opened <https://cu2023.camp.lnu.se> from the LNU network. | The dashboard loads over HTTPS. | ✅ As expected. |
| Application is reachable from a phone | R7 | Opened <https://cu2023.camp.lnu.se> on a phone. | The dashboard loads. | ❌ The site can't be opened on mobile during testing, Says "Webbplatsen kan inte nås" , "Det gick inte att hitta IP-adressen till servern på cu2023.camp.lnu.se" with the following Error "ERR_NAME_NOT_RESOLVED" Reason unknown [2026-10-21]|

## Known Issues in Third-Party Modules

**midgard-hex-grid 1.0.0**

- **Installation is not documented.** The README says to clone the repository and import from
  `./dist/index.js`, but the package is published on npm. It works with `npm install
  midgard-hex-grid` and `import { HexGrid } from 'midgard-hex-grid'`. Installing it from GitHub
  does not work, since `dist/` is git-ignored and there is no `prepare` script.
- **A grid of a given number of hexagons cannot be requested directly.** `createGrid()` builds a
  grid around a rectangular skeleton and always fills the surrounding coordinates, so the number of
  hexagons does not match the skeleton size. Workaround: `VisitorHive` asks for a grid that is
  large enough and keeps the first `count` hexagons with `slice(0, count)`.


Neither issue affected the result.
