// mock_tools.js
// Contains data sets and mock API implementations for AuraDiet AI external tools

const DIET_PLANS = {
  college: {
    title: "Student Budget & High Protein Routine",
    calories: "2,100 kcal",
    macros: { protein: "140g", carbs: "220g", fats: "70g" },
    water: "3.0L",
    tips: [
      "Keep raw almonds and apples in your backpack for long library sessions.",
      "Prep oatmeal in mason jars the night before to save morning study time.",
      "Opt for budget-friendly proteins like canned tuna, tofu, eggs, and peanut butter."
    ],
    meals: {
      breakfast: {
        time: "09:00 AM",
        name: "Quick Dorm Protein Oats",
        ingredients: ["1/2 cup Rolled Oats", "1 scoop Whey/Soy Protein", "1 Medium Banana", "1 tbsp Peanut Butter"],
        calories: 480,
        prep: "Microwave oats in water for 90s, stir in protein powder, top with sliced banana and peanut butter."
      },
      lunch: {
        time: "01:30 PM",
        name: "Budget Rice & Veggie Box",
        ingredients: ["1 cup Brown Rice (pre-cooked)", "150g Smoked Tofu or Canned Tuna", "1 cup Frozen Broccoli", "1 tbsp Soy Sauce"],
        calories: 520,
        prep: "Sauté tofu/tuna with broccoli and soy sauce. Mix with brown rice. Easy to pack in Tupperware."
      },
      snack: {
        time: "05:30 PM",
        name: "Library Study Fuel",
        ingredients: ["1 Medium Crisp Apple", "15 Raw Almonds", "500ml Water"],
        calories: 210,
        prep: "Zero prep. Keep in bag. Helps maintain steady blood sugar levels during intense studying."
      },
      dinner: {
        time: "08:30 PM",
        name: "One-Pot Chickpea Pasta",
        ingredients: ["75g Chickpea Pasta", "1/2 cup Marinara Sauce", "1 cup Fresh Spinach", "1 tbsp Olive Oil"],
        calories: 620,
        prep: "Boil chickpea pasta. Drain and toss with olive oil, marinara sauce, and spinach until spinach wilts."
      }
    },
    schedule: [
      { id: "cal-1", type: "meal", time: "08:30 AM", title: "Wake Up & Hydrate", description: "Drink 500ml of room-temp water." },
      { id: "cal-2", type: "meal", time: "09:00 AM", title: "Breakfast: Quick Dorm Oats", description: "Quick dorm protein oats (480 kcal)." },
      { id: "cal-3", type: "routine", time: "10:00 AM - 01:00 PM", title: "Morning Lectures & Labs", description: "Stay hydrated. Keep water bottle filled." },
      { id: "cal-4", type: "meal", time: "01:30 PM", title: "Lunch: Budget Rice & Veggies", description: "Tofu/Tuna brown rice box (520 kcal)." },
      { id: "cal-5", type: "routine", time: "02:00 PM - 05:00 PM", title: "Library Study Block", description: "High concentration window." },
      { id: "cal-6", type: "meal", time: "05:30 PM", title: "Snack: Apple & Almonds", description: "Library study fuel (210 kcal)." },
      { id: "cal-7", type: "routine", time: "06:30 PM - 07:45 PM", title: "Gym Session / Walk", description: "Active movement." },
      { id: "cal-8", type: "meal", time: "08:30 PM", title: "Dinner: One-Pot Pasta", description: "One-pot chickpea pasta & spinach (620 kcal)." }
    ]
  },
  school: {
    title: "High Energy & Growing Years Routine",
    calories: "1,800 kcal",
    macros: { protein: "95g", carbs: "210g", fats: "60g" },
    water: "2.5L",
    tips: [
      "Prepare the lunch box wrap the night before and wrap tightly in parchment paper.",
      "Keep hydration fun by squeezing a slice of lemon or orange into the water flask.",
      "Eat your post-school snack before starting homework to keep your brain fueled."
    ],
    meals: {
      breakfast: {
        time: "07:00 AM",
        name: "Rise & Shine Eggs & Toast",
        ingredients: ["2 Large Eggs (Scrambled)", "2 slices Whole Wheat Toast", "1/2 cup Sliced Strawberries", "1 tsp Butter"],
        calories: 390,
        prep: "Scramble eggs in a pan with butter. Serve alongside toasted whole wheat bread and fresh strawberries."
      },
      lunch: {
        time: "11:30 AM",
        name: "School Box Turkey Wrap",
        ingredients: ["1 Whole Wheat Tortilla", "3 slices Turkey Breast / Hummus", "1/2 cup Sliced Bell Peppers", "1 tbsp Cream Cheese"],
        calories: 430,
        prep: "Spread cream cheese on tortilla. Layer turkey, bell peppers, roll tightly, and cut in half. Pack with ice pack."
      },
      snack: {
        time: "03:00 PM",
        name: "Homework Energy Bowl",
        ingredients: ["150g Low-Fat Greek Yogurt", "1 tsp Organic Honey", "1/4 cup Fresh Blueberries", "1 tbsp Chia Seeds"],
        calories: 220,
        prep: "Spoon Greek yogurt into a bowl, drizzle with organic honey, and top with blueberries and chia seeds."
      },
      dinner: {
        time: "07:00 PM",
        name: "Clean Chicken & Sweet Potato Mash",
        ingredients: ["150g Grilled Chicken Breast / Lentil Patty", "1 Medium Sweet Potato", "1 cup Steamed Green Beans", "1 tsp Olive Oil"],
        calories: 550,
        prep: "Grill chicken or lentil patty. Boil and mash sweet potato with olive oil. Serve with steamed green beans."
      }
    },
    schedule: [
      { id: "cal-9", type: "meal", time: "06:30 AM", title: "Morning Stretch & Water", description: "Drink 250ml water, do 5 min light stretching." },
      { id: "cal-10", type: "meal", time: "07:00 AM", title: "Breakfast: Rise & Shine Eggs", description: "Scrambled eggs, toast & strawberries (390 kcal)." },
      { id: "cal-11", type: "routine", time: "08:00 AM - 02:00 PM", title: "School Hours", description: "Classes & active learning." },
      { id: "cal-12", type: "meal", time: "11:30 AM", title: "Lunch: Box Turkey Wrap", description: "Recess wrap & carrot sticks (430 kcal)." },
      { id: "cal-13", type: "meal", time: "03:00 PM", title: "Snack: Homework Energy Bowl", description: "Greek yogurt, honey & blueberries (220 kcal)." },
      { id: "cal-14", type: "routine", time: "03:30 PM - 05:30 PM", title: "Homework & Outdoor Play", description: "Keep screen time limited. Stay active." },
      { id: "cal-15", type: "meal", time: "07:00 PM", title: "Dinner: Chicken & Mash", description: "Grilled chicken, mashed sweet potato & beans (550 kcal)." }
    ]
  },
  office: {
    title: "Desk-Bound Focus & Sustained Energy Routine",
    calories: "1,900 kcal",
    macros: { protein: "120g", carbs: "170g", fats: "75g" },
    water: "3.2L",
    tips: [
      "Use an insulated 1-liter bottle at your desk and aim to drink 3 full bottles by 5 PM.",
      "Avoid sweet sugary coffee in the afternoon; try green tea or sparkling water instead.",
      "Get up and stretch every 60 minutes. Use snack times as an excuse to walk around."
    ],
    meals: {
      breakfast: {
        time: "07:30 AM",
        name: "Brain-Power Avocado Toast",
        ingredients: ["1 slice Sourdough Bread", "1/2 Ripe Avocado", "2 Poached Eggs", "Pinch of Red Pepper Flakes"],
        calories: 450,
        prep: "Toast sourdough. Mash avocado on toast, top with two soft-poached eggs. Garnish with red pepper flakes."
      },
      lunch: {
        time: "12:45 PM",
        name: "Desk-Prepped Quinoa Bowl",
        ingredients: ["3/4 cup Cooked Quinoa", "150g Grilled Tempeh or Chicken", "2 cups Mixed Greens", "2 tbsp Vinaigrette Dressing"],
        calories: 510,
        prep: "Toss cold quinoa, tempeh/chicken, mixed greens, and cucumber slices together. Drizzle dressing just before eating."
      },
      snack: {
        time: "03:45 PM",
        name: "Anti-Brain-Fog Crunch",
        ingredients: ["3 tbsp Garlic Hummus", "1 cup Cucumber & Celery Sticks", "1 cup Green Tea (Unsweetened)"],
        calories: 180,
        prep: "Slice cucumber and celery into sticks. Dip into pre-packaged garlic hummus. Sip green tea."
      },
      dinner: {
        time: "07:30 PM",
        name: "Lean & Clean Salmon (or Paneer)",
        ingredients: ["150g Baked Salmon or Paneer", "1 cup Asparagus Spears", "1/2 cup Cooked Quinoa", "1 slice Lemon"],
        calories: 580,
        prep: "Bake salmon/paneer and asparagus at 400°F for 12 mins with lemon slice and herbs. Serve with warm quinoa."
      }
    },
    schedule: [
      { id: "cal-16", type: "meal", time: "07:00 AM", title: "Lemon Water & Meditate", description: "Start the day clear-headed with warm lemon water." },
      { id: "cal-17", type: "meal", time: "07:30 AM", title: "Breakfast: Avocado Toast", description: "Avocado & poached egg sourdough toast (450 kcal)." },
      { id: "cal-18", type: "routine", time: "09:00 AM - 12:30 PM", title: "Office Morning Block", description: "Deep focus and team meetings. Stand periodically." },
      { id: "cal-19", type: "meal", time: "12:45 PM", title: "Lunch: Quinoa Bowl", description: "Healthy grain and protein meal-prepped bowl (510 kcal)." },
      { id: "cal-20", type: "routine", time: "01:30 PM - 03:30 PM", title: "Office Afternoon Block", description: "Tackle operations and emails. Stretch desk breaks." },
      { id: "cal-21", type: "meal", time: "03:45 PM", title: "Snack: Veggies & Hummus", description: "Avoid brain fog snack + green tea (180 kcal)." },
      { id: "cal-22", type: "routine", time: "05:30 PM - 07:00 PM", title: "Commute & Active Time", description: "Walk back or hit the gym to shake off desk stiffness." },
      { id: "cal-23", type: "meal", time: "07:30 PM", title: "Dinner: Baked Salmon/Paneer", description: "High omega-3 dinner with asparagus and quinoa (580 kcal)." }
    ]
  }
};

// Simulated Tool Handlers representing the real API endpoints that a TruGen agent triggers
const mockTools = {
  // Tool 1: sync_diet_calendar
  // API Call Signature: POST /api/tools/sync_diet_calendar { routineType: 'college'|'school'|'office' }
  syncDietCalendar: async (routineType) => {
    console.log(`[Tool Call: sync_diet_calendar] Triggered for ${routineType}`);
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
    const plan = DIET_PLANS[routineType];
    if (!plan) throw new Error("Invalid routine type provided.");

    return {
      status: "success",
      message: `Successfully synchronized the ${routineType} diet schedule to user's Google Calendar.`,
      events_added: plan.schedule.length,
      routine: routineType,
      calendar_name: `${routineType.charAt(0).toUpperCase() + routineType.slice(1)} Routine Diet Planner`,
      schedule: plan.schedule
    };
  },

  // Tool 2: order_grocery_cart
  // API Call Signature: POST /api/tools/order_grocery_cart { routineType: 'college'|'school'|'office' }
  orderGroceryCart: async (routineType) => {
    console.log(`[Tool Call: order_grocery_cart] Triggered for ${routineType}`);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
    const plan = DIET_PLANS[routineType];
    if (!plan) throw new Error("Invalid routine type provided.");

    // Compile list of ingredients
    const ingredients = [];
    Object.keys(plan.meals).forEach(mealKey => {
      plan.meals[mealKey].ingredients.forEach(item => {
        if (!ingredients.some(ing => ing.name === item)) {
          // Generate a mock price between $1.50 and $12.00
          const price = (Math.random() * 8 + 1.5).toFixed(2);
          ingredients.push({ name: item, price: parseFloat(price), qty: 1 });
        }
      });
    });

    const total = ingredients.reduce((sum, item) => sum + item.price, 0).toFixed(2);

    return {
      status: "success",
      message: `Assembled Instacart grocery basket containing all ${ingredients.length} items for the ${routineType} diet.`,
      items: ingredients,
      total_price: `$${total}`,
      checkout_url: `https://www.instacart.com/store/checkout?mock_ref=aura_diet_${routineType}`
    };
  },

  // Tool 3: generate_pdf_diet_report
  // API Call Signature: POST /api/tools/generate_pdf_diet_report { email: 'user@example.com', routineType: 'college'|'school'|'office' }
  generatePdfDietReport: async (email, routineType) => {
    console.log(`[Tool Call: generate_pdf_diet_report] Triggered for ${routineType} sending to ${email}`);
    await new Promise(resolve => setTimeout(resolve, 1200)); // Simulate API delay
    const plan = DIET_PLANS[routineType];
    if (!plan) throw new Error("Invalid routine type provided.");

    const reportId = "PDF-" + Math.floor(100000 + Math.random() * 900000);
    return {
      status: "success",
      message: `PDF diet report successfully generated and dispatched to ${email || 'your account email'}.`,
      report_id: reportId,
      download_url: `#download-${reportId}`,
      file_size: "1.42 MB",
      generated_at: new Date().toLocaleString(),
      plan_title: plan.title,
      calories: plan.calories,
      macros: plan.macros
    };
  },

  // Tool 4: log_daily_consumption
  // API Call Signature: POST /api/tools/log_daily_consumption { mealType: 'breakfast'|'lunch'|'snack'|'dinner', calories: number, routineType: 'college'|'school'|'office' }
  logDailyConsumption: async (mealType, calories, routineType) => {
    console.log(`[Tool Call: log_daily_consumption] Logging ${mealType} (${calories} kcal) for ${routineType}`);
    await new Promise(resolve => setTimeout(resolve, 600)); // Simulate API delay
    const plan = DIET_PLANS[routineType];
    if (!plan) throw new Error("Invalid routine type provided.");

    return {
      status: "success",
      message: `Logged ${mealType.toUpperCase()} into health logs successfully.`,
      calories_logged: calories,
      routine: routineType,
      timestamp: new Date().toLocaleTimeString(),
      remaining_calories: (parseInt(plan.calories.replace(",", "")) - calories) + " kcal"
    };
  }
};

// Export to window object for browser access
window.DIET_PLANS = DIET_PLANS;
window.mockTools = mockTools;
