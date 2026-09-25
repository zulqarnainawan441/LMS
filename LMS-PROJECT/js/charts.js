/**
 * charts.js
 * Handles the rendering of Chart.js interactive canvases across different dashboards.
 */

document.addEventListener('DOMContentLoaded', () => {

    const chartDefaults = {
        fontFamily: "'Inter', sans-serif",
        textColor: "#6B7280",
        gridColor: "#E5E7EB"
    };

    // 1. Student Dashboard - Overall Performance (Doughnut Chart)
    const overallPerformanceCtx = document.getElementById('overallPerformanceChart');
    if (overallPerformanceCtx) {
        new Chart(overallPerformanceCtx, {
            type: 'doughnut',
            data: {
                labels: ['Completed', 'Remaining'],
                datasets: [{
                    data: [85, 15],
                    backgroundColor: ['#10B981', '#E5E7EB'],
                    borderWidth: 0,
                    hoverOffset: 4
                }]
            },
            options: {
                cutout: '80%',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
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

    // 2. Results Dashboard - Performance Trend (Bar Chart)
    const performanceCtx = document.getElementById('performanceChart');
    if (performanceCtx) {
        new Chart(performanceCtx, {
            type: 'bar',
            data: {
                labels: ['August', 'September', 'October', 'November'],
                datasets: [{
                    label: 'Average Score',
                    data: [85, 90, 88, 95],
                    backgroundColor: ['#2563EB', '#2563EB', '#2563EB', '#F59E0B'],
                    borderRadius: 4,
                    barPercentage: 0.6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        grid: { color: chartDefaults.gridColor },
                        ticks: { color: chartDefaults.textColor }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { color: chartDefaults.textColor }
                    }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: '#1F2937',
                        padding: 12,
                        titleFont: { family: chartDefaults.fontFamily },
                        bodyFont: { family: chartDefaults.fontFamily }
                    }
                }
            }
        });
    }

    // 3. Admin Dashboard - Enrollment Trend (Line Chart)
    const enrollmentCtx = document.getElementById('enrollmentChart');
    if (enrollmentCtx) {
        new Chart(enrollmentCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'New Enrollments',
                    data: [120, 190, 150, 220, 180, 280],
                    borderColor: '#2563EB',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: '#FFFFFF',
                    pointBorderColor: '#2563EB',
                    pointBorderWidth: 2,
                    pointRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: chartDefaults.gridColor },
                        ticks: { color: chartDefaults.textColor }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { color: chartDefaults.textColor }
                    }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: '#1F2937',
                        padding: 12,
                        titleFont: { family: chartDefaults.fontFamily },
                        bodyFont: { family: chartDefaults.fontFamily }
                    }
                }
            }
        });
    }
});
