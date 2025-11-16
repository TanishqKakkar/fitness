let mealsData = { ...CONFIG.initialData.meals };

document.addEventListener('DOMContentLoaded', () => {
    loadMealsData();
    setupEventListeners();
    renderMeals();
});

function setupEventListeners() {
    document.getElementById('mealForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        addMeal();
    });
}

function openMealForm(type) {
    document.getElementById('mealType').value = type;
    document.getElementById('mealModal').classList.add('active');
}

function closeMealForm() {
    document.getElementById('mealModal').classList.remove('active');
    document.getElementById('mealForm').reset();
}

function addMeal() {
    const type = document.getElementById('mealType').value;
    const name = document.getElementById('mealName').value;
    const calories = parseInt(document.getElementById('mealCalories').value);
    const category = document.getElementById('mealCategory').value;

    if (name && calories && type) {
        mealsData[type].push({
            name,
            calories,
            category,
            id: Date.now(),
            timestamp: new Date().toLocaleTimeString()
        });

        closeMealForm();
        renderMeals();
        saveMealsData();
        showSuccess('Meal added successfully!');
    }
}

function renderMeals() {
    ['breakfast', 'lunch', 'dinner'].forEach(type => {
        const list = document.getElementById(type + 'List');
        const calsSpan = document.getElementById(type + 'Cals');
        if (!list) return;
        list.innerHTML = '';

        let typeCals = 0;
        mealsData[type].forEach(meal => {
            typeCals += meal.calories;
            const div = document.createElement('div');
            div.className = 'meal-item';
            div.innerHTML = `
                <div class="meal-item-content">
                    <div class="meal-item-info">
                        <h4>${meal.name}</h4>
                        <p class="meal-category">${meal.category}</p>
                    </div>
                    <div class="meal-item-actions">
                        <span class="meal-item-calories">${meal.calories} kcal</span>
                        <button class="delete-btn" onclick="deleteMeal('${type}', ${meal.id})">Remove</button>
                    </div>
                </div>
            `;
            list.appendChild(div);
        });

        if (mealsData[type].length === 0) {
            list.innerHTML = '<p class="empty-state">No meals added yet. Start planning your nutrition!</p>';
        }

        if (calsSpan) calsSpan.textContent = typeCals + ' kcal';
    });

    updateTotalCalories();
}

function updateTotalCalories() {
    const totalCals = Object.values(mealsData)
        .flat()
        .reduce((sum, meal) => sum + meal.calories, 0);
    document.getElementById('totalCalories').textContent = totalCals;
}

function deleteMeal(type, id) {
    if (confirm('Remove this meal?')) {
        mealsData[type] = mealsData[type].filter(m => m.id !== id);
        renderMeals();
        saveMealsData();
        showSuccess('Meal removed!');
    }
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

function downloadMealPlan() {
    let report = `
FitTrack Pro - Meal Plan Report
=================================

BREAKFAST MEALS (${mealsData.breakfast.reduce((s, m) => s + m.calories, 0)} kcal)
${mealsData.breakfast.length === 0 ? 'No meals added' : mealsData.breakfast.map(m => `  • ${m.name} - ${m.calories} kcal (${m.category})`).join('\n')}

LUNCH MEALS (${mealsData.lunch.reduce((s, m) => s + m.calories, 0)} kcal)
${mealsData.lunch.length === 0 ? 'No meals added' : mealsData.lunch.map(m => `  • ${m.name} - ${m.calories} kcal (${m.category})`).join('\n')}

DINNER MEALS (${mealsData.dinner.reduce((s, m) => s + m.calories, 0)} kcal)
${mealsData.dinner.length === 0 ? 'No meals added' : mealsData.dinner.map(m => `  • ${m.name} - ${m.calories} kcal (${m.category})`).join('\n')}

TOTAL DAILY CALORIES: ${Object.values(mealsData).flat().reduce((s, m) => s + m.calories, 0)} kcal

Generated: ${new Date().toLocaleString()}
    `.trim();

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mealplan-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showSuccess('Meal plan downloaded!');
}

function resetMeals() {
    if (confirm('Reset all meals? This cannot be undone.')) {
        mealsData = { breakfast: [], lunch: [], dinner: [] };
        renderMeals();
        saveMealsData();
        showSuccess('Meals reset!');
    }
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

function saveMealsData() {
    localStorage.setItem('fittrackMeals', JSON.stringify(mealsData));
}

function loadMealsData() {
    const saved = localStorage.getItem('fittrackMeals');
    if (saved) mealsData = JSON.parse(saved);
}
