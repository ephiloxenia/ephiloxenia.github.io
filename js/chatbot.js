document.addEventListener('DOMContentLoaded', function() {
    initChatbot();
    
    // Add event listener for tab changes to control chat visibility
    const navItems = document.querySelectorAll('.mobile-nav-item');
    const globalChatBar = document.querySelector('.global-chat-bar');
    
    // Track if we're in human mode or AI mode
    window.isHumanMode = false;
    
    if (navItems && globalChatBar) {
        // Initially hide the chat bar
        globalChatBar.style.display = 'none';
        
        navItems.forEach(item => {
            item.addEventListener('click', function() {
                const tabName = this.getAttribute('data-tab');
                
                // Only show chat bar in the Assistant tab (concierge tab)
                if (tabName === 'concierge') {
                    globalChatBar.style.display = 'block';
                    
                    // Force scroll to bottom when switching to chat tab
                    setTimeout(scrollToBottom, 100);
                } else {
                    globalChatBar.style.display = 'none';
                }
            });
        });
    }
    
    // Set up a MutationObserver to watch for changes in the chat container
    const chatMessages = document.getElementById('chat-messages');
    if (chatMessages) {
        const chatObserver = new MutationObserver(function(mutations) {
            // Find the last added child and scroll to it
            if (mutations.length > 0) {
                const lastMutation = mutations[mutations.length - 1];
                if (lastMutation.addedNodes.length > 0) {
                    const lastNode = lastMutation.addedNodes[lastMutation.addedNodes.length - 1];
                    if (lastNode.nodeType === 1) { // Element node
                        lastNode.scrollIntoView({ behavior: 'smooth', block: 'end' });
                    }
                }
            }
        });
        
        chatObserver.observe(chatMessages, {
            childList: true,  // Watch for added/removed nodes
            subtree: false,   // No need to watch children
            characterData: false // No need to watch for text changes
        });
    }
    
    // Use event delegation for human support option (ONLY use this approach)
    const humanSupportOption = document.querySelector('.human-support-option');
    if (humanSupportOption) {
        humanSupportOption.addEventListener('click', function(e) {
            if (e.target.closest('#talk-to-human')) {
                handleTalkToHuman();
            } else if (e.target.closest('#return-to-ai')) {
                handleReturnToAI();
            }
        });
    }
});

function initChatbot() {
    // Get chat elements - use the global chat input instead of tab-specific one
    const chatForm = document.getElementById('global-chat-form');
    const chatInput = document.getElementById('global-chat-input');
    const chatMessages = document.getElementById('chat-messages');
    
    if (!chatForm || !chatInput || !chatMessages) return;
    
    // Move the human support option inside the chat messages container
    const humanSupportOption = document.getElementById('human-support-option');
    if (humanSupportOption) {
        // Remove from its current position
        humanSupportOption.parentNode.removeChild(humanSupportOption);
        
        // Add to the end of chat messages container
        chatMessages.appendChild(humanSupportOption);
        
        // Make sure it's visible
        humanSupportOption.classList.add('visible');
    }
    
    // Add welcome message
    setTimeout(() => {
        addBotMessage("Hello! I'm your AI assistant. How can I help you during your stay? If you prefer to speak with a human concierge, click the option below.");
    }, 500);
    
    // Handle form submission
    chatForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const message = chatInput.value.trim();
        if (!message) return;
        
        // Switch to concierge tab if not already active
        const conciergeTab = document.querySelector('.mobile-nav-item[data-tab="concierge"]');
        if (!conciergeTab.classList.contains('active')) {
            // Simulate click on concierge tab
            conciergeTab.click();
            
            // Ensure the chat bar is visible
            const globalChatBar = document.querySelector('.global-chat-bar');
            if (globalChatBar) {
                globalChatBar.style.display = 'block';
            }
        }
        
        // Add user message
        addUserMessage(message);
        
        // Clear input
        chatInput.value = '';
        chatInput.focus();
        
        // Show typing indicator
        showTypingIndicator();
        
        // Process the message and respond
        setTimeout(() => {
            removeTypingIndicator();
            
            // Use different response handling depending on mode
            if (window.isHumanMode) {
                // Simulate human agent response
                const humanResponses = [
                    "I'd be happy to help with that. Let me look into it for you.",
                    "Thanks for your question. Based on your preferences, I would recommend...",
                    "I understand what you're looking for. Here's what I can do for you...",
                    "Let me connect with our team and get the best information for you.",
                    "That's a great question. The answer is...",
                    "I'll make sure that gets taken care of right away."
                ];
                const randomResponse = humanResponses[Math.floor(Math.random() * humanResponses.length)];
                addHumanAgentMessage(randomResponse);
            } else {
                // Regular AI processing
                processUserMessage(message);
            }
        }, 1000 + Math.random() * 1000);
    });
    
    // Suggestions buttons - update to handle both global and tab-specific buttons
    const suggestionButtons = document.querySelectorAll('.suggestion-btn');
    suggestionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const message = this.textContent.trim();
            chatInput.value = message;
            chatForm.dispatchEvent(new Event('submit'));
        });
    });

    // Voice input button - update to handle the global voice button
    const voiceButton = document.getElementById('global-voice-input-btn');
    if (voiceButton && 'webkitSpeechRecognition' in window) {
        const recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        
        voiceButton.addEventListener('click', function() {
            voiceButton.classList.add('listening');
            voiceButton.querySelector('i').className = 'bi bi-mic-fill text-danger';
            
            recognition.start();
        });
        
        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            chatInput.value = transcript;
            
            // Submit the form after a short delay
            setTimeout(() => {
                chatForm.dispatchEvent(new Event('submit'));
            }, 300);
        };
        
        recognition.onend = function() {
            voiceButton.classList.remove('listening');
            voiceButton.querySelector('i').className = 'bi bi-mic';
        };
        
        recognition.onerror = function(event) {
            console.error('Speech recognition error', event.error);
            voiceButton.classList.remove('listening');
            voiceButton.querySelector('i').className = 'bi bi-mic';
        };
    } else if (voiceButton) {
        voiceButton.style.display = 'none';
    }
}

function addUserMessage(message) {
    const chatMessages = document.getElementById('chat-messages');
    
    if (!chatMessages) return;
    
    const messageElement = document.createElement('div');
    messageElement.className = 'message message-user';
    messageElement.textContent = message;
    
    // Get the human support option
    const humanSupportOption = document.getElementById('human-support-option');
    
    if (window.isHumanMode) {
        // In human mode, always place user messages at the end (before the support option)
        if (humanSupportOption && humanSupportOption.parentNode === chatMessages) {
            chatMessages.insertBefore(messageElement, humanSupportOption);
        } else {
            chatMessages.appendChild(messageElement);
        }
    } else {
        // AI mode - Insert before the human support option if it exists
        if (humanSupportOption && humanSupportOption.parentNode === chatMessages) {
            chatMessages.insertBefore(messageElement, humanSupportOption);
        } else {
            chatMessages.appendChild(messageElement);
        }
    }
    
    // Force scroll to bottom when adding user message
    setTimeout(() => {
        messageElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 100);
}

function addBotMessage(message) {
    const chatMessages = document.getElementById('chat-messages');
    
    if (!chatMessages) return;
    
    const messageElement = document.createElement('div');
    messageElement.className = 'message message-bot';
    messageElement.innerHTML = message;
    
    // Get the human support option
    const humanSupportOption = document.getElementById('human-support-option');
    
    // Insert message before the human support option if it exists
    if (humanSupportOption && humanSupportOption.parentNode === chatMessages) {
        chatMessages.insertBefore(messageElement, humanSupportOption);
    } else {
        chatMessages.appendChild(messageElement);
    }
    
    // Force scroll to bottom when adding bot message
    setTimeout(() => {
        messageElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 100);
}

function showTypingIndicator() {
    const chatMessages = document.getElementById('chat-messages');
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'message message-bot typing-indicator';
    typingIndicator.innerHTML = '<span></span><span></span><span></span>';
    typingIndicator.id = 'typing-indicator';
    
    // Get the human support option
    const humanSupportOption = document.getElementById('human-support-option');
    
    // Insert typing indicator before the human support option if it exists
    if (humanSupportOption && humanSupportOption.parentNode === chatMessages) {
        chatMessages.insertBefore(typingIndicator, humanSupportOption);
    } else {
        chatMessages.appendChild(typingIndicator);
    }
    
    // Force scroll to bottom immediately and with a delay
    setTimeout(() => {
        scrollToBottom();
    }, 10);
}

function removeTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

function scrollToBottom() {
    const chatMessages = document.getElementById('chat-messages');
    if (chatMessages) {
        // Force immediate scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Use scrollIntoView on the last message for better browser compatibility
        const lastMessage = chatMessages.lastElementChild;
        if (lastMessage) {
            lastMessage.style.marginBottom = '24px'; // Add extra margin to the last message
            lastMessage.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    }
}

function processUserMessage(message) {
    // Get guest preferences and context (in a real app this would come from backend)
    const guestPreferences = getGuestPreferences();
    
    // Convert message to lowercase for easier matching
    const lowerMessage = message.toLowerCase();
    
    // Check if it's a personalized recommendation request
    if (containsAny(lowerMessage, ['recommend', 'suggestion', 'what should', 'advise', 'best for me', 'personalized'])) {
        if (containsAny(lowerMessage, ['restaurant', 'dinner', 'lunch', 'food', 'eat', 'dining'])) {
            providePersonalizedRestaurantRecommendations(guestPreferences);
            return;
        }
        
        if (containsAny(lowerMessage, ['activity', 'activities', 'do', 'explore', 'tour', 'sightseeing', 'attractions'])) {
            providePersonalizedActivityRecommendations(guestPreferences);
            return;
        }
        
        if (containsAny(lowerMessage, ['spa', 'massage', 'wellness', 'relax', 'treatment'])) {
            providePersonalizedSpaRecommendations(guestPreferences);
            return;
        }
        
        // General recommendation request
        provideGeneralRecommendations(guestPreferences);
        return;
    }
    
    // Check for greeting
    if (containsAny(lowerMessage, ['hello', 'hi', 'hey', 'greetings'])) {
        addBotMessage(`Hello ${guestPreferences.name || ''}! How can I assist you today?`);
        return;
    }
    
    // Check for checkout information
    if (containsAny(lowerMessage, ['check out', 'checkout', 'leaving'])) {
        addBotMessage("Check-out time is at 12:00 PM. You can request a late check-out through the app or at the reception. Would you like me to arrange a late check-out for you?");
        return;
    }
    
    // Check for breakfast information
    if (containsAny(lowerMessage, ['breakfast', 'morning', 'meal'])) {
        const breakfastRecommendation = getPersonalizedBreakfastRecommendation(guestPreferences);
        addBotMessage(`Breakfast is served in the main restaurant from 7:00 AM to 10:30 AM. ${breakfastRecommendation} Would you like to reserve a table?`);
        return;
    }
    
    // Check for wifi information
    if (containsAny(lowerMessage, ['wifi', 'internet', 'connection', 'password'])) {
        addBotMessage("You can connect to our WiFi network named 'Sunset_Resort_Guest' using the password 'SunnyStay2023'. If you're having trouble connecting, please let me know.");
        return;
    }
    
    // Check for room service
    if (containsAny(lowerMessage, ['room service', 'order', 'deliver', 'bring'])) {
        // Check if it's a specific menu recommendation request
        if (containsAny(lowerMessage, ['recommend', 'suggestion', 'best'])) {
            providePersonalizedRoomServiceRecommendations(guestPreferences);
            return;
        }
        
        addBotMessage("Room service is available 24/7. You can view the menu in the 'Services' tab of this app. Would you like me to help you place an order?");
        return;
    }
    
    // Check for local transport
    if (containsAny(lowerMessage, ['taxi', 'transport', 'bus', 'transportation', 'travel', 'airport'])) {
        addBotMessage("I can help you arrange transportation. We have taxi services available 24/7, and the concierge can assist with rental cars or shuttle services. The nearest bus stop is a 5-minute walk from the hotel. Would you like me to arrange a taxi for you?");
        return;
    }
    
    // Check for hotel facilities
    if (containsAny(lowerMessage, ['gym', 'fitness', 'pool', 'swimming', 'facilities'])) {
        addBotMessage(`
            <p>Our hotel offers the following facilities:</p>
            <ul>
                <li><strong>Swimming Pool</strong> - Open 7:00 AM to 10:00 PM (level 3)</li>
                <li><strong>Fitness Center</strong> - Open 24/7 with your room key (level 2)</li>
                <li><strong>Spa & Wellness</strong> - Open 9:00 AM to 9:00 PM (level 2)</li>
                <li><strong>Business Center</strong> - Open 8:00 AM to 8:00 PM (lobby level)</li>
                <li><strong>Rooftop Bar</strong> - Open 4:00 PM to midnight (top floor)</li>
            </ul>
        `);
        return;
    }
    
    // Check for weather information
    if (containsAny(lowerMessage, ['weather', 'temperature', 'forecast', 'rain', 'sunny'])) {
        provideWeatherForecast();
        return;
    }
    
    // AI assistant features
    if (containsAny(lowerMessage, ['set', 'wake', 'alarm', 'reminder'])) {
        if (containsAny(lowerMessage, ['wake', 'up', 'morning', 'tomorrow'])) {
            addBotMessage("I'll set a wake-up call for you. What time would you like to be woken up tomorrow?");
            return;
        }
        addBotMessage("I can help you set reminders and alarms. What would you like me to remind you about?");
        return;
    }
    
    // Default response based on sentiment analysis
    if (containsNegativeWords(lowerMessage)) {
        addBotMessage("I'm sorry to hear that. How can I help improve your experience? Your comfort is our priority.");
        return;
    }
    
    // Default response
    addBotMessage("I'm here to make your stay exceptional. You can ask me about personalized recommendations, hotel facilities, local attractions, dining options, or any services you might need. How else can I assist you?");
}

function containsAny(text, keywords) {
    return keywords.some(keyword => text.includes(keyword));
}

function containsNegativeWords(text) {
    const negativeWords = ['bad', 'terrible', 'awful', 'disappointed', 'unhappy', 'problem', 'issue', 'complaint', 'wrong', 'broken', 'not working', 'dirty', 'noisy', 'uncomfortable'];
    return negativeWords.some(word => text.includes(word));
}

// Simulated guest preferences (in a real app, this would come from a backend API)
function getGuestPreferences() {
    return {
        name: 'John',
        roomNumber: '302',
        stayDuration: 5,
        purpose: 'leisure',
        previousStays: 2,
        dietaryPreferences: ['vegetarian'],
        interests: ['local culture', 'history', 'fine dining', 'outdoor activities'],
        previousOrders: ['grilled salmon', 'caesar salad', 'club sandwich'],
        previousRoomTemperature: 22,
        wakeUpTime: '07:30',
        specialRequests: ['extra pillows', 'quiet room'],
        languages: ['English', 'Spanish'],
        savedPlaces: ['Harbor Bistro', 'City Museum'],
        allergies: ['nuts'],
        lastFeedback: {
            room: 4.5,
            service: 5,
            food: 4,
            overall: 4.5
        }
    };
}

function providePersonalizedRestaurantRecommendations(preferences) {
    // In a real app, this would use a recommendation algorithm based on user preferences
    // and possibly machine learning models
    
    let response = '<p>Based on your preferences, I recommend these restaurants:</p><ul>';
    
    // Check if user is vegetarian
    if (preferences.dietaryPreferences.includes('vegetarian')) {
        response += `
            <li><strong>Green Garden</strong> - Our award-winning vegetarian restaurant with farm-to-table cuisine (located on the ground floor)</li>
            <li><strong>Spice of Life</strong> - Vegetarian-friendly international cuisine just 10 minutes walk from the hotel</li>`;
    } else {
        response += `
            <li><strong>The Ocean View</strong> - Our signature restaurant with fresh seafood and Mediterranean cuisine (located on the ground floor)</li>`;
    }
    
    // Check interests
    if (preferences.interests.includes('local culture')) {
        response += `
            <li><strong>Authentic Local</strong> - Traditional cuisine with local ingredients and cultural performances every evening</li>`;
    }
    
    if (preferences.interests.includes('fine dining')) {
        response += `
            <li><strong>Michelin Star</strong> - Our fine dining restaurant with an executive chef (advance reservation recommended)</li>`;
    }
    
    // Check saved places
    if (preferences.savedPlaces.includes('Harbor Bistro')) {
        response += `
            <li><strong>Harbor Bistro</strong> - Your previously saved restaurant, known for fresh seafood (Would you like to make a reservation?)</li>`;
    }
    
    response += `</ul>
        <p>Would you like me to make a reservation at any of these for you?</p>
        <div class="d-flex flex-wrap gap-2 mt-3">
            <button class="btn btn-sm btn-outline-primary suggestion-btn">Reserve at Green Garden</button>
            <button class="btn btn-sm btn-outline-primary suggestion-btn">Show menu options</button>
            <button class="btn btn-sm btn-outline-primary suggestion-btn">Local restaurants map</button>
        </div>`;
    
    addBotMessage(response);
}

function providePersonalizedActivityRecommendations(preferences) {
    let response = '<p>Based on your preferences and current availabilities, here are my top activity recommendations for you:</p><ul>';
    
    // Check interests
    if (preferences.interests.includes('local culture') || preferences.interests.includes('history')) {
        response += `
            <li><strong>Historical Walking Tour</strong> - Explore the old town with our expert local guide (departs at 10:00 AM daily)</li>
            <li><strong>Cultural Heritage Museum</strong> - Just opened a new exhibition on local traditions (15 minutes by taxi)</li>`;
    }
    
    if (preferences.interests.includes('outdoor activities')) {
        response += `
            <li><strong>Coastal Hiking Trail</strong> - Breathtaking views with moderate difficulty level (transportation included)</li>
            <li><strong>Sunset Sailing</strong> - A 3-hour cruise along the coast with refreshments</li>`;
    }
    
    if (preferences.purpose === 'leisure' && preferences.stayDuration >= 3) {
        response += `
            <li><strong>Island Day Trip</strong> - Full day excursion to the nearby islands with lunch included</li>`;
    }
    
    response += `</ul>
        <p>Our weather forecast for tomorrow is sunny and 25°C, perfect for outdoor activities!</p>
        <div class="d-flex flex-wrap gap-2 mt-3">
            <button class="btn btn-sm btn-outline-primary suggestion-btn">Book Sunset Sailing</button>
            <button class="btn btn-sm btn-outline-primary suggestion-btn">Show all activities</button>
            <button class="btn btn-sm btn-outline-primary suggestion-btn">Recommend for rainy day</button>
        </div>`;
    
    addBotMessage(response);
}

function providePersonalizedSpaRecommendations(preferences) {
    let response = '<p>Based on your preferences, here are my spa treatment recommendations:</p><ul>';
    
    if (preferences.purpose === 'leisure') {
        response += `
            <li><strong>Relaxation Package</strong> - 90-minute full body massage and facial (Our most popular package)</li>
            <li><strong>Aromatherapy Massage</strong> - 60-minute treatment with essential oils to promote relaxation</li>`;
    } else {
        response += `
            <li><strong>Express Rejuvenation</strong> - 30-minute head and shoulder massage perfect for business travelers</li>
            <li><strong>Foot Reflexology</strong> - 45-minute specialized treatment to relieve tension</li>`;
    }
    
    // Check if they have provided any special requests or previous feedback
    if (preferences.specialRequests.includes('quiet room')) {
        response += `
            <li><strong>Private Wellness Suite</strong> - Exclusive treatment room with added privacy and tranquility</li>`;
    }
    
    response += `</ul>
        <p>I see you have a gap in your schedule tomorrow between 2:00 PM and 4:00 PM. Would you like me to book a treatment during this time?</p>
        <div class="d-flex flex-wrap gap-2 mt-3">
            <button class="btn btn-sm btn-outline-primary suggestion-btn">Book Relaxation Package</button>
            <button class="btn btn-sm btn-outline-primary suggestion-btn">See full spa menu</button>
            <button class="btn btn-sm btn-outline-primary suggestion-btn">Check availability</button>
        </div>`;
    
    addBotMessage(response);
}

function providePersonalizedRoomServiceRecommendations(preferences) {
    let response = '<p>Based on your preferences and past orders, I recommend:</p><ul>';
    
    // Check dietary preferences
    if (preferences.dietaryPreferences.includes('vegetarian')) {
        response += `
            <li><strong>Seasonal Vegetable Risotto</strong> - Our chef's special with local organic vegetables</li>
            <li><strong>Mediterranean Platter</strong> - Hummus, falafel, and fresh vegetable selection</li>`;
    } else {
        // Check previous orders
        if (preferences.previousOrders.includes('grilled salmon')) {
            response += `
                <li><strong>Grilled Salmon</strong> - Your previous favorite, served with seasonal vegetables</li>`;
        }
        
        if (preferences.previousOrders.includes('club sandwich')) {
            response += `
                <li><strong>Club Sandwich</strong> - Another one of your favorites, available 24/7</li>`;
        } else {
            response += `
                <li><strong>Chef's Special Pasta</strong> - Fresh handmade pasta with truffle sauce</li>`;
        }
    }
    
    // Check for allergies
    if (preferences.allergies.includes('nuts')) {
        response += `
            <li><em>Note: All recommended dishes are prepared without nuts</em></li>`;
    }
    
    response += `</ul>
        <p>Would you like me to place an order for any of these items?</p>
        <div class="d-flex flex-wrap gap-2 mt-3">
            <button class="btn btn-sm btn-outline-primary suggestion-btn">Order Grilled Salmon</button>
            <button class="btn btn-sm btn-outline-primary suggestion-btn">View full menu</button>
            <button class="btn btn-sm btn-outline-primary suggestion-btn">Dietary restrictions</button>
        </div>`;
    
    addBotMessage(response);
}

function getPersonalizedBreakfastRecommendation(preferences) {
    // In a real app, this would use a more sophisticated algorithm
    
    let recommendation = '';
    
    if (preferences.dietaryPreferences.includes('vegetarian')) {
        recommendation = 'Based on your preferences, I recommend our vegetarian breakfast selection with fresh fruit, avocado toast, and plant-based options.';
    } else if (preferences.previousOrders.includes('caesar salad')) {
        recommendation = 'Our healthy breakfast bar with fresh fruits and yogurt parfaits might be perfect for you based on your previous dining choices.';
    } else {
        recommendation = 'We offer a buffet style breakfast with continental and local options.';
    }
    
    return recommendation;
}

function provideGeneralRecommendations(preferences) {
    let response = `<p>Based on your interests and preferences, here are my top recommendations for your stay:</p><ul>`;
    
    // Dining recommendation
    if (preferences.dietaryPreferences.includes('vegetarian')) {
        response += `
            <li><strong>Dining:</strong> Try our Green Garden restaurant for exceptional vegetarian cuisine</li>`;
    } else if (preferences.interests.includes('fine dining')) {
        response += `
            <li><strong>Dining:</strong> Our Michelin Star restaurant offers a tasting menu that changes daily</li>`;
    } else {
        response += `
            <li><strong>Dining:</strong> The Ocean View restaurant offers fresh local seafood with a great view</li>`;
    }
    
    // Activity recommendation
    if (preferences.interests.includes('local culture') || preferences.interests.includes('history')) {
        response += `
            <li><strong>Activity:</strong> The guided city tour is highly rated and covers both historical sites and local culture</li>`;
    } else if (preferences.interests.includes('outdoor activities')) {
        response += `
            <li><strong>Activity:</strong> The sunset sailing trip provides breathtaking views of the coastline</li>`;
    } else {
        response += `
            <li><strong>Activity:</strong> Our rooftop pool offers panoramic views of the city</li>`;
    }
    
    // Relaxation recommendation
    response += `
        <li><strong>Relaxation:</strong> The spa's signature treatment combines local ingredients with traditional techniques</li>`;
    
    response += `</ul>
        <p>Would you like more specific recommendations for any of these categories?</p>
        <div class="d-flex flex-wrap gap-2 mt-3">
            <button class="btn btn-sm btn-outline-primary suggestion-btn">Dining options</button>
            <button class="btn btn-sm btn-outline-primary suggestion-btn">Activities nearby</button>
            <button class="btn btn-sm btn-outline-primary suggestion-btn">Spa treatments</button>
        </div>`;
    
    addBotMessage(response);
}

function provideWeatherForecast() {
    // In a real app, this would fetch data from a weather API
    const forecast = {
        today: {
            condition: 'Sunny',
            temperature: {
                min: 22,
                max: 28
            },
            precipitation: '0%',
            wind: '5 km/h'
        },
        tomorrow: {
            condition: 'Partly Cloudy',
            temperature: {
                min: 20,
                max: 25
            },
            precipitation: '10%',
            wind: '10 km/h'
        },
        dayAfterTomorrow: {
            condition: 'Cloudy with showers',
            temperature: {
                min: 18,
                max: 23
            },
            precipitation: '40%',
            wind: '15 km/h'
        }
    };
    
    const response = `
        <div class="weather-forecast">
            <p>Here's the weather forecast for the next few days:</p>
            <div class="d-flex flex-wrap gap-3 mt-3">
                <div class="weather-day">
                    <div class="weather-day-title">Today</div>
                    <div class="weather-icon">${getWeatherIcon(forecast.today.condition)}</div>
                    <div class="weather-condition">${forecast.today.condition}</div>
                    <div class="weather-temp">${forecast.today.temperature.min}°C - ${forecast.today.temperature.max}°C</div>
                    <div class="weather-detail"><i class="bi bi-droplet"></i> ${forecast.today.precipitation}</div>
                    <div class="weather-detail"><i class="bi bi-wind"></i> ${forecast.today.wind}</div>
                </div>
                <div class="weather-day">
                    <div class="weather-day-title">Tomorrow</div>
                    <div class="weather-icon">${getWeatherIcon(forecast.tomorrow.condition)}</div>
                    <div class="weather-condition">${forecast.tomorrow.condition}</div>
                    <div class="weather-temp">${forecast.tomorrow.temperature.min}°C - ${forecast.tomorrow.temperature.max}°C</div>
                    <div class="weather-detail"><i class="bi bi-droplet"></i> ${forecast.tomorrow.precipitation}</div>
                    <div class="weather-detail"><i class="bi bi-wind"></i> ${forecast.tomorrow.wind}</div>
                </div>
                <div class="weather-day">
                    <div class="weather-day-title">After Tomorrow</div>
                    <div class="weather-icon">${getWeatherIcon(forecast.dayAfterTomorrow.condition)}</div>
                    <div class="weather-condition">${forecast.dayAfterTomorrow.condition}</div>
                    <div class="weather-temp">${forecast.dayAfterTomorrow.temperature.min}°C - ${forecast.dayAfterTomorrow.temperature.max}°C</div>
                    <div class="weather-detail"><i class="bi bi-droplet"></i> ${forecast.dayAfterTomorrow.precipitation}</div>
                    <div class="weather-detail"><i class="bi bi-wind"></i> ${forecast.dayAfterTomorrow.wind}</div>
                </div>
            </div>
            <p class="mt-3">Based on the forecast, I recommend planning outdoor activities for today and tomorrow. Would you like me to suggest some options?</p>
        </div>
    `;
    
    addBotMessage(response);
}

function getWeatherIcon(condition) {
    switch (condition.toLowerCase()) {
        case 'sunny':
            return '<i class="bi bi-sun-fill text-warning"></i>';
        case 'partly cloudy':
            return '<i class="bi bi-cloud-sun-fill"></i>';
        case 'cloudy':
            return '<i class="bi bi-cloud-fill"></i>';
        case 'cloudy with showers':
            return '<i class="bi bi-cloud-drizzle-fill"></i>';
        case 'rain':
            return '<i class="bi bi-cloud-rain-fill"></i>';
        case 'thunderstorm':
            return '<i class="bi bi-cloud-lightning-rain-fill"></i>';
        default:
            return '<i class="bi bi-cloud-fill"></i>';
    }
}

function handleTalkToHuman() {
    // Show typing indicator
    showTypingIndicator();
    
    // Set human mode flag
    window.isHumanMode = true;
    
    // Remove typing indicator after a short delay and show human agent response
    setTimeout(() => {
        removeTypingIndicator();
        
        // Add a message from the human agent using our new function
        addHumanAgentMessage("Hello! I'm Maria from the concierge desk. How may I assist you today? I'll be available to help you for the next 30 minutes.");
        
        // Replace the "Talk to human" section with a "Return to AI" option
        const humanSupportOption = document.querySelector('.human-support-option');
        if (humanSupportOption) {
            humanSupportOption.innerHTML = `
                <a class="human-support-link" id="return-to-ai">
                    <i class="bi bi-robot"></i> Return to AI assistant
                </a>
            `;
        }
    }, 1500);
}

function handleReturnToAI() {
    // Show typing indicator
    showTypingIndicator();
    
    // Reset human mode flag
    window.isHumanMode = false;
    
    // Remove typing indicator after a short delay
    setTimeout(() => {
        removeTypingIndicator();
        
        // Add a message from the AI
        addBotMessage("I'm your AI assistant again. How can I assist you with your stay?");
        
        // Replace the "Return to AI" section with a "Talk to human" option
        const humanSupportOption = document.querySelector('.human-support-option');
        if (humanSupportOption) {
            humanSupportOption.innerHTML = `
                <a class="human-support-link" id="talk-to-human">
                    <i class="bi bi-person-circle"></i> Talk to a human concierge
                </a>
            `;
        }
    }, 1500);
}

function addHumanAgentMessage(message) {
    const chatMessages = document.getElementById('chat-messages');
    
    if (!chatMessages) return;
    
    const messageElement = document.createElement('div');
    messageElement.className = 'message message-bot';
    messageElement.innerHTML = `
        <div style="display: flex; align-items: center; margin-bottom: 8px;">
            <div class="concierge-avatar">M</div>
            <strong>Maria, Concierge</strong>
        </div>
        <p style="margin: 0;">${message}</p>
    `;
    
    // Mark as human message
    messageElement.setAttribute('data-is-human', 'true');
    
    // Get the human support option
    const humanSupportOption = document.getElementById('human-support-option');
    
    // In human mode, always append the human message at the end (before the support option)
    if (humanSupportOption && humanSupportOption.parentNode === chatMessages) {
        chatMessages.insertBefore(messageElement, humanSupportOption);
    } else {
        chatMessages.appendChild(messageElement);
    }
    
    // Force scroll to bottom when adding human message
    setTimeout(() => {
        messageElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 100);
    
    return messageElement;
} 