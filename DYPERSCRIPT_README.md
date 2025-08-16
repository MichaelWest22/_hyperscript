# 🍼 Dyperscript - Hyperscript for Toddlers

*The underscore is still silent, but now it giggles*

## What is Dyperscript?

Dyperscript is a delightfully silly variant of [hyperscript](https://hyperscript.org) that replaces all the boring grown-up keywords with adorable toddler language. Instead of writing `on click toggle .red`, you can write `when ouchie make red-thingy`!

Perfect for:
- Making your code more fun and approachable
- Teaching kids about web development
- Adding some whimsy to your projects
- Confusing your coworkers (in a good way!)

## Quick Start

1. Include hyperscript and dyperscript in your HTML:
```html
<script src="https://unpkg.com/hyperscript.org@0.9.14"></script>
<script src="dyperscript.js"></script>
```

2. Use `dy` attributes instead of `_`:
```html
<button dy="when ouchie make red-thingy">Click me!</button>
```

3. Watch the magic happen! 🎉

## Baby Language Dictionary

### Events (When things happen)
| Baby Talk | Hyperscript | What it means |
|-----------|-------------|---------------|
| `when` / `someone` / `somebody` | `on` | When an event happens |
| `ouchie` / `touchy` / `poke` / `boop` | `click` | Mouse click |
| `mousie-over` | `mouseover` | Mouse enters element |
| `mousie-out` | `mouseout` | Mouse leaves element |
| `key-press` / `type-type` | `keydown` | Key pressed |
| `focus-focus` | `focus` | Element gets focus |
| `blur-blur` | `blur` | Element loses focus |

### Actions (What to do)
| Baby Talk | Hyperscript | What it does |
|-----------|-------------|--------------|
| `make` / `change` / `flip` / `switchie` | `toggle` | Toggle something on/off |
| `peekaboo` / `appear` / `hello` | `show` | Make visible |
| `hidey` / `bye-bye` / `no-see` | `hide` | Make invisible |
| `yeet` / `throw-away` / `gone` | `remove` | Delete element |
| `gimme` / `take` / `grab` | `get` | Get a value |
| `put` / `give` / `make-it` | `set` | Set a value |
| `go` / `move` / `whoosh` | `transition` | Animate transition |
| `wait-wait` / `hold-on` / `sleepy` | `wait` | Pause execution |

### Targets (What to affect)
| Baby Talk | Hyperscript | What it refers to |
|-----------|-------------|-------------------|
| `me` / `myself` / `i` | `me` | Current element |
| `you` | `you` | Target element |
| `that` / `this` / `thingy` | `it` | Referenced element |
| `parent` / `mommy` / `daddy` | `parent` | Parent element |
| `child` / `baby` / `kids` | `children` | Child elements |

### Timing (How long to wait)
| Baby Talk | Hyperscript | Duration |
|-----------|-------------|----------|
| `quick` / `super-quick` | `100ms` / `50ms` | Very fast |
| `fast` | `200ms` | Fast |
| `normal` | `500ms` | Normal speed |
| `slow` / `super-slow` | `1s` / `2s` | Slow |
| `forever` | `10s` | Very long |

### Colors & Styles
| Baby Talk | CSS Class | Visual effect |
|-----------|-----------|---------------|
| `red-thingy` / `blue-thingy` / `green-thingy` | `.red` / `.blue` / `.green` | Color changes |
| `big-thingy` / `small-thingy` / `tiny-thingy` | `.big` / `.small` / `.tiny` | Size changes |
| `happy` / `sad` / `angry` | `.happy` / `.sad` / `.angry` | Emoji faces |
| `bouncy` / `spinny` / `wiggly` | `.bounce` / `.spin` / `.wiggle` | Animations |
| `round` / `square` / `pointy` | `.round` / `.square` / `.pointy` | Shape changes |

### Connectors (Linking actions)
| Baby Talk | Hyperscript | Purpose |
|-----------|-------------|---------|
| `and` / `next` / `after` | `then` | Do this next |
| `pretty` / `using` | `with` | Modify how |
| `maybe` / `sometimes` / `if` | `when` | Conditional |

## Examples

### Basic Click Handler
```html
<!-- Dyperscript -->
<button dy="when ouchie make red-thingy">Turn red!</button>

<!-- Converts to hyperscript -->
<button _="on click toggle .red">Turn red!</button>
```

### Show/Hide with Animation
```html
<!-- Dyperscript -->
<button dy="when poke peekaboo #secret-box pretty whoosh">Show secret!</button>
<div id="secret-box" style="display: none;">🎁 Surprise!</div>

<!-- Converts to hyperscript -->
<button _="on click show #secret-box with transition">Show secret!</button>
```

### Sequential Actions
```html
<!-- Dyperscript -->
<div dy="when boop make blue-thingy wait-wait quick next make bouncy">
  Click for sequence!
</div>

<!-- Converts to hyperscript -->
<div _="on click toggle .blue wait 100ms then toggle .bounce">
  Click for sequence!
</div>
```

### Complex Animation Chain
```html
<!-- Dyperscript -->
<div dy="when ouchie make big-thingy and spinny wait-wait slow next make small-thingy next hidey">
  Magical disappearing act!
</div>

<!-- Converts to hyperscript -->
<div _="on click toggle .big .spin wait 1s then toggle .small then hide">
  Magical disappearing act!
</div>
```

## Files Included

- **`dyperscript.js`** - Basic implementation with core keyword mappings
- **`dyperscript-extended.js`** - Advanced version with phrase parsing and more features
- **`dyperscript-demo.html`** - Simple demo page showing basic features
- **`dyperscript-playground.html`** - Comprehensive interactive playground

## API Reference

### Basic Usage
```javascript
// Convert dyperscript to hyperscript
const hyperscript = dyperscript.convert("when ouchie make red-thingy");
// Returns: "on click toggle .red"

// Process all dyperscript elements on page
dyperscript.process();
```

### Extended API (dyperscript-extended.js)
```javascript
// Add custom keyword mapping
dyperscript.addKeyword('smoosh', 'click');

// Add custom class mapping  
dyperscript.addClass('sparkly', '.sparkle');

// Add custom phrase pattern
dyperscript.addPhrase(/turn (\w+)/gi, 'toggle .$1');

// Get all available baby words
const words = dyperscript.getBabyWords();
```

## Supported Attributes

Dyperscript looks for these attributes:
- `dy="..."`
- `data-dy="..."`
- `dyperscript="..."`
- `data-dyperscript="..."`

All are converted to the standard hyperscript `_` attribute.

## CSS Classes You'll Need

Make sure to define these CSS classes for the visual effects:

```css
.red { background-color: #ff6b6b; }
.blue { background-color: #4dabf7; }
.green { background-color: #51cf66; }
.big { transform: scale(1.5); }
.small { transform: scale(0.7); }
.bounce { animation: bounce 0.6s infinite alternate; }
.spin { animation: spin 2s linear infinite; }
.wiggle { animation: wiggle 0.5s infinite; }
.round { border-radius: 50%; }
.square { border-radius: 0; }

@keyframes bounce {
  from { transform: translateY(0); }
  to { transform: translateY(-15px); }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes wiggle {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-3deg); }
  75% { transform: rotate(3deg); }
}
```

## Browser Support

Dyperscript works anywhere hyperscript works! It's just a preprocessing layer that converts baby language to standard hyperscript syntax.

## Contributing

Want to add more baby words? Fork the repo and add your silly keywords! Some ideas:

- More event types (`whoosh` for scroll, `beep` for input)
- More animations (`jiggle`, `pulse`, `zoom`)
- More descriptive words (`super-duper-big`, `teeny-tiny`)
- Sound effects (`boing`, `pop`, `swoosh`)

## Why?

Because programming should be fun! And sometimes the best way to understand something is to make it completely ridiculous. Plus, imagine the joy of explaining to your boss that the button works "when someone gives it an ouchie to make the thingy bouncy." 

## License

MIT License - Use it, abuse it, make it even sillier!

## Credits

Built on top of the amazing [hyperscript](https://hyperscript.org) by the Big Sky Software team. All the real work is done by hyperscript - dyperscript just makes it talk like a toddler! 👶

---

*Remember: The underscore is silent, but the giggles are loud!* 🍼✨