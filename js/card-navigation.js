/**
 * Card Navigation - Cross-page card navigation and highlighting
 * This script handles hash-based navigation to highlight and scroll to specific cards
 */
document.addEventListener('DOMContentLoaded', function() {
    // Process hash navigation after the page is fully loaded
    handleHashNavigation();
});

/**
 * Handles navigation based on URL hash
 */
function handleHashNavigation() {
    // Check if there's a hash in the URL (e.g., #card-id)
    if (window.location.hash) {
        const targetId = window.location.hash.substring(1); // Remove the # symbol
        
        // Wait a short time for the page to fully render
        setTimeout(() => {
            const targetCard = document.getElementById(targetId);
            
            if (targetCard) {
                // Highlight and scroll to the card
                highlightAndScrollToCard(targetCard);
            } else {
                // If target card doesn't exist yet (dynamic content), 
                // add IDs to cards and try again
                addIdsToCards();
                
                // Try again after adding IDs
                setTimeout(() => {
                    const newTargetCard = document.getElementById(targetId);
                    if (newTargetCard) {
                        highlightAndScrollToCard(newTargetCard);
                    }
                }, 200);
            }
        }, 300);
    }
}

/**
 * Add IDs to all cards that don't have them
 */
function addIdsToCards() {
    const pageName = getCurrentPageName();
    const cards = document.querySelectorAll('.dashboard-card, .page-card, .card');
    
    cards.forEach((card, index) => {
        if (!card.id) {
            let id = '';
            
            // Try to generate ID based on page name
            if (pageName === 'pricing' || window.location.pathname.includes('dynamic-pricing')) {
                id = `pricing-${index + 1}`;
            } else if (pageName === 'insights' || window.location.pathname.includes('guest-insights')) {
                id = `insights-${index + 1}`;
            } else if (pageName === 'operations' || window.location.pathname.includes('operations')) {
                id = `operations-${index + 1}`;
            } else if (pageName === 'sustainability' || window.location.pathname.includes('sustainability')) {
                id = `sustainability-${index + 1}`;
            } else {
                id = `card-${index}`;
            }
            
            card.id = id;
        }
    });
}

/**
 * Get the current page name based on URL
 */
function getCurrentPageName() {
    const path = window.location.pathname;
    const pageName = path.split('/').pop().split('.')[0];
    
    if (pageName === 'dynamic-pricing') return 'pricing';
    if (pageName === 'guest-insights') return 'insights';
    if (pageName === 'hotel-dashboard') return 'dashboard';
    
    return pageName;
}

/**
 * Highlights a card and scrolls to it
 */
function highlightAndScrollToCard(card) {
    // First, set up the highlight-card class if it doesn't exist
    if (!document.querySelector('style#highlight-style')) {
        const style = document.createElement('style');
        style.id = 'highlight-style';
        style.textContent = `
            .highlight-card {
                animation: highlight-pulse 2s ease-in-out;
                box-shadow: 0 0 15px rgba(58, 143, 133, 0.5) !important;
            }
            @keyframes highlight-pulse {
                0% { box-shadow: 0 0 5px rgba(58, 143, 133, 0.3); }
                50% { box-shadow: 0 0 20px rgba(58, 143, 133, 0.7); }
                100% { box-shadow: 0 0 15px rgba(58, 143, 133, 0.5); }
            }
        `;
        document.head.appendChild(style);
    }

    // Remove existing highlights
    document.querySelectorAll('.highlight-card').forEach(el => {
        el.classList.remove('highlight-card');
    });
    
    // Add highlight to the target card
    card.classList.add('highlight-card');
    
    // Scroll to the card with smooth animation
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Remove highlight after animation completes
    setTimeout(() => {
        card.classList.remove('highlight-card');
    }, 3000);
} 