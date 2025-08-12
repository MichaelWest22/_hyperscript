# Convert Command Design - Complete Implementation

## Overview
The `convert` command provides date/time format conversion using JavaScript's built-in date handling and `Intl.DateTimeFormat` for robust, standards-compliant formatting.

## Design Philosophy
- **JavaScript Standards**: Leverages native `Date` constructor and `Intl.DateTimeFormat` 
- **Preset Formats**: Simple string identifiers for common formats
- **Timezone Support**: Full IANA timezone support via JavaScript
- **Natural Language**: Optional filler words for readable syntax
- **Sensible Defaults**: Minimal syntax for common use cases

## Syntax
```ebnf
convert [the] [date] [of] <expression> [from <format>] [to <format>] [timezone <timezone>]
```

## Format System

### Supported Formats
- `iso` - ISO 8601 format (e.g., "2024-01-15T10:30:00Z")
- `local` - Browser's locale format using `toLocaleString()`
- `local-date` - Browser's locale date format (MM/DD/YYYY or DD/MM/YYYY depending on locale)
- `local-time` - Browser's locale time format (e.g., "10:30 AM" or "10:30")
- `local-datetime` - Browser's locale datetime format
- `us-date` - MM/DD/YYYY format
- `eu-date` - DD/MM/YYYY format  
- `iso-date` - YYYY-MM-DD format
- `us-datetime` - MM/DD/YYYY, HH:MM AM/PM format
- `eu-datetime` - DD/MM/YYYY, HH:MM format

### Implementation Strategy
Optimized format options using shared objects:

```javascript
var dateOpts = { year: "numeric", month: "2-digit", day: "2-digit" };
var timeOpts = { hour: "2-digit", minute: "2-digit" };
var formatOptions = {
    "iso": { format: "iso" },
    "local": { format: "locale" },
    "local-date": dateOpts,
    "local-time": timeOpts,
    "local-datetime": Object.assign({}, dateOpts, timeOpts),
    "us-date": dateOpts,
    "eu-date": dateOpts,  // Same options, different locale
    "iso-date": Object.assign({}, dateOpts, { timeZone: "UTC" }),
    "us-datetime": Object.assign({}, dateOpts, timeOpts),
    "eu-datetime": Object.assign({}, dateOpts, timeOpts)
};
```

## Parsing Strategy

### Normalization Approach
Uses a clean parser system that normalizes input to ISO format:

```javascript
var parsers = {
    "us-date": function(str) {
        if (str.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
            var parts = str.split("/");
            return parts[2] + "-" + parts[0] + "-" + parts[1]; // MM/DD/YYYY -> YYYY-MM-DD
        }
        return str;
    },
    "eu-date": function(str) {
        if (str.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
            var parts = str.split("/");
            return parts[2] + "-" + parts[1] + "-" + parts[0]; // DD/MM/YYYY -> YYYY-MM-DD
        }
        return str;
    }
};

var normalizedStr = parsers[fromFmt] ? parsers[fromFmt](dateStr) : dateStr;
var date = new Date(normalizedStr);
```

### Benefits of Normalization
- **Extensible**: Easy to add new input formats
- **Consistent**: All dates go through same `Date()` constructor
- **Maintainable**: Clear separation of parsing and formatting logic

## Locale-Aware Formatting

### Dynamic Locale Selection
```javascript
var locale = 'en-US';
if (toFmt.startsWith('eu-')) {
    locale = 'en-GB'; // British locale for EU formats
}
result = new Intl.DateTimeFormat(locale, options).format(date);
```

This ensures:
- **US formats**: "01/15/2024" (MM/DD/YYYY)
- **EU formats**: "15/01/2024" (DD/MM/YYYY)

## Timezone Support
- **Full IANA support**: "America/New_York", "Europe/London", etc.
- **UTC handling**: Explicit UTC timezone option
- **Local default**: Uses browser's local timezone when not specified
- **Isolation**: Each conversion gets its own options object to prevent interference

```javascript
if (tz) {
    options = Object.assign({}, options, { timeZone: tz });
}
```

## Usage Examples

```html
<!-- Minimal - ISO to local (most common case) -->
<div _="on load convert my innerHTML then put it into me">
  2024-01-15T10:30:00Z
</div>

<!-- Natural language with filler words -->
<div _="on load convert the date of my innerHTML to 'us-date' then put it into me">
  2024-01-15T10:30:00Z
</div>

<!-- EU date parsing and formatting -->
<div _="on load convert '15/01/2024' from 'eu-date' to 'iso' then put it into me">
</div>

<!-- Time-only output -->
<div _="on load convert my innerHTML to 'local-time' then put it into me">
  2024-01-15T10:30:00Z
</div>

<!-- Timezone-specific conversion -->
<div _="on load convert my innerHTML from 'iso' to 'us-datetime' timezone 'UTC' then put it into me">
  2024-01-15T10:30:00Z
</div>
```

## Default Behavior
- **`from` parameter**: Defaults to `"iso"` (common API format)
- **`to` parameter**: Defaults to `"local"` (user-friendly display)
- **`timezone`**: Defaults to browser's local timezone
- **Result**: Stored in both `ctx.result` and `ctx.it`

## Benefits

### 1. Standards Compliance
- Uses JavaScript's native date handling
- Leverages `Intl.DateTimeFormat` for internationalization
- No custom parsing logic to maintain

### 2. Robust Timezone Support
- Full IANA timezone database support
- Automatic DST handling
- Cross-browser compatibility
- Proper isolation prevents timezone interference

### 3. User Experience
- Natural language syntax with filler words
- Sensible defaults for common use cases
- Minimal syntax: `convert my innerHTML`
- Comprehensive format support including time-only

### 4. Maintainability
- DRY format options using shared objects
- Extensible parser system
- Clear separation of concerns
- Locale-aware formatting

## Architecture

### Parser Integration
- Optional filler word matching: `the`, `date`, `of`
- Optional parameter handling with defaults
- Standard expression parsing for date values

### Runtime Execution
- Normalization-based parsing approach
- Shared format option objects for efficiency
- Locale-aware `Intl.DateTimeFormat` usage
- Isolated timezone handling

### Error Handling
- Invalid dates handled by JavaScript `Date` constructor
- Malformed formats fall back to string output
- Timezone errors handled by `Intl.DateTimeFormat`

## Extensibility

### Adding New Formats
1. **Input parsing**: Add to `parsers` object if special handling needed
2. **Output formatting**: Add to `formatOptions` object
3. **Locale handling**: Extend locale selection logic if needed

Example:
```javascript
// New input parser
"custom-input": function(str) {
    // Custom parsing logic
    return normalizedISOString;
}

// New output format
"custom-format": { 
    weekday: "long", 
    year: "numeric", 
    month: "long", 
    day: "numeric" 
}
```

## Recent Improvements

### Code Quality
- **DRY Principle**: Shared `dateOpts` and `timeOpts` objects eliminate duplication
- **Normalization**: Clean parser system replaces inline special cases
- **Isolation**: Timezone handling prevents object mutation issues

### Feature Completeness
- **EU Date Support**: Both parsing ("15/01/2024") and formatting
- **Time-Only Format**: `local-time` for time-only display
- **Locale Awareness**: Proper US vs EU formatting differentiation

### Robustness
- **Parser Coverage**: Both US and EU date formats properly parsed
- **Timezone Safety**: Each conversion gets isolated options object
- **Format Consistency**: All formats use same underlying mechanisms

This design provides a robust, maintainable, and user-friendly date conversion system that leverages web platform standards while supporting natural language syntax and comprehensive format coverage.