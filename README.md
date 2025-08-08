
# Swipe Stack (Expo + WebView + Canvas)

This is a minimal, high-performance scaffold for **Swipe Stack: Perfect-Streak Tower** with addictive-friendly loops.

## Run
```bash
pnpm i
pnpm start
```
Open in iOS via Expo.

## Notes
- The game runs inside a WebView using Canvas (no external engine). This keeps the binary small and fast.
- RN handles paywall, analytics, ads, and haptics.
- Tuning values live in `/config/tuning.json` and are injected on load.
- Replace stubs in `/app/services` with your actual SDK integrations when ready.
