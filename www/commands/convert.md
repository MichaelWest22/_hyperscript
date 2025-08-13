---
title: convert - ///_hyperscript
---

## The `convert` Command

### Syntax

```ebnf
convert <expression> [from <format>] [to <format>] [timezone <timezone>]
```

### Description

The `convert` command allows you to convert date strings between different formats and timezones. It supports conversion between UTC and local time, as well as various date format strings.

The `from` parameter is optional and defaults to `iso` format if not specified. The `to` parameter is optional and defaults to `local` format if not specified.

The converted date will be put into the `it` variable.

### Supported Formats

#### Input/Output Formats
- `iso` - ISO 8601 format (e.g., "2024-01-15T10:30:00.000Z")
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

The optional `timezone` parameter specifies the **output** timezone (not the input timezone). Input dates are parsed as-is, then the output is displayed in the specified timezone.

Supported timezone values:
- `UTC` - Coordinated Universal Time
- IANA timezone names (e.g., "America/New_York", "Europe/London", "Asia/Tokyo")

#### Timezone Behavior
- **Input parsing**: Input dates are parsed according to their format (ISO dates include timezone info, others are assumed local)
- **Output timezone**: The `timezone` parameter controls what timezone the output is displayed in
- **Default behavior**: When no timezone specified, datetime outputs use your browser's local timezone
- **Date-only formats**: Timezone parameter is ignored and dates are extracted from UTC to prevent day shifting across timezone boundaries
- **Special formats** (`iso`, `local`): Timezone parameter is ignored

**Note**: Date-only formats (`us-date`, `eu-date`, `local-date`, `iso-date`) are designed to be timezone-safe and will never shift by ±1 day regardless of timezone boundaries.

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

<!-- Input: Local date, Output: ISO format -->
<input type="text" id="dateInput" placeholder="01/15/2024">
<button _="on click convert #dateInput.value from 'us-date' to 'iso' put it into #output">
  Convert to ISO
</button>
<!-- Result: "2024-01-15T00:00:00.000Z" -->

<!-- Show same UTC time in different output timezones -->
<div _="on load convert '2024-01-15T10:30:00Z' to 'display-datetime' timezone 'Europe/London' put it into me"></div>
<!-- Result: "2024-01-15 10:30:00 (UTC+00:00)" -->

<div _="on load convert '2024-01-15T10:30:00Z' to 'display-datetime' timezone 'Asia/Tokyo' put it into me"></div>
<!-- Result: "2024-01-15 19:30:00 (UTC+09:00)" -->

<!-- Date-only (timezone parameter ignored) -->
<div _="on load convert my innerHTML to 'eu-date' timezone 'Asia/Tokyo' put it into me">
  2024-01-15T10:30:00Z
</div>
<!-- Result: "15/01/2024" (same regardless of timezone parameter) -->
```