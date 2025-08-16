/**
 * Dyperscript - A toddler-friendly variant of hyperscript
 * Converts baby language keywords to hyperscript syntax
 */

// Baby language to hyperscript keyword mapping
const BABY_TO_HYPERSCRIPT = {
    // Events
    'when': 'on',
    'someone': 'on',
    'somebody': 'on',
    'ouchie': 'click',
    'touchy': 'click',
    'poke': 'click',
    'boop': 'click',
    
    // Actions
    'make': 'toggle',
    'change': 'toggle', 
    'flip': 'toggle',
    'switchie': 'toggle',
    'hidey': 'hide',
    'bye-bye': 'hide',
    'no-see': 'hide',
    'peekaboo': 'show',
    'hello': 'show',
    'appear': 'show',
    'yeet': 'remove',
    'throw-away': 'remove',
    'gone': 'remove',
    'gimme': 'get',
    'take': 'get',
    'grab': 'get',
    'put': 'set',
    'give': 'set',
    'make-it': 'set',
    'go': 'transition',
    'move': 'transition',
    'whoosh': 'transition',
    'wait-wait': 'wait',
    'hold-on': 'wait',
    'pause': 'wait',
    'sleepy': 'wait',
    
    // Targets
    'me': 'me',
    'myself': 'me', 
    'i': 'me',
    'you': 'you',
    'that': 'it',
    'this': 'it',
    'thingy': 'it',
    'stuff': 'it',
    
    // Modifiers
    'pretty': 'with',
    'using': 'with',
    'and': 'then',
    'next': 'then',
    'after': 'then',
    'if': 'when',
    'maybe': 'when',
    'sometimes': 'when',
    
    // Time
    'quick': '100ms',
    'fast': '200ms', 
    'slow': '1s',
    'super-slow': '2s',
    'forever': '10s',
    
    // Classes (keep the dot)
    'red-thingy': '.red',
    'blue-thingy': '.blue',
    'big-thingy': '.big',
    'small-thingy': '.small',
    'happy': '.happy',
    'sad': '.sad',
    'bouncy': '.bounce',
    'spinny': '.spin',
    'wiggly': '.wiggle'
};

/**
 * Convert dyperscript (baby language) to hyperscript
 */
function convertDyperscriptToHyperscript(dyperscriptCode) {
    let converted = dyperscriptCode;
    
    // Replace baby language keywords with hyperscript equivalents
    for (const [baby, hyperscript] of Object.entries(BABY_TO_HYPERSCRIPT)) {
        // Use word boundaries to avoid partial matches
        const regex = new RegExp(`\\b${baby}\\b`, 'gi');
        converted = converted.replace(regex, hyperscript);
    }
    
    return converted;
}

/**
 * Process dyperscript attributes and convert them
 */
function processDyperscriptElements() {
    // Find all elements with dyperscript attributes
    const elements = document.querySelectorAll('[dy], [data-dy], [dyperscript]');
    
    elements.forEach(element => {
        let dyperscriptCode = element.getAttribute('dy') || 
                             element.getAttribute('data-dy') || 
                             element.getAttribute('dyperscript');
        
        if (dyperscriptCode) {
            // Convert baby language to hyperscript
            const hyperscriptCode = convertDyperscriptToHyperscript(dyperscriptCode);
            
            // Set the hyperscript attribute
            element.setAttribute('_', hyperscriptCode);
            
            // Remove the dyperscript attribute
            element.removeAttribute('dy');
            element.removeAttribute('data-dy');
            element.removeAttribute('dyperscript');
            
            console.log(`Dyperscript converted: "${dyperscriptCode}" → "${hyperscriptCode}"`);
        }
    });
    
    // Re-process the page with hyperscript if it's available
    if (window._hyperscript) {
        window._hyperscript.processNode(document.body);
    }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', processDyperscriptElements);
} else {
    processDyperscriptElements();
}

// Export for manual use
window.dyperscript = {
    convert: convertDyperscriptToHyperscript,
    process: processDyperscriptElements,
    addMapping: function(baby, hyperscript) {
        BABY_TO_HYPERSCRIPT[baby] = hyperscript;
    }
};