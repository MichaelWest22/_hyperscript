
## The `convert` Command

Just include the `_hyperscript-convert.js` file in a script tag after hyperscript to extend it with this command. 

### Syntax

```ebnf
convert <expression> [from <format>] [timezone <input-timezone>] [to <format>] [timezone <output-timezone>]
```

### Description

The `convert` command allows you to convert date strings between different formats and timezones. It supports conversion between UTC and local time, as well as various date format strings.

The `from` parameter is optional and defaults to `iso` format if not specified. The `to` parameter is optional and defaults to `local` format if not specified.

The converted date will be put into the `it` variable.

### Supported Formats

#### Input/Output Formats
- `iso` - Smart ISO format that auto-detects timezone:
  - With Z: "2024-01-15T10:30:00Z" (uses UTC)
  - With offset: "2024-01-15T10:30:00-05:00" (uses embedded timezone)
  - Without timezone: "2024-01-15T10:30:00" (uses local/specified timezone)
- `us-date` - US date format (e.g., "01/15/2024")
- `eu-date` - European date format (e.g., "15/01/2024")
- `us-datetime` - US datetime format (e.g., "01/15/2024, 10:30 AM")
- `eu-datetime` - European datetime format (e.g., "15/01/2024, 22:30")

#### Output-Only Formats
- `local` - Browser's default locale format
- `local-date` - Browser's locale date format
- `local-time` - Browser's locale time format
- `local-datetime` - Browser's locale datetime format
- `iso-date` - ISO date only (e.g., "2024-01-15")
- `iso-full` - ISO format with timezone offset (e.g., "2024-01-15T05:30:00.000-05:00")
- `display-datetime` - Human-readable format with timezone (e.g., "2024-01-15 05:30:00 (UTC-05:00)")

### Timezone Support

Timezone parameters can be specified after both `from` and `to` formats to control input interpretation and output display.

Supported timezone values:
- `UTC` - Coordinated Universal Time
- IANA timezone names (e.g., "America/New_York", "Europe/London", "Asia/Tokyo")

#### Timezone Behavior
- **Input timezone**: The `timezone` parameter after `from` specifies what timezone the input should be interpreted as
- **Output timezone**: The `timezone` parameter after `to` specifies what timezone the output should be displayed in
- **Smart ISO parsing**: 
  - With Z or offset: Uses embedded timezone info, input timezone parameter ignored
  - Without timezone: Uses input timezone parameter or defaults to browser local
- **Date-only formats**: Timezone parameters are ignored to prevent day shifting across timezone boundaries
- **Output timezone defaults**: Displayed in browser's local timezone when not specified

**Note**: Date-only formats (`us-date`, `eu-date`, `local-date`, `iso-date`) are designed to be timezone-safe and will never shift by ±1 day regardless of timezone parameters.

### Examples

```html
<!-- Input: UTC time, Output: Your local timezone -->
<div _="on load convert my innerHTML to 'us-datetime' put it into me">
  2024-01-15T10:30:00Z
</div>
<!-- Result: "01/15/2024, 5:30 AM" (if you're in EST) -->

<!-- Input: UTC time, Output: Specific timezone -->
<div _="on load convert my innerHTML to 'us-datetime' timezone 'America/New_York' put it into me">
  2024-01-15T10:30:00Z
</div>
<!-- Result: "01/15/2024, 5:30 AM" (EST time) -->

<!-- HTML datetime-local input - smart ISO auto-detects no timezone -->
<input type="datetime-local" id="dateInput" value="2024-01-15T14:00">
<button _="on click convert #dateInput.value timezone 'America/New_York' to 'iso' put it into #output">
  Convert EST to UTC
</button>
<!-- Result: "2024-01-15T19:00:00.000Z" (2 PM EST = 7 PM UTC) -->

<!-- Same input without timezone specification uses browser local -->
<button _="on click convert #dateInput.value to 'iso' put it into #output">
  Convert local to UTC
</button>
<!-- Result: "2024-01-15T??:00:00.000Z" (depends on browser timezone) -->

<!-- Multi-timezone conversion -->
<div _="on load convert '01/15/2024, 2:00 PM' from 'us-datetime' timezone 'America/Chicago' to 'us-datetime' timezone 'Asia/Tokyo' put it into me"></div>
<!-- Result: "01/16/2024, 5:00 AM" (2 PM CST = 5 AM JST next day) -->

<!-- Show same UTC time in different output timezones -->
<div _="on load convert '2024-01-15T10:30:00Z' to 'display-datetime' timezone 'Europe/London' put it into me"></div>
<!-- Result: "2024-01-15 10:30:00 (UTC+00:00)" -->

<div _="on load convert '2024-01-15T10:30:00Z' to 'display-datetime' timezone 'Asia/Tokyo' put it into me"></div>
<!-- Result: "2024-01-15 19:30:00 (UTC+09:00)" -->

<!-- Date-only (timezone parameters ignored) -->
<div _="on load convert my innerHTML to 'eu-date' timezone 'Asia/Tokyo' put it into me">
  2024-01-15T10:30:00Z
</div>
<!-- Result: "15/01/2024" (same regardless of timezone parameters) -->
```