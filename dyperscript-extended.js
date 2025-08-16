/**
 * Dyperscript Extended - Advanced toddler-friendly hyperscript
 * A more comprehensive implementation with phrase parsing and context awareness
 */

class DyperscriptParser {
    constructor() {
        // Basic keyword mappings
        this.keywords = {
            // Events
            'when': 'on',
            'someone': 'on', 
            'somebody': 'on',
            'if': 'on',
            'ouchie': 'click',
            'touchy': 'click',
            'poke': 'click', 
            'boop': 'click',
            'tap-tap': 'click',
            'press': 'click',
            'squish': 'click',
            'bonk': 'click',
            'mousie-over': 'mouseover',
            'mousie-out': 'mouseout',
            'mousie-move': 'mousemove',
            'key-press': 'keydown',
            'type-type': 'keydown',
            'focus-focus': 'focus',
            'blur-blur': 'blur',
            'load-load': 'load',
            'scroll-scroll': 'scroll',
            
            // Actions  
            'make': 'toggle',
            'change': 'toggle',
            'flip': 'toggle', 
            'switchie': 'toggle',
            'switch': 'toggle',
            'peekaboo': 'show',
            'appear': 'show',
            'hello': 'show',
            'come-out': 'show',
            'pop-up': 'show',
            'hidey': 'hide',
            'bye-bye': 'hide',
            'no-see': 'hide',
            'disappear': 'hide',
            'go-away': 'hide',
            'yeet': 'remove',
            'throw-away': 'remove',
            'delete': 'remove',
            'gone': 'remove',
            'poof': 'remove',
            'gimme': 'get',
            'take': 'get',
            'grab': 'get',
            'fetch': 'get',
            'bring': 'get',
            'put': 'set',
            'give': 'set',
            'make-it': 'set',
            'change-to': 'set',
            'become': 'set',
            'go': 'transition',
            'move': 'transition',
            'whoosh': 'transition',
            'slide': 'transition',
            'glide': 'transition',
            'wait-wait': 'wait',
            'hold-on': 'wait',
            'pause': 'wait',
            'sleepy': 'wait',
            'count-to': 'wait',
            'nap': 'wait',
            'tell': 'tell',
            'say-to': 'tell',
            'talk-to': 'tell',
            'whisper': 'tell',
            'shout': 'tell',
            'add-class': 'add',
            'stick-on': 'add',
            'put-on': 'add',
            'take-off': 'remove',
            'pull-off': 'remove',
            
            // Targets
            'me': 'me',
            'myself': 'me',
            'i': 'me', 
            'self': 'me',
            'you': 'you',
            'that': 'it',
            'this': 'it',
            'thingy': 'it',
            'stuff': 'it',
            'thing': 'it',
            'element': 'it',
            'parent': 'parent',
            'mommy': 'parent',
            'daddy': 'parent',
            'child': 'children',
            'baby': 'children',
            'kids': 'children',
            'next-one': 'next',
            'previous-one': 'previous',
            'before': 'previous',
            'after': 'next',
            'first-one': 'first',
            'last-one': 'last',
            'random-one': 'random',
            
            // Modifiers
            'pretty': 'with',
            'using': 'with',
            'and': 'then',
            'next': 'then', 
            'after-that': 'then',
            'also': 'then',
            'plus': 'then',
            'maybe': 'when',
            'sometimes': 'when',
            'only-if': 'when',
            'unless': 'unless',
            'except': 'unless',
            'not-when': 'unless',
            'from': 'from',
            'coming-from': 'from',
            'sent-by': 'from',
            'to': 'to',
            'going-to': 'to',
            'into': 'into',
            'inside': 'into',
            'on': 'on',
            'onto': 'on',
            'at': 'at',
            'near': 'at',
            'by': 'at',
            
            // Time expressions
            'quick': '100ms',
            'super-quick': '50ms',
            'fast': '200ms',
            'normal': '500ms',
            'slow': '1s',
            'super-slow': '2s',
            'really-slow': '3s',
            'forever': '10s',
            'tiny-bit': '10ms',
            'little-bit': '100ms',
            'medium-bit': '500ms',
            'long-bit': '1s',
            'really-long': '2s',
            
            // Boolean/Logic
            'yes': 'true',
            'no': 'false',
            'yep': 'true',
            'nope': 'false',
            'maybe': 'null',
            'dunno': 'undefined',
            
            // Comparison
            'same-as': '==',
            'different-from': '!=',
            'bigger-than': '>',
            'smaller-than': '<',
            'has': 'contains',
            'includes': 'contains',
            'matches': 'matches',
            'looks-like': 'matches',
            'is-empty': 'is empty',
            'has-stuff': 'is not empty',
            'exists': 'exists',
            'is-there': 'exists',
            'is-gone': 'does not exist'
        };
        
        // Phrase patterns for more natural language
        this.phrases = [
            // "when I get ouchie" -> "on click"
            { pattern: /when\s+(?:i|me|myself)\s+get\s+(\w+)/gi, replacement: 'on $1' },
            
            // "make the thingy red" -> "toggle .red on it"  
            { pattern: /make\s+(?:the\s+)?(\w+)\s+(\w+)/gi, replacement: 'toggle .$2 on $1' },
            
            // "show me the thing" -> "show it"
            { pattern: /show\s+me\s+(?:the\s+)?(\w+)/gi, replacement: 'show $1' },
            
            // "hide the scary thing" -> "hide it"
            { pattern: /hide\s+(?:the\s+)?(\w+)\s+(\w+)/gi, replacement: 'hide $1' },
            
            // "wait a little bit" -> "wait 100ms"
            { pattern: /wait\s+a\s+little\s+bit/gi, replacement: 'wait 100ms' },
            
            // "wait a long time" -> "wait 2s"
            { pattern: /wait\s+a\s+long\s+time/gi, replacement: 'wait 2s' },
            
            // "turn red" -> "toggle .red"
            { pattern: /turn\s+(\w+)/gi, replacement: 'toggle .$1' },
            
            // "become big" -> "toggle .big"
            { pattern: /become\s+(\w+)/gi, replacement: 'toggle .$1' },
            
            // "go bye bye" -> "hide"
            { pattern: /go\s+bye\s+bye/gi, replacement: 'hide' },
            
            // "come back" -> "show"
            { pattern: /come\s+back/gi, replacement: 'show' },
            
            // "play with" -> "toggle"
            { pattern: /play\s+with\s+(\w+)/gi, replacement: 'toggle $1' }
        ];
        
        // Class name mappings (things that become CSS classes)
        this.classNames = {
            'red-thingy': '.red',
            'blue-thingy': '.blue', 
            'green-thingy': '.green',
            'yellow-thingy': '.yellow',
            'purple-thingy': '.purple',
            'pink-thingy': '.pink',
            'orange-thingy': '.orange',
            'big-thingy': '.big',
            'small-thingy': '.small',
            'tiny-thingy': '.tiny',
            'huge-thingy': '.huge',
            'happy': '.happy',
            'sad': '.sad',
            'angry': '.angry',
            'excited': '.excited',
            'sleepy': '.sleepy',
            'bouncy': '.bounce',
            'spinny': '.spin',
            'wiggly': '.wiggle',
            'shaky': '.shake',
            'glowy': '.glow',
            'flashy': '.flash',
            'invisible': '.invisible',
            'visible': '.visible',
            'pretty': '.pretty',
            'ugly': '.ugly',
            'scary': '.scary',
            'cute': '.cute',
            'funny': '.funny',
            'serious': '.serious',
            'round': '.round',
            'square': '.square',
            'pointy': '.pointy',
            'smooth': '.smooth',
            'rough': '.rough',
            'soft': '.soft',
            'hard': '.hard',
            'hot': '.hot',
            'cold': '.cold',
            'warm': '.warm',
            'cool': '.cool'
        };
    }
    
    /**
     * Convert dyperscript to hyperscript
     */
    convert(dyperscriptCode) {
        let converted = dyperscriptCode.toLowerCase().trim();
        
        // First, apply phrase patterns for more natural language
        for (const phrase of this.phrases) {
            converted = converted.replace(phrase.pattern, phrase.replacement);
        }
        
        // Then apply class name mappings
        for (const [baby, cssClass] of Object.entries(this.classNames)) {
            const regex = new RegExp(`\\b${baby}\\b`, 'gi');
            converted = converted.replace(regex, cssClass);
        }
        
        // Finally, apply keyword mappings
        for (const [baby, hyperscript] of Object.entries(this.keywords)) {
            const regex = new RegExp(`\\b${baby}\\b`, 'gi');
            converted = converted.replace(regex, hyperscript);
        }
        
        // Clean up extra spaces
        converted = converted.replace(/\s+/g, ' ').trim();
        
        return converted;
    }
    
    /**
     * Add a new keyword mapping
     */
    addKeyword(baby, hyperscript) {
        this.keywords[baby] = hyperscript;
    }
    
    /**
     * Add a new class mapping
     */
    addClass(baby, cssClass) {
        this.classNames[baby] = cssClass;
    }
    
    /**
     * Add a new phrase pattern
     */
    addPhrase(pattern, replacement) {
        this.phrases.push({ pattern, replacement });
    }
    
    /**
     * Get all available baby words
     */
    getBabyWords() {
        return {
            keywords: Object.keys(this.keywords),
            classes: Object.keys(this.classNames),
            phrases: this.phrases.map(p => p.pattern.source)
        };
    }
}

// Create global instance
const dyperscriptParser = new DyperscriptParser();

/**
 * Process all dyperscript elements on the page
 */
function processDyperscriptElements() {
    const attributes = ['dy', 'data-dy', 'dyperscript', 'data-dyperscript'];
    
    attributes.forEach(attr => {
        const elements = document.querySelectorAll(`[${attr}]`);
        
        elements.forEach(element => {
            const dyperscriptCode = element.getAttribute(attr);
            
            if (dyperscriptCode) {
                const hyperscriptCode = dyperscriptParser.convert(dyperscriptCode);
                
                // Set the hyperscript attribute
                element.setAttribute('_', hyperscriptCode);
                
                // Remove the dyperscript attribute
                element.removeAttribute(attr);
                
                console.log(`🍼 Dyperscript: "${dyperscriptCode}" → "${hyperscriptCode}"`);
            }
        });
    });
    
    // Re-process with hyperscript if available
    if (window._hyperscript) {
        window._hyperscript.processNode(document.body);
    }
}

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', processDyperscriptElements);
} else {
    processDyperscriptElements();
}

// Export enhanced API
window.dyperscript = {
    convert: (code) => dyperscriptParser.convert(code),
    process: processDyperscriptElements,
    addKeyword: (baby, hyperscript) => dyperscriptParser.addKeyword(baby, hyperscript),
    addClass: (baby, cssClass) => dyperscriptParser.addClass(baby, cssClass),
    addPhrase: (pattern, replacement) => dyperscriptParser.addPhrase(pattern, replacement),
    getBabyWords: () => dyperscriptParser.getBabyWords(),
    parser: dyperscriptParser
};

console.log('🍼 Dyperscript Extended loaded! Try: dyperscript.getBabyWords()');