// Hypernonce Extension for _hyperscript
// Usage: <script src="hypernonce.js"></script>
//        <script src="_hyperscript.js"></script>
// 
// Security Model: Only trust the initial page load nonce.
// Any content with different nonces will be blocked.

(function() {
    'use strict';

    // Global validator instance
    let validator = null;
    let nonceValidationHook = null;

    // Nonce validation logic
    class NonceValidator {
        #pageNonce = null;

        constructor() {
            this.#initPageNonce();
        }

        #initPageNonce() {
            if (typeof document === 'undefined') return;
            
            // Find first script tag with nonce - this is the ONLY trusted nonce
            // Must be from initial page load, not from any dynamic content
            const scriptWithNonce = document.querySelector('script[nonce]');
            if (scriptWithNonce) {
                this.#pageNonce = scriptWithNonce.nonce || scriptWithNonce.getAttribute('nonce');
            }
        }

        getPageNonce() {
            // Re-initialize if we don't have a nonce yet
            if (!this.#pageNonce) {
                this.#initPageNonce();
            }
            return this.#pageNonce;
        }

        extractNonceFromScript(scriptContent) {
            // Match /**nonce-value*/ comment
            const nonceMatch = scriptContent.match(/\/\*\*nonce-([^*]+)\*\//i);
            return nonceMatch ? nonceMatch[1] : null;
        }

        validateNonce(scriptNonce) {
            // SECURITY: If no page nonce, block everything
            const pageNonce = this.getPageNonce();
            if (!pageNonce) return false;
            return scriptNonce === pageNonce;
        }

        validateScript(scriptContent) {
            const scriptNonce = this.extractNonceFromScript(scriptContent);
            return this.validateNonce(scriptNonce);
        }
    }

    // Initialize validator immediately
    validator = new NonceValidator();

    // Hook function
    nonceValidationHook = function(element) {
        // SECURITY: Always validate - if extension is loaded, security is enforced
        // If no page nonce is set, block all scripts for safety

        // Check the element itself and all descendants for hyperscript attributes
        const elementsToCheck = [element];
        if (element.querySelectorAll) {
            // Add all descendants with hyperscript attributes
            const scriptAttrs = ['_', 'script', 'data-script'];
            for (const attr of scriptAttrs) {
                const descendants = element.querySelectorAll(`[${attr}]`);
                elementsToCheck.push(...descendants);
            }
            // Add all hyperscript script tags
            const scriptTags = element.querySelectorAll('script[type="text/hyperscript"]');
            elementsToCheck.push(...scriptTags);
        }

        // Remove duplicates
        const uniqueElements = [...new Set(elementsToCheck)];

        for (const el of uniqueElements) {
            // Check for hyperscript attributes
            const scriptAttrs = ['_', 'script', 'data-script'];
            for (const attr of scriptAttrs) {
                if (el.hasAttribute && el.hasAttribute(attr)) {
                    const scriptContent = el.getAttribute(attr);
                    if (scriptContent && !validator.validateScript(scriptContent)) {
                        console.warn('hypernonce: Script blocked due to nonce mismatch', el);
                        document.dispatchEvent(new CustomEvent('hyperscript:nonceBlocked', { 
                            detail: { element: el, reason: 'attribute-nonce-mismatch' }
                        }));
                        // Remove the attribute to prevent execution
                        el.removeAttribute(attr);
                        continue;
                    }
                }
            }

            // Check for script tags
            if (el instanceof HTMLScriptElement && el.type === 'text/hyperscript') {
                const scriptNonce = el.nonce || el.getAttribute('nonce');
                if (!validator.validateNonce(scriptNonce)) {
                    console.warn('hypernonce: Script tag blocked due to nonce mismatch or missing nonce', el);
                    document.dispatchEvent(new CustomEvent('hyperscript:nonceBlocked', { 
                        detail: { element: el, reason: scriptNonce ? 'script-tag-nonce-mismatch' : 'missing-nonce' }
                    }));
                    // Remove the script tag entirely to prevent execution
                    el.remove();
                }
            }
        }
    };

    // Extension initialization - wait for hyperscript to be ready for hooks
    function initHypernonce() {
        if (typeof _hyperscript === 'undefined') {
            return;
        }
        _hyperscript.addBeforeProcessHook(nonceValidationHook);
    }

    // Check if hyperscript is already loaded and initialized
    if (typeof _hyperscript !== 'undefined') {
        // Hyperscript already loaded - register hook immediately and process existing content
        initHypernonce();
        
        // Run validation on any existing hyperscript content that may have already been processed
        if (typeof document !== 'undefined' && document.documentElement) {
            nonceValidationHook(document.documentElement);
        }
    } else {
        // Hyperscript not loaded yet - wait for the before-init event
        if (typeof document !== 'undefined') {
            document.addEventListener('hyperscript:beforeInit', initHypernonce);
        } else {
            // Non-browser environment - initialize immediately when hyperscript loads
            initHypernonce();
        }
    }

})();