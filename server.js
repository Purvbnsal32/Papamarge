// server.js
// Vanilla Node.js Web Server (Zero-Dependencies)
// Acts as the Local Host + Webhook Endpoint for TruGen's Real-Time Cloud Agent

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8000;

// Maintain list of connected clients for Server-Sent Events (SSE)
let sseClients = [];

// Helper to broadcast events to all active dashboard pages
function broadcastEvent(type, data) {
  const payload = JSON.stringify({ type, data });
  console.log(`[SSE Broadcast] Sending event '${type}' to ${sseClients.length} listener(s).`);
  sseClients.forEach(client => {
    client.write(`data: ${payload}\n\n`);
  });
}

const server = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method;

  // CORS Headers for TruGen API endpoints
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-api-key');

  if (method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // 1. SSE EVENT STREAM ENDPOINT (Dashboard listens here)
  if (url === '/api/events' && method === 'GET') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });

    sseClients.push(res);
    console.log(`[SSE Client Connected] Active clients: ${sseClients.length}`);

    // Keep connection alive
    const keepAlive = setInterval(() => {
      res.write(': keepalive\n\n');
    }, 25000);

    req.on('close', () => {
      clearInterval(keepAlive);
      sseClients = sseClients.filter(c => c !== res);
      console.log(`[SSE Client Disconnected] Active clients: ${sseClients.length}`);
    });
    return;
  }

  // 2. TRUGEN WEBHOOK / TOOL CALL: sync_diet_calendar
  if (url === '/api/tools/sync_diet_calendar' && method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        const routineType = payload.routine_type || 'college';
        
        console.log(`[Webhook Hit] TruGen Cloud triggered sync_diet_calendar for routine: ${routineType}`);
        
        // Broadcast to dashboard frontend to update UI
        broadcastEvent('sync_diet_calendar', { routine: routineType });
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          status: 'success',
          message: `Successfully processed sync_diet_calendar tool call on local calendar.`,
          routine: routineType
        }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
      }
    });
    return;
  }

  // 3. TRUGEN WEBHOOK / TOOL CALL: order_grocery_cart
  if (url === '/api/tools/order_grocery_cart' && method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        const routineType = payload.routine_type || 'college';
        
        console.log(`[Webhook Hit] TruGen Cloud triggered order_grocery_cart for routine: ${routineType}`);
        
        broadcastEvent('order_grocery_cart', { routine: routineType });
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          status: 'success',
          message: `Grocery basket ingredients assembled successfully.`,
          routine: routineType
        }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
      }
    });
    return;
  }

  // 4. TRUGEN WEBHOOK / TOOL CALL: generate_pdf_diet_report
  if (url === '/api/tools/generate_pdf_diet_report' && method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        const routineType = payload.routine_type || 'college';
        const email = payload.email || 'user@example.com';
        
        console.log(`[Webhook Hit] TruGen Cloud triggered generate_pdf_diet_report for ${routineType} to ${email}`);
        
        broadcastEvent('generate_pdf_diet_report', { routine: routineType, email });
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          status: 'success',
          message: `PDF generated and dispatched to ${email}.`,
          routine: routineType
        }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
      }
    });
    return;
  }

  // 5. TRUGEN WEBHOOK / TOOL CALL: log_daily_consumption
  if (url === '/api/tools/log_daily_consumption' && method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        const mealType = payload.meal_type || 'breakfast';
        const calories = payload.calories || 400;
        const routineType = payload.routine_type || 'college';
        
        console.log(`[Webhook Hit] TruGen Cloud triggered log_daily_consumption: ${mealType} (${calories} kcal)`);
        
        broadcastEvent('log_daily_consumption', { meal: mealType, kcal: calories, routine: routineType });
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          status: 'success',
          message: `Consumption of ${mealType} logged successfully.`,
          calories_logged: calories
        }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
      }
    });
    return;
  }

  // 6. STATIC FILES SERVER
  let filePath = path.join(__dirname, url === '/' ? 'index.html' : url);
  const extname = path.extname(filePath);
  
  let contentType = 'text/html';
  switch (extname) {
    case '.js':
      contentType = 'text/javascript';
      break;
    case '.css':
      contentType = 'text/css';
      break;
    case '.json':
      contentType = 'application/json';
      break;
    case '.png':
      contentType = 'image/png';
      break;
    case '.jpg':
      contentType = 'image/jpg';
      break;
    case '.svg':
      contentType = 'image/svg+xml';
      break;
  }

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 File Not Found');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end(`500 Server Error: ${err.code}`);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`================================================================`);
  console.log(`  AURA DIET AI WEBHOOK SERVER ACTIVE ON PORT ${PORT}              `);
  console.log(`  Dashboard: http://localhost:${PORT}                             `);
  console.log(`================================================================`);
  console.log(`  TruGen Tool URLs (to route via ngrok/localtunnel):            `);
  console.log(`  - Calendar:   [POST] /api/tools/sync_diet_calendar            `);
  console.log(`  - Grocery:    [POST] /api/tools/order_grocery_cart            `);
  console.log(`  - PDF Export: [POST] /api/tools/generate_pdf_diet_report      `);
  console.log(`  - Health Log: [POST] /api/tools/log_daily_consumption         `);
  console.log(`================================================================`);
});
