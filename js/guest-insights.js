document.addEventListener('DOMContentLoaded', function() {
    initSectionNavigation();
    initGuestCharts();
});

function initSectionNavigation() {
    const sectionNav = document.querySelector('.section-nav');
    if (!sectionNav) return;

    // Add click event listeners to navigation buttons
    sectionNav.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const targetId = this.getAttribute('data-section');
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                // Remove active class from all buttons
                sectionNav.querySelectorAll('.btn').forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                this.classList.add('active');
                
                // Scroll to section with offset
                const offset = 80; // Adjust this value based on your header height
                const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Update active button based on scroll position
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('.section-id');
        const navButtons = sectionNav.querySelectorAll('.btn');
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
                currentSection = section.id;
            }
        });
        
        navButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-section') === currentSection) {
                btn.classList.add('active');
            }
        });
    });
}

function initGuestCharts() {
    // Guest Behavior Chart
    const behaviorCtx = document.getElementById('guest-behavior-chart');
    if (behaviorCtx) {
        new Chart(behaviorCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [
                    {
                        label: 'Booking Window',
                        data: [45, 42, 40, 38, 35, 32, 30, 28, 25, 22, 20, 18],
                        borderColor: '#0056b3',
                        backgroundColor: 'rgba(0, 86, 179, 0.1)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Length of Stay',
                        data: [3.2, 3.4, 3.6, 3.8, 4.0, 4.2, 4.4, 4.6, 4.4, 4.2, 4.0, 3.8],
                        borderColor: '#28a745',
                        backgroundColor: 'rgba(40, 167, 69, 0.1)',
                        tension: 0.4,
                        fill: true
                    }
                ]
            },
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
                        title: {
                            display: true,
                            text: 'Days'
                        }
                    }
                }
            }
        });
    }

    // Guest Demographics Chart
    const demographicsCtx = document.getElementById('guest-demographics-chart');
    if (demographicsCtx) {
        new Chart(demographicsCtx, {
            type: 'bar',
            data: {
                labels: ['18-24', '25-34', '35-44', '45-54', '55-64', '65+'],
                datasets: [
                    {
                        label: 'Current Period',
                        data: [8, 28, 35, 15, 9, 5],
                        backgroundColor: 'rgba(0, 86, 179, 0.8)',
                        borderColor: '#0056b3',
                        borderWidth: 1
                    },
                    {
                        label: 'Previous Period',
                        data: [7, 25, 32, 18, 11, 7],
                        backgroundColor: 'rgba(108, 117, 125, 0.8)',
                        borderColor: '#6c757d',
                        borderWidth: 1
                    }
                ]
            },
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
                        title: {
                            display: true,
                            text: 'Percentage'
                        },
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

    // Booking Channels Chart
    const channelsCtx = document.getElementById('booking-channels-chart');
    if (channelsCtx) {
        new Chart(channelsCtx, {
            type: 'doughnut',
            data: {
                labels: ['Direct', 'OTA', 'Travel Agent', 'Corporate', 'Other'],
                datasets: [{
                    data: [35, 25, 20, 15, 5],
                    backgroundColor: [
                        'rgba(0, 86, 179, 0.8)',
                        'rgba(40, 167, 69, 0.8)',
                        'rgba(255, 193, 7, 0.8)',
                        'rgba(220, 53, 69, 0.8)',
                        'rgba(108, 117, 125, 0.8)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right'
                    }
                }
            }
        });
    }

    // Guest Satisfaction Chart
    const satisfactionCtx = document.getElementById('satisfaction-chart');
    if (satisfactionCtx) {
        new Chart(satisfactionCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [
                    {
                        label: 'Overall Satisfaction',
                        data: [4.2, 4.3, 4.4, 4.5, 4.6, 4.7],
                        borderColor: '#0056b3',
                        backgroundColor: 'rgba(0, 86, 179, 0.1)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Service Quality',
                        data: [4.0, 4.1, 4.2, 4.3, 4.4, 4.5],
                        borderColor: '#28a745',
                        backgroundColor: 'rgba(40, 167, 69, 0.1)',
                        tension: 0.4,
                        fill: true
                    }
                ]
            },
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
                        max: 5,
                        title: {
                            display: true,
                            text: 'Rating'
                        }
                    }
                }
            }
        });
    }

    // Service Performance Chart
    const performanceCtx = document.getElementById('service-performance-chart');
    if (performanceCtx) {
        new Chart(performanceCtx, {
            type: 'bar',
            data: {
                labels: ['Front Desk', 'Housekeeping', 'Restaurant', 'Concierge', 'Spa'],
                datasets: [
                    {
                        label: 'Response Time (min)',
                        data: [2, 15, 8, 5, 10],
                        backgroundColor: 'rgba(0, 86, 179, 0.8)',
                        borderColor: '#0056b3',
                        borderWidth: 1
                    },
                    {
                        label: 'Target (min)',
                        data: [3, 20, 10, 7, 15],
                        backgroundColor: 'rgba(40, 167, 69, 0.8)',
                        borderColor: '#28a745',
                        borderWidth: 1
                    }
                ]
            },
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
                        title: {
                            display: true,
                            text: 'Minutes'
                        }
                    }
                }
            }
        });
    }

    // Guest Preferences Chart
    const preferencesCtx = document.getElementById('guest-preferences-chart');
    if (preferencesCtx) {
        new Chart(preferencesCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [
                    {
                        label: 'Room Preferences',
                        data: [85, 87, 89, 91, 93, 95],
                        borderColor: '#0056b3',
                        backgroundColor: 'rgba(0, 86, 179, 0.1)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Amenity Selection',
                        data: [80, 82, 85, 87, 90, 92],
                        borderColor: '#28a745',
                        backgroundColor: 'rgba(40, 167, 69, 0.1)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Communication Style',
                        data: [70, 72, 73, 74, 75, 75],
                        borderColor: '#ffc107',
                        backgroundColor: 'rgba(255, 193, 7, 0.1)',
                        tension: 0.4,
                        fill: true
                    }
                ]
            },
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
                        title: {
                            display: true,
                            text: 'Match Rate (%)'
                        },
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
    
    // Sentiment Trends Chart
    const sentimentCtx = document.getElementById('sentiment-chart');
    if (sentimentCtx) {
        new Chart(sentimentCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [
                    {
                        label: 'Positive',
                        data: [65, 68, 70, 72, 75, 78],
                        borderColor: '#28a745',
                        backgroundColor: 'rgba(40, 167, 69, 0.1)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Neutral',
                        data: [20, 18, 17, 15, 15, 12],
                        borderColor: '#ffc107',
                        backgroundColor: 'rgba(255, 193, 7, 0.1)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Negative',
                        data: [15, 14, 13, 13, 10, 10],
                        borderColor: '#dc3545',
                        backgroundColor: 'rgba(220, 53, 69, 0.1)',
                        tension: 0.4,
                        fill: true
                    }
                ]
            },
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
                        stacked: true,
                        title: {
                            display: true,
                            text: 'Percentage (%)'
                        },
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
    
    // Age Distribution Chart
    const ageDistributionCtx = document.getElementById('age-distribution-chart');
    if (ageDistributionCtx) {
        new Chart(ageDistributionCtx, {
            type: 'doughnut',
            data: {
                labels: ['18-24', '25-34', '35-44', '45-54', '55-64', '65+'],
                datasets: [{
                    data: [8, 28, 35, 15, 9, 5],
                    backgroundColor: [
                        'rgba(0, 86, 179, 0.8)',
                        'rgba(40, 167, 69, 0.8)',
                        'rgba(255, 193, 7, 0.8)',
                        'rgba(220, 53, 69, 0.8)',
                        'rgba(108, 117, 125, 0.8)',
                        'rgba(0, 123, 255, 0.8)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right'
                    }
                }
            }
        });
    }
    
    // Travel Purpose Chart
    const travelPurposeCtx = document.getElementById('travel-purpose-chart');
    if (travelPurposeCtx) {
        new Chart(travelPurposeCtx, {
            type: 'pie',
            data: {
                labels: ['Leisure', 'Business', 'Bleisure', 'Other'],
                datasets: [{
                    data: [65, 20, 12, 3],
                    backgroundColor: [
                        'rgba(40, 167, 69, 0.8)',
                        'rgba(0, 86, 179, 0.8)',
                        'rgba(255, 193, 7, 0.8)',
                        'rgba(108, 117, 125, 0.8)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            boxWidth: 12
                        }
                    }
                }
            }
        });
    }
}

// ... existing code ... 