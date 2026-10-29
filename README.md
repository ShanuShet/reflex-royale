# REFLEX ROYALE

A responsive neon multiplayer reaction battle built with Node.js, Express and Socket.IO.

## Features
- Four-letter rooms, no account, 2–8 players.
- Five rounds with randomized delay before green signal.
- Server-authoritative timing and reaction scoring.
- False starts cost 15 points; leaderboard, personal best, round results.
- Session-token reconnection and host-only start/rematch.
- Responsive desktop/mobile UI and `/health` endpoint.
- Automated unit tests with Node's built-in test runner.

## Requirements
Node.js 20+ and npm.

## Run locally
```bash
npm install
npm test
npm start
```
Open http://localhost:3000. For development use `npm run dev`.

## Play
Create a room, share its four-letter code, have friends join, then start the match. Wait through the amber phase; tap only when the screen turns green. The selected mode decides the round count: Classic (5), Sudden Death (1), or Marathon (10).

## Scoring
| Reaction | Points |
|---|---:|
| Under 180 ms | 100 |
| 180–249 ms | 90 |
| 250–349 ms | 80 |
| 350–499 ms | 65 |
| 500–749 ms | 50 |
| 750–999 ms | 35 |
| 1000–1499 ms | 20 |
| 1500 ms or slower | 10 |
| False start | −15 |

The server measures from signal emission to receipt of the tap event, so network latency affects results. This is for fun, not a scientific reaction-time test.

## Free deployment (Render)
1. Push the project files to a GitHub repository; keep `package.json` at repository root.
2. In Render, choose **New → Blueprint** and connect the repository.
3. Accept `render.yaml` and deploy.
4. Open the generated URL and test using two browsers/devices.
5. Check current Render free-tier policies; availability, sleeping and usage limits can change.

Rooms are stored in memory. Use one server instance for the demo; rooms reset if the server restarts. Multi-instance deployment requires shared room storage and a Socket.IO adapter.

## Project structure
`server.js`, `game.js`, `package.json`, `public/index.html`, `public/client.js`, `public/styles.css`, `test/game.test.js`, `render.yaml`.

## Health check
`GET /health` returns `ok`, service name and active room count.


## Enhanced features

- Three modes: Classic (5 rounds), Sudden Death (1 round), and Marathon (10 rounds).
- Optional synthesized sound cues for the signal and tap results.
- Keyboard play: Space or Enter to strike when the signal is green.
- Copyable room invite link (`?room=CODE`) that pre-fills the room code for friends.
- Match analytics: average/best reaction, false starts, longest streak, valid hits, and match score.
- Achievements: Champion, Lightning, Ice Cold, On Fire, and Human Hypersonic.
- Local career profile with match count, wins, best reaction, and unlocked achievements stored in the player's browser.
- Final match history is shared only once the match is complete; session tokens and socket IDs remain private.

### Feature notes

Career stats and achievements are stored in each player's browser using local storage. They are not global accounts and will not follow the player to another device/browser. The server remains authoritative for match scores and reaction timing.
