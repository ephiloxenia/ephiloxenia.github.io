document.addEventListener('DOMContentLoaded', function() {
    initializeCharts();
});

function initializeCharts() {
    // Initialize all charts based on what's available on the page
    createOccupancyChart();
    createRevenueChart();
    createGuestSatisfactionChart();
    createBookingSourceChart();
    createRoomTypeDistributionChart();
    createForecastChart();
    createRoomStatusChart();
}

function createOccupancyChart() {
    const ctx = document.getElementById('occupancy-chart');
    if (!ctx) return;
    
    // Monthly occupancy data
    const occupancyData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
            label: 'This Year',
            data: [65, 59, 80, 81, 56, 85, 90, 95, 82, 75, 70, 78],
            borderColor: 'rgba(33, 150, 243, 1)',
            backgroundColor: 'rgba(33, 150, 243, 0.2)',
            borderWidth: 2,
            tension: 0.4,
            fill: true
        }, {
            label: 'Last Year',
            data: [62, 55, 75, 78, 52, 80, 87, 90, 78, 70, 65, 73],
            borderColor: 'rgba(150, 150, 150, 0.7)',
            backgroundColor: 'rgba(150, 150, 150, 0.1)',
            borderWidth: 2,
            borderDash: [5, 5],
            tension: 0.4,
            fill: true
        }]
    };
    
    new Chart(ctx, {
        type: 'line',
        data: occupancyData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.parsed.y + '%';
                        }
                    }
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

function createRevenueChart() {
    const ctx = document.getElementById('revenue-chart');
    if (!ctx) return;
    
    // Monthly revenue data in thousands
    const revenueData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
            label: 'Revenue',
            data: [12500, 19000, 15000, 16000, 14000, 18000, 22000, 25000, 20000, 18000, 16000, 19000],
            backgroundColor: 'rgba(76, 175, 80, 0.6)',
            borderColor: 'rgba(76, 175, 80, 1)',
            borderWidth: 1
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
                    display: false,
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return 'Revenue: €' + context.parsed.y.toLocaleString();
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '€' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

function createGuestSatisfactionChart() {
    const ctx = document.getElementById('guest-satisfaction-chart');
    if (!ctx) return;
    
    // Guest satisfaction data by category
    const satisfactionData = {
        labels: ['Cleanliness', 'Service', 'Amenities', 'Value', 'Location', 'Overall'],
        datasets: [{
            label: 'Guest Rating',
            data: [4.7, 4.5, 4.3, 4.2, 4.8, 4.6],
            backgroundColor: [
                'rgba(33, 150, 243, 0.7)',
                'rgba(33, 150, 243, 0.7)',
                'rgba(33, 150, 243, 0.7)',
                'rgba(33, 150, 243, 0.7)',
                'rgba(33, 150, 243, 0.7)',
                'rgba(33, 150, 243, 0.7)'
            ],
            borderColor: [
                'rgba(33, 150, 243, 1)',
                'rgba(33, 150, 243, 1)',
                'rgba(33, 150, 243, 1)',
                'rgba(33, 150, 243, 1)',
                'rgba(33, 150, 243, 1)',
                'rgba(33, 150, 243, 1)'
            ],
            borderWidth: 1
        }]
    };
    
    new Chart(ctx, {
        type: 'bar',
        data: satisfactionData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: {
                legend: {
                    display: false,
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return 'Rating: ' + context.parsed.x + '/5';
                        }
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    max: 5,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

function createBookingSourceChart() {
    const ctx = document.getElementById('booking-source-chart');
    if (!ctx) return;
    
    // Booking source distribution
    const bookingSourceData = {
        labels: ['Direct', 'OTA', 'Travel Agent', 'Phone', 'Walk-in', 'Other'],
        datasets: [{
            data: [35, 40, 10, 8, 5, 2],
            backgroundColor: [
                'rgba(33, 150, 243, 0.7)',
                'rgba(76, 175, 80, 0.7)',
                'rgba(255, 193, 7, 0.7)',
                'rgba(156, 39, 176, 0.7)',
                'rgba(244, 67, 54, 0.7)',
                'rgba(96, 125, 139, 0.7)'
            ],
            borderColor: [
                'rgba(33, 150, 243, 1)',
                'rgba(76, 175, 80, 1)',
                'rgba(255, 193, 7, 1)',
                'rgba(156, 39, 176, 1)',
                'rgba(244, 67, 54, 1)',
                'rgba(96, 125, 139, 1)'
            ],
            borderWidth: 1
        }]
    };
    
    new Chart(ctx, {
        type: 'doughnut',
        data: bookingSourceData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.parsed + '%';
                        }
                    }
                }
            }
        }
    });
}

function createRoomTypeDistributionChart() {
    const ctx = document.getElementById('room-type-chart');
    if (!ctx) return;
    
    // Room type distribution
    const roomTypeData = {
        labels: ['Standard', 'Deluxe', 'Suite', 'Family', 'Premium'],
        datasets: [{
            data: [45, 25, 15, 10, 5],
            backgroundColor: [
                'rgba(33, 150, 243, 0.7)',
                'rgba(76, 175, 80, 0.7)',
                'rgba(255, 193, 7, 0.7)',
                'rgba(156, 39, 176, 0.7)',
                'rgba(244, 67, 54, 0.7)'
            ],
            borderColor: [
                'rgba(33, 150, 243, 1)',
                'rgba(76, 175, 80, 1)',
                'rgba(255, 193, 7, 1)',
                'rgba(156, 39, 176, 1)',
                'rgba(244, 67, 54, 1)'
            ],
            borderWidth: 1
        }]
    };
    
    new Chart(ctx, {
        type: 'pie',
        data: roomTypeData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.parsed + '%';
                        }
                    }
                }
            }
        }
    });
}

function createForecastChart() {
    const ctx = document.getElementById('forecast-chart');
    if (!ctx) return;
    
    // Generate dates for the next 30 days
    const today = new Date();
    const labels = [];
    for (let i = 0; i < 30; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    }
    
    // Generate forecast data
    const occupancyForecast = [];
    const revenueForecast = [];
    let baseOccupancy = 70; // Starting point
    let baseRevenue = 5000; // Starting point
    
    for (let i = 0; i < 30; i++) {
        // Add some randomness to simulate real forecasts
        // Higher occupancy on weekends (assume today is any day and calculate forward)
        const dayOfWeek = (today.getDay() + i) % 7;
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        
        const randomVariation = Math.random() * 10 - 5;
        const weekendBoost = isWeekend ? 15 : 0;
        
        occupancyForecast.push(Math.min(100, Math.max(40, baseOccupancy + randomVariation + weekendBoost)));
        revenueForecast.push(baseRevenue * (1 + (occupancyForecast[i] - baseOccupancy) / 100) * (1 + Math.random() * 0.1 - 0.05));
    }
    
    const forecastData = {
        labels: labels,
        datasets: [{
            label: 'Occupancy Forecast (%)',
            data: occupancyForecast,
            borderColor: 'rgba(33, 150, 243, 1)',
            backgroundColor: 'rgba(33, 150, 243, 0.1)',
            borderWidth: 2,
            tension: 0.4,
            yAxisID: 'y',
            fill: true
        }, {
            label: 'Revenue Forecast (€)',
            data: revenueForecast,
            borderColor: 'rgba(76, 175, 80, 1)',
            backgroundColor: 'rgba(76, 175, 80, 0.0)',
            borderWidth: 2,
            tension: 0.4,
            yAxisID: 'y1',
            borderDash: [5, 5]
        }]
    };
    
    new Chart(ctx, {
        type: 'line',
        data: forecastData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            if (context.dataset.yAxisID === 'y') {
                                return 'Occupancy: ' + context.parsed.y.toFixed(1) + '%';
                            } else {
                                return 'Revenue: €' + context.parsed.y.toFixed(0);
                            }
                        }
                    }
                }
            },
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Occupancy (%)'
                    },
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    },
                    min: 0,
                    max: 100
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    grid: {
                        drawOnChartArea: false,
                    },
                    title: {
                        display: true,
                        text: 'Revenue (€)'
                    },
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

function createRoomStatusChart() {
    const ctx = document.getElementById('room-status-chart');
    if (!ctx) return;
    
    // Room status data
    const roomStatusData = {
        labels: ['Floor 1', 'Floor 2', 'Floor 3', 'Floor 4', 'Floor 5'],
        datasets: [
            {
                label: 'Occupied',
                data: [8, 12, 9, 7, 6],
                backgroundColor: 'rgba(40, 167, 69, 0.7)',
                borderColor: 'rgba(40, 167, 69, 1)',
                borderWidth: 1
            },
            {
                label: 'Available',
                data: [3, 4, 2, 3, 3],
                backgroundColor: 'rgba(220, 53, 69, 0.7)',
                borderColor: 'rgba(220, 53, 69, 1)',
                borderWidth: 1
            },
            {
                label: 'Maintenance',
                data: [1, 0, 1, 0, 1],
                backgroundColor: 'rgba(255, 193, 7, 0.7)',
                borderColor: 'rgba(255, 193, 7, 1)',
                borderWidth: 1
            },
            {
                label: 'Reserved',
                data: [2, 3, 2, 2, 1],
                backgroundColor: 'rgba(23, 162, 184, 0.7)',
                borderColor: 'rgba(23, 162, 184, 1)',
                borderWidth: 1
            },
            {
                label: 'Cleaning',
                data: [1, 2, 1, 0, 1],
                backgroundColor: 'rgba(108, 117, 125, 0.7)',
                borderColor: 'rgba(108, 117, 125, 1)',
                borderWidth: 1
            }
        ]
    };
    
    new Chart(ctx, {
        type: 'bar',
        data: roomStatusData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.parsed.y + ' rooms';
                        }
                    }
                }
            },
            scales: {
                x: {
                    stacked: true,
                },
                y: {
                    stacked: true,
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Rooms'
                    }
                }
            }
        }
    });
} 