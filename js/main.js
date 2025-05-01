document.addEventListener('DOMContentLoaded', function() {
    // Tooltips initialization
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            const sidebar = document.querySelector('.sidebar');
            sidebar.classList.toggle('show');
        });
    }
    
    // Add sidebar toggle button for responsive view
    addSidebarToggle();
    
    // Initialize components based on page
    initializePageSpecificFunctions();

    // Prevent scrollTo(0, 0) for all internal tab navigation
    preventScrollForInternalTabs();
});

// Function to prevent scroll to top for internal tabs
function preventScrollForInternalTabs() {
    // Target all internal tab links (not the main navigation tabs)
    const internalTabs = document.querySelectorAll('.nav-tabs .nav-link, .list-group-item.list-group-item-action');
    
    if (internalTabs.length > 0) {
        internalTabs.forEach(tab => {
            tab.addEventListener('click', function(e) {
                // If this is part of internal navigation and not the main bottom navbar
                if (!this.closest('.mobile-nav')) {
                    // If Bootstrap is using the tab for toggling content
                    if (this.getAttribute('data-bs-toggle') === 'tab') {
                        // Let Bootstrap handle the tab switching, but prevent the scroll behavior
                        const originalScrollTo = window.scrollTo;
                        window.scrollTo = function() {};
                        
                        // Restore after a brief delay
                        setTimeout(() => {
                            window.scrollTo = originalScrollTo;
                        }, 100);
                    }
                }
            });
        });
    }
}

function addSidebarToggle() {
    // Only add sidebar toggle to hotel management pages, not guest app or login pages
    const currentPath = window.location.pathname;
    if (currentPath.includes('guest-app.html') || 
        currentPath.includes('guest-login.html') || 
        currentPath.includes('hotel-login.html')) {
        return; // Don't add sidebar toggle to guest app or login pages
    }
    
    // Create sidebar toggle button
    const sidebarToggle = document.createElement('button');
    sidebarToggle.className = 'sidebar-toggle';
    sidebarToggle.innerHTML = '<i class="bi bi-list"></i>';
    sidebarToggle.setAttribute('aria-label', 'Toggle sidebar');
    document.body.appendChild(sidebarToggle);
    
    // Add event listener for toggling sidebar
    sidebarToggle.addEventListener('click', function() {
        const sidebar = document.querySelector('.sidebar');
        sidebar.classList.toggle('show');
    });
    
    // Handle window resize to adjust sidebar visibility
    window.addEventListener('resize', function() {
        const sidebar = document.querySelector('.sidebar');
        if (window.innerWidth > 768 && sidebar.classList.contains('show')) {
            sidebar.classList.remove('show');
        }
    });
}

function initializePageSpecificFunctions() {
    // Get the current page from URL
    const currentPage = window.location.pathname.split('/').pop();
    
    // Apply specific initializations based on the current page
    if (currentPage === 'hotel-dashboard.html' || currentPage === '') {
        initializeDashboard();
        initializeTaskManagement(); // Add task management initialization
        initializeCheckInOutToggle(); // Add check-in/out toggle
        initializeWeatherForecast(); // Add weather forecast functionality
    } else if (currentPage === 'dynamic-pricing.html') {
        initializePricing();
    } else if (currentPage === 'guest-app.html') {
        initializeGuestApp();
    } else if (currentPage === 'sustainability.html') {
        initializeSustainability();
    } else if (currentPage === 'operations.html') {
        initializeOperations();
    } else if (currentPage === 'guest-insights.html') {
        initializeGuestInsights();
    } else if (currentPage === 'settings.html') {
        // Initialize settings functionality
    }
}

function initializeDashboard() {
    // Dashboard specific initializations
    updateDashboardStats();
    // Don't call these functions directly since charts.js handles them
    // renderOccupancyChart();
    // renderRevenueChart();
    
    // The charts.js script will handle all chart rendering
    if (typeof initializeCharts === 'function') {
        initializeCharts();
    }
}

function updateDashboardStats() {
    // Simulate fetching dashboard stats
    setTimeout(() => {
        document.getElementById('occupancy-rate').textContent = '78%';
        document.getElementById('avg-daily-rate').textContent = '€142';
        document.getElementById('revenue-per-room').textContent = '€110';
        document.getElementById('guest-satisfaction').textContent = '4.7';
    }, 500);
}

function renderOccupancyChart() {
    const ctx = document.getElementById('occupancy-chart');
    if (!ctx) return;
    
    const occupancyData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
            label: 'Occupancy %',
            data: [65, 59, 80, 81, 56, 85, 90, 95, 82, 75, 70, 78],
            backgroundColor: 'rgba(33, 150, 243, 0.2)',
            borderColor: 'rgba(33, 150, 243, 1)',
            borderWidth: 2,
            tension: 0.4
        }]
    };
    
    new Chart(ctx, {
        type: 'line',
        data: occupancyData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    });
}

function renderRevenueChart() {
    const ctx = document.getElementById('revenue-chart');
    if (!ctx) return;
    
    const revenueData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
            label: 'Revenue',
            data: [12500, 19000, 15000, 16000, 14000, 18000, 22000, 25000, 20000, 18000, 16000, 19000],
            backgroundColor: 'rgba(76, 175, 80, 0.2)',
            borderColor: 'rgba(76, 175, 80, 1)',
            borderWidth: 2
        }]
    };
    
    new Chart(ctx, {
        type: 'bar',
        data: revenueData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '€' + value;
                        }
                    }
                }
            }
        }
    });
}

function initializePricing() {
    // Dynamic pricing specific initializations
    renderPricingChart();
    initializePricingSliders();
}

function renderPricingChart() {
    const ctx = document.getElementById('pricing-chart');
    if (!ctx) return;
    
    const pricingData = {
        labels: Array.from({length: 30}, (_, i) => i + 1),
        datasets: [{
            label: 'Current Price',
            data: Array.from({length: 30}, () => Math.floor(Math.random() * (180 - 120 + 1)) + 120),
            borderColor: 'rgba(33, 150, 243, 1)',
            backgroundColor: 'rgba(33, 150, 243, 0.1)',
            borderWidth: 2,
            fill: true
        }, {
            label: 'Suggested Price',
            data: Array.from({length: 30}, () => Math.floor(Math.random() * (200 - 140 + 1)) + 140),
            borderColor: 'rgba(76, 175, 80, 1)',
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
            borderWidth: 2,
            borderDash: [5, 5],
            fill: true
        }]
    };
    
    new Chart(ctx, {
        type: 'line',
        data: pricingData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: 'index',
            },
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': €' + context.parsed.y;
                        }
                    }
                }
            },
            scales: {
                y: {
                    ticks: {
                        callback: function(value) {
                            return '€' + value;
                        }
                    }
                }
            }
        }
    });
}

function initializePricingSliders() {
    // Initialize sliders for pricing factors
    const sliders = document.querySelectorAll('.pricing-factor-slider');
    sliders.forEach(slider => {
        slider.addEventListener('input', function() {
            const value = this.value;
            const id = this.getAttribute('id');
            document.querySelector(`[data-slider="${id}"]`).textContent = value + '%';
        });
    });
}

function initializeGuestApp() {
    // Guest app specific initializations
    loadRecommendations();
    initializeRoomControls();
    initializeExperienceBooking();
    initializeServiceRequests();
    setupNotifications();
    setupHelpLinks();
    initializeHotelMap();
    initializeVirtualTour();
    initializeServiceTracker();
    initializeNotificationControls();
    
    // Initially hide the global chat bar
    const globalChatBar = document.querySelector('.global-chat-bar');
    if (globalChatBar) {
        globalChatBar.style.display = 'none';
    }
}

function initializeNotificationControls() {
    // Initialize the notifications switch
    const notificationsSwitch = document.getElementById('notificationsSwitch');
    if (notificationsSwitch) {
        // Set the initial state to match the checkbox
        enableHomeButtonNotifications = notificationsSwitch.checked;
        
        // Add event listener to update the flag when changed
        notificationsSwitch.addEventListener('change', function() {
            enableHomeButtonNotifications = this.checked;
        });
    }
}

function loadRecommendations() {
    // Simulate loading personalized recommendations
    const recommendationsContainer = document.getElementById('recommendations-container');
    if (!recommendationsContainer) return;
    
    // Sample recommendations
    const recommendations = [
        {
            title: 'Local Wine Tasting Tour',
            description: 'Experience the finest local wines with our exclusive wine tour, specially selected based on your preferences.',
            rating: 4.8,
            image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60'
        },
        {
            title: 'Seafood Dinner at Harbor View',
            description: 'Based on your dining preferences, we recommend the award-winning seafood restaurant with beautiful harbor views.',
            rating: 4.7,
            image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60'
        },
        {
            title: 'Sunset Sailing Experience',
            description: 'Enjoy a breathtaking sunset from the water with this private sailing trip along the coast.',
            rating: 4.9,
            image: 'https://images.unsplash.com/photo-1526761122248-c31c93f8b2b9?q=80&w=800'
        }
    ];
    
    // Create recommendation cards
    recommendations.forEach(rec => {
        const card = document.createElement('div');
        card.className = 'card mb-4 experience-card';
        card.innerHTML = `
            <img src="${rec.image}" class="card-img-top" alt="${rec.title}" style="height: 180px; object-fit: cover;">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-start mb-2">
                    <h5 class="card-title mb-0">${rec.title}</h5>
                    <span class="badge bg-primary">Recommended</span>
                </div>
                <div class="mb-2 d-flex align-items-center">
                    <span class="text-warning me-1">
                        ${Array(5).fill().map((_, i) => 
                            `<i class="bi bi-star${i < Math.floor(rec.rating) ? '-fill' : i < rec.rating ? '-half' : ''}"></i>`
                        ).join('')}
                    </span>
                    <small class="text-muted ms-1">${rec.rating}</small>
                </div>
                <p class="card-text">${rec.description}</p>
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <span class="fw-bold">€85</span>
                        <small class="text-muted">per person</small>
                    </div>
                    <div>
                        <button class="btn btn-sm btn-outline-secondary me-1 favorite-btn">
                            <i class="bi bi-heart"></i>
                        </button>
                        <button class="btn btn-primary book-now-btn">Book Now</button>
                    </div>
                </div>
            </div>
        `;
        recommendationsContainer.appendChild(card);
    });
    
    // Add event listeners to the newly added Book Now buttons
    const bookNowButtons = recommendationsContainer.querySelectorAll('.book-now-btn');
    const bookingModal = document.getElementById('bookingModal');
    
    if (bookNowButtons.length > 0 && bookingModal) {
        bookNowButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                // Prevent any event propagation issues
                e.preventDefault();
                e.stopPropagation();
                
                // Get experience details from the card
                const card = this.closest('.card');
                const title = card.querySelector('.card-title').textContent;
                
                // Use default date and time since recommendations don't have date/time selectors
                let date = 'June 18, 2023'; // Default
                let time = '18:30'; // Default
                
                // Update booking modal with experience details
                const bookingTitle = bookingModal.querySelector('.booking-title');
                const bookingDate = bookingModal.querySelector('.booking-date');
                const bookingTime = bookingModal.querySelector('.booking-time');
                
                if (bookingTitle) bookingTitle.textContent = title;
                if (bookingDate) bookingDate.textContent = date;
                if (bookingTime) bookingTime.textContent = time;
                
                // First check if there's an existing modal instance and dispose it
                const existingModal = bootstrap.Modal.getInstance(bookingModal);
                if (existingModal) {
                    existingModal.dispose();
                }
                
                // Create and show a new modal instance with a slight delay
                setTimeout(() => {
                    const bsModal = new bootstrap.Modal(bookingModal);
                    console.log('Opening booking modal...', bookingModal);
                    bsModal.show();
                }, 50);
            });
        });
    }
    
    // Add event listeners to favorite buttons
    const favoriteButtons = recommendationsContainer.querySelectorAll('.favorite-btn');
    if (favoriteButtons.length > 0) {
        favoriteButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const isFavorite = this.classList.contains('btn-danger');
                
                if (isFavorite) {
                    this.classList.remove('btn-danger');
                    this.classList.add('btn-outline-secondary');
                    this.innerHTML = '<i class="bi bi-heart"></i>';
                    showNotification('Removed from favorites');
                } else {
                    this.classList.remove('btn-outline-secondary');
                    this.classList.add('btn-danger');
                    this.innerHTML = '<i class="bi bi-heart-fill"></i>';
                    showNotification('Added to favorites');
                }
            });
        });
    }
}

function initializeRoomControls() {
    // Initialize room temperature control
    const tempControl = document.getElementById('tempControl');
    const roomTemp = document.querySelector('.room-temp');
    
    if (tempControl && roomTemp) {
        tempControl.addEventListener('input', function() {
            roomTemp.textContent = this.value + '°C';
        });
    }
    
    // Initialize room scene buttons
    const sceneButtons = document.querySelectorAll('.room-scene-btn');
    if (sceneButtons.length > 0) {
        sceneButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all buttons
                sceneButtons.forEach(b => {
                    b.classList.remove('btn-primary', 'active');
                    b.classList.add('btn-outline-primary');
                });
                
                // Add active class to clicked button
                this.classList.remove('btn-outline-primary');
                this.classList.add('btn-primary', 'active');
                
                // Enable room lights when a scene is selected
                const roomLights = document.getElementById('roomLights');
                if (roomLights) {
                    roomLights.checked = true;
                }
                
                // Set notification source and show a notification
                window.currentNotificationSource = 'homeButton';
                showNotification('Room scene changed to ' + this.dataset.scene);
            });
        });
    }
    
    // Schedule modal functionality
    const scheduleModal = document.getElementById('scheduleModal');
    if (scheduleModal) {
        scheduleModal.addEventListener('show.bs.modal', function(event) {
            const button = event.relatedTarget;
            const controlType = button.dataset.control;
            const controlName = document.getElementById('controlName');
            const temperatureGroup = document.getElementById('temperatureSettingGroup');
            const switchGroup = document.getElementById('switchSettingGroup');
            const scheduleConfirmation = document.getElementById('scheduleConfirmation');
            
            // Reset confirmation message
            if (scheduleConfirmation) {
                scheduleConfirmation.classList.add('d-none');
            }
            
            // Set the control name in the modal title
            if (controlName) {
                controlName.textContent = controlType.charAt(0).toUpperCase() + controlType.slice(1);
            }
            
            // Show/hide appropriate controls based on control type
            if (temperatureGroup && switchGroup) {
                if (controlType === 'temperature') {
                    temperatureGroup.classList.remove('d-none');
                    switchGroup.classList.add('d-none');
                } else {
                    temperatureGroup.classList.add('d-none');
                    switchGroup.classList.remove('d-none');
                }
            }
        });
        
        // Save schedule button
        const saveScheduleBtn = document.getElementById('saveScheduleBtn');
        if (saveScheduleBtn) {
            saveScheduleBtn.addEventListener('click', function() {
                const scheduleTime = document.getElementById('scheduleTime').value;
                const scheduleConfirmation = document.getElementById('scheduleConfirmation');
                
                if (scheduleTime) {
                    // Show confirmation message
                    if (scheduleConfirmation) {
                        scheduleConfirmation.classList.remove('d-none');
                    }
                    
                    // Simulate creating a scheduled task
                    setTimeout(() => {
                        const repeatDaily = document.getElementById('repeatDaily').checked;
                        const controlName = document.getElementById('controlName').textContent;
                        const message = `${controlName} scheduled for ${scheduleTime}${repeatDaily ? ' (repeats daily)' : ''}`;
                        
                        // Set notification source and show the notification
                        window.currentNotificationSource = 'homeButton';
                        showNotification(message, 'success');
                        
                        // Close modal after delay
                        setTimeout(() => {
                            const bsModal = bootstrap.Modal.getInstance(scheduleModal);
                            if (bsModal) {
                                bsModal.hide();
                            }
                        }, 1000);
                    }, 1500);
                }
            });
        }
    }
    
    // Initialize toggle switches
    const toggles = ['roomLights', 'roomCurtains', 'dndMode'];
    toggles.forEach(toggleId => {
        const toggle = document.getElementById(toggleId);
        if (toggle) {
            toggle.addEventListener('change', function() {
                const status = this.checked ? 'on' : 'off';
                let name = '';
                
                switch(toggleId) {
                    case 'roomLights':
                        name = 'Room lights';
                        break;
                    case 'roomCurtains':
                        name = 'Curtains';
                        break;
                    case 'dndMode':
                        name = 'Do Not Disturb mode';
                        break;
                }
                
                window.currentNotificationSource = 'homeButton';
                showNotification(`${name} turned ${status}`);
            });
        }
    });
    
    // Initialize room key functionality
    const roomKeyBtn = document.querySelector('.room-key-btn');
    if (roomKeyBtn) {
        roomKeyBtn.addEventListener('click', function() {
            // The actual modal is already handled by Bootstrap
            // This is just for additional functionality
            setTimeout(() => {
                window.currentNotificationSource = 'homeButton';
                showNotification('Room key ready for use');
            }, 1000);
        });
    }
    
    // Initialize Smart Check-in functionality
    const smartCheckinBtn = document.querySelector('.smart-checkin-btn');
    if (smartCheckinBtn) {
        smartCheckinBtn.addEventListener('click', function() {
            // The actual modal is already handled by Bootstrap
            // This is just for additional functionality
            setTimeout(() => {
                window.currentNotificationSource = 'homeButton';
                showNotification('Smart Check-in is ready');
            }, 1000);
        });
    }
    
    // Room Details Button
    const viewRoomDetailsBtn = document.getElementById('viewRoomDetails');
    if (viewRoomDetailsBtn) {
        viewRoomDetailsBtn.addEventListener('click', function() {
            // Show room details modal or update current view with room details
            window.currentNotificationSource = 'homeButton';
            showNotification('Προβολή πληροφοριών δωματίου');
            
            // Κλείσιμο του τρέχοντος modal
            const currentModal = bootstrap.Modal.getInstance(document.getElementById('smartCheckinModal'));
            if (currentModal) {
                currentModal.hide();
            }
            
            // Εδώ θα μπορούσατε να ανοίξετε ένα νέο modal με πληροφορίες για το δωμάτιο
            // Ή να μεταβείτε σε μια νέα σελίδα/tab με λεπτομέρειες δωματίου
        });
    }
    
    // Navigation to Room Button
    const navigationToRoomBtn = document.getElementById('navigationToRoom');
    if (navigationToRoomBtn) {
        navigationToRoomBtn.addEventListener('click', function() {
            // Show room navigation directions
            window.currentNotificationSource = 'homeButton';
            showNotification('Οδηγίες πλοήγησης προς το δωμάτιο');
            
            // Κλείσιμο του τρέχοντος modal
            const currentModal = bootstrap.Modal.getInstance(document.getElementById('smartCheckinModal'));
            if (currentModal) {
                currentModal.hide();
            }
            
            // Ανοίγουμε το modal χάρτη του ξενοδοχείου με επισήμανση του δωματίου
            setTimeout(() => {
                const hotelMapModal = new bootstrap.Modal(document.getElementById('hotelMapModal'));
                hotelMapModal.show();
            }, 500);
        });
    }
    
    // Copy WiFi credentials functionality
    const copyButtons = ['copyWifiName', 'copyWifiPassword'];
    copyButtons.forEach(btnId => {
        const btn = document.getElementById(btnId);
        if (btn) {
            btn.addEventListener('click', function() {
                const input = this.previousElementSibling;
                input.select();
                document.execCommand('copy');
                
                // Change button text temporarily
                const originalHTML = this.innerHTML;
                this.innerHTML = '<i class="bi bi-check"></i>';
                setTimeout(() => {
                    this.innerHTML = originalHTML;
                }, 1500);
                
                window.currentNotificationSource = 'homeButton';
                showNotification('Copied to clipboard');
            });
        }
    });
    
    // Auto-connect WiFi functionality
    const connectWifiBtn = document.getElementById('connectWifiBtn');
    if (connectWifiBtn) {
        connectWifiBtn.addEventListener('click', function() {
            this.disabled = true;
            this.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Connecting...';
            
            setTimeout(() => {
                this.innerHTML = '<i class="bi bi-check-circle"></i> Connected';
                window.currentNotificationSource = 'homeButton';
                showNotification('Connected to hotel WiFi');
            }, 2000);
        });
    }
}

function initializeExperienceBooking() {
    // Setup experience category filtering
    const categoryButtons = document.querySelectorAll('.experience-categories .btn');
    const experienceCards = document.querySelectorAll('.experience-card');
    
    if (categoryButtons.length > 0 && experienceCards.length > 0) {
        categoryButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                // Update active button
                categoryButtons.forEach(b => {
                    b.classList.remove('btn-primary', 'active');
                    b.classList.add('btn-outline-primary');
                });
                this.classList.remove('btn-outline-primary');
                this.classList.add('btn-primary', 'active');
                
                const category = this.dataset.category;
                
                // Filter experiences
                experienceCards.forEach(card => {
                    if (category === 'all' || card.dataset.category === category) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }
    
    // Setup date and time selection for experiences
    const dateButtons = document.querySelectorAll('.date-btn');
    if (dateButtons.length > 0) {
        dateButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                // Find all date buttons in this card
                const card = this.closest('.card');
                const cardDateButtons = card.querySelectorAll('.date-btn');
                
                cardDateButtons.forEach(b => {
                    b.classList.remove('btn-primary');
                    b.classList.add('btn-outline-primary');
                });
                
                this.classList.remove('btn-outline-primary');
                this.classList.add('btn-primary');
            });
        });
    }
    
    const timeButtons = document.querySelectorAll('.time-btn');
    if (timeButtons.length > 0) {
        timeButtons.forEach(btn => {
            if (!btn.disabled) {
                btn.addEventListener('click', function() {
                    // Find all time buttons in this card
                    const card = this.closest('.card');
                    const cardTimeButtons = card.querySelectorAll('.time-btn:not([disabled])');
                    
                    cardTimeButtons.forEach(b => {
                        b.classList.remove('btn-primary');
                        b.classList.add('btn-outline-primary');
                    });
                    
                    this.classList.remove('btn-outline-primary');
                    this.classList.add('btn-primary');
                });
            }
        });
    }
    
    // Setup favorite button functionality
    const favoriteButtons = document.querySelectorAll('.favorite-btn');
    if (favoriteButtons.length > 0) {
        favoriteButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const isFavorite = this.classList.contains('btn-danger');
                
                if (isFavorite) {
                    this.classList.remove('btn-danger');
                    this.classList.add('btn-outline-secondary');
                    this.innerHTML = '<i class="bi bi-heart"></i>';
                    showNotification('Removed from favorites');
                } else {
                    this.classList.remove('btn-outline-secondary');
                    this.classList.add('btn-danger');
                    this.innerHTML = '<i class="bi bi-heart-fill"></i>';
                    showNotification('Added to favorites');
                }
            });
        });
    }
    
    // Setup booking modal functionality
    const bookNowButtons = document.querySelectorAll('.book-now-btn');
    const bookingModal = document.getElementById('bookingModal');
    
    if (bookNowButtons.length > 0 && bookingModal) {
        bookNowButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                // Prevent any event propagation issues
                e.preventDefault();
                e.stopPropagation();
                
                // Get experience details from the card
                const card = this.closest('.card');
                const title = card.querySelector('.card-title').textContent;
                
                // Get selected date and time if available
                let date = 'June 18, 2023'; // Default
                let time = '18:30'; // Default
                
                const selectedDateBtn = card.querySelector('.date-btn.btn-primary');
                if (selectedDateBtn) {
                    date = selectedDateBtn.textContent.trim();
                    if (date === 'Today') date = 'June 17, 2023';
                    if (date === 'Tomorrow') date = 'June 18, 2023';
                }
                
                const selectedTimeBtn = card.querySelector('.time-btn.btn-primary');
                if (selectedTimeBtn) {
                    time = selectedTimeBtn.textContent.trim();
                }
                
                // Update booking modal with experience details
                const bookingTitle = bookingModal.querySelector('.booking-title');
                const bookingDate = bookingModal.querySelector('.booking-date');
                const bookingTime = bookingModal.querySelector('.booking-time');
                
                if (bookingTitle) bookingTitle.textContent = title;
                if (bookingDate) bookingDate.textContent = date;
                if (bookingTime) bookingTime.textContent = time;
                
                // First check if there's an existing modal instance and dispose it
                const existingModal = bootstrap.Modal.getInstance(bookingModal);
                if (existingModal) {
                    existingModal.dispose();
                }
                
                // Create and show a new modal instance with a slight delay
                setTimeout(() => {
                    const bsModal = new bootstrap.Modal(bookingModal);
                    console.log('Opening booking modal...', bookingModal);
                    bsModal.show();
                }, 50);
            });
        });
    }
    
    // Handle booking confirmation
    const confirmBookingBtn = document.querySelector('.confirm-booking-btn');
    if (confirmBookingBtn) {
        confirmBookingBtn.addEventListener('click', function() {
            const bsModal = bootstrap.Modal.getInstance(bookingModal);
            if (bsModal) {
                bsModal.hide();
                
                // Clean up modal after it's hidden
                bookingModal.addEventListener('hidden.bs.modal', function () {
                    bsModal.dispose();
                }, { once: true });
            }
            
            // Show confirmation notification
            showNotification('Booking confirmed! Check your email for details.', 'success');
        });
    }
}

function initializeServiceRequests() {
    // Handle room service items
    const addToOrderButtons = document.querySelectorAll('.add-to-order');
    const orderItems = document.getElementById('orderItems');
    const emptyOrderMessage = document.getElementById('emptyOrderMessage');
    const orderSubtotal = document.getElementById('orderSubtotal');
    const orderServiceCharge = document.getElementById('orderServiceCharge');
    const orderTotal = document.getElementById('orderTotal');
    
    let orderItemsCount = 0;
    let subtotal = 0;
    
    if (addToOrderButtons.length > 0 && orderItems) {
        addToOrderButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const item = this.dataset.item;
                const price = parseFloat(this.dataset.price);
                
                // Toggle button state and show customization options
                const foodItem = this.closest('.food-item');
                if (foodItem) {
                    const optionsPanel = foodItem.querySelector('.food-options');
                    const quantityControl = foodItem.querySelector('.item-quantity-control');
                    
                    if (optionsPanel) {
                        optionsPanel.classList.remove('d-none');
                    }
                    
                    if (quantityControl) {
                        quantityControl.classList.remove('d-none');
                    }
                    
                    this.textContent = 'Added';
                    this.classList.remove('btn-outline-primary');
                    this.classList.add('btn-success');
                }
                
                // Hide empty order message
                if (emptyOrderMessage) {
                    emptyOrderMessage.style.display = 'none';
                }
                
                // Add item to order
                const orderItem = document.createElement('div');
                orderItem.className = 'list-group-item';
                orderItem.innerHTML = `
                    <div class="d-flex justify-content-between align-items-center">
                        <div>${item}</div>
                        <div class="d-flex align-items-center">
                            <span class="me-3">€${price.toFixed(2)}</span>
                            <button class="btn btn-sm btn-outline-danger remove-item">×</button>
                        </div>
                    </div>
                `;
                orderItems.appendChild(orderItem);
                
                // Update order totals
                orderItemsCount++;
                subtotal += price;
                updateOrderTotals();
                
                // Setup remove button
                const removeBtn = orderItem.querySelector('.remove-item');
                removeBtn.addEventListener('click', function() {
                    orderItem.remove();
                    orderItemsCount--;
                    subtotal -= price;
                    updateOrderTotals();
                    
                    // Reset the Add button state
                    if (foodItem) {
                        const optionsPanel = foodItem.querySelector('.food-options');
                        const quantityControl = foodItem.querySelector('.item-quantity-control');
                        
                        if (optionsPanel) {
                            optionsPanel.classList.add('d-none');
                        }
                        
                        if (quantityControl) {
                            quantityControl.classList.add('d-none');
                        }
                        
                        const addBtn = foodItem.querySelector('.add-to-order');
                        if (addBtn) {
                            addBtn.textContent = 'Add';
                            addBtn.classList.remove('btn-success');
                            addBtn.classList.add('btn-outline-primary');
                        }
                    }
                    
                    // Show empty message if no items
                    if (orderItemsCount === 0 && emptyOrderMessage) {
                        emptyOrderMessage.style.display = 'block';
                    }
                });
            });
        });
    }
    
    // Handle quantity controls
    const quantityControls = document.querySelectorAll('.item-quantity-control');
    if (quantityControls.length > 0) {
        quantityControls.forEach(control => {
            const minusBtn = control.querySelector('.quantity-minus');
            const plusBtn = control.querySelector('.quantity-plus');
            const input = control.querySelector('.quantity-input');
            
            if (minusBtn && plusBtn && input) {
                minusBtn.addEventListener('click', function() {
                    let value = parseInt(input.value);
                    if (value > 1) {
                        input.value = value - 1;
                    }
                });
                
                plusBtn.addEventListener('click', function() {
                    let value = parseInt(input.value);
                    input.value = value + 1;
                });
            }
        });
    }
    
    // Handle delivery time scheduling
    const deliveryTimeSelect = document.getElementById('deliveryTime');
    const scheduledTimeInput = document.querySelector('.scheduled-time');
    
    if (deliveryTimeSelect && scheduledTimeInput) {
        deliveryTimeSelect.addEventListener('change', function() {
            if (this.value === 'schedule') {
                scheduledTimeInput.classList.remove('d-none');
            } else {
                scheduledTimeInput.classList.add('d-none');
            }
        });
    }
    
    // Handle quick action buttons
    const quickActionButtons = document.querySelectorAll('.quick-action-btn[data-service]');
    if (quickActionButtons.length > 0) {
        quickActionButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const service = this.dataset.service;
                let message = '';
                
                // Change button state to show feedback
                this.classList.add('btn-primary');
                this.classList.remove('btn-light');
                
                // Reset button state after 2 seconds
                setTimeout(() => {
                    this.classList.remove('btn-primary');
                    this.classList.add('btn-light');
                }, 2000);
                
                switch(service) {
                    case 'towels':
                        message = 'Extra towels request submitted';
                        updateServiceRequests('quickTowels');
                        break;
                    case 'pillows':
                        message = 'Extra pillows request submitted';
                        updateServiceRequests('quickPillows');
                        break;
                    case 'toiletries':
                        message = 'Toiletries request submitted';
                        updateServiceRequests('quickToiletries');
                        break;
                    case 'dnd':
                        message = 'Do Not Disturb mode activated';
                        showNotification('Room status updated to Do Not Disturb', 'info');
                        return; // Don't add to service requests
                    default:
                        message = 'Request submitted';
                }
                
                showNotification(message, 'success');
            });
        });
    }
    
    // Handle service rating stars
    const ratingStars = document.querySelectorAll('.rating-star');
    if (ratingStars.length > 0) {
        ratingStars.forEach(star => {
            star.addEventListener('mouseenter', function() {
                const rating = parseInt(this.dataset.rating);
                const stars = this.parentElement.querySelectorAll('.rating-star');
                
                stars.forEach((s, index) => {
                    if (index < rating) {
                        s.classList.remove('bi-star');
                        s.classList.add('bi-star-fill', 'text-warning');
                    } else {
                        s.classList.remove('bi-star-fill', 'text-warning');
                        s.classList.add('bi-star');
                    }
                });
            });
            
            star.addEventListener('mouseleave', function() {
                const stars = this.parentElement.querySelectorAll('.rating-star');
                const ratedStars = this.parentElement.querySelectorAll('.rating-star.rated');
                
                if (ratedStars.length === 0) {
                    stars.forEach(s => {
                        s.classList.remove('bi-star-fill', 'text-warning');
                        s.classList.add('bi-star');
                    });
                }
            });
            
            star.addEventListener('click', function() {
                const rating = parseInt(this.dataset.rating);
                const stars = this.parentElement.querySelectorAll('.rating-star');
                
                stars.forEach((s, index) => {
                    s.classList.remove('rated');
                    if (index < rating) {
                        s.classList.remove('bi-star');
                        s.classList.add('bi-star-fill', 'text-warning', 'rated');
                    } else {
                        s.classList.remove('bi-star-fill', 'text-warning');
                        s.classList.add('bi-star');
                    }
                });
                
                // Show thank you message after rating
                const ratingCard = this.closest('.card');
                if (ratingCard) {
                    setTimeout(() => {
                        ratingCard.innerHTML = `
                            <div class="card-body p-2 text-center">
                                <i class="bi bi-check-circle-fill text-success fs-3 mb-2"></i>
                                <p class="mb-0">Thank you for your feedback!</p>
                            </div>
                        `;
                        
                        // Auto dismiss after 3 seconds
                        setTimeout(() => {
                            const serviceCard = ratingCard.closest('.active-service-card');
                            if (serviceCard) {
                                const dismissBtn = serviceCard.querySelector('.dismiss-service-btn');
                                if (dismissBtn) {
                                    dismissBtn.click();
                                }
                            }
                        }, 3000);
                    }, 500);
                }
            });
        });
    }
    
    // Handle "Order Again" buttons
    const orderAgainButtons = document.querySelectorAll('.order-again-btn');
    if (orderAgainButtons.length > 0) {
        orderAgainButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const orderId = this.dataset.orderId;
                
                // Close the service tracker modal
                const serviceTrackerModal = document.getElementById('serviceTrackerModal');
                if (serviceTrackerModal) {
                    const bsModal = bootstrap.Modal.getInstance(serviceTrackerModal);
                    if (bsModal) {
                        bsModal.hide();
                    }
                }
                
                // Open the room service modal
                setTimeout(() => {
                    const roomServiceModal = new bootstrap.Modal(document.getElementById('roomServiceModal'));
                    roomServiceModal.show();
                }, 300);
                
                // Show confirmation notification
                showNotification('Previous order loaded', 'success');
            });
        });
    }
    
    function updateOrderTotals() {
        if (orderSubtotal && orderServiceCharge && orderTotal) {
            const serviceCharge = subtotal * 0.1;
            const total = subtotal + serviceCharge;
            
            orderSubtotal.textContent = `€${subtotal.toFixed(2)}`;
            orderServiceCharge.textContent = `€${serviceCharge.toFixed(2)}`;
            orderTotal.textContent = `€${total.toFixed(2)}`;
        }
    }
    
    // Handle service request submissions
    const serviceRequestButtons = document.querySelectorAll('.service-request-btn');
    if (serviceRequestButtons.length > 0) {
        serviceRequestButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const service = this.dataset.service;
                let message = '';
                
                switch(service) {
                    case 'cleaning':
                        message = 'Room cleaning request submitted';
                        break;
                    case 'roomService':
                        message = 'Room service order placed';
                        break;
                    default:
                        message = 'Service request submitted';
                }
                
                showNotification(message, 'success');
                
                // Update the active requests list
                updateServiceRequests(service);
            });
        });
    }
    
    function updateServiceRequests(service) {
        const statusCard = document.querySelector('.service-status-card');
        if (!statusCard) return;
        
        const listGroup = statusCard.querySelector('.list-group');
        if (!listGroup) return;
        
        const now = new Date();
        const timeString = now.getHours() + ':' + (now.getMinutes() < 10 ? '0' : '') + now.getMinutes();
        
        const newRequest = document.createElement('div');
        newRequest.className = 'list-group-item';
        
        let serviceName = '';
        let serviceIcon = '';
        switch(service) {
            case 'cleaning':
                serviceName = 'Room Cleaning';
                serviceIcon = 'bi-stars';
                break;
            case 'roomService':
                serviceName = 'Room Service Order';
                serviceIcon = 'bi-cup-hot';
                break;
            case 'quickTowels':
                serviceName = 'Extra Towels';
                serviceIcon = 'bi-droplet-half';
                break;
            case 'quickPillows':
                serviceName = 'Extra Pillows';
                serviceIcon = 'bi-box2-heart';
                break;
            case 'quickToiletries':
                serviceName = 'Toiletries Restock';
                serviceIcon = 'bi-basket2';
                break;
            default:
                serviceName = 'Service Request';
                serviceIcon = 'bi-bell';
        }
        
        newRequest.innerHTML = `
            <div class="d-flex w-100 justify-content-between">
                <h6 class="mb-1"><i class="bi ${serviceIcon} me-2"></i>${serviceName}</h6>
                <small class="text-warning">Pending</small>
            </div>
            <p class="mb-1 small">Requested at ${timeString}</p>
            <div class="progress" style="height: 5px;">
                <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style="width: 15%;" aria-valuenow="15" aria-valuemin="0" aria-valuemax="100"></div>
            </div>
        `;
        
        listGroup.prepend(newRequest);
        
        // Update badge count
        updateServiceBadgeCount();
        
        // Simulate status updates
        setTimeout(() => {
            const statusBadge = newRequest.querySelector('small');
            const progressBar = newRequest.querySelector('.progress-bar');
            
            statusBadge.className = 'text-primary';
            statusBadge.textContent = 'In Progress';
            progressBar.style.width = '50%';
            progressBar.setAttribute('aria-valuenow', '50');
            
            // For quick requests, complete them faster
            const completionTime = service.startsWith('quick') ? 10000 : 30000;
            
            setTimeout(() => {
                statusBadge.className = 'text-success';
                statusBadge.textContent = 'Completed';
                progressBar.style.width = '100%';
                progressBar.setAttribute('aria-valuenow', '100');
                progressBar.classList.remove('progress-bar-animated');
            }, completionTime);
        }, 5000);
    }
}

// Global flag to control notifications from home tab buttons
let enableHomeButtonNotifications = false;

function setupNotifications() {
    // Initial notification has been removed
    // Previously: Simulate initial notification after a delay
    // setTimeout(() => {
    //    showNotification('Welcome to Sunset Resort! Your room is ready.', 'primary', true); // Force this notification
    // }, 3000);
}

function showNotification(message, type = 'primary', force = false) {
    // Skip notification if it's from home tab buttons and notifications are disabled
    if (!force && !enableHomeButtonNotifications && window.currentNotificationSource === 'homeButton') {
        return;
    }
    
    const toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) return;
    
    // Create a new toast instead of using a fixed one
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    toast.setAttribute('data-type', type); // Add type as data attribute for styling
    
    // Set toast content
    toast.innerHTML = `
        <div class="toast-header">
            <i class="bi bi-bell-fill me-2 text-${type}"></i>
            <strong class="me-auto">Notification</strong>
            <small class="text-muted">just now</small>
            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
            ${message}
        </div>
    `;
    
    // Add toast to container
    toastContainer.appendChild(toast);
    
    // Initialize and show toast
    const bsToast = new bootstrap.Toast(toast, {
        autohide: true,
        delay: 4000
    });
    bsToast.show();
    
    // Remove toast from DOM after it's hidden
    toast.addEventListener('hidden.bs.toast', function() {
        toast.remove();
    });
    
    // Reset the notification source after showing
    window.currentNotificationSource = null;
}

function setupHelpLinks() {
    // Navigate to concierge tab when help->concierge is clicked
    const conciergeLink = document.querySelector('[data-target="concierge"]');
    if (conciergeLink) {
        conciergeLink.addEventListener('click', function() {
            // Activate concierge tab
            const conciergeTab = document.querySelector('.mobile-nav-item[data-tab="concierge"]');
            if (conciergeTab) {
                conciergeTab.click();
            }
        });
    }
    
    // Setup urgent help button
    const urgentHelpBtn = document.querySelector('.urgent-help');
    if (urgentHelpBtn) {
        urgentHelpBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            showNotification('Calling reception...', 'danger');
            
            // Simulate a calling interface
            setTimeout(() => {
                alert('This would initiate a call to the reception desk in a real app.');
            }, 1000);
        });
    }
    
    // Handle the service links that navigate to other tabs
    const experienceLink = document.querySelector('[data-tab="experience"]');
    if (experienceLink) {
        experienceLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Activate experience tab
            const experienceTab = document.querySelector('.mobile-nav-item[data-tab="experience"]');
            if (experienceTab) {
                experienceTab.click();
            }
        });
    }
}

function initializeSustainability() {
    // Sustainability page specific initializations
    renderSustainabilityCharts();
    animateCarbonMeters();
}

function renderSustainabilityCharts() {
    const ctx = document.getElementById('sustainability-chart');
    if (!ctx) return;
    
    const sustainabilityData = {
        labels: ['Energy', 'Water', 'Waste', 'Food', 'Transportation'],
        datasets: [{
            label: 'Current Usage',
            data: [75, 60, 45, 80, 50],
            backgroundColor: 'rgba(33, 150, 243, 0.5)',
            borderWidth: 0
        }, {
            label: 'Industry Average',
            data: [100, 100, 100, 100, 100],
            backgroundColor: 'rgba(180, 180, 180, 0.2)',
            borderWidth: 0
        }]
    };
    
    new Chart(ctx, {
        type: 'radar',
        data: sustainabilityData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        display: false
                    }
                }
            }
        }
    });
}

function animateCarbonMeters() {
    const meters = document.querySelectorAll('.carbon-meter-fill');
    meters.forEach(meter => {
        const value = meter.getAttribute('data-value');
        setTimeout(() => {
            meter.style.width = value + '%';
        }, 300);
    });
}

function initializeOperations() {
    // Operations page specific initializations
    initializeRoomCalendar();
    
    // Initialize other operations functionalities
    if (document.getElementById('operations-chart')) {
        renderOperationsChart();
    }
}

function initializeRoomCalendar() {
    const calendarContainer = document.getElementById('room-availability-calendar');
    if (!calendarContainer) return;
    
    // Get current date
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    // Set calendar title
    const calendarTitle = document.getElementById('calendar-title');
    if (calendarTitle) {
        calendarTitle.textContent = new Date(currentYear, currentMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }
    
    // Generate room data
    const roomTypes = ['Deluxe King', 'Deluxe Twin', 'Ocean View', 'Suite', 'Presidential'];
    const roomData = {};
    
    roomTypes.forEach(type => {
        const rooms = [];
        // Generate some rooms for each type
        const roomCount = type === 'Presidential' ? 2 : (type === 'Suite' ? 5 : 10);
        
        for (let i = 1; i <= roomCount; i++) {
            const roomNumber = type === 'Deluxe King' ? 100 + i :
                              type === 'Deluxe Twin' ? 200 + i :
                              type === 'Ocean View' ? 300 + i :
                              type === 'Suite' ? 400 + i : 500 + i;
            
            // Generate random bookings
            const bookings = [];
            let daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
            
            // Start with all days available
            const availability = Array(daysInMonth).fill('available');
            
            // Add some random bookings
            const bookingCount = Math.floor(Math.random() * 3) + 1;
            for (let j = 0; j < bookingCount; j++) {
                const startDay = Math.floor(Math.random() * (daysInMonth - 5)) + 1;
                const duration = Math.floor(Math.random() * 4) + 1;
                
                for (let day = startDay; day < startDay + duration && day <= daysInMonth; day++) {
                    availability[day - 1] = 'booked';
                }
                
                bookings.push({
                    id: `booking-${roomNumber}-${j}`,
                    guestName: getRandomName(),
                    checkIn: new Date(currentYear, currentMonth, startDay),
                    checkOut: new Date(currentYear, currentMonth, startDay + duration),
                    adults: Math.floor(Math.random() * 2) + 1,
                    children: Math.floor(Math.random() * 3),
                    status: getRandomStatus()
                });
            }
            
            // Add some maintenance days
            if (Math.random() > 0.8) {
                const maintenanceDay = Math.floor(Math.random() * daysInMonth) + 1;
                availability[maintenanceDay - 1] = 'maintenance';
            }
            
            rooms.push({
                number: roomNumber,
                availability: availability,
                bookings: bookings
            });
        }
        
        roomData[type] = rooms;
    });
    
    // Render the calendar
    renderRoomCalendar(calendarContainer, roomData, currentYear, currentMonth);
    
    // Add navigation event listeners
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    
    if (prevMonthBtn) {
        prevMonthBtn.addEventListener('click', function() {
            navigateMonth(calendarContainer, roomData, -1);
        });
    }
    
    if (nextMonthBtn) {
        nextMonthBtn.addEventListener('click', function() {
            navigateMonth(calendarContainer, roomData, 1);
        });
    }
    
    // Add event listeners for room cells
    calendarContainer.addEventListener('click', function(e) {
        const cell = e.target.closest('.calendar-cell');
        if (!cell) return;
        
        const roomNumber = cell.dataset.room;
        const day = cell.dataset.day;
        const status = cell.dataset.status;
        
        if (status === 'booked') {
            showBookingDetails(getRoomTypeByNumber(roomNumber), roomNumber, day);
        } else {
            showAddBookingModal(getRoomTypeByNumber(roomNumber), roomNumber, day);
        }
    });
    
    // Add filter event listeners
    const roomTypeFilters = document.querySelectorAll('.room-type-filter');
    roomTypeFilters.forEach(filter => {
        filter.addEventListener('change', function() {
            filterRoomCalendar(calendarContainer, roomData);
        });
    });
}

function renderRoomCalendar(container, roomData, year, month) {
    // Clear container
    container.innerHTML = '';
    
    // Get number of days in month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Create header row with dates
    const headerRow = document.createElement('div');
    headerRow.className = 'calendar-header-row';
    
    // Add room number header
    const roomHeader = document.createElement('div');
    roomHeader.className = 'calendar-header-cell room-header';
    roomHeader.textContent = 'Room';
    headerRow.appendChild(roomHeader);
    
    // Add day headers
    for (let day = 1; day <= daysInMonth; day++) {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'calendar-header-cell';
        dayHeader.textContent = day;
        
        // Add day of week
        const dayOfWeek = new Date(year, month, day).getDay();
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            dayHeader.classList.add('weekend');
        }
        
        headerRow.appendChild(dayHeader);
    }
    
    container.appendChild(headerRow);
    
    // Get selected room types
    const selectedRoomTypes = [];
    document.querySelectorAll('.room-type-filter:checked').forEach(filter => {
        selectedRoomTypes.push(filter.value);
    });
    
    // If no filters selected, show all
    const showAllRooms = selectedRoomTypes.length === 0;
    
    // Create rows for each room
    Object.keys(roomData).forEach(roomType => {
        // Skip if not selected
        if (!showAllRooms && !selectedRoomTypes.includes(roomType)) return;
        
        // Add room type header
        const typeHeaderRow = document.createElement('div');
        typeHeaderRow.className = 'calendar-row room-type-header';
        
        const typeHeaderCell = document.createElement('div');
        typeHeaderCell.className = 'calendar-cell room-type-header-cell';
        typeHeaderCell.textContent = roomType;
        typeHeaderCell.colSpan = daysInMonth + 1;
        typeHeaderRow.appendChild(typeHeaderCell);
        
        container.appendChild(typeHeaderRow);
        
        // Add rows for rooms of this type
        roomData[roomType].forEach(room => {
            const roomRow = document.createElement('div');
            roomRow.className = 'calendar-row';
            
            // Add room number cell
            const roomCell = document.createElement('div');
            roomCell.className = 'calendar-cell room-number-cell';
            roomCell.textContent = room.number;
            roomRow.appendChild(roomCell);
            
            // Add cells for each day
            for (let day = 0; day < daysInMonth; day++) {
                const dayCell = document.createElement('div');
                dayCell.className = 'calendar-cell';
                dayCell.classList.add(room.availability[day]);
                dayCell.dataset.room = room.number;
                dayCell.dataset.day = day + 1;
                dayCell.dataset.status = room.availability[day];
                
                // Add day of week class for styling
                const dayOfWeek = new Date(year, month, day + 1).getDay();
                if (dayOfWeek === 0 || dayOfWeek === 6) {
                    dayCell.classList.add('weekend');
                }
                
                // Add booking info if booked
                if (room.availability[day] === 'booked') {
                    // Find booking for this day
                    const booking = room.bookings.find(b => {
                        const checkIn = b.checkIn.getDate();
                        const checkOut = b.checkOut.getDate();
                        return day + 1 >= checkIn && day + 1 < checkOut;
                    });
                    
                    if (booking) {
                        dayCell.dataset.booking = booking.id;
                        
                        // Add check-in/check-out indicators
                        if (day + 1 === booking.checkIn.getDate()) {
                            dayCell.classList.add('check-in');
                        }
                        if (day + 1 === booking.checkOut.getDate() - 1) {
                            dayCell.classList.add('check-out');
                        }
                    }
                }
                
                roomRow.appendChild(dayCell);
            }
            
            container.appendChild(roomRow);
        });
    });
}

function navigateMonth(container, roomData, direction) {
    const calendarTitle = document.getElementById('calendar-title');
    if (!calendarTitle) return;
    
    // Parse current title to get month and year
    const currentDate = new Date(calendarTitle.textContent);
    const newMonth = new Date(currentDate.setMonth(currentDate.getMonth() + direction));
    
    // Update title
    calendarTitle.textContent = newMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    
    // Render calendar for new month
    renderRoomCalendar(container, roomData, newMonth.getFullYear(), newMonth.getMonth());
}

function filterRoomCalendar(container, roomData) {
    // Get current month and year from calendar title
    const calendarTitle = document.getElementById('calendar-title');
    if (!calendarTitle) return;
    
    // Parse current title to get month and year
    const currentDate = new Date(calendarTitle.textContent);
    
    // Render filtered calendar
    renderRoomCalendar(container, roomData, currentDate.getFullYear(), currentDate.getMonth());
}

function showBookingDetails(roomType, roomNumber, day) {
    // Find the booking modal and update its content
    const bookingDetailsModal = document.getElementById('booking-details-modal');
    if (!bookingDetailsModal) return;
    
    // Set modal title
    const modalTitle = bookingDetailsModal.querySelector('.modal-title');
    if (modalTitle) {
        modalTitle.textContent = `Room ${roomNumber} Booking Details`;
    }
    
    // Create a sample booking details (in real application, this would come from backend)
    const bookingDetails = {
        guestName: getRandomName(),
        email: 'guest@example.com',
        phone: '+1 123-456-7890',
        checkIn: new Date().toLocaleDateString(),
        checkOut: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        adults: 2,
        children: 1,
        requests: 'Late check-out requested',
        paymentStatus: 'Fully paid',
        bookingSource: 'Direct website'
    };
    
    // Update modal content
    const modalBody = bookingDetailsModal.querySelector('.modal-body');
    if (modalBody) {
        modalBody.innerHTML = `
            <div class="row">
                <div class="col-md-6">
                    <p><strong>Guest:</strong> ${bookingDetails.guestName}</p>
                    <p><strong>Email:</strong> ${bookingDetails.email}</p>
                    <p><strong>Phone:</strong> ${bookingDetails.phone}</p>
                    <p><strong>Check-in:</strong> ${bookingDetails.checkIn}</p>
                    <p><strong>Check-out:</strong> ${bookingDetails.checkOut}</p>
                </div>
                <div class="col-md-6">
                    <p><strong>Adults:</strong> ${bookingDetails.adults}</p>
                    <p><strong>Children:</strong> ${bookingDetails.children}</p>
                    <p><strong>Special Requests:</strong> ${bookingDetails.requests}</p>
                    <p><strong>Payment Status:</strong> ${bookingDetails.paymentStatus}</p>
                    <p><strong>Booking Source:</strong> ${bookingDetails.bookingSource}</p>
                </div>
            </div>
        `;
    }
    
    // Show the modal
    const bsModal = new bootstrap.Modal(bookingDetailsModal);
    bsModal.show();
}

function showAddBookingModal(roomType, roomNumber, day) {
    // Find the add booking modal and update its content
    const addBookingModal = document.getElementById('add-booking-modal');
    if (!addBookingModal) return;
    
    // Set modal title
    const modalTitle = addBookingModal.querySelector('.modal-title');
    if (modalTitle) {
        modalTitle.textContent = `Add Booking for Room ${roomNumber}`;
    }
    
    // Get current month and year from calendar title
    const calendarTitle = document.getElementById('calendar-title');
    if (!calendarTitle) return;
    
    // Parse current title to get month and year
    const currentDate = new Date(calendarTitle.textContent);
    const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    
    // Set date fields
    const checkInInput = addBookingModal.querySelector('#check-in-date');
    const checkOutInput = addBookingModal.querySelector('#check-out-date');
    
    if (checkInInput && checkOutInput) {
        checkInInput.value = selectedDate.toISOString().split('T')[0];
        
        // Set check-out to next day by default
        const nextDay = new Date(selectedDate);
        nextDay.setDate(nextDay.getDate() + 1);
        checkOutInput.value = nextDay.toISOString().split('T')[0];
    }
    
    // Show the modal
    const bsModal = new bootstrap.Modal(addBookingModal);
    bsModal.show();
    
    // Add event listener for form submission
    const form = addBookingModal.querySelector('form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // In a real application, you'd save this data to your backend
            showNotification('Booking added successfully!', 'success');
            
            // Close the modal
            bsModal.hide();
            
            // Update calendar (in a real app, you'd fetch fresh data)
            const calendarContainer = document.getElementById('room-availability-calendar');
            if (calendarContainer) {
                const cell = calendarContainer.querySelector(`[data-room="${roomNumber}"][data-day="${day}"]`);
                if (cell) {
                    cell.classList.remove('available');
                    cell.classList.add('booked', 'check-in');
                    cell.dataset.status = 'booked';
                }
            }
        });
    }
}

function getRandomName() {
    const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Lisa', 'Robert', 'Emily', 'Thomas', 'Maria', 'Sofia', 'James'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Garcia', 'Rodriguez', 'Wilson', 'Anderson', 'Taylor'];
    
    return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
}

function getRandomStatus() {
    const statuses = ['Confirmed', 'Checked In', 'Completed'];
    return statuses[Math.floor(Math.random() * statuses.length)];
}

function getRoomTypeByNumber(roomNumber) {
    const num = parseInt(roomNumber);
    if (num >= 100 && num < 200) return 'Deluxe King';
    if (num >= 200 && num < 300) return 'Deluxe Twin';
    if (num >= 300 && num < 400) return 'Ocean View';
    if (num >= 400 && num < 500) return 'Suite';
    return 'Presidential';
}

function initializeGuestInsights() {
    // Initialize guest insights features
    // Αφαιρέθηκε: initializeFeedbackDashboard();
}

// Initialize Hotel Map Functionality
function initializeHotelMap() {
    const floorSelectors = document.querySelectorAll('input[name="floor-selector"]');
    
    if (floorSelectors.length > 0) {
        floorSelectors.forEach(selector => {
            selector.addEventListener('change', function() {
                if (this.checked) {
                    const floorNumber = this.id.split('-')[1];
                    switchFloor(floorNumber);
                }
            });
        });
    }
    
    // Handle map search
    const mapSearchBtn = document.getElementById('map-search-btn');
    const mapSearch = document.getElementById('map-search');
    const directionsPanel = document.getElementById('directions-panel');
    const destinationName = document.getElementById('destination-name');
    
    if (mapSearchBtn && mapSearch && directionsPanel && destinationName) {
        mapSearchBtn.addEventListener('click', function() {
            const searchTerm = mapSearch.value.trim().toLowerCase();
            
            if (searchTerm) {
                // Simple search functionality
                let found = false;
                const poiMapping = {
                    'restaurant': { floor: '1', name: 'Restaurant' },
                    'lobby': { floor: '1', name: 'Lobby' },
                    'pool': { floor: '1', name: 'Swimming Pool' },
                    'gym': { floor: '2', name: 'Fitness Center' },
                    'spa': { floor: '2', name: 'Spa & Wellness' },
                    'parking': { floor: '0', name: 'Parking Garage' },
                    'shops': { floor: '0', name: 'Shopping Area' }
                };
                
                for (const [poi, details] of Object.entries(poiMapping)) {
                    if (poi.includes(searchTerm) || details.name.toLowerCase().includes(searchTerm)) {
                        // Switch to the appropriate floor
                        const floorSelector = document.getElementById(`floor-${details.floor}`);
                        if (floorSelector) {
                            floorSelector.checked = true;
                            switchFloor(details.floor);
                        }
                        
                        // Show directions panel
                        directionsPanel.classList.remove('d-none');
                        destinationName.textContent = details.name;
                        
                        // Highlight the POI marker by adding a pulse animation class
                        const marker = document.querySelector(`.map-marker[data-poi="${poi}"]`);
                        if (marker) {
                            // First remove pulse from all markers
                            document.querySelectorAll('.map-marker i').forEach(icon => {
                                icon.classList.remove('pulse-animation');
                            });
                            
                            // Add pulse to the found marker
                            marker.querySelector('i').classList.add('pulse-animation');
                        }
                        
                        found = true;
                        break;
                    }
                }
                
                if (!found) {
                    directionsPanel.classList.add('d-none');
                    showNotification('Location not found. Try another search term.', 'warning');
                }
            }
        });
        
        // Handle enter key in search box
        mapSearch.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                mapSearchBtn.click();
            }
        });
        
        // Start navigation button
        const startNavigationBtn = document.getElementById('start-navigation-btn');
        if (startNavigationBtn) {
            startNavigationBtn.addEventListener('click', function() {
                showNotification('Navigation started. Follow the directions to reach your destination.', 'info');
                
                // Close map modal and show a toast with navigation instructions
                const mapModal = document.getElementById('hotelMapModal');
                if (mapModal) {
                    const bsModal = bootstrap.Modal.getInstance(mapModal);
                    if (bsModal) {
                        bsModal.hide();
                    }
                }
                
                // Show a toast with the first navigation instruction
                const destination = destinationName.textContent;
                showCustomToast('Navigation', `Follow directions to ${destination}`, 'info');
            });
        }
    }
    
    // Add click handlers for map markers
    const mapMarkers = document.querySelectorAll('.map-marker');
    if (mapMarkers.length > 0) {
        mapMarkers.forEach(marker => {
            marker.addEventListener('click', function() {
                const poi = this.dataset.poi;
                const poiName = poi.charAt(0).toUpperCase() + poi.slice(1);
                
                // Show a tooltip with information about the POI
                showNotification(`Selected: ${poiName}`, 'info');
                
                // Show directions panel
                if (directionsPanel && destinationName) {
                    directionsPanel.classList.remove('d-none');
                    destinationName.textContent = poiName;
                }
                
                // Add pulse animation to the clicked marker
                document.querySelectorAll('.map-marker i').forEach(icon => {
                    icon.classList.remove('pulse-animation');
                });
                this.querySelector('i').classList.add('pulse-animation');
            });
        });
    }
}

// Helper function to switch floor in the map
function switchFloor(floorNumber) {
    // Hide all floor maps
    const floorMaps = document.querySelectorAll('.floor-map');
    if (floorMaps.length > 0) {
        floorMaps.forEach(map => {
            map.classList.add('d-none');
        });
    }
    
    // Show the selected floor map
    const selectedMap = document.getElementById(`floor-map-${floorNumber}`);
    if (selectedMap) {
        selectedMap.classList.remove('d-none');
    }
}

// Initialize Virtual Tour Functionality
function initializeVirtualTour() {
    const tourLocationSelector = document.getElementById('tour-location-selector');
    const tourImage = document.getElementById('tour-image');
    
    if (tourLocationSelector && tourImage) {
        tourLocationSelector.addEventListener('change', function() {
            const location = this.value;
            
            // Change the image based on selected location
            tourImage.src = `img/virtual-tour-${location}.jpg`;
            showNotification(`Viewing ${location} area`, 'info');
            
            // Update hotspots based on location
            updateTourHotspots(location);
        });
    }
    
    // Add click handlers for tour navigation buttons
    const tourNavBtns = document.querySelectorAll('.tour-nav-btn');
    if (tourNavBtns.length > 0) {
        tourNavBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const direction = this.dataset.direction;
                rotateTourView(direction);
            });
        });
    }
    
    // Add click handlers for tour hotspots
    const tourHotspots = document.querySelectorAll('.tour-hotspot');
    if (tourHotspots.length > 0) {
        tourHotspots.forEach(hotspot => {
            hotspot.addEventListener('click', function() {
                const target = this.dataset.target;
                showHotspotInfo(target);
            });
        });
    }
}

// Helper function to rotate tour view
function rotateTourView(direction) {
    const tourImage = document.getElementById('tour-image');
    const tourLocationSelector = document.getElementById('tour-location-selector');
    
    if (tourImage && tourLocationSelector) {
        const currentLocation = tourLocationSelector.value;
        const locations = ['lobby', 'pool', 'restaurant', 'spa', 'garden', 'suite'];
        
        // Find current index
        const currentIndex = locations.indexOf(currentLocation);
        
        // Calculate new index based on direction
        let newIndex;
        if (direction === 'left') {
            newIndex = (currentIndex - 1 + locations.length) % locations.length;
        } else {
            newIndex = (currentIndex + 1) % locations.length;
        }
        
        // Update selector and trigger change event
        tourLocationSelector.value = locations[newIndex];
        tourLocationSelector.dispatchEvent(new Event('change'));
    }
}

// Helper function to update tour hotspots based on location
function updateTourHotspots(location) {
    // This function would dynamically update the hotspots based on the location
    // For now, we'll just log the action
    console.log(`Updating hotspots for ${location}`);
}

// Helper function to show hotspot information
function showHotspotInfo(target) {
    // This function would show information about the hotspot
    showCustomToast('Information', `Details about ${target}`, 'info');
}

// Initialize Service Tracker
function initializeServiceTracker() {
    // Handle dismiss service button
    const dismissButtons = document.querySelectorAll('.dismiss-service-btn');
    if (dismissButtons.length > 0) {
        dismissButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const serviceId = this.dataset.serviceId;
                const serviceCard = document.querySelector(`.active-service-card[data-service-id="${serviceId}"]`);
                
                if (serviceCard) {
                    // Animate removal
                    serviceCard.style.opacity = '0';
                    serviceCard.style.transform = 'translateX(100%)';
                    serviceCard.style.transition = 'all 0.3s ease';
                    
                    setTimeout(() => {
                        serviceCard.remove();
                        
                        // Update badge count
                        updateServiceBadgeCount();
                        
                        // Check if there are any active orders left
                        checkActiveOrders();
                    }, 300);
                }
            });
        });
    }
    
    // Handle contact service button
    const contactButtons = document.querySelectorAll('.contact-service-btn');
    if (contactButtons.length > 0) {
        contactButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const service = this.dataset.service;
                
                // Close service tracker modal
                const serviceTrackerModal = document.getElementById('serviceTrackerModal');
                if (serviceTrackerModal) {
                    const bsModal = bootstrap.Modal.getInstance(serviceTrackerModal);
                    if (bsModal) {
                        bsModal.hide();
                    }
                }
                
                // Simulate switching to chat tab and prefilling message
                setTimeout(() => {
                    const conciergeTab = document.querySelector('.mobile-nav-item[data-tab="concierge"]');
                    if (conciergeTab) {
                        conciergeTab.click();
                        
                        // Prefill the chat input
                        const chatInput = document.getElementById('global-chat-input');
                        if (chatInput) {
                            chatInput.value = `I have a question about my ${service} order`;
                            chatInput.focus();
                        }
                    }
                }, 300);
            });
        });
    }
    
    // Handle order again buttons
    const orderAgainButtons = document.querySelectorAll('.order-again-btn');
    if (orderAgainButtons.length > 0) {
        orderAgainButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const orderId = this.dataset.orderId;
                
                // Close the service tracker modal
                const serviceTrackerModal = document.getElementById('serviceTrackerModal');
                if (serviceTrackerModal) {
                    const bsModal = bootstrap.Modal.getInstance(serviceTrackerModal);
                    if (bsModal) {
                        bsModal.hide();
                    }
                }
                
                // Open the room service modal
                setTimeout(() => {
                    const roomServiceModal = new bootstrap.Modal(document.getElementById('roomServiceModal'));
                    roomServiceModal.show();
                }, 300);
                
                // Show confirmation notification
                showNotification('Previous order loaded', 'success');
            });
        });
    }
    
    // Handle rating stars
    const ratingStars = document.querySelectorAll('.rating-star');
    if (ratingStars.length > 0) {
        ratingStars.forEach(star => {
            star.addEventListener('mouseenter', function() {
                const rating = parseInt(this.dataset.rating);
                const stars = this.parentElement.querySelectorAll('.rating-star');
                
                stars.forEach((s, index) => {
                    if (index < rating) {
                        s.classList.remove('bi-star');
                        s.classList.add('bi-star-fill', 'text-warning');
                    } else {
                        s.classList.remove('bi-star-fill', 'text-warning');
                        s.classList.add('bi-star');
                    }
                });
            });
            
            star.addEventListener('mouseleave', function() {
                const stars = this.parentElement.querySelectorAll('.rating-star');
                const ratedStars = this.parentElement.querySelectorAll('.rating-star.rated');
                
                if (ratedStars.length === 0) {
                    stars.forEach(s => {
                        s.classList.remove('bi-star-fill', 'text-warning');
                        s.classList.add('bi-star');
                    });
                }
            });
            
            star.addEventListener('click', function() {
                const rating = parseInt(this.dataset.rating);
                const stars = this.parentElement.querySelectorAll('.rating-star');
                
                stars.forEach((s, index) => {
                    s.classList.remove('rated');
                    if (index < rating) {
                        s.classList.remove('bi-star');
                        s.classList.add('bi-star-fill', 'text-warning', 'rated');
                    } else {
                        s.classList.remove('bi-star-fill', 'text-warning');
                        s.classList.add('bi-star');
                    }
                });
                
                // Show thank you message after rating
                const ratingCard = this.closest('.card');
                if (ratingCard) {
                    setTimeout(() => {
                        ratingCard.innerHTML = `
                            <div class="card-body p-2 text-center">
                                <i class="bi bi-check-circle-fill text-success fs-3 mb-2"></i>
                                <p class="mb-0">Thank you for your feedback!</p>
                            </div>
                        `;
                        
                        // Auto dismiss after 3 seconds
                        setTimeout(() => {
                            const serviceCard = ratingCard.closest('.active-service-card');
                            if (serviceCard) {
                                const dismissBtn = serviceCard.querySelector('.dismiss-service-btn');
                                if (dismissBtn) {
                                    dismissBtn.click();
                                }
                            }
                        }, 3000);
                    }, 500);
                }
            });
        });
    }
    
    // Handle tab navigation
    const orderTabs = document.querySelectorAll('#orderTabs .nav-link');
    if (orderTabs.length > 0) {
        orderTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                // Update the active tab
                orderTabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                // Show the corresponding content
                const targetId = this.getAttribute('data-bs-target');
                const tabContents = document.querySelectorAll('#orderTabsContent .tab-pane');
                
                tabContents.forEach(content => {
                    content.classList.remove('show', 'active');
                    if (content.id === targetId.replace('#', '')) {
                        content.classList.add('show', 'active');
                    }
                });
            });
        });
    }
    
    // Initialize the modal and ensure tabs work properly when modal opens
    const serviceTrackerModal = document.getElementById('serviceTrackerModal');
    if (serviceTrackerModal) {
        serviceTrackerModal.addEventListener('shown.bs.modal', function() {
            // Make sure empty state message displays correctly
            checkActiveOrders();
        });
    }
    
    // Simulate real-time updates to orders
    setTimeout(() => {
        simulateOrderUpdate();
    }, 10000);
    
    // Initial badge count
    updateServiceBadgeCount();
    
    // Check if there are any active orders
    checkActiveOrders();
}

// Helper function to update service badge count
function updateServiceBadgeCount() {
    const badges = document.querySelectorAll('.service-tracker-badge');
    const activeCards = document.querySelectorAll('.active-service-card');
    
    if (badges.length > 0) {
        const count = activeCards.length;
        badges.forEach(badge => {
            badge.textContent = count;
            
            if (count === 0) {
                badge.style.display = 'none';
            } else {
                badge.style.display = '';
            }
        });
    }
    
    // Also update the button badge in the service tab
    const serviceCardButton = document.querySelector('.service-status-card .btn');
    if (serviceCardButton) {
        const cardBadge = serviceCardButton.querySelector('.service-tracker-badge');
        if (cardBadge) {
            cardBadge.textContent = activeCards.length;
            
            if (activeCards.length === 0) {
                cardBadge.style.display = 'none';
            } else {
                cardBadge.style.display = '';
            }
        }
    }
}

// Helper function to check if there are any active orders
function checkActiveOrders() {
    const activeCards = document.querySelectorAll('.active-service-card');
    const noActiveOrders = document.getElementById('no-active-orders');
    
    if (noActiveOrders) {
        if (activeCards.length === 0) {
            noActiveOrders.classList.remove('d-none');
        } else {
            noActiveOrders.classList.add('d-none');
        }
    }
}

// Simulate order updates for demonstration
function simulateOrderUpdate() {
    // Find the room service order
    const roomServiceOrder = document.querySelector('.active-service-card[data-service-id="rs-123456"]');
    
    if (roomServiceOrder) {
        // Update progress
        const progressBar = roomServiceOrder.querySelector('.progress-bar');
        const onTheWayStep = roomServiceOrder.querySelector('.progress-step[data-step="on-way"]');
        const deliveredStep = roomServiceOrder.querySelector('.progress-step[data-step="delivered"]');
        
        if (progressBar && deliveredStep) {
            // Update progress bar to 100%
            progressBar.style.width = '100%';
            progressBar.setAttribute('aria-valuenow', '100');
            progressBar.classList.remove('bg-primary');
            progressBar.classList.add('bg-success');
            
            // Update steps
            if (onTheWayStep) {
                onTheWayStep.classList.remove('active');
                onTheWayStep.classList.add('completed');
                onTheWayStep.querySelector('i').className = 'bi bi-check-circle-fill';
            }
            
            if (deliveredStep) {
                // Don't add 'active' class to avoid spinning animation
                deliveredStep.classList.add('completed');
                deliveredStep.querySelector('i').className = 'bi bi-check-circle-fill';
            }
            
            // Update status badge
            const badge = roomServiceOrder.querySelector('.badge');
            if (badge) {
                badge.classList.remove('bg-primary');
                badge.classList.add('bg-success');
                badge.textContent = 'Delivered';
            }
            
            // Update estimated time
            const estimatedTime = roomServiceOrder.querySelector('.estimated-time');
            if (estimatedTime) {
                estimatedTime.innerHTML = '<i class="bi bi-check-circle me-1"></i> Delivered at ' + getCurrentTime();
            }
            
            // Show notification
            showCustomToast('Room Service Update', 'Your order has been delivered to your room.', 'success');
        }
    }
}

// Helper function to get current time in HH:MM format
function getCurrentTime() {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    
    // Format with leading zeros
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    
    return hours + ':' + minutes;
}

// Show custom toast notification
function showCustomToast(title, message, type = 'primary') {
    const toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) return;
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    toast.setAttribute('data-type', type); // Add type as data attribute for styling
    
    // Set toast content
    toast.innerHTML = `
        <div class="toast-header">
            <i class="bi bi-bell-fill me-2 text-${type}"></i>
            <strong class="me-auto">${title}</strong>
            <small class="text-muted">just now</small>
            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
            ${message}
        </div>
    `;
    
    // Add toast to container
    toastContainer.appendChild(toast);
    
    // Initialize and show toast
    const bsToast = new bootstrap.Toast(toast, {
        autohide: true,
        delay: 5000
    });
    bsToast.show();
    
    // Remove toast from DOM after it's hidden
    toast.addEventListener('hidden.bs.toast', function() {
        toast.remove();
    });
}

// Task Management Functionality
function initializeTaskManagement() {
    // Handle task checkbox clicks
    const taskCheckboxes = document.querySelectorAll('.task-list .form-check-input');
    taskCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const taskLabel = this.nextElementSibling;
            if (this.checked) {
                // Strikethrough text when checked
                taskLabel.classList.add('text-decoration-line-through', 'text-muted');
                // Show success toast
                showCustomToast('Task Completed', `Task "${taskLabel.textContent}" marked as complete`, 'success');
            } else {
                // Remove strikethrough when unchecked
                taskLabel.classList.remove('text-decoration-line-through', 'text-muted');
            }
        });
    });

    // Handle Add Task button in modal
    const addTaskModal = document.getElementById('addTaskModal');
    if (addTaskModal) {
        const addTaskBtn = addTaskModal.querySelector('.modal-footer .btn-primary');
        const taskTitleInput = document.getElementById('taskTitle');
        const taskPrioritySelect = document.getElementById('taskPriority');
        const taskAssigneeSelect = document.getElementById('taskAssignee');
        
        addTaskBtn.addEventListener('click', function() {
            if (!taskTitleInput.value.trim()) {
                // Show error if no title is provided
                showCustomToast('Error', 'Please enter a task title', 'danger');
                return;
            }
            
            // Create new task element
            addNewTask(
                taskTitleInput.value,
                taskPrioritySelect.value,
                taskAssigneeSelect.options[taskAssigneeSelect.selectedIndex].text
            );
            
            // Reset form and close modal
            taskTitleInput.value = '';
            const bsModal = bootstrap.Modal.getInstance(addTaskModal);
            bsModal.hide();
            
            // Show success notification
            showCustomToast('Task Added', 'New task has been added successfully', 'success');
        });
    }
}

function addNewTask(title, priority, assignee) {
    const taskList = document.querySelector('.task-list');
    if (!taskList) return;
    
    // Generate unique ID for the new task
    const taskId = 'task-' + Date.now();
    
    // Create new task list item
    const newTaskItem = document.createElement('li');
    newTaskItem.className = 'list-group-item d-flex justify-content-between align-items-center';
    
    // Set priority badge color
    let badgeClass;
    switch(priority) {
        case 'high':
            badgeClass = 'bg-danger';
            break;
        case 'medium':
            badgeClass = 'bg-warning';
            break;
        case 'low':
        default:
            badgeClass = 'bg-info';
            break;
    }
    
    // Set task content with checkbox and label
    newTaskItem.innerHTML = `
        <div class="form-check">
            <input class="form-check-input" type="checkbox" value="" id="${taskId}">
            <label class="form-check-label" for="${taskId}">${title}</label>
            ${assignee !== 'Select Staff Member' ? `<span class="ms-2 small text-muted">(${assignee})</span>` : ''}
        </div>
        <span class="badge ${badgeClass} rounded-pill">${priority.charAt(0).toUpperCase() + priority.slice(1)}</span>
    `;
    
    // Add task to the beginning of the list
    taskList.insertBefore(newTaskItem, taskList.firstChild);
    
    // Add event listener to the new checkbox
    const newCheckbox = newTaskItem.querySelector('.form-check-input');
    newCheckbox.addEventListener('change', function() {
        const taskLabel = this.nextElementSibling;
        if (this.checked) {
            taskLabel.classList.add('text-decoration-line-through', 'text-muted');
            showCustomToast('Task Completed', `Task "${taskLabel.textContent}" marked as complete`, 'success');
        } else {
            taskLabel.classList.remove('text-decoration-line-through', 'text-muted');
        }
    });
}

// Check-in/Check-out Toggle Functionality
function initializeCheckInOutToggle() {
    const btnGroup = document.querySelector('.arrivals-departures .btn-group');
    if (!btnGroup) return;
    
    const todayBtn = btnGroup.querySelector('button:first-child');
    const tomorrowBtn = btnGroup.querySelector('button:last-child');
    
    todayBtn.addEventListener('click', function() {
        todayBtn.classList.add('active');
        tomorrowBtn.classList.remove('active');
        updateCheckInOutData('today');
    });
    
    tomorrowBtn.addEventListener('click', function() {
        tomorrowBtn.classList.add('active');
        todayBtn.classList.remove('active');
        updateCheckInOutData('tomorrow');
    });
}

function updateCheckInOutData(day) {
    // This would typically fetch data from an API
    // For demo purposes, we're using static data
    
    const checkInsTable = document.querySelector('.arrivals-departures h6:first-of-type + .table-responsive table tbody');
    const checkOutsTable = document.querySelector('.arrivals-departures h6:last-of-type + .table-responsive table tbody');
    
    if (!checkInsTable || !checkOutsTable) return;
    
    // Sample data for demo purposes
    const data = {
        today: {
            checkIns: [
                { guest: 'Emma Rodriguez', room: '401', time: '14:00', status: 'Expected' },
                { guest: 'Thomas Smith', room: '205', time: '15:30', status: 'Confirmed' },
                { guest: 'Lisa Johnson', room: '310', time: '16:00', status: 'Early' }
            ],
            checkOuts: [
                { guest: 'James Wilson', room: '512', time: '11:00', status: 'Completed' },
                { guest: 'Sarah Chen', room: '305', time: '12:00', status: 'In Progress' },
                { guest: 'Robert Davis', room: '210', time: '12:00', status: 'Late' }
            ]
        },
        tomorrow: {
            checkIns: [
                { guest: 'Michael Brown', room: '405', time: '13:00', status: 'Confirmed' },
                { guest: 'Jennifer Taylor', room: '208', time: '14:00', status: 'Expected' },
                { guest: 'David Garcia', room: '312', time: '16:30', status: 'Expected' },
                { guest: 'Maria Lopez', room: '501', time: '15:00', status: 'VIP' }
            ],
            checkOuts: [
                { guest: 'William Clark', room: '410', time: '10:00', status: 'Expected' },
                { guest: 'Elizabeth Wright', room: '307', time: '11:00', status: 'Expected' },
                { guest: 'Joseph Martin', room: '215', time: '10:30', status: 'Expected' }
            ]
        }
    };
    
    // Get the data for the selected day
    const selectedData = data[day];
    
    // Update check-ins count in heading
    document.querySelector('.arrivals-departures h6:first-of-type').innerHTML = 
        `<i class="bi bi-box-arrow-in-right me-2"></i>Check-ins (${selectedData.checkIns.length})`;
    
    // Update check-outs count in heading
    document.querySelector('.arrivals-departures h6:last-of-type').innerHTML = 
        `<i class="bi bi-box-arrow-right me-2"></i>Check-outs (${selectedData.checkOuts.length})`;
    
    // Update check-ins table
    checkInsTable.innerHTML = '';
    selectedData.checkIns.forEach(item => {
        const statusClass = getStatusClass(item.status);
        checkInsTable.innerHTML += `
            <tr>
                <td>${item.guest}</td>
                <td>${item.room}</td>
                <td>${item.time}</td>
                <td><span class="badge ${statusClass}">${item.status}</span></td>
            </tr>
        `;
    });
    
    // Update check-outs table
    checkOutsTable.innerHTML = '';
    selectedData.checkOuts.forEach(item => {
        const statusClass = getStatusClass(item.status);
        checkOutsTable.innerHTML += `
            <tr>
                <td>${item.guest}</td>
                <td>${item.room}</td>
                <td>${item.time}</td>
                <td><span class="badge ${statusClass}">${item.status}</span></td>
            </tr>
        `;
    });
}

function getStatusClass(status) {
    switch(status) {
        case 'Confirmed':
        case 'VIP':
            return 'bg-success';
        case 'Expected':
            return 'bg-info';
        case 'In Progress':
            return 'bg-info';
        case 'Completed':
            return 'bg-secondary';
        case 'Early':
            return 'bg-warning';
        case 'Late':
            return 'bg-warning';
        default:
            return 'bg-secondary';
    }
}

// Weather Forecast Functionality
function initializeWeatherForecast() {
    // In a real application, this would fetch data from a weather API
    // For demo purposes, we're using static data
    
    // Mock API call
    fetchWeatherData('Athens')
        .then(data => {
            updateWeatherUI(data);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });
}

function fetchWeatherData(city) {
    // This is a mock function that simulates an API call
    // In a real application, you would make an actual API request to a weather service
    
    return new Promise((resolve) => {
        // Simulate API response delay
        setTimeout(() => {
            // Sample weather data
            const weatherData = {
                current: {
                    temperature: 24,
                    condition: 'Sunny',
                    icon: 'bi-brightness-high-fill',
                    humidity: 45,
                    wind: 10
                },
                forecast: [
                    { day: 'Tue', temperature: 25, icon: 'bi-sun', condition: 'Sunny' },
                    { day: 'Wed', temperature: 23, icon: 'bi-cloud-sun', condition: 'Partly Cloudy' },
                    { day: 'Thu', temperature: 21, icon: 'bi-cloud', condition: 'Cloudy' },
                    { day: 'Fri', temperature: 19, icon: 'bi-cloud-drizzle', condition: 'Light Rain' },
                    { day: 'Sat', temperature: 22, icon: 'bi-sun', condition: 'Sunny' }
                ]
            };
            resolve(weatherData);
        }, 500);
    });
}

function updateWeatherUI(data) {
    // Update current weather
    const currentWeatherIcon = document.querySelector('.current-weather .weather-icon i');
    const currentTemp = document.querySelector('.weather-info h2');
    const currentCondition = document.querySelector('.weather-info p');
    const humidity = document.querySelector('.weather-details div:first-child');
    const wind = document.querySelector('.weather-details div:last-child');
    
    if (currentWeatherIcon) currentWeatherIcon.className = data.current.icon + ' fs-1 text-warning';
    if (currentTemp) currentTemp.textContent = `${data.current.temperature}°C`;
    if (currentCondition) currentCondition.textContent = `${data.current.condition}, Athens`;
    if (humidity) humidity.innerHTML = `<i class="bi bi-moisture me-1"></i> Humidity: ${data.current.humidity}%`;
    if (wind) wind.innerHTML = `<i class="bi bi-wind me-1"></i> Wind: ${data.current.wind} km/h`;
    
    // Update forecast
    const forecastDays = document.querySelectorAll('.forecast-day');
    if (forecastDays.length > 0) {
        forecastDays.forEach((forecastDay, index) => {
            if (index < data.forecast.length) {
                const dayElement = forecastDay.querySelector('.day');
                const iconElement = forecastDay.querySelector('div:nth-child(2) i');
                const tempElement = forecastDay.querySelector('.temp');
                
                if (dayElement) dayElement.textContent = data.forecast[index].day;
                if (iconElement) {
                    iconElement.className = data.forecast[index].icon;
                    iconElement.classList.add('fs-4');
                    
                    // Add appropriate color class
                    if (data.forecast[index].icon.includes('sun')) {
                        iconElement.classList.add('text-warning');
                    } else if (data.forecast[index].icon.includes('cloud-drizzle') || 
                               data.forecast[index].icon.includes('cloud-rain')) {
                        iconElement.classList.add('text-primary');
                    } else if (data.forecast[index].icon.includes('cloud')) {
                        iconElement.classList.add('text-secondary');
                    }
                }
                if (tempElement) tempElement.textContent = `${data.forecast[index].temperature}°C`;
            }
        });
    }
} 