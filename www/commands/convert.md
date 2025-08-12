---
title: convert - ///_hyperscript
---

## The `convert` Command

### Syntax

```ebnf
convert <expression> [from <format>] [to <format>] [timezone <timezone>]
```

### Description

The `convert` command allows you to convert date strings between different formats and timezones. It supports conversion between local time and UTC, as well as various date format strings.

The `from` parameter is optional and defaults to `iso` format if not specified. The `to` parameter is optional and defaults to `local` format if not specified.

The converted date will be put into the `it` variable.

### Supported Formats

- `iso` - ISO 8601 format (e.g., "2024-01-15T10:30:00Z")
- `local` - Browser's locale format
- `local-date` - Browser's locale date format (MM/DD/YYYY or DD/MM/YYYY depending on locale)
- `local-time` - Browser's locale time format (e.g., "10:30 AM" or "10:30")
- `local-datetime` - Browser's locale datetime format
- `us-date` - US date format (e.g., "01/15/2024")
- `eu-date` - European date format (e.g., "15/01/2024")
- `iso-date` - ISO date format (e.g., "2024-01-15")
- `us-datetime` - US datetime format (e.g., "01/15/2024, 10:30 AM")
- `eu-datetime` - European datetime format (e.g., "15/01/2024, 10:30")

### Timezone Support

The optional `timezone` parameter allows you to specify the target timezone:
- `UTC` - Coordinated Universal Time
- `local` - Browser's local timezone
- IANA timezone names (e.g., "America/New_York", "Europe/London")

If no timezone is specified, the conversion defaults to the user's local browser timezone.

### Examples

```html
<!-- Convert server UTC timestamp to local format on page load -->
<div _="on load 
         convert my innerHTML from 'iso' to 'local'
         put it into me">
  2024-01-15T10:30:00Z
</div>

<!-- Convert with all defaults (iso to local) -->
<div _="on load 
         convert my innerHTML
         put it into me">
  2024-01-15T10:30:00Z
</div>

<!-- Convert ISO format (default) to specific format -->
<div _="on load 
         convert my innerHTML to 'us-datetime'
         put it into me">
  2024-01-15T10:30:00Z
</div>

<!-- Convert to specific format with explicit from -->
<div _="on load 
         convert my innerHTML from 'iso' to 'us-datetime'
         put it into me">
  2024-01-15T10:30:00Z
</div>

<!-- Convert user input to UTC -->
<input type="text" id="dateInput" placeholder="us-date">
<button _="on click 
           convert #dateInput.value from 'us-date' to 'iso' timezone 'UTC'
           put it into #output">
  Convert to UTC
</button>

<!-- Convert local browser format to ISO -->
<div _="on load 
         convert my innerHTML from 'local-datetime' to 'iso'
         put it into me">
  1/15/2024, 10:30:00 AM
</div>
```