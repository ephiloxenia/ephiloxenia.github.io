# Search and Navigation Implementation Guide

This document explains how to implement the cross-page search and navigation functionality across all pages of the e-Philoxenia application.

## Overview

The system allows users to search for cards across all pages from a single search bar and navigate directly to them with automatic scrolling and highlighting.

## Files Included

1. `js/card-navigation.js` - Core navigation functionality for all pages
2. Search functionality in `hotel-dashboard.html`
3. Sample integration file `guest-insights-update.js`

## Implementation Steps for Each Page

### 1. Add the Card Navigation Script

Include the navigation script at the bottom of each page before the closing `</body>` tag:

```html
<script src="js/card-navigation.js"></script>
```

### 2. Add Proper IDs to Cards

Make sure each card has an ID that matches the format used in the search:

- Dashboard cards: `card-{index}`
- Pricing cards: `pricing-{index}`
- Guest Insights cards: `insights-{index}`
- Operations cards: `operations-{index}`
- Sustainability cards: `sustainability-{index}`

For example, in each page you can add this script:

```javascript
document.addEventListener('DOMContentLoaded', function() {
    // Get the current page type
    const pageName = window.location.pathname.split('/').pop().split('.')[0];
    let prefix = 'card';
    
    if (pageName === 'dynamic-pricing') prefix = 'pricing';
    else if (pageName === 'guest-insights') prefix = 'insights';
    else if (pageName === 'operations') prefix = 'operations';
    else if (pageName === 'sustainability') prefix = 'sustainability';
    
    // Add IDs to all cards
    const cards = document.querySelectorAll('.card, .dashboard-card');
    cards.forEach((card, index) => {
        if (!card.id) {
            card.id = `${prefix}-${index + 1}`;
        }
    });
});
```

### 3. For Pages with Specific Card Titles

Use a mapping approach for more precise ID assignment:

```javascript
// Map of target titles to IDs
const cardIdMap = {
    'Guest Demographics': 'insights-1',
    'Guest Feedback Analysis': 'insights-2',
    'Loyalty Program Performance': 'insights-3',
    'Booking Patterns': 'insights-4'
    // Add more mappings as needed
};

// Add IDs based on card titles
cards.forEach((card, index) => {
    const titleElement = card.querySelector('.card-title, h5');
    if (titleElement) {
        const title = titleElement.textContent.trim();
        
        // Check if this card title is in our mapping
        if (cardIdMap[title]) {
            card.id = cardIdMap[title];
        } else {
            // Fallback ID
            card.id = prefix + '-card-' + (index + 1);
        }
    }
});
```

### 4. For Dynamic Content

If your cards are loaded dynamically (e.g., via AJAX), make sure to:

1. Add appropriate IDs when creating the cards
2. Call `addIdsToCards()` after loading content 
3. Check for hash navigation after content is loaded:
   
```javascript
function afterLoadingDynamicContent() {
    addIdsToCards();  // From card-navigation.js
    
    // Check if there's a hash in the URL and handle navigation
    if (window.location.hash) {
        const targetId = window.location.hash.substring(1);
        const targetCard = document.getElementById(targetId);
        if (targetCard) {
            highlightAndScrollToCard(targetCard);
        }
    }
}
```

## Testing the Implementation

1. Add a known ID to a card (e.g., `insights-1`) on the Guest Insights page
2. From the Dashboard page, search for that card
3. Click on the search result
4. Verify that:
   - The correct page loads
   - The page scrolls to the target card
   - The card is highlighted briefly

## Troubleshooting

If navigation doesn't work:

1. Check the browser console for errors
2. Verify that card IDs match exactly between the search data and the actual cards
3. Ensure the `card-navigation.js` script is properly loaded
4. Make sure the card exists on the page before the navigation script runs
5. Check if any styles are conflicting with the highlight-card class 