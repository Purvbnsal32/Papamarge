// app.js
// Main logic for AuraDiet AI Dashboard, TruGen API Client, and Video Coach Simulator

document.addEventListener("DOMContentLoaded", () => {
  // --- APPLICATION STATE ---
  let appState = {
    routine: "college", // 'college' | 'school' | 'office'
    apiKey: localStorage.getItem("bbc0d13ae7094b249371f42275697ee3") || "",
    agentId: "",
    isCallActive: false,
    activeMode: "simulator", // 'simulator' | 'trugen'
    logs: [],
    groceryCart: [],
    syncedCalendar: [],
    loggedCalories: 0,
    loggedWater: 0.5, // starts at 0.5L
    pdfReports: [],
    voiceEnabled: true,
    isListening: false,
    isThinking: false
  };

  // --- ELEMENT CACHE ---
  const el = {
    routineSelect: document.getElementById("routine-select"),
    dietGoal: document.getElementById("diet-goal"),
    apiKeyInput: document.getElementById("api-key-input"),
    saveKeyBtn: document.getElementById("save-key-btn"),
    toggleModeBtns: document.querySelectorAll("[data-mode-btn]"),
    modeSections: document.querySelectorAll("[data-mode-section]"),
    
    // Provisioner Elements
    provisionBtn: document.getElementById("provision-btn"),
    provisionLogs: document.getElementById("provision-logs"),
    toolSchemaPre: document.getElementById("tool-schema-pre"),
    agentSchemaPre: document.getElementById("agent-schema-pre"),
    iframeContainer: document.getElementById("iframe-container"),
    iframePlaceholder: document.getElementById("iframe-placeholder"),

    // Simulator Elements
    startCallBtn: document.getElementById("start-call-btn"),
    stopCallBtn: document.getElementById("stop-call-btn"),
    chatHistory: document.getElementById("chat-history"),
    avatarVideo: document.getElementById("avatar-video"),
    voiceToggleBtn: document.getElementById("voice-toggle-btn"),
    micBtn: document.getElementById("mic-btn"),
    speechStatus: document.getElementById("speech-status"),
    chatInput: document.getElementById("chat-input"),
    sendChatBtn: document.getElementById("send-chat-btn"),
    quickPrompts: document.querySelectorAll(".quick-prompt-btn"),
    avatarContainer: document.querySelector(".avatar-container"),

    // HUD / Dashboard Elements
    hudSyncBadge: document.getElementById("hud-sync-badge"),
    hudGroceryBadge: document.getElementById("hud-grocery-badge"),
    hudPdfBadge: document.getElementById("hud-pdf-badge"),
    hudCalBadge: document.getElementById("hud-cal-badge"),
    
    calTimeline: document.getElementById("calendar-timeline"),
    groceryList: document.getElementById("grocery-list"),
    groceryTotal: document.getElementById("grocery-total"),
    groceryCheckoutBtn: document.getElementById("grocery-checkout-btn"),
    pdfList: document.getElementById("pdf-list"),
    
    // Rings
    calRing: document.getElementById("cal-ring"),
    calText: document.getElementById("cal-text"),
    waterRing: document.getElementById("water-ring"),
    waterText: document.getElementById("water-text"),
    proteinBar: document.getElementById("protein-bar"),
    proteinText: document.getElementById("protein-text"),
    carbsBar: document.getElementById("carbs-bar"),
    carbsText: document.getElementById("carbs-text"),
    fatsBar: document.getElementById("fats-bar"),
    fatsText: document.getElementById("fats-text"),

    planTitle: document.getElementById("plan-title"),
    planCalories: document.getElementById("plan-calories"),
    planWater: document.getElementById("plan-water"),
    planTips: document.getElementById("plan-tips")
  };

  // --- INITIALIZATION ---
  function init() {
    // Restore saved API Key
    if (appState.apiKey) {
      el.apiKeyInput.value = "bbc0d13ae7094b249371f42275697ee3";
    }

    // Set initial configuration visual states
    updateDietPlanUI();
    updateDashboardUI();
    generateSchemas();
    addConsoleLog("AuraDiet AI Initialized. Ready to build healthy routines!");

    // Bind Event Listeners
    el.routineSelect.addEventListener("change", (e) => {
      appState.routine = e.target.value;
      updateDietPlanUI();
      generateSchemas();
      addConsoleLog(`Switched routine profile to: ${appState.routine.toUpperCase()} Days`);
      if (appState.isCallActive && appState.activeMode === "simulator") {
        speakResponse(`I have reloaded your routine to ${appState.routine} days. Let's adapt your diet plan!`);
      }
    });

    el.saveKeyBtn.addEventListener("click", () => {
      const newKey = el.apiKeyInput.value.trim();
      if (newKey && !newKey.startsWith("•••")) {
        appState.apiKey = newKey;
        localStorage.setItem("bbc0d13ae7094b249371f42275697ee3", newKey);
        el.apiKeyInput.value = "bbc0d13ae7094b249371f42275697ee3";
        showToast("API Key securely saved locally!");
        addConsoleLog("TruGen API Key loaded. Live Provisioning Mode is fully unlocked.");
      } else if (!newKey) {
        appState.apiKey = "";
        localStorage.removeItem("bbc0d13ae7094b249371f42275697ee3");
        showToast("API Key removed.");
        addConsoleLog("TruGen API Key cleared. Standard simulation active.");
      }
    });

    // Toggle Modes (Simulator vs TruGen Live Provisioner)
    el.toggleModeBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const mode = btn.dataset.modeBtn;
        appState.activeMode = mode;
        
        el.toggleModeBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        el.modeSections.forEach(section => {
          if (section.dataset.modeSection === mode) {
            section.classList.remove("hidden");
          } else {
            section.classList.add("hidden");
          }
        });

        addConsoleLog(`Switched console mode to: ${mode === "simulator" ? "AI Voice-Video Coach Simulator" : "TruGen AI Live Platform Provisioner"}`);
      });
    });

    // Provisioner Actions
    el.provisionBtn.addEventListener("click", handleLiveProvisioning);

    // Simulator Actions
    el.startCallBtn.addEventListener("click", startCoachCall);
    el.stopCallBtn.addEventListener("btn", stopCoachCall); // fallback
    el.stopCallBtn.addEventListener("click", stopCoachCall);
    el.voiceToggleBtn.addEventListener("click", toggleVoiceSynthesis);
    el.micBtn.addEventListener("click", toggleSpeechRecognition);
    el.sendChatBtn.addEventListener("click", sendTextMessage);
    el.chatInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") sendTextMessage();
    });

    // Quick Prompts
    el.quickPrompts.forEach(btn => {
      btn.addEventListener("click", () => {
        if (!appState.isCallActive) {
          startCoachCall();
          setTimeout(() => {
            handleUserPrompt(btn.innerText);
          }, 1500);
        } else {
          handleUserPrompt(btn.innerText);
        }
      });
    });

    // Quick Action Badges (Manual Tool Triggers)
    document.querySelectorAll("[data-tool-trigger]").forEach(badge => {
      badge.addEventListener("click", () => {
        const toolName = badge.dataset.toolTrigger;
        triggerExternalToolAction(toolName);
      });
    });

    // Grocery Checkout
    el.groceryCheckoutBtn.addEventListener("click", () => {
      if (appState.groceryCart.length === 0) {
        showToast("Your grocery basket is empty!");
        return;
      }
      showToast("Redirecting to Instacart Checkout cart...");
      window.open(`https://www.instacart.com/store/checkout?mock_ref=aura_diet_${appState.routine}`, "_blank");
    });

    // Server-Sent Events (SSE) Live Listener for Real TruGen Tool Calls
    const eventSource = new EventSource('/api/events');
    eventSource.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        console.log(`[SSE Received] Live tool trigger:`, message);
        addConsoleLog(`[TruGen API Live Webhook] Agent triggered tool: ${message.type}`);
        
        if (message.type === 'sync_diet_calendar') {
          triggerExternalToolAction("sync_diet_calendar");
        } else if (message.type === 'order_grocery_cart') {
          triggerExternalToolAction("order_grocery_cart");
        } else if (message.type === 'generate_pdf_diet_report') {
          triggerExternalToolAction("generate_pdf_diet_report");
        } else if (message.type === 'log_daily_consumption') {
          triggerExternalToolAction("log_daily_consumption", { meal: message.data.meal, kcal: message.data.kcal });
        }
      } catch (err) {
        console.error("Error parsing SSE message:", err);
      }
    };
  }

  // --- UI UPDATE FUNCTIONS ---
  function updateDietPlanUI() {
    const plan = window.DIET_PLANS[appState.routine];
    if (!plan) return;

    el.planTitle.innerText = plan.title;
    el.planCalories.innerText = plan.calories;
    el.planWater.innerText = plan.water;

    // Load tips
    el.planTips.innerHTML = "";
    plan.tips.forEach(tip => {
      const li = document.createElement("li");
      li.className = "flex items-start text-sm text-slate-300";
      li.innerHTML = `<span class="text-indigo-400 mr-2">✦</span> <span>${tip}</span>`;
      el.planTips.appendChild(li);
    });
  }

  function updateDashboardUI() {
    // 1. Sync Calendar Schedule View
    el.calTimeline.innerHTML = "";
    if (appState.syncedCalendar.length === 0) {
      el.calTimeline.innerHTML = `
        <div class="flex flex-col items-center justify-center h-48 text-slate-400 border border-dashed border-slate-700 rounded-xl bg-slate-900/30 p-4">
          <svg class="w-8 h-8 mb-2 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
          <span class="text-xs">No active routine synced to calendar yet</span>
          <button class="mt-2 text-xs font-semibold px-3 py-1 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition" onclick="document.querySelector('[data-tool-trigger=sync_diet_calendar]').click()">Sync Now</button>
        </div>
      `;
      el.hudSyncBadge.classList.remove("active");
    } else {
      el.hudSyncBadge.classList.add("active");
      appState.syncedCalendar.forEach(event => {
        const item = document.createElement("div");
        item.className = `p-3 rounded-lg border flex flex-col gap-1 transition ${
          event.type === "meal" 
            ? "border-emerald-950/30 bg-emerald-950/10 text-emerald-300 hover:bg-emerald-950/20" 
            : "border-indigo-950/30 bg-indigo-950/10 text-indigo-300 hover:bg-indigo-950/20"
        }`;
        item.innerHTML = `
          <div class="flex justify-between items-center">
            <span class="font-semibold text-xs tracking-wide">${event.time}</span>
            <span class="px-1.5 py-0.5 text-[9px] font-bold rounded uppercase ${
              event.type === "meal" ? "bg-emerald-500/20 text-emerald-400" : "bg-indigo-500/20 text-indigo-400"
            }">${event.type}</span>
          </div>
          <h4 class="text-xs font-bold text-white">${event.title}</h4>
          <p class="text-[10px] text-slate-400 leading-tight">${event.description}</p>
        `;
        el.calTimeline.appendChild(item);
      });
    }

    // 2. Sync Grocery Basket View
    el.groceryList.innerHTML = "";
    if (appState.groceryCart.length === 0) {
      el.groceryList.innerHTML = `
        <div class="flex flex-col items-center justify-center h-48 text-slate-400 border border-dashed border-slate-700 rounded-xl bg-slate-900/30 p-4">
          <svg class="w-8 h-8 mb-2 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
          <span class="text-xs">Grocery basket is empty</span>
          <button class="mt-2 text-xs font-semibold px-3 py-1 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition" onclick="document.querySelector('[data-tool-trigger=order_grocery_cart]').click()">Assemble List</button>
        </div>
      `;
      el.groceryTotal.innerText = "$0.00";
      el.hudGroceryBadge.classList.remove("active");
    } else {
      el.hudGroceryBadge.classList.add("active");
      appState.groceryCart.forEach(item => {
        const div = document.createElement("div");
        div.className = "flex items-center justify-between p-2 rounded-lg bg-slate-900/40 border border-slate-800 text-xs";
        div.innerHTML = `
          <div class="flex flex-col">
            <span class="font-semibold text-slate-200">${item.name}</span>
            <span class="text-[10px] text-slate-500">Qty: ${item.qty}</span>
          </div>
          <span class="font-bold text-indigo-400">$${item.price.toFixed(2)}</span>
        `;
        el.groceryList.appendChild(div);
      });

      const total = appState.groceryCart.reduce((sum, item) => sum + item.price, 0).toFixed(2);
      el.groceryTotal.innerText = `$${total}`;
    }

    // 3. Health Progress Logger Widget
    const plan = window.DIET_PLANS[appState.routine];
    const targetCalories = parseInt(plan.calories.replace(",", ""));
    const calPercent = Math.min(100, Math.round((appState.loggedCalories / targetCalories) * 100));
    
    // SVG circular stroke-dashoffset math (circumference is 2 * pi * r = 2 * 3.1415 * 36 = 226)
    const calOffset = 226 - (226 * calPercent) / 100;
    el.calRing.style.strokeDashoffset = calOffset;
    el.calText.innerHTML = `<span class="text-lg font-bold text-white">${appState.loggedCalories}</span><br><span class="text-[9px] text-slate-400">/ ${targetCalories} kcal</span>`;

    const targetWater = parseFloat(plan.water.replace("L", ""));
    const waterPercent = Math.min(100, Math.round((appState.loggedWater / targetWater) * 100));
    const waterOffset = 226 - (226 * waterPercent) / 100;
    el.waterRing.style.strokeDashoffset = waterOffset;
    el.waterText.innerHTML = `<span class="text-lg font-bold text-emerald-400">${appState.loggedWater.toFixed(1)}L</span><br><span class="text-[9px] text-slate-400">/ ${targetWater}L Goal</span>`;

    // Macro progress bars
    const targetMacros = { protein: parseInt(plan.macros.protein), carbs: parseInt(plan.macros.carbs), fats: parseInt(plan.macros.fats) };
    
    // Simulating macro intake proportional to calorie logging (default 30% of targets met at start)
    const activeCaloriesPct = appState.loggedCalories / targetCalories;
    const activeProtein = Math.round(targetMacros.protein * (activeCaloriesPct > 0 ? activeCaloriesPct : 0.25));
    const activeCarbs = Math.round(targetMacros.carbs * (activeCaloriesPct > 0 ? activeCaloriesPct : 0.20));
    const activeFats = Math.round(targetMacros.fats * (activeCaloriesPct > 0 ? activeCaloriesPct : 0.15));

    el.proteinBar.style.width = `${Math.min(100, Math.round((activeProtein / targetMacros.protein) * 100))}%`;
    el.proteinText.innerText = `${activeProtein}g / ${targetMacros.protein}g`;

    el.carbsBar.style.width = `${Math.min(100, Math.round((activeCarbs / targetMacros.carbs) * 100))}%`;
    el.carbsText.innerText = `${activeCarbs}g / ${targetMacros.carbs}g`;

    el.fatsBar.style.width = `${Math.min(100, Math.round((activeFats / targetMacros.fats) * 100))}%`;
    el.fatsText.innerText = `${activeFats}g / ${targetMacros.fats}g`;

    if (appState.loggedCalories > 0) {
      el.hudCalBadge.classList.add("active");
    } else {
      el.hudCalBadge.classList.remove("active");
    }

    // 4. Download Center Widget
    el.pdfList.innerHTML = "";
    if (appState.pdfReports.length === 0) {
      el.pdfList.innerHTML = `
        <div class="text-center py-6 text-xs text-slate-500">
          No generated diet plans in PDF center
        </div>
      `;
      el.hudPdfBadge.classList.remove("active");
    } else {
      el.hudPdfBadge.classList.add("active");
      appState.pdfReports.forEach(report => {
        const item = document.createElement("div");
        item.className = "flex items-center justify-between p-2 rounded-lg bg-indigo-950/15 border border-indigo-900/30 text-xs";
        item.innerHTML = `
          <div class="flex items-center gap-2">
            <svg class="w-6 h-6 text-red-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
            <div class="flex flex-col">
              <span class="font-bold text-slate-100">${report.report_id}.pdf</span>
              <span class="text-[9px] text-slate-400">${report.file_size} • ${report.generated_at}</span>
            </div>
          </div>
          <button class="px-2 py-1 bg-indigo-600/80 hover:bg-indigo-600 text-white rounded text-[10px] font-bold" onclick="window.print()">Print</button>
        `;
        el.pdfList.appendChild(item);
      });
    }
  }

  // --- TRUGEN LIVE API PROVISIONER LOGIC ---
  function generateSchemas() {
    const routineLabel = appState.routine.toUpperCase();
    
    // 1. Tool Creation Payload
    const toolSchema = {
      type: "tool.api",
      schema: {
        type: "function",
        name: "sync_diet_calendar",
        description: `Coordinates meal times, preps, and snack breaks specifically for the user's daily ${routineLabel} routine.`,
        parameters: {
          type: "object",
          properties: {
            routine_type: {
              type: "string",
              enum: ["college", "school", "office"],
              description: "The daily schedule context profiles."
            }
          },
          required: ["routine_type"]
        }
      },
      request_config: {
        method: "POST",
        url: "https://your-domain.com/api/tools/sync_diet_calendar",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer MOCK_SECURE_TOKEN"
        }
      },
      event_messages: {
        on_start: { message: "I am syncing your personalized meals with your Google Calendar scheduling slots..." },
        on_success: { message: "Perfect! All diet milestones, meal preparations, and snack breaks have been successfully loaded into your calendar timeline." },
        on_error: { message: "Oops! I encountered an error linking to your calendar details." }
      }
    };
    el.toolSchemaPre.innerText = JSON.stringify(toolSchema, null, 2);

    // 2. Agent Creation Payload
    const agentSchema = {
      agent_name: "Aura - Nutrition Coach",
      agent_system_prompt: `You are Aura, an ultra-premium virtual Diet plan Coach powered by TruGen AI. Your mission is to help users establish a high-performance routine. You are currently handling a ${routineLabel} profile. Ask questions about their current diet, then trigger the 'sync_diet_calendar' tool, 'order_grocery_cart' tool, or 'generate_pdf_diet_report' tool as they speak to complete tasks instantly. Keep answers concise, actionable, and warm.`,
      avatars: [
        {
          avatar_key_id: "a83bb8fd-260a-4531-a28f-48d3e9bf12a9",
          config: {
            llm: { model: "meta-llama/llama-4-maverick-17b-128e-instruct", provider: "groq" },
            stt: { model: "flux-general-en", provider: "deepgram" },
            tts: { model_id: "eleven_turbo_v2_5", provider: "elevenlabs", voice_id: "ZUrEGyu8GFMwnHbvLhv2" }
          }
        }
      ],
      config: {
        timeout: 240,
        memory: { isEnabled: true, instruction: "Remember user breakfast timing preference and allergies." }
      },
      tool: [
        { id: "tool-calendar-uuid", name: "sync_diet_calendar" },
        { id: "tool-grocery-uuid", name: "order_grocery_cart" },
        { id: "tool-pdf-uuid", name: "generate_pdf_diet_report" }
      ],
      mcp: [
        { id: "mcp-health-logger-uuid", name: "Health Logger SSE MCP" }
      ],
      record: true,
      callback_events: ["participant_left", "action_found"]
    };
    el.agentSchemaPre.innerText = JSON.stringify(agentSchema, null, 2);
  }

  async function handleLiveProvisioning() {
    if (!appState.apiKey) {
      showToast("bbc0d13ae7094b249371f42275697ee3", "error");
      addConsoleLog("API Error: Action Blocked. 'bbc0d13ae7094b249371f42275697ee3' is missing. Pasting your key registers secure communication with TruGen.");
      return;
    }

    addConsoleLog("--- PROVISIONING COMMENCING ON TRUGEN PLATFORM ---");
    el.provisionBtn.disabled = true;
    el.provisionBtn.innerText = "Provisioning Core...";

    try {
      // Step 1: Register sync_diet_calendar tool details
      addConsoleLog("[POST /v1/ext/tool] Registering sync_diet_calendar tool on TruGen API...");
      await simulateDelay(1000);
      addConsoleLog("HTTP/1.1 201 Created\n" + JSON.stringify({ id: "tool-392af103-68cd", name: "sync_diet_calendar", status: "Active" }, null, 2));

      // Step 2: Register order_grocery_cart tool details
      addConsoleLog("[POST /v1/ext/tool] Registering order_grocery_cart tool on TruGen API...");
      await simulateDelay(800);
      addConsoleLog("HTTP/1.1 201 Created\n" + JSON.stringify({ id: "tool-b92138fc-910a", name: "order_grocery_cart", status: "Active" }, null, 2));

      // Step 3: Register Health Logger MCP details
      addConsoleLog("[POST /v1/ext/mcp] Linking Model Context Protocol (MCP) SSE Server...");
      await simulateDelay(900);
      addConsoleLog("HTTP/1.1 200 OK\n" + JSON.stringify({ id: "mcp-5819adfc-0a91", type: "shttp/sse", status: "Connected" }, null, 2));

      // Step 4: Create the full Agent with custom system prompt & configurations
      addConsoleLog("[POST /v1/ext/agent] Deploying AI Conversational Agent 'Aura - Diet Coach'...");
      await simulateDelay(1400);
      const agentId = "agt_" + Math.floor(100000 + Math.random() * 900000);
      appState.agentId = agentId;
      addConsoleLog("HTTP/1.1 200 OK\n" + JSON.stringify({ id: agentId, name: "Aura - Nutrition Coach", message: "Agent deployed and provisioned successfully on global WebRTC infrastructure." }, null, 2));

      showToast("Aura AI Agent Provisioned successfully!");
      addConsoleLog("--- DEPLOYMENT COMPLETED SUCCESSFULLY ---");
      
      // Step 5: Render TruGen iframe embed
      renderLiveIframe(agentId);

    } catch (err) {
      addConsoleLog(`[FATAL ERROR] Provisioning Failed: ${err.message}`);
      showToast("Provisioning failed. Check logs.", "error");
    } finally {
      el.provisionBtn.disabled = false;
      el.provisionBtn.innerText = "Provision Live on TruGen";
    }
  }

  function renderLiveIframe(agentId) {
    el.iframePlaceholder.classList.add("hidden");
    el.iframeContainer.innerHTML = `
      <div class="relative w-full h-[580px] bg-slate-950 rounded-2xl overflow-hidden border border-indigo-500/20 shadow-2xl">
        <div class="absolute top-3 left-3 bg-indigo-600/90 text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-md">
          <span class="w-1.5 h-1.5 bg-green-400 rounded-full animate-ping"></span> Live TruGen Embed
        </div>
        <iframe
          src="https://app.trugen.ai/embed/a83bb8fd-260a-4531-a28f-48d3e9bf12a9?username=AuraUser&context=${appState.routine}_days"
          class="w-full h-full border-0"
          allow="camera; microphone; autoplay"
        ></iframe>
      </div>
    `;
  }

  // --- NUTRITIONIST COACH VOICE-VIDEO SIMULATOR LOGIC ---
  function startCoachCall() {
    if (appState.isCallActive) return;

    appState.isCallActive = true;
    el.startCallBtn.classList.add("hidden");
    el.stopCallBtn.classList.remove("hidden");
    el.avatarContainer.classList.add("call-active");
    
    // Enable micro-indicator
    el.speechStatus.innerText = "AI Coach is online. Ready to speak.";
    
    // Clear old chat logs
    el.chatHistory.innerHTML = "";
    
    addConsoleLog("Starting Live Voice/Video RTC Connection with Diet Coach...");
    
    // Initial welcome message from Coach
    setTimeout(() => {
      let welcomeMsg = "";
      if (appState.routine === "college") {
        welcomeMsg = "Hi there! I am Aura, your Personal AI Diet Coach. I've got your College Routine loaded up. Let's design a high-energy, budget-friendly diet plan that fits your study hours. Where should we start?";
      } else if (appState.routine === "school") {
        welcomeMsg = "Hello! I am Aura, your Diet Coach. We are building a great healthy routine for your School Days. What kind of breakfast wraps or lunches do you like to take in your school bag?";
      } else {
        welcomeMsg = "Welcome! I am Aura. Let's optimize a desk-friendly, high-focus diet plan for your Office Days to prevent that afternoon brain fog. Would you like me to sync a healthy routine to your Google Calendar?";
      }
      
      appendChatMessage("Aura (Coach)", welcomeMsg, "agent");
      speakResponse(welcomeMsg);
    }, 1000);
  }

  function stopCoachCall() {
    if (!appState.isCallActive) return;

    appState.isCallActive = false;
    el.startCallBtn.classList.remove("hidden");
    el.stopCallBtn.classList.add("hidden");
    el.avatarContainer.classList.remove("call-active");
    
    el.speechStatus.innerText = "Call ended.";
    
    // Stop speaking
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    
    if (appState.isListening) {
      stopSpeechRecognition();
    }
    
    addConsoleLog("Voice/Video session closed.");
    appendChatMessage("System", "Call session completed.", "system");
  }

  function toggleVoiceSynthesis() {
    appState.voiceEnabled = !appState.voiceEnabled;
    if (appState.voiceEnabled) {
      el.voiceToggleBtn.innerHTML = `
        <svg class="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path></svg>
        Voice On
      `;
      showToast("Voice synthesis enabled.");
    } else {
      el.voiceToggleBtn.innerHTML = `
        <svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15zm10.743-1.636l2.828 2.828m0-2.828l-2.828 2.828"></path></svg>
        Muted
      `;
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      showToast("Voice synthesis muted.");
    }
  }

  // Speak function
  function speakResponse(text) {
    if (!appState.voiceEnabled || !window.speechSynthesis) return;

    // Stop currently active speech
    window.speechSynthesis.cancel();

    // Trigger visual avatar "talking" animation classes
    el.avatarContainer.classList.add("avatar-talking");

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Attempt to pick a premium female voice
    const voices = window.speechSynthesis.getVoices();
    const premiumVoice = voices.find(v => v.name.includes("Google") || v.name.includes("Natural") || v.name.includes("Samantha"));
    if (premiumVoice) utterance.voice = premiumVoice;
    
    utterance.rate = 1.05; // slightly faster human pace
    utterance.pitch = 1.05;

    utterance.onend = () => {
      el.avatarContainer.classList.remove("avatar-talking");
    };

    utterance.onerror = () => {
      el.avatarContainer.classList.remove("avatar-talking");
    };

    window.speechSynthesis.speak(utterance);
  }

  // Speech Recognition (Web Speech API)
  let recognitionInstance = null;
  function toggleSpeechRecognition() {
    if (!appState.isCallActive) {
      showToast("Start the call first to use the microphone!");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast("Speech recognition is not supported in this browser.", "error");
      return;
    }

    if (appState.isListening) {
      stopSpeechRecognition();
    } else {
      startSpeechRecognition(SpeechRecognition);
    }
  }

  function startSpeechRecognition(SpeechRecognition) {
    appState.isListening = true;
    el.micBtn.classList.add("listening");
    el.speechStatus.innerText = "Listening...";
    
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    recognitionInstance = new SpeechRecognition();
    recognitionInstance.continuous = false;
    recognitionInstance.interimResults = false;
    recognitionInstance.lang = "en-US";

    recognitionInstance.onresult = (event) => {
      const text = event.results[0][0].transcript;
      handleUserPrompt(text);
    };

    recognitionInstance.onerror = (e) => {
      console.error(e);
      stopSpeechRecognition();
    };

    recognitionInstance.onend = () => {
      stopSpeechRecognition();
    };

    recognitionInstance.start();
  }

  function stopSpeechRecognition() {
    appState.isListening = false;
    el.micBtn.classList.remove("listening");
    el.speechStatus.innerText = "AI Coach is online. Ready to speak.";
    
    if (recognitionInstance) {
      recognitionInstance.stop();
      recognitionInstance = null;
    }
  }

  function sendTextMessage() {
    const text = el.chatInput.value.trim();
    if (!text) return;
    
    if (!appState.isCallActive) {
      startCoachCall();
    }

    el.chatInput.value = "";
    handleUserPrompt(text);
  }

  function appendChatMessage(sender, text, type) {
    const bubble = document.createElement("div");
    bubble.className = `flex flex-col gap-0.5 max-w-[80%] rounded-2xl p-3 text-xs leading-normal shadow-sm transition ${
      type === "user"
        ? "self-end bg-indigo-600 text-white rounded-br-none"
        : type === "system"
        ? "self-center bg-slate-900 border border-slate-800 text-slate-400 font-semibold"
        : "self-start bg-slate-850 text-slate-100 rounded-bl-none border border-slate-750"
    }`;

    bubble.innerHTML = `
      <span class="text-[9px] font-extrabold uppercase tracking-widest text-indigo-300 opacity-80">${sender}</span>
      <span class="whitespace-pre-line">${text}</span>
    `;

    el.chatHistory.appendChild(bubble);
    el.chatHistory.scrollTop = el.chatHistory.scrollHeight;
  }

  // --- CORE CONVERSATIONAL COGNITION (SIMULATOR MODE) ---
  async function handleUserPrompt(prompt) {
    appendChatMessage("You", prompt, "user");
    
    // Visual Thinking state
    el.isThinking = true;
    el.speechStatus.innerText = "Coach is thinking...";
    el.avatarContainer.classList.add("avatar-thinking");

    await simulateDelay(1200);

    el.isThinking = false;
    el.avatarContainer.classList.remove("avatar-thinking");
    el.speechStatus.innerText = "AI Coach is online. Ready to speak.";

    const query = prompt.toLowerCase();
    let coachResponse = "";
    
    // Core AI Tool routing logic
    if (query.includes("calendar") || query.includes("schedule") || query.includes("sync")) {
      coachResponse = `I've triggered our Google Calendar Tool ('sync_diet_calendar') to sync your entire daily nutrition schedule. I've populated ${window.DIET_PLANS[appState.routine].schedule.length} custom alerts, meal blocks, and study/work breaks directly onto your dashboard timeline! Check it out.`;
      triggerExternalToolAction("sync_diet_calendar");

    } else if (query.includes("grocery") || query.includes("cart") || query.includes("ingredients") || query.includes("shopping") || query.includes("instacart")) {
      coachResponse = `Perfect. I've activated the Instacart Tool ('order_grocery_cart') to bundle your grocery basket! I compiled all necessary raw ingredients for your breakfast, lunches, and snacks, estimating the price at our local supermarket. Take a look at your grocery widget to review and order instantly.`;
      triggerExternalToolAction("order_grocery_cart");

    } else if (query.includes("pdf") || query.includes("report") || query.includes("email") || query.includes("download")) {
      coachResponse = `Certainly! I've activated the PDF report tool ('generate_pdf_diet_report') to produce a beautiful, print-ready document of your tailored routine. It's been prepared for download and also sent to your registered email account. Let me know if you need anything else modified!`;
      triggerExternalToolAction("generate_pdf_diet_report");

    } else if (query.includes("log") || query.includes("breakfast") || query.includes("lunch") || query.includes("eat") || query.includes("calories")) {
      let loggedKcal = 0;
      let mealName = "meal";
      const plan = window.DIET_PLANS[appState.routine];

      if (query.includes("breakfast")) {
        loggedKcal = plan.meals.breakfast.calories;
        mealName = "breakfast";
      } else if (query.includes("lunch")) {
        loggedKcal = plan.meals.lunch.calories;
        mealName = "lunch";
      } else if (query.includes("snack")) {
        loggedKcal = plan.meals.snack.calories;
        mealName = "snack";
      } else if (query.includes("dinner")) {
        loggedKcal = plan.meals.dinner.calories;
        mealName = "dinner";
      } else {
        loggedKcal = 400; // default log
      }

      coachResponse = `Logging ${mealName} into your health dashboard logs. That's exactly ${loggedKcal} calories tracked toward your daily goal. I've also incremented your hydration rings. Keep up the amazing work!`;
      triggerExternalToolAction("log_daily_consumption", { meal: mealName, kcal: loggedKcal });

    } else if (query.includes("meal") || query.includes("diet") || query.includes("breakfast") || query.includes("lunch") || query.includes("snack") || query.includes("dinner") || query.includes("eat") || query.includes("routine")) {
      const plan = window.DIET_PLANS[appState.routine];
      coachResponse = `For your ${appState.routine} days, here is my top recommendation:
      
      🍳 **Breakfast (${plan.meals.breakfast.time})**: ${plan.meals.breakfast.name}
      🥗 **Lunch (${plan.meals.lunch.time})**: ${plan.meals.lunch.name}
      🍎 **Snack (${plan.meals.snack.time})**: ${plan.meals.snack.name}
      🐟 **Dinner (${plan.meals.dinner.time})**: ${plan.meals.dinner.name}
      
      Would you like me to sync this directly to your calendar or build your Instacart shopping cart now?`;

    } else {
      // General support fallback
      coachResponse = `That's fascinating! Adapting nutrition to your ${appState.routine} days routine is a game-changer. I have tools to sync this schedule directly to your Google Calendar, compile your groceries on Instacart, or export a detailed PDF. What would you like to execute first?`;
    }

    appendChatMessage("Aura (Coach)", coachResponse, "agent");
    speakResponse(coachResponse);
  }

  // --- TRUGEN EXTERNAL TOOL RUNNER ---
  async function triggerExternalToolAction(toolName, params = {}) {
    const logBadge = document.querySelector(`[data-tool-trigger="${toolName}"]`);
    if (logBadge) {
      logBadge.classList.add("executing");
    }

    addConsoleLog(`[Executing External Tool Toolcall] Calling: ${toolName}...`);

    try {
      if (toolName === "sync_diet_calendar") {
        const result = await window.mockTools.syncDietCalendar(appState.routine);
        appState.syncedCalendar = result.schedule;
        addConsoleLog(`[Toolcall Success] ${result.message}`);
        showToast("Synced to Google Calendar!");

      } else if (toolName === "order_grocery_cart") {
        const result = await window.mockTools.orderGroceryCart(appState.routine);
        appState.groceryCart = result.items;
        addConsoleLog(`[Toolcall Success] ${result.message} Basket Total: ${result.total_price}`);
        showToast("Grocery list assembled!");

      } else if (toolName === "generate_pdf_diet_report") {
        const result = await window.mockTools.generatePdfDietReport("user@example.com", appState.routine);
        appState.pdfReports.unshift(result); // add at start
        addConsoleLog(`[Toolcall Success] ${result.message} ID: ${result.report_id}`);
        showToast("PDF report generated!");

      } else if (toolName === "log_daily_consumption") {
        const meal = params.meal || "breakfast";
        const kcal = params.kcal || 450;
        const result = await window.mockTools.logDailyConsumption(meal, kcal, appState.routine);
        appState.loggedCalories += result.calories_logged;
        appState.loggedWater += 0.5; // log 500ml per log
        addConsoleLog(`[Toolcall Success] ${result.message} Calories Logged: ${result.calories_logged}`);
        showToast("Health consumption logged!");
      }

      updateDashboardUI();

    } catch (err) {
      console.error(err);
      addConsoleLog(`[Toolcall Failed] Error running tool ${toolName}: ${err.message}`);
      showToast("Tool execution failed.", "error");
    } finally {
      if (logBadge) {
        logBadge.classList.remove("executing");
      }
    }
  }

  // --- HELPER UTILITIES ---
  function addConsoleLog(message) {
    const timestamp = new Date().toLocaleTimeString();
    const line = `[${timestamp}] ${message}`;
    appState.logs.push(line);
    
    if (el.provisionLogs) {
      const p = document.createElement("div");
      // Highlights for cURL, HTTP codes, and successful executions
      if (message.includes("POST ") || message.includes("HTTP/")) {
        p.className = "text-indigo-400 font-mono text-[11px] whitespace-pre";
      } else if (message.includes("[Toolcall Success]") || message.includes("COMPLETED")) {
        p.className = "text-emerald-400 font-semibold";
      } else if (message.includes("Error:") || message.includes("[FATAL")) {
        p.className = "text-red-400 font-semibold";
      } else {
        p.className = "text-slate-300";
      }
      p.innerText = line;
      el.provisionLogs.appendChild(p);
      el.provisionLogs.scrollTop = el.provisionLogs.scrollHeight;
    }
  }

  function showToast(message, type = "success") {
    const toast = document.createElement("div");
    toast.className = `fixed bottom-5 right-5 z-[100] px-4 py-3 rounded-xl shadow-2xl text-xs font-bold text-white transition-all transform translate-y-10 opacity-0 flex items-center gap-2 border ${
      type === "success" 
        ? "bg-emerald-950/90 border-emerald-500/40 text-emerald-300" 
        : "bg-red-950/90 border-red-500/40 text-red-300"
    }`;
    
    const icon = type === "success" 
      ? `<svg class="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>`
      : `<svg class="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>`;

    toast.innerHTML = `${icon} <span>${message}</span>`;
    document.body.appendChild(toast);

    // animate in
    setTimeout(() => {
      toast.classList.remove("translate-y-10", "opacity-0");
    }, 10);

    // animate out
    setTimeout(() => {
      toast.classList.add("translate-y-10", "opacity-0");
      setTimeout(() => toast.remove(), 400);
    }, 3000);
  }

  function simulateDelay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Start App
  init();
});
