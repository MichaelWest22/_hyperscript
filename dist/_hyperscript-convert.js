_hyperscript.addCommand("convert", function (parser, runtime, tokens) {
    if (!tokens.matchToken("convert")) return;
    
    // Optional filler words
    tokens.matchToken("the");
    tokens.matchToken("date");
    tokens.matchToken("of");
    
    var expr = parser.requireElement("expression", tokens);
    
    var fromFormat, inputTimezone;
    if (tokens.matchToken("from")) {
        fromFormat = parser.requireElement("stringLike", tokens);
    }
    if (tokens.matchToken("timezone")) {
            inputTimezone = parser.requireElement("stringLike", tokens);
    }
    var toFormat, outputTimezone;
    if (tokens.matchToken("to")) {
        toFormat = parser.requireElement("stringLike", tokens);
    }
    if (tokens.matchToken("timezone")) {
        outputTimezone = parser.requireElement("stringLike", tokens);
    }

    var convertCmd = {
        expr: expr,
        fromFormat: fromFormat,
        toFormat: toFormat,
        inputTimezone: inputTimezone,
        outputTimezone: outputTimezone,
        args: [expr, fromFormat, toFormat, inputTimezone, outputTimezone],
        op: function(ctx, dateStr, fromFmt, toFmt, inputTz, outputTz) {
            fromFmt = fromFmt || "iso";
            toFmt = toFmt || "local";
            
            // Apply input timezone conversion for timezone-agnostic formats
            function applyInputTimezone(dateObj, timeZone) {
                if (!timeZone) return dateObj

                // Your local system's offset at that date/time (in min)
                const localOffset = dateObj.getTimezoneOffset();

                // Target timezone offset for that date/time (DST-aware)
                const tzName = new Intl.DateTimeFormat('en-US', {
                    timeZone,
                    timeZoneName: 'longOffset'
                }).formatToParts(dateObj).find(p => p.type === 'timeZoneName').value;

                let targetOffset = 0;
                if (tzName !== 'GMT') {
                    const sign = tzName[3] === '+' ? -1 : 1; // Invert: JS offset sign is opposite
                    const [hh, mm = '0'] = tzName.slice(4).split(':');
                    targetOffset = sign * ((+hh * 60) + (+mm));
                }

                // Adjust from local to target interpretation
                return new Date(dateObj.getTime() + ((targetOffset - localOffset) * 60000));
            }
            function parseRegionalDate(str, isUS, dateOnly) {
                const m = str.match(/^(\d{2})\/(\d{2})\/(\d{4})(.*)$/);
                if (!m) return str;

                const month = isUS ? m[1] : m[2];
                const day   = isUS ? m[2] : m[1];
                const iso   = `${m[3]}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                
                return iso + (m[4].trim() ? m[4].replace(/^,?\s*/, ' ') : 'T00:00:00');
            }
            
            var parserKey = fromFmt.substring(0, 2);
            var normalizedStr = (parserKey === "us" || parserKey === "eu") ? 
                parseRegionalDate(dateStr, parserKey === "us", fromFmt === "us-date" || fromFmt === "eu-date") : dateStr;
            
            // Fix: For date-only ISO strings, create date in local timezone instead of UTC
            if ((fromFmt === 'iso' || fromFmt === 'iso-date') && /^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
                normalizedStr += 'T00:00:00';
            }
            
            var date = new Date(normalizedStr);

            // Check if we should skip timezone conversion (ISO with timezone info or date-only)
            var hasTimezoneInfo = fromFmt === 'iso' && /Z$|[+-]\d{2}:?\d{2}$/.test(dateStr);
            if (!hasTimezoneInfo && !toFmt.endsWith('-date') && !fromFmt.endsWith('-date')) {
                date = applyInputTimezone(date, inputTz);
            }
            
            var dateOpts = { year: "numeric", month: "2-digit", day: "2-digit" };
            var timeOpts = { hour: "2-digit", minute: "2-digit" };
            var formatOptions = {
                "iso": { format: "iso" },
                "iso-full": Object.assign({}, dateOpts, timeOpts, { second: "2-digit", postfixTz: 'iso' }),
                "local": { format: "locale" },
                "local-date": dateOpts,
                "local-time": timeOpts,
                "local-datetime": Object.assign({}, dateOpts, timeOpts),
                "display-datetime": Object.assign({}, dateOpts, timeOpts, { second: "2-digit", postfixTz: 'display' }),
                "us-date": dateOpts,
                "eu-date": dateOpts,
                "iso-date": Object.assign({}, dateOpts, { timeZone: "UTC" }),
                "us-datetime": Object.assign({}, dateOpts, timeOpts),
                "eu-datetime": Object.assign({}, dateOpts, timeOpts)
            };
            
            var options = formatOptions[toFmt] || { format: "string" };
            // Only apply timezone to datetime formats, not date-only formats
            if (outputTz && !toFmt.endsWith('-date')) {
                options = Object.assign({}, options, { timeZone: outputTz });
            }
            
            var result;
            if (options.format === "iso") {
                result = date.toISOString();
            } else if (options.postfixTz) {
                // Formats that need timezone postfix handling
                var targetTz = outputTz || Intl.DateTimeFormat().resolvedOptions().timeZone;
                var formatter = new Intl.DateTimeFormat('sv-SE', Object.assign({}, options, { timeZone: targetTz }));
                var formattedDate = formatter.format(date);
                // Get timezone offset
                var offsetFormatter = new Intl.DateTimeFormat('en', {
                    timeZone: targetTz,
                    timeZoneName: 'longOffset'
                });
                var offsetStr = offsetFormatter.formatToParts(date).find(p => p.type === 'timeZoneName').value.replace('GMT', '');
                
                // Apply format-specific postfix
                if (options.postfixTz === 'iso') {
                    // Get milliseconds manually
                    var tzDate = new Date(date.toLocaleString('en-US', {timeZone: targetTz}));
                    var ms = tzDate.getMilliseconds().toString().padStart(3, '0');
                    result = formattedDate.replace(' ', 'T') + '.' + ms + offsetStr;
                } else {
                    result = formattedDate + ' (UTC' + offsetStr + ')';
                }
            } else if (options.format === "locale") {
                result = date.toLocaleString();
            } else if (options.format === "string") {
                result = date.toString();
            } else if (toFmt === "iso-date") {
                result = date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, '0') + "-" + String(date.getDate()).padStart(2, '0');
            } else if (toFmt === "us-date") {
                result = String(date.getMonth() + 1).padStart(2, '0') + "/" + String(date.getDate()).padStart(2, '0') + "/" + date.getFullYear();
            } else if (toFmt === "eu-date") {
                result = String(date.getDate()).padStart(2, '0') + "/" + String(date.getMonth() + 1).padStart(2, '0') + "/" + date.getFullYear();
            } else {
                var locale;
                if (toFmt.startsWith('us-')) {
                    locale = 'en-US';
                } else if (toFmt.startsWith('eu-')) {
                    locale = 'en-GB';
                } else {
                    locale = undefined;
                }
                result = new Intl.DateTimeFormat(locale, options).format(date);
            }
            
            ctx.result = result;
            ctx.it = result;
            return runtime.findNext(convertCmd, ctx);
        }
    };
    return convertCmd;
});
