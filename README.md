# trading-dashboard

Live monitoring frontend for the trading bot. Powered by Next.js, Tailwind, and Recharts.

## Architecture
This dashboard pulls real-time data from the Go `trading-bot` via:
- **REST API:** Active positions, order history
- **WebSocket:** Live equity curve, current asset price

## Development
```bash
npm ci
npm run dev
```

## Features
- Deep dark premium aesthetic
- Real-time PnL area chart (Recharts)
- Candlestick chart overlaid with strategy entry/exit signals
- "Panic Button" kill switch to flatten all positions
