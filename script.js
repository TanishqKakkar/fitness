// Load configuration
let appData = { ...CONFIG.initialData };

document.addEventListener('DOMContentLoaded', () => {
    loadData();
    setupEventListeners();
    updateOverview();
    renderActivities();
    renderMeals();
    updateAnalytics();
    updateLiveClock();
    setInterval(updateLiveClock, 1000);
});

function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            showPage(e.target.dataset.page);
        });
    });

    // Workout form
    document.getElementById('workoutForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        addWorkout();
    });

    // Meal form
    document.getElementById('mealForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        addMeal();
    });

    // Filters
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            filterActivities(e.target.dataset.filter);
        });
    });

    // Action buttons
    document.getElementById('downloadBtn')?.addEventListener('click', downloadReport);
    document.getElementById('resetBtn')?.addEventListener('click', resetDashboard);
}

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
}

function updateOverview() {
    document.getElementById('stepsValue').textContent = appData.steps.toLocaleString();
    document.getElementById('caloriesValue').textContent = appData.calories;
    document.getElementById('waterValue').textContent = appData.water;

    const stepsPercent = Math.min((appData.steps / CONFIG.dailyGoals.steps) * 100, 100);
    const caloriesPercent = Math.min((appData.calories / CONFIG.dailyGoals.calories) * 100, 100);
    const waterPercent = Math.min((appData.water / CONFIG.dailyGoals.water) * 100, 100);

    document.getElementById('stepsBar').style.width = stepsPercent + '%';
    document.getElementById('caloriesBar').style.width = caloriesPercent + '%';
    document.getElementById('waterBar').style.width = waterPercent + '%';
}

function updateLiveClock() {
    const now = new Date();
    const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    document.getElementById('liveClock').textContent = time;
}

function addWorkout() {
    const type = document.getElementById('workoutType').value;
    const duration = parseInt(document.getElementById('workoutDuration').value);
    const intensity = document.getElementById('workoutIntensity').value;
    let calories = parseInt(document.getElementById('workoutCalories').value);

    if (type && duration && intensity && calories) {
        appData.activities.push({
            type,
            duration,
            intensity,
            calories,
            timestamp: new Date().toLocaleTimeString(),
            id: Date.now()
        });

        appData.calories += calories;
        appData.steps += Math.floor(duration * 100 / 5);

        document.getElementById('workoutForm').reset();
        updateOverview();
        renderActivities();
        saveData();
        showSuccess('Workout logged successfully!');
    }
}

function renderActivities(filter = 'all') {
    const list = document.getElementById('workoutsList');
    if (!list) return;
    list.innerHTML = '';

    const filtered = filter === 'all' ? appData.activities : 
                     appData.activities.filter(a => {
                         const hour = new Date().getHours();
                         if (filter === 'morning') return hour < 12;
                         if (filter === 'afternoon') return hour >= 12 && hour < 18;
                         if (filter === 'evening') return hour >= 18;
                         return true;
                     });

    if (filtered.length === 0) {
        list.innerHTML = '<p style="color: var(--text-tertiary); text-align: center; padding: 2rem;">No workouts yet</p>';
        return;
    }

    filtered.reverse().forEach(activity => {
        const workoutData = CONFIG.workoutTypes.find(w => w.name === activity.type);
        const div = document.createElement('div');
        div.className = 'activity-item';
        div.innerHTML = `
            <div class="activity-info">
                <h4>${workoutData?.emoji || '💪'} ${activity.type}</h4>
                <p class="activity-meta">${activity.timestamp}</p>
            </div>
            <div class="activity-stats">
                <div class="activity-stat">
                    <span class="activity-stat-value">${activity.duration}</span>
                    <span class="activity-stat-label">minutes</span>
                </div>
                <div class="activity-stat">
                    <span class="activity-stat-value">${activity.calories}</span>
                    <span class="activity-stat-label">kcal</span>
                </div>
                <div class="activity-stat">
                    <span class="activity-stat-value">${activity.intensity}</span>
                    <span class="activity-stat-label">intensity</span>
                </div>
            </div>
            <button class="delete-btn" onclick="deleteActivity(${activity.id})">Delete</button>
        `;
        list.appendChild(div);
    });
}

function filterActivities(filter) {
    renderActivities(filter);
}

function deleteActivity(id) {
    const activity = appData.activities.find(a => a.id === id);
    if (activity) {
        appData.calories = Math.max(0, appData.calories - activity.calories);
        appData.activities = appData.activities.filter(a => a.id !== id);
        updateOverview();
        renderActivities();
        saveData();
    }
}

function addMealForm(type) {
    document.getElementById('mealType').value = type;
    document.getElementById('mealModal').classList.add('active');
}

function closeMealForm() {
    document.getElementById('mealModal').classList.remove('active');
}

function addMeal() {
    const type = document.getElementById('mealType').value;
    const name = document.getElementById('mealName').value;
    const calories = parseInt(document.getElementById('mealCalories').value);

    if (name && calories) {
        appData.meals[type].push({ name, calories, id: Date.now() });
        document.getElementById('mealForm').reset();
        closeMealForm();
        renderMeals();
        saveData();
        showSuccess('Meal added!');
    }
}

function renderMeals() {
    ['breakfast', 'lunch', 'dinner'].forEach(type => {
        const list = document.getElementById(type + 'List');
        const calsSpan = document.getElementById(type + 'Cals');
        if (!list) return;
        list.innerHTML = '';

        let typeCals = 0;
        appData.meals[type].forEach(meal => {
            typeCals += meal.calories;
            const div = document.createElement('div');
            div.className = 'meal-item';
            div.innerHTML = `
                <div class="meal-info">
                    <h4>${meal.name}</h4>
                </div>
                <div style="display: flex; gap: 1rem; align-items: center;">
                    <span class="meal-calories">${meal.calories} cal</span>
                    <button class="delete-btn" onclick="deleteMeal('${type}', ${meal.id})">Remove</button>
                </div>
            `;
            list.appendChild(div);
        });

        if (calsSpan) calsSpan.textContent = typeCals + ' kcal';
    });

    const totalCals = Object.values(appData.meals)
        .flat()
        .reduce((sum, meal) => sum + meal.calories, 0);
    document.getElementById('totalCalories').textContent = totalCals;
}

function deleteMeal(type, id) {
    appData.meals[type] = appData.meals[type].filter(m => m.id !== id);
    renderMeals();
    saveData();
}

function updateAnalytics() {
    const { weeklyStats } = CONFIG.initialData;

    let activityHTML = '';
    weeklyStats.forEach(day => {
        activityHTML += `
            <div class="chart-bar">
                <div class="bar-label">${day.day}</div>
                <div class="bar" style="height: ${day.workouts * 25}px;">
                    <div class="bar-value">${day.workouts}</div>
                </div>
            </div>
        `;
    });

    let calorieHTML = '';
    weeklyStats.forEach(day => {
        calorieHTML += `
            <div class="chart-bar">
                <div class="bar-label">${day.day}</div>
                <div class="bar" style="height: ${(day.calories / 700) * 150}px;">
                    <div class="bar-value">${day.calories}</div>
                </div>
            </div>
        `;
    });

    const chartsDiv = document.getElementById('workoutsChart');
    const caloriesDiv = document.getElementById('caloriesChart');
    if (chartsDiv) chartsDiv.innerHTML = activityHTML;
    if (caloriesDiv) caloriesDiv.innerHTML = calorieHTML;

    const totalWorkouts = appData.activities.length;
    const totalBurned = appData.activities.reduce((sum, a) => sum + a.calories, 0);
    const avgDuration = totalWorkouts > 0 ? Math.round(appData.activities.reduce((sum, a) => sum + a.duration, 0) / totalWorkouts) : 0;

    if (document.getElementById('totalWorkouts')) document.getElementById('totalWorkouts').textContent = totalWorkouts;
    if (document.getElementById('totalBurned')) document.getElementById('totalBurned').textContent = totalBurned;
    if (document.getElementById('avgDuration')) document.getElementById('avgDuration').textContent = avgDuration + ' min';
}

function showSuccess(msg) {
    document.getElementById('successMessage').textContent = msg;
    const modal = document.getElementById('successModal');
    modal.classList.add('active');
    setTimeout(() => modal.classList.remove('active'), 2000);
}

function closeSuccessModal() {
    document.getElementById('successModal').classList.remove('active');
}

function downloadReport() {
    const report = `
FitTrack Pro - Fitness Report
==============================

Daily Metrics:
- Steps: ${appData.steps} / ${CONFIG.dailyGoals.steps}
- Calories: ${appData.calories} kcal
- Water: ${appData.water} / ${CONFIG.dailyGoals.water} glasses

Workout Summary:
- Total Workouts: ${appData.activities.length}
- Total Calories Burned: ${appData.activities.reduce((s, a) => s + a.calories, 0)} kcal

Meal Summary:
- Total Meals: ${Object.values(appData.meals).flat().length}
- Total Calories Consumed: ${Object.values(appData.meals).flat().reduce((s, m) => s + m.calories, 0)} kcal

Generated: ${new Date().toLocaleString()}
    `.trim();

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fittrack-report-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showSuccess('Report downloaded!');
}

function resetDashboard() {
    if (confirm('Reset all data? This cannot be undone.')) {
        appData = { ...CONFIG.initialData };
        updateOverview();
        renderActivities();
        renderMeals();
        updateAnalytics();
        saveData();
        showSuccess('Dashboard reset!');
    }
}

function saveData() {
    localStorage.setItem('fittrackData', JSON.stringify(appData));
}

function loadData() {
    const saved = localStorage.getItem('fittrackData');
    if (saved) appData = JSON.parse(saved);
}
