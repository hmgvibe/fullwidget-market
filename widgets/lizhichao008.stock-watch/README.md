# Stock Watchlist / 自選股 / 自选股

A FullWidget desktop widget for China A-share quotes and intraday charts.
Interface and settings are available in 繁體中文, 简体中文 and English.

## What it does

- Shows a watchlist of up to 12 A-shares: Chinese short name, exchange badge,
  6-digit code, intraday sparkline, last price and change / change %.
- Follows A-share convention: **red = up, green = down**.
- Refreshes at the chosen interval during trading hours and slows to 5 minutes
  outside trading hours.
- Search by code, Chinese name or pinyin initials (`600519`, `茅台`, `GZMT`)
  from the widget or from Control Center. Click a result to add / remove it.
- Hover the card to reveal `Edit`; remove rows with the outlined minus button,
  drag rows to reorder, or use `+ Add stock` to open the search panel.
- Clicking a row opens the Eastmoney quote page in the default browser
  (can be disabled in settings).

## Themes

All colours come from FullWidget's `--w-*` variables; the card never paints its
own background, so it follows the global theme, accent colour, opacity, radius
and font. Verified in `instrument`, `type` and `paper`, and at the minimum card
size. Nine preview images under `preview/` cover three themes × three languages.

## Data source and privacy

Quotes, intraday series and symbol search come from Eastmoney's public JSON
endpoints through `widget.fetch`:

| Endpoint | Used for |
|---|---|
| `push2his.eastmoney.com/api/qt/stock/get` | last price, change, prev close |
| `push2his.eastmoney.com/api/qt/stock/trends2/get` | intraday series |
| `searchapi.eastmoney.com/api/suggest/get` | code / name / pinyin search |

Only the ticker codes in your watchlist and the keyword you type are sent to
those hosts. There is no account, no telemetry and no analytics. Search results
are cached locally through `widget.storage` (max 800 entries) so they still work
offline. All settings stay in FullWidget.

## Permissions

| Permission | Why |
|---|---|
| `network:push2his.eastmoney.com` | quotes and intraday charts |
| `network:searchapi.eastmoney.com` | symbol lookup while adding stocks |
| `shell.open` | open a stock's quote page in the browser on click (optional setting) |

## Disclaimer

Market data is provided by a third party, may be delayed or inaccurate, and is
for reference only — not investment advice. This widget is not affiliated with
or endorsed by Eastmoney.

## Development

No build step, no dependencies, no remote code. Files are plain HTML/CSS/JS and
can be edited directly; developer mode hot-reloads on save.
