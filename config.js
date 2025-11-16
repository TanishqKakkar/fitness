const CONFIG = {
    app: {
        name: "FitTrack Pro",
        version: "1.0.0",
        description: "Elite Fitness Tracking Dashboard"
    },
    
    workoutTypes: [
        { id: 1, name: "Running", emoji: "🏃", intensity: "High", defaultCalories: 150 },
        { id: 2, name: "Cycling", emoji: "🚴", intensity: "Medium", defaultCalories: 120 },
        { id: 3, name: "Swimming", emoji: "🏊", intensity: "High", defaultCalories: 140 },
        { id: 4, name: "Weight Training", emoji: "🏋️", intensity: "High", defaultCalories: 130 },
        { id: 5, name: "Yoga", emoji: "🧘", intensity: "Low", defaultCalories: 60 },
        { id: 6, name: "HIIT", emoji: "⚡", intensity: "Maximum", defaultCalories: 180 },
        { id: 7, name: "Walking", emoji: "🚶", intensity: "Low", defaultCalories: 50 },
        { id: 8, name: "Stretching", emoji: "🤸", intensity: "Low", defaultCalories: 30 }
    ],

    dailyGoals: {
        steps: 10000,
        calories: 2000,
        water: 8,
        workouts: 1
    },

    mealCategories: {
        breakfast: { name: "Breakfast", emoji: "🌅", idealCalories: 400 },
        lunch: { name: "Lunch", emoji: "🌞", idealCalories: 600 },
        dinner: { name: "Dinner", emoji: "🌙", idealCalories: 500 }
    },

    sampleMeals: [
        { name: "Oatmeal with Berries", calories: 350, category: "breakfast" },
        { name: "Grilled Chicken Salad", calories: 450, category: "lunch" },
        { name: "Salmon with Vegetables", calories: 520, category: "dinner" },
        { name: "Greek Yogurt", calories: 150, category: "breakfast" },
        { name: "Turkey Sandwich", calories: 400, category: "lunch" },
        { name: "Pasta Primavera", calories: 480, category: "dinner" }
    ],

    intensityLevels: [
        { level: "Low", multiplier: 0.5, color: "#06b6d4" },
        { level: "Medium", multiplier: 0.75, color: "#0ea5e9" },
        { level: "High", multiplier: 1.0, color: "#06b6d4" },
        { level: "Maximum", multiplier: 1.3, color: "#0ea5e9" }
    ],

    weekDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],

    // Initial data state
    initialData: {
        steps: 7250,
        calories: 480,
        water: 5,
        activities: [],
        meals: { breakfast: [], lunch: [], dinner: [] },
        weeklyStats: [
            { day: "Mon", workouts: 3, calories: 450 },
            { day: "Tue", workouts: 5, calories: 520 },
            { day: "Wed", workouts: 2, calories: 380 },
            { day: "Thu", workouts: 7, calories: 650 },
            { day: "Fri", workouts: 4, calories: 420 },
            { day: "Sat", workouts: 6, calories: 580 },
            { day: "Sun", workouts: 5, calories: 480 }
        ]
    }
};
