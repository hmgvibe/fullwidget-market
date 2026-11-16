# Cloudbreak / 云霁 / 雲霽

A theme-following weather card for FullWidget — current conditions, four metrics and a 7-day forecast.
一个跟随 FullWidget 全局主题的天气卡片，显示当前天气、四项指标与七天预报。

## What it does

- **Location row**: city name and update time (`济南市 · 10:30 更新`). Click the city to open a fuzzy search panel (375 built-in cities plus online lookup; accepts both `滨州` and `滨州市`).
- **Today**: large temperature + condition + high/low, with an animated weather icon (soft glow tinted by condition) and today's precipitation probability.
- **Metrics**: feels-like, humidity, wind (direction + Beaufort level) and air quality (value + 优/良/中/差 grade).
- **7-day forecast**: daily icon, high/low and a temperature-range bar (blue → red); the bar grows with card height, and weekday labels shrink to one character when space is tight.
- **Follows your theme**: every colour, radius, padding and font comes from FullWidget's `--w-*` variables, using the same conventions as the built-in widgets. Verified in `instrument`, `type` and `paper`, from the 470×300 default down to the 200×115 minimum, where content is progressively simplified.

## Data source and privacy

Weather data comes from public APIs via `widget.fetch`. No account, no telemetry, no analytics.
Search results, geocoding, station codes and the last forecast are cached locally via `widget.storage` so the card still shows something offline. All settings stay in FullWidget. Weather icons are bundled local SVGs — no code or assets are loaded from the network.

| Endpoint | Used for |
|---|---|
| `api.open-meteo.com` | current conditions, hourly and 7-day forecast (temperature, precipitation probability) |
| `geocoding-api.open-meteo.com` | city-name search and coordinates |
| `d1.weather.com.cn` | domestic wind and AQI observations |
| `toy1.weather.com.cn` | city name → China Weather station code (for the endpoint above) |

## Permissions

| Permission | Why |
|---|---|
| `network:api.open-meteo.com` | current weather and forecast data |
| `network:geocoding-api.open-meteo.com` | city lookup |
| `network:d1.weather.com.cn` | wind and air quality |
| `network:toy1.weather.com.cn` | station-code lookup |

## Notes

- Requires an internet connection for live data; cached data is shown when offline.
- The two China Weather endpoints are used for domestic wind/AQI wording. If unavailable, the widget falls back to Open-Meteo values.
- Data is provided by third parties and may be delayed or inaccurate.

## Development

No build step, no dependencies, no remote code. Plain HTML/CSS/JS; developer mode hot-reloads on save.
