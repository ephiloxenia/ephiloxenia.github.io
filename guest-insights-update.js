// ====================================
// RECOMMENDED CHANGES FOR GUEST INSIGHTS PAGE
// ====================================

// 1. Add this script tag to the bottom of the page before </body>
// <script src="js/card-navigation.js"></script>

// 2. Make sure all relevant cards have proper IDs matching the search data
// Here's a sample function to run on page load:

document.addEventListener('DOMContentLoaded', function() {
    // Add IDs to all cards for navigation
    const cards = document.querySelectorAll('.card, .dashboard-card');
    
    // Map of target titles to IDs
    const cardIdMap = {
        'Guest Demographics': 'insights-1',
        'Guest Feedback Analysis': 'insights-2',
        'Loyalty Program Performance': 'insights-3',
        'Booking Patterns': 'insights-4'
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
                // Fallback ID if not in our mapping
                card.id = 'insights-card-' + (index + 1);
            }
        }
    });
});

// 3. Add hash-based navigation handler (already in card-navigation.js)

// 4. Ensure that any custom card links use the proper hash-based URLs
// For example:
// <a href="guest-insights.html#insights-1">Guest Demographics</a>

// 5. If you're building cards dynamically, make sure to add IDs
// Example with a card template:
/*
function createCard(title, data) {
    const cardId = title === 'Guest Demographics' ? 'insights-1' : 
                  title === 'Guest Feedback Analysis' ? 'insights-2' :
                  title === 'Loyalty Program Performance' ? 'insights-3' :
                  title === 'Booking Patterns' ? 'insights-4' : 
                  'insights-card-' + Date.now();
                  
    const cardHtml = `
        <div id="${cardId}" class="card dashboard-card mb-4">
            <div class="card-body">
                <h5 class="card-title">${title}</h5>
                <div class="card-content">
                    <!-- Card content goes here -->
                </div>
            </div>
        </div>
    `;
    
    return cardHtml;
}
*/ 