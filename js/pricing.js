document.addEventListener('DOMContentLoaded', function() {
    initPricingEngine();
    initPricingCalendar();
    initPricingFactors();
    initPricingHistory();
});

function initPricingEngine() {
    // Initialize the pricing engine
    const applyBtn = document.getElementById('apply-pricing-btn');
    if (applyBtn) {
        applyBtn.addEventListener('click', function() {
            // Simulate applying the pricing changes
            showToast('Pricing rules updated successfully!', 'success');
            
            // Update the pricing chart with new values
            updatePricingChart();
        });
    }
    
    const toggleAutoBtn = document.getElementById('toggle-auto-pricing');
    if (toggleAutoBtn) {
        toggleAutoBtn.addEventListener('click', function() {
            const isAuto = this.getAttribute('data-auto') === 'true';
            if (isAuto) {
                this.setAttribute('data-auto', 'false');
                this.textContent = 'Enable Auto Pricing';
                this.classList.replace('btn-danger', 'btn-success');
                showToast('Automatic pricing disabled. You are now in manual mode.', 'warning');
            } else {
                this.setAttribute('data-auto', 'true');
                this.textContent = 'Disable Auto Pricing';
                this.classList.replace('btn-success', 'btn-danger');
                showToast('Automatic pricing enabled. AI will optimize your prices.', 'success');
            }
        });
    }
}

function initPricingCalendar() {
    const calendarEl = document.getElementById('pricing-calendar');
    if (!calendarEl) return;
    
    // Generate sample pricing data for the calendar
    const today = new Date();
    const events = [];
    
    // Generate 60 days of sample data
    for (let i = -10; i < 50; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        
        // Generate a price between €80 and €250
        const basePrice = Math.floor(Math.random() * (180 - 120 + 1)) + 120;
        const suggested = Math.floor(basePrice * (1 + (Math.random() * 0.3 - 0.1)));
        
        // Determine color based on occupancy
        const occupancy = Math.floor(Math.random() * 101);  // 0-100%
        let backgroundColor;
        if (occupancy < 30) {
            backgroundColor = '#f44336';  // Low occupancy - red
        } else if (occupancy < 70) {
            backgroundColor = '#ff9800';  // Medium occupancy - orange
        } else {
            backgroundColor = '#4caf50';  // High occupancy - green
        }
        
        events.push({
            title: `€${basePrice}`,
            start: date.toISOString().split('T')[0],
            backgroundColor: backgroundColor,
            extendedProps: {
                currentPrice: basePrice,
                suggestedPrice: suggested,
                occupancy: occupancy
            }
        });
    }
    
    // Initialize FullCalendar
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        events: events,
        height: 'auto',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek'
        },
        eventClick: function(info) {
            const props = info.event.extendedProps;
            showPricingModal(
                info.event.start,
                props.currentPrice,
                props.suggestedPrice,
                props.occupancy
            );
        }
    });
    
    calendar.render();
}

function showPricingModal(date, currentPrice, suggestedPrice, occupancy) {
    // Format the date
    const formattedDate = date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Get the modal elements
    const modal = new bootstrap.Modal(document.getElementById('pricing-modal'));
    
    // Update modal content
    document.getElementById('pricing-modal-date').textContent = formattedDate;
    document.getElementById('pricing-modal-current').textContent = `€${currentPrice}`;
    document.getElementById('pricing-modal-suggested').textContent = `€${suggestedPrice}`;
    document.getElementById('pricing-modal-occupancy').textContent = `${occupancy}%`;
    
    // Set the price input value
    const priceInput = document.getElementById('pricing-modal-input');
    priceInput.value = currentPrice;
    
    // Update the competitors section
    updateCompetitorPrices(currentPrice);
    
    // Show the modal
    modal.show();
    
    // Handle the save button
    const saveBtn = document.getElementById('save-price-btn');
    saveBtn.addEventListener('click', function() {
        const newPrice = priceInput.value;
        showToast(`Price for ${formattedDate} updated to €${newPrice}`, 'success');
        modal.hide();
    });
}

function updateCompetitorPrices(basePrice) {
    const competitors = [
        { name: 'Hotel Alpha', price: Math.round(basePrice * (1 + (Math.random() * 0.2 - 0.1))) },
        { name: 'Hotel Beta', price: Math.round(basePrice * (1 + (Math.random() * 0.2 - 0.1))) },
        { name: 'Hotel Gamma', price: Math.round(basePrice * (1 + (Math.random() * 0.2 - 0.1))) },
        { name: 'Hotel Delta', price: Math.round(basePrice * (1 + (Math.random() * 0.2 - 0.1))) }
    ];
    
    const competitorsContainer = document.getElementById('competitor-prices');
    competitorsContainer.innerHTML = '';
    
    competitors.forEach(comp => {
        const div = document.createElement('div');
        div.className = 'd-flex justify-content-between mb-2';
        div.innerHTML = `
            <div>${comp.name}</div>
            <div class="fw-bold">€${comp.price}</div>
        `;
        competitorsContainer.appendChild(div);
    });
}

function initPricingFactors() {
    const factorsContainer = document.getElementById('pricing-factors-container');
    if (!factorsContainer) return;
    
    // Sample pricing factors
    const factors = [
        { name: 'Seasonality', value: 70, impact: 'High' },
        { name: 'Local Events', value: 45, impact: 'Medium' },
        { name: 'Competitor Prices', value: 85, impact: 'High' },
        { name: 'Historical Demand', value: 60, impact: 'Medium' },
        { name: 'Weather Forecast', value: 30, impact: 'Low' },
        { name: 'Day of Week', value: 50, impact: 'Medium' }
    ];
    
    // Create factor cards
    factors.forEach(factor => {
        const card = document.createElement('div');
        card.className = 'col-md-6 col-lg-4 mb-3';
        card.innerHTML = `
            <div class="card dashboard-card h-100">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <h5 class="card-title mb-0">${factor.name}</h5>
                        <span class="badge bg-${factor.impact === 'High' ? 'danger' : factor.impact === 'Medium' ? 'warning' : 'info'}">${factor.impact}</span>
                    </div>
                    <div class="mb-2">
                        <label for="${factor.name.toLowerCase()}-slider" class="form-label">
                            Weight: <span data-slider="${factor.name.toLowerCase()}-slider">${factor.value}%</span>
                        </label>
                        <input type="range" class="form-range pricing-factor-slider" id="${factor.name.toLowerCase()}-slider" min="0" max="100" value="${factor.value}">
                    </div>
                </div>
            </div>
        `;
        factorsContainer.appendChild(card);
    });
}

function initPricingHistory() {
    const ctx = document.getElementById('pricing-history-chart');
    if (!ctx) return;
    
    // Generate sample data for price history
    const labels = [];
    const priceData = [];
    const occupancyData = [];
    
    // Generate 12 months of data
    const currentDate = new Date();
    for (let i = 11; i >= 0; i--) {
        const date = new Date(currentDate);
        date.setMonth(currentDate.getMonth() - i);
        
        labels.push(date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }));
        priceData.push(Math.floor(Math.random() * (180 - 100 + 1)) + 100);
        occupancyData.push(Math.floor(Math.random() * (95 - 60 + 1)) + 60);
    }
    
    // Create chart
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Average Price (€)',
                    data: priceData,
                    borderColor: 'rgba(33, 150, 243, 1)',
                    backgroundColor: 'rgba(33, 150, 243, 0.1)',
                    yAxisID: 'y',
                    fill: true
                },
                {
                    label: 'Occupancy (%)',
                    data: occupancyData,
                    borderColor: 'rgba(76, 175, 80, 1)',
                    backgroundColor: 'rgba(76, 175, 80, 0.0)',
                    yAxisID: 'y1',
                    borderDash: [5, 5]
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Price (€)'
                    },
                    ticks: {
                        callback: function(value) {
                            return '€' + value;
                        }
                    }
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
                        text: 'Occupancy (%)'
                    },
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    },
                    min: 0,
                    max: 100
                }
            }
        }
    });
}

function updatePricingChart() {
    const chart = Chart.getChart('pricing-chart');
    if (!chart) return;
    
    // Generate new price suggestions
    const newSuggestions = Array.from({length: 30}, () => Math.floor(Math.random() * (220 - 160 + 1)) + 160);
    
    // Update the chart
    chart.data.datasets[1].data = newSuggestions;
    chart.update();
}

function showToast(message, type = 'info') {
    // Create toast container if it doesn't exist
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
        document.body.appendChild(toastContainer);
    }
    
    // Create toast element
    const toastEl = document.createElement('div');
    toastEl.className = `toast align-items-center text-white bg-${type} border-0`;
    toastEl.setAttribute('role', 'alert');
    toastEl.setAttribute('aria-live', 'assertive');
    toastEl.setAttribute('aria-atomic', 'true');
    
    toastEl.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;
    
    toastContainer.appendChild(toastEl);
    
    // Show the toast
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
    
    // Remove toast after it's hidden
    toastEl.addEventListener('hidden.bs.toast', function() {
        toastEl.remove();
    });
}

// Initialize Competitive Price Comparison Chart
const competitorPriceCtx = document.getElementById('competitor-price-chart').getContext('2d');
new Chart(competitorPriceCtx, {
    type: 'line',
    data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                label: 'Your Hotel',
                data: [145, 150, 155, 160, 165, 170, 175, 180, 170, 160, 150, 145],
                borderColor: '#0056b3',
                backgroundColor: 'rgba(0, 86, 179, 0.1)',
                tension: 0.4,
                fill: true
            },
            {
                label: 'Competitor A',
                data: [160, 165, 170, 175, 180, 185, 190, 195, 185, 175, 165, 160],
                borderColor: '#dc3545',
                backgroundColor: 'rgba(220, 53, 69, 0.1)',
                tension: 0.4,
                fill: true
            },
            {
                label: 'Competitor B',
                data: [135, 140, 145, 150, 155, 160, 165, 170, 160, 150, 140, 135],
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
                beginAtZero: false,
                title: {
                    display: true,
                    text: 'Average Daily Rate (€)'
                }
            }
        }
    }
});

// Initialize Revenue Performance Chart
const revenuePerformanceCtx = document.getElementById('revenue-performance-chart').getContext('2d');
new Chart(revenuePerformanceCtx, {
    type: 'bar',
    data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                label: 'Revenue',
                data: [380000, 395000, 410000, 425000, 440000, 455000, 470000, 485000, 470000, 455000, 440000, 425000],
                backgroundColor: 'rgba(0, 86, 179, 0.8)',
                borderColor: '#0056b3',
                borderWidth: 1
            },
            {
                label: 'Target',
                data: [400000, 415000, 430000, 445000, 460000, 475000, 490000, 505000, 490000, 475000, 460000, 445000],
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
                    text: 'Revenue (€)'
                }
            }
        }
    }
});

// Initialize Revenue Forecast Chart
const revenueForecastCtx = document.getElementById('revenue-forecast-chart').getContext('2d');
new Chart(revenueForecastCtx, {
    type: 'line',
    data: {
        labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Forecast',
                data: [470000, 485000, 470000, 455000, 440000, 425000, 410000, 425000, 440000, 455000, 470000, 485000],
                borderColor: '#0056b3',
                backgroundColor: 'rgba(0, 86, 179, 0.1)',
                tension: 0.4,
                fill: true
            },
            {
                label: 'Historical',
                data: [450000, 465000, 450000, 435000, 420000, 405000, 390000, 405000, 420000, 435000, 450000, 465000],
                borderColor: '#6c757d',
                backgroundColor: 'rgba(108, 117, 125, 0.1)',
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
                    text: 'Revenue (€)'
                }
            }
        }
    }
});

// Initialize Market Demand Forecast Chart
const marketDemandCtx = document.getElementById('market-demand-chart').getContext('2d');
new Chart(marketDemandCtx, {
    type: 'line',
    data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                label: 'Demand Forecast',
                data: [65, 70, 75, 80, 85, 90, 95, 100, 85, 75, 70, 65],
                borderColor: '#0056b3',
                backgroundColor: 'rgba(0, 86, 179, 0.1)',
                tension: 0.4,
                fill: true
            },
            {
                label: 'Historical Demand',
                data: [60, 65, 70, 75, 80, 85, 90, 95, 80, 70, 65, 60],
                borderColor: '#6c757d',
                backgroundColor: 'rgba(108, 117, 125, 0.1)',
                tension: 0.4,
                fill: true
            },
            {
                label: 'Supply',
                data: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
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
                max: 100,
                title: {
                    display: true,
                    text: 'Demand Level (%)'
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