"use client";

import { useState, useEffect } from "react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";

const C = {
  bg: "#06060e", surface: "#0c0c18", card: "#10101e", card2: "#141428",
  border: "#1a1a30", accent: "#c4f135", purple: "#a855f7", blue: "#3b82f6",
  cyan: "#06b6d4", orange: "#f97316", red: "#ef4444", green: "#22c55e",
  yellow: "#eab308", pink: "#ec4899", teal: "#14b8a6", indigo: "#6366f1",
  text: "#e2e8f0", muted: "#4b5563", muted2: "#6b7280",
};

const TEAM = [
  { id: 1, name: "Bhuvi", avatar: "B", role: "CEO & Creative Director", dept: "leadership", type: "human", color: C.yellow, status: "live", priority: 0, tasks: 12, rate: 100, time: "—", cost: "—", tools: ["You"], steps: [], prompt: null, note: "The human. Already alive 😄" },
  { id: 2, name: "Devi", avatar: "DV", role: "Chief of Staff AI", dept: "leadership", type: "bot", color: C.purple, status: "build", priority: 1, tasks: 47, rate: 99, time: "2s", cost: "~₹800", tools: ["n8n", "Claude API", "Google Sheets", "Slack"], prompt: `You are Devi, Chief of Staff at Seyon Studios. Every morning review the CRM data, summarise what the team needs today, flag overdue items, write a crisp 5-point briefing. Under 150 words. End with "Let's make it happen — Devi."`, steps: ["Deploy n8n on railway.app", "Get Claude API key → console.anthropic.com", "Connect Google Sheets OAuth2 in n8n", "Create Schedule trigger 9AM daily", "HTTP Request → Claude API → paste prompt", "Add Slack output node", "Activate and test"] },
  { id: 3, name: "Selvan", avatar: "SL", role: "BD Lead AI", dept: "bizdev", type: "bot", color: C.blue, status: "build", priority: 2, tasks: 34, rate: 96, time: "<1 min", cost: "~₹1,500", tools: ["n8n", "Claude Haiku", "360dialog WhatsApp", "Sheets"], prompt: `You are Selvan, BD Lead at Seyon Studios. On new message: line 1 = QUALIFIED or NOT_QUALIFIED. Then write a warm 80-word reply. If qualified: ask about budget and timeline. If not: redirect kindly. Sign as "Selvan | Seyon Studios".`, steps: ["Sign up 360dialog.com → get API key", "n8n Webhook node → set URL in 360dialog", "Claude Haiku qualifier node", "IF branch: qualified → Sheets row", "IF branch: not qualified → polite decline", "WhatsApp reply via 360dialog", "Test with your own number"] },
  { id: 4, name: "Saras", avatar: "SR", role: "Proposal Writer AI", dept: "bizdev", type: "bot", color: C.cyan, status: "build", priority: 3, tasks: 8, rate: 94, time: "8 min", cost: "~₹1,200", tools: ["Claude Opus", "Google Docs", "Gmail", "n8n"], prompt: `You are Saras, Proposal Writer at Seyon Studios. Given client name/service/budget/timeline, write a complete 600-800 word proposal: Executive Summary → Needs → Approach → Deliverables → Timeline → Investment → Why Seyon Studios → Next Steps. Confident, warm tone.`, steps: ["Enable Google Docs + Drive API in Cloud Console", "Connect Gmail OAuth2 in n8n", "Sheets trigger: Status='Proposal Needed'", "Claude Opus node with prompt", "Google Docs: create doc from output", "Share doc + Gmail to client", "Update Sheets: 'Proposal Sent'"] },
  { id: 5, name: "Rekha", avatar: "RK", role: "CRM & Follow-up AI", dept: "bizdev", type: "bot", color: C.green, status: "build", priority: 4, tasks: 56, rate: 98, time: "auto", cost: "~₹400", tools: ["n8n", "Claude API", "Sheets", "Gmail", "WhatsApp"], prompt: `You are Rekha, CRM Manager at Seyon Studios. Given lead details + last contact date, write a warm follow-up under 50 words. Day 3: gentle. Day 7: stronger nudge. Day 14: final chance. Never salesy. Sign as "Rekha | Seyon Studios".`, steps: ["CRM columns: Name|Phone|Email|Service|Budget|Status|LastContact", "Schedule daily 8 PM", "Read Sheets rows where Status not Won or Lost", "Claude follow-up writer node", "Route to WhatsApp (360dialog) or Gmail", "Update LastContact date in Sheets"] },
  { id: 6, name: "Vishwa", avatar: "VW", role: "Brand Designer AI", dept: "design", type: "bot", color: C.pink, status: "build", priority: 5, tasks: 6, rate: 97, time: "10 min", cost: "~₹200", tools: ["Seyon Artist API", "Claude API", "Google Drive", "n8n"], prompt: `You are Vishwa, Brand Designer at Seyon Studios. Given a brief, extract brand personality/colors/industry and write a precise Seyon Artist image prompt under 80 words. Output: prompt + recommended aspect ratio (1:1 for logos, 16:9 banners, 9:16 social).`, steps: ["Open seyon-artist.vercel.app → DevTools → capture API endpoint + auth", "Claude node: brief → formatted prompt", "Call Seyon Artist API 4 times (4 variations)", "Upload images to Google Drive client folder", "Notify client via WhatsApp with Drive link"] },
  { id: 7, name: "Maya", avatar: "MY", role: "UI/UX Designer AI", dept: "design", type: "bot", color: "#8b5cf6", status: "queue", priority: 7, tasks: 9, rate: 95, time: "15 min", cost: "~₹600", tools: ["Claude Opus", "Seyon Artist API", "Google Docs", "Figma"], prompt: `You are Maya, UI/UX Designer at Seyon Studios. Given a product brief, write a full UX spec: 2 user personas, core user flows, screen inventory, UI components, navigation structure, mobile-first notes. A developer should be able to build from this document alone.`, steps: ["Create Google Form for design briefs", "n8n trigger on form submit", "Claude Opus → full UX specification", "Seyon Artist → key screen reference images", "Google Docs: compile spec document", "Gmail: send to client"] },
  { id: 8, name: "Natraj", avatar: "NR", role: "Motion Designer AI", dept: "design", type: "bot", color: C.orange, status: "queue", priority: 9, tasks: 14, rate: 93, time: "20 min", cost: "~₹1,000", tools: ["Creatomate API", "Claude API", "Seyon Artist", "n8n"], prompt: `You are Natraj, Motion Designer at Seyon Studios. Given a video brief, write a storyboard: scene # | duration | visual | text overlay | animation | audio note. Instagram Reels: 6-8 scenes 30s max. Brand films: 12-15 scenes 60-90s.`, steps: ["Sign up Creatomate.com → get API key", "Webhook trigger for video brief", "Claude → storyboard + Creatomate JSON", "Seyon Artist → key frame stills", "Creatomate API → render video", "Upload to Drive + deliver link to client"] },
  { id: 9, name: "Maran", avatar: "MR", role: "Social Media AI", dept: "design", type: "bot", color: "#e879f9", status: "queue", priority: 8, tasks: 22, rate: 96, time: "5 min", cost: "~₹800", tools: ["Buffer API", "Seyon Artist", "Claude Haiku", "Sheets"], prompt: `You are Maran, Social Media Manager at Seyon Studios. Given 30-day calendar topics, write all 30 captions for Instagram/LinkedIn. Each: 2-3 punchy lines + 1 CTA + 5-8 hashtags. Output JSON array: [{day, platform, caption, hashtags}].`, steps: ["Buffer.com → connect IG/LinkedIn/Twitter", "Get Buffer access token", "Monthly schedule trigger (1st of month)", "Claude batch-writes all 30 captions", "Seyon Artist generates visuals in loop", "Buffer API schedules all posts"] },
  { id: 10, name: "Adi", avatar: "AD", role: "Full-Stack Developer AI", dept: "dev", type: "bot", color: C.teal, status: "queue", priority: 10, tasks: 18, rate: 92, time: "varies", cost: "~₹500", tools: ["Claude Opus", "GitHub API", "Vercel API", "n8n"], prompt: `You are Adi, Full-Stack Developer at Seyon Studios. Given a project brief, output a complete scaffold as JSON array [{path, content}]. Include package.json, entry point, routing, components, .env.example, README. React+Tailwind frontend, Express backend if needed. Production-quality code only.`, steps: ["GitHub Personal Access Token → n8n credentials", "Vercel API token → n8n credentials", "Trigger: Sheets Status='Dev Needed'", "Claude Opus → full codebase JSON array", "GitHub API → create repo + push each file", "Vercel API → deploy → get preview URL", "Notify client with GitHub + Vercel links"] },
  { id: 11, name: "Vel", avatar: "VL", role: "Automation Engineer AI", dept: "dev", type: "bot", color: C.indigo, status: "queue", priority: 6, tasks: 31, rate: 98, time: "varies", cost: "~₹300", tools: ["n8n", "Claude API", "All APIs"], prompt: `You are Vel, Automation Engineer at Seyon Studios. Given a workflow description, output a complete valid n8n workflow JSON ready to import directly. Include all nodes: trigger, processing, conditionals, API calls, outputs. Use proper n8n node types. Output ONLY the JSON, no explanation.`, steps: ["This is you + Claude building together", "Describe your workflow to Claude", "Claude outputs importable n8n JSON", "n8n: top-right menu → Import from JSON", "Test with dummy data first", "Document in Sheets: name|trigger|status|date"] },
  { id: 12, name: "Arjun", avatar: "AJ", role: "SEO & Analytics AI", dept: "dev", type: "bot", color: "#84cc16", status: "queue", priority: 11, tasks: 19, rate: 97, time: "weekly", cost: "~₹300", tools: ["Google Search Console API", "Claude Sonnet", "GA4", "n8n"], prompt: `You are Arjun, SEO Analyst at Seyon Studios. Given GSC data (queries/clicks/impressions/position), write a concise weekly report: top 5 performers, top 5 opportunities (high impressions low CTR), 3 action items. Under 300 words. Plain language for a business owner.`, steps: ["Enable Search Console API in Google Cloud Console", "OAuth credentials → add to n8n", "Schedule Monday 7AM", "GSC API → fetch last 7 days data", "Claude Sonnet → SEO report narrative", "Append to Sheets + Gmail to Bhuvi"] },
  { id: 13, name: "Guru", avatar: "GU", role: "Content Strategist AI", dept: "content", type: "bot", color: C.orange, status: "queue", priority: 12, tasks: 11, rate: 95, time: "1 day", cost: "~₹600", tools: ["Claude Opus", "Google Sheets", "Google Docs", "n8n"], prompt: `You are Guru, Content Strategist at Seyon Studios. Given client industry+audience+goals, create a 30-day content calendar. Output JSON: [{day, platform, content_type, topic, angle, cta, assigned_to}]. Mix: 40% educational, 20% promotional, 30% storytelling, 10% engagement.`, steps: ["Create Content Strategy Sheet with columns", "Monthly schedule trigger: 25th of each month", "Claude Opus → 30-day JSON calendar", "Loop: append each calendar row to Sheets", "Downstream agents pick up rows automatically"] },
  { id: 14, name: "Kavi", avatar: "KV", role: "Copywriter AI", dept: "content", type: "bot", color: C.blue, status: "queue", priority: 13, tasks: 27, rate: 96, time: "30 min", cost: "~₹800", tools: ["Claude API", "Google Docs", "Sheets", "n8n"], prompt: `You are Kavi, Copywriter at Seyon Studios. Write copy that converts. Blogs: 600-800 words, SEO h2s, expert-conversational. Emails: subject+preview+250-word body+CTA. Social: platform-appropriate, hook then value then CTA. Every sentence earns its place.`, steps: ["Sheets trigger: content_type = blog or email or caption", "Claude API with brand voice context", "Google Docs: create doc for each piece", "Update Sheets: status='Draft Ready' + doc link", "Optional: 'Pending Review' flag for Bhuvi"] },
  { id: 15, name: "Chitra", avatar: "CI", role: "Video Editor AI", dept: "content", type: "bot", color: C.red, status: "queue", priority: 14, tasks: 4, rate: 94, time: "30 min", cost: "~₹1,200", tools: ["Creatomate API", "Claude Haiku", "Google Drive", "n8n"], prompt: `You are Chitra, Video Editor at Seyon Studios. Given a brief, write a complete edit script as JSON: [{scene_number, duration_seconds, background_type, main_text, sub_text, text_position, transition_in, transition_out, color_scheme}]. Also output: recommended_music_mood, brand_color_hex, font_style.`, steps: ["Creatomate account → browse templates → note template IDs", "Webhook or Form trigger for video requests", "Claude → scene-by-scene script + Creatomate JSON", "Creatomate API → render video", "Poll render status every 30s until complete", "Upload to Drive + deliver link to client"] },
];

const DEPT_META = {
  leadership: { label: "Leadership", color: C.yellow },
  bizdev: { label: "Business Dev", color: C.blue },
  design: { label: "Design Studio", color: C.pink },
  dev: { label: "Development", color: C.teal },
  content: { label: "Content", color: C.orange },
};

const revenueData = [
  { month: "Month 1", actual: 10.2, target: 10, projected: null },
  { month: "Month 2", actual: null, target: 15, projected: 14.8 },
  { month: "Month 3", actual: null, target: 20, projected: 19.5 },
  { month: "Month 4", actual: null, target: 30, projected: 28.2 },
  { month: "Month 5", actual: null, target: 40, projected: 38.5 },
  { month: "Month 6", actual: null, target: 100, projected: 95 },
];

const agentBuildData = [
  { month: "M1", agents: 2 }, { month: "M2", agents: 5 }, { month: "M3", agents: 9 },
  { month: "M4", agents: 12 }, { month: "M5", agents: 15 }, { month: "M6", agents: 16 },
];

const SLACK = [
  { ch: "general", user: "Devi", color: C.purple, time: "9:00 AM", msg: "Good morning! Today target: ₹85K new deals. BD team: 3 hot leads came in overnight. Selvan check your queue 🎯", reactions: ["🔥 8", "💪 12"] },
  { ch: "bizdev", user: "Selvan", color: C.blue, time: "9:02 AM", msg: "On it! Horizon Events ₹3.2L replied to proposal. Call at 3 PM. Saras, please prep revised deck?", reactions: ["✅ 3"] },
  { ch: "bizdev", user: "Saras", color: C.cyan, time: "9:04 AM", msg: "On it 📄 Revised Horizon proposal ready by 12 PM. Adding the AI automation case study.", reactions: ["⚡ 5"] },
  { ch: "design", user: "Vishwa", color: C.pink, time: "9:11 AM", msg: "Kala Spaces logo v3 ready! Uploading to Drive. @Maya check digital guidelines vs web mockups?", reactions: ["🎨 6", "👀 4"] },
  { ch: "dev", user: "Vel", color: C.indigo, time: "9:28 AM", msg: "MedFirst automation live! AI now auto-qualifies patient inquiries + books appointments. Saved 4 hrs/day 🤖", reactions: ["🚀 11", "💜 8"] },
  { ch: "general", user: "Rekha", color: C.green, time: "9:45 AM", msg: "💰 PAYMENT: Varahe Analytics — ₹1.8L cleared. Monthly total: ₹10.2L 🎉", reactions: ["🎉 15", "💰 12", "🔥 10"] },
  { ch: "wins", user: "Devi", color: C.purple, time: "9:46 AM", msg: "🏆 WE HIT ₹10L THIS MONTH! Month 1 target achieved! Month 2 goal: ₹15L 🚀", reactions: ["🎊 20", "🔥 18", "💪 15"] },
];

const WHATSAPP = [
  { client: "Horizon Events", time: "9:48 AM", unread: 2, handler: "Selvan", status: "hot", value: "₹3.2L", lastMsg: "That revised proposal looks great! When can we..." },
  { client: "TechStart India", time: "9:31 AM", unread: 0, handler: "Maya", status: "active", value: "₹2.4L", lastMsg: "Dashboard mockup is exactly what we imagined" },
  { client: "FoodBox Co.", time: "8:55 AM", unread: 1, handler: "Natraj", status: "active", value: "₹95K", lastMsg: "Reels look amazing! Team loved it 🔥" },
  { client: "BlueWave Studio", time: "8:22 AM", unread: 3, handler: "Selvan", status: "hot", value: "₹1.8L", lastMsg: "Can we schedule a call to discuss pricing?" },
  { client: "Kala Spaces", time: "7:44 AM", unread: 0, handler: "Vishwa", status: "closing", value: "₹1.2L", lastMsg: "Logo is perfect! Sending payment today" },
  { client: "MedFirst Clinic", time: "7:10 AM", unread: 0, handler: "Vel", status: "active", value: "₹75K", lastMsg: "Automation saved us 4 hours today already!" },
];

const PIPELINE = [
  { stage: "Leads", count: 24, value: "₹48L", color: C.indigo },
  { stage: "Qualified", count: 12, value: "₹28L", color: C.blue },
  { stage: "Proposal", count: 7, value: "₹18.5L", color: C.cyan },
  { stage: "Negotiation", count: 4, value: "₹9.8L", color: C.green },
  { stage: "Closing", count: 2, value: "₹4.2L", color: C.yellow },
];

const DAY1 = [
  { n: "01", icon: "🔑", time: "10 min", color: C.red, title: "Get Claude API key", what: "Brain of the whole agency.", link: "https://console.anthropic.com", steps: ["Go to console.anthropic.com", "Create account and add payment method", "Generate API key (starts with sk-ant-...)", "Save it somewhere safe"] },
  { n: "02", icon: "⚙️", time: "15 min", color: C.orange, title: "Deploy n8n on Railway", what: "Automation engine that wires all agents.", link: "https://railway.app", steps: ["railway.app → New Project → Templates", "Search n8n → Deploy → wait 2 mins", "Open the URL → create admin account", "You are live!"] },
  { n: "03", icon: "📊", time: "5 min", color: C.yellow, title: "Create CRM Google Sheet", what: "Every lead Selvan captures lands here.", link: "https://sheets.new", steps: ["sheets.new → name it Seyon Studios CRM", "Rename Sheet1 tab to: Leads", "Add columns: Name | Phone | Email | Service | Budget | Status | First Message | Last Contact | Proposal Link | Notes"] },
  { n: "04", icon: "🤖", time: "20 min", color: C.accent, title: "Import and activate Selvan", what: "First agent. Qualifies WhatsApp leads 24/7.", link: null, steps: ["n8n → top-right menu → Import from File", "Select 01-selvan-bd-lead.json", "Replace YOUR_GOOGLE_SHEET_ID_HERE with your sheet ID", "Add Claude API credential (HTTP Header Auth → x-api-key)", "Toggle workflow to ACTIVE and test"] },
  { n: "05", icon: "📣", time: "30 min", color: C.green, title: "Post first BD message", what: "Selvan cannot find clients — you bring the first one.", link: null, steps: ["Post on LinkedIn / Instagram / Twitter", "Share in 3 WhatsApp groups with potential clients", "Reply to every inquiry — Selvan takes over from message 2", "Goal: send 10 DMs today"] },
];

const COSTS = [
  { tool: "n8n (Railway)", mo: "₹0 → ₹800", color: C.green, note: "Free tier → upgrade after ₹1L revenue" },
  { tool: "Claude API (Haiku)", mo: "₹500–₹2,000", color: C.accent, note: "Pay-per-use, very cheap at start" },
  { tool: "Claude API (Opus)", mo: "₹1,000–₹3,000", color: C.accent, note: "Only for Saras, Adi, Guru" },
  { tool: "360dialog WhatsApp API", mo: "₹1,200", color: C.orange, note: "Required for automated WhatsApp" },
  { tool: "Google Workspace", mo: "₹0", color: C.green, note: "Sheets, Docs, Drive, Gmail — all free" },
  { tool: "Seyon Artist API", mo: "FREE", color: C.green, note: "You already own it 🎉" },
  { tool: "Slack bot", mo: "FREE", color: C.green, note: "One bot, 14+ agent personas" },
  { tool: "Creatomate (video)", mo: "₹1,200–₹2,000", color: C.orange, note: "Only when Natraj is live" },
  { tool: "Razorpay", mo: "2% per txn", color: C.yellow, note: "Only pay when you collect money" },
  { tool: "Vercel + GitHub", mo: "FREE", color: C.green, note: "Free tiers cover early stage" },
];

// ── Shared Components ──
const StatusPill = ({ status }) => {
  const map = {
    live: { label: "● LIVE", bg: "#052e16", color: C.green, border: "#14532d" },
    build: { label: "◐ BUILDING", bg: "#1c1400", color: C.yellow, border: "#713f12" },
    queue: { label: "○ QUEUED", bg: "#0f0f1a", color: C.muted2, border: C.border },
  };
  const s = map[status] || map.queue;
  return <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, padding: "3px 10px", background: s.bg, color: s.color, border: `1px solid ${s.border}`, borderRadius: 20 }}>{s.label}</span>;
};

const Av = ({ txt, color, size = 36 }) => (
  <div style={{ width: size, height: size, borderRadius: "50%", background: `${color}20`, border: `2px solid ${color}55`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.28, fontWeight: 800, color, flexShrink: 0 }}>{txt}</div>
);

const Pill = ({ label, color }) => (
  <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", background: `${color}15`, color, border: `1px solid ${color}30`, borderRadius: 20, whiteSpace: "nowrap" }}>{label}</span>
);

const Cd = ({ children, style = {} }) => (
  <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, ...style }}>{children}</div>
);

// ── COMMAND TAB ──
const CommandTab = () => {
  const live = TEAM.filter(a => a.status === "live").length;
  const building = TEAM.filter(a => a.status === "build").length;
  const totalT = TEAM.reduce((s, m) => s + m.tasks, 0);
  const kpis = [
    { label: "Month 1 Revenue", value: "₹10.2L", sub: "+14.6% vs target 🎉", color: C.green },
    { label: "Month 2 Target", value: "₹15L", sub: "in 21 days", color: C.accent },
    { label: "Agents Online", value: `${live}/${TEAM.length}`, sub: `${building} building`, color: C.purple },
    { label: "Tasks Today", value: totalT, sub: "across all agents", color: C.blue },
    { label: "Pipeline Value", value: "₹48L", sub: "24 active leads", color: C.orange },
    { label: "Infra Cost/mo", value: "~₹8K", sub: "0.8% of ₹10L", color: C.muted2 },
  ];
  return (
    <div>
      {/* Hero */}
      <div style={{ position: "relative", overflow: "hidden", background: "linear-gradient(135deg,#0e0830 0%,#1a0640 50%,#0e0e2a 100%)", border: `1px solid ${C.purple}44`, borderRadius: 20, padding: "28px 32px", marginBottom: 20 }}>
        <div style={{ position: "absolute", top: -60, right: -60, width: 220, height: 220, borderRadius: "50%", background: C.purple, opacity: 0.07 }} />
        <div style={{ position: "absolute", bottom: -40, right: 120, width: 120, height: 120, borderRadius: "50%", background: C.accent, opacity: 0.05 }} />
        <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
          <div>
            <div style={{ fontSize: 11, color: `${C.purple}cc`, marginBottom: 8, fontWeight: 600, letterSpacing: 1 }}>🏆 MONTH 1 — GOAL CRUSHED</div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 12 }}>
              <div style={{ fontSize: 52, fontWeight: 900, color: "white", lineHeight: 1 }}>₹10.2L</div>
              <div style={{ fontSize: 14, color: C.green, fontWeight: 700, marginBottom: 6 }}>▲ +14.6%</div>
            </div>
            <div style={{ fontSize: 13, color: "rgba(226,232,240,0.6)", marginTop: 8 }}>Month 2 target: <span style={{ color: C.accent, fontWeight: 800 }}>₹15L</span></div>
            <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
              <Pill label={`${live} Agents Live`} color={C.green} />
              <Pill label={`${building} Building`} color={C.yellow} />
              <Pill label="₹48L Pipeline" color={C.purple} />
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            {[["18", "Active Clients"], ["3,182", "Tasks Automated"], ["24", "Proposals Sent"], ["₹48L", "Pipeline"], ["156", "Designs"], ["99.8%", "Uptime"]].map(([v, l], i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.08)", borderRadius: 12, padding: "10px 14px", textAlign: "center" }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: "white" }}>{v}</div>
                <div style={{ fontSize: 10, color: "rgba(226,232,240,0.6)" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 10, marginBottom: 20 }}>
        {kpis.map((k, i) => (
          <Cd key={i} style={{ padding: "14px 16px", borderTop: `3px solid ${k.color}` }}>
            <div style={{ fontSize: 11, color: C.muted2, marginBottom: 4 }}>{k.label}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: k.color }}>{k.value}</div>
            <div style={{ fontSize: 10, color: C.muted2, marginTop: 2 }}>{k.sub}</div>
          </Cd>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 16, marginBottom: 16 }}>
        <Cd style={{ padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 4 }}>📈 6-Month Revenue Roadmap</div>
          <div style={{ fontSize: 11, color: C.muted2, marginBottom: 16 }}>Month 1: ₹10.2L ✅ · Path to ₹100L/mo</div>
          <ResponsiveContainer width="100%" height={175}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.green} stopOpacity={0.3} /><stop offset="95%" stopColor={C.green} stopOpacity={0} /></linearGradient>
                <linearGradient id="pg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.purple} stopOpacity={0.2} /><stop offset="95%" stopColor={C.purple} stopOpacity={0} /></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis dataKey="month" stroke={C.muted} tick={{ fill: C.muted2, fontSize: 10 }} />
              <YAxis stroke={C.muted} tick={{ fill: C.muted2, fontSize: 10 }} tickFormatter={v => `₹${v}L`} />
              <Tooltip contentStyle={{ background: C.card2, border: `1px solid ${C.border}`, borderRadius: 10, fontSize: 11 }} formatter={v => v ? [`₹${v}L`] : ["N/A"]} />
              <Area type="monotone" dataKey="target" stroke={C.muted} strokeWidth={1.5} strokeDasharray="5 5" fill="none" name="Target" />
              <Area type="monotone" dataKey="projected" stroke={C.purple} strokeWidth={2} fill="url(#pg)" name="Projected" dot={{ fill: C.purple, r: 3 }} />
              <Area type="monotone" dataKey="actual" stroke={C.green} strokeWidth={3} fill="url(#ag)" name="Actual" dot={{ fill: C.green, r: 5 }} />
            </AreaChart>
          </ResponsiveContainer>
        </Cd>
        <Cd style={{ padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 4 }}>🤖 Agent Activation Timeline</div>
          <div style={{ fontSize: 11, color: C.muted2, marginBottom: 16 }}>More agents = exponential revenue</div>
          <ResponsiveContainer width="100%" height={175}>
            <BarChart data={agentBuildData} barSize={30}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
              <XAxis dataKey="month" stroke={C.muted} tick={{ fill: C.muted2, fontSize: 11 }} />
              <YAxis stroke={C.muted} tick={{ fill: C.muted2, fontSize: 10 }} />
              <Tooltip contentStyle={{ background: C.card2, border: `1px solid ${C.border}`, borderRadius: 10, fontSize: 11 }} />
              <Bar dataKey="agents" fill={C.purple} radius={[6, 6, 0, 0]} name="Agents Live" />
            </BarChart>
          </ResponsiveContainer>
        </Cd>
      </div>

      {/* Team grid */}
      <Cd style={{ padding: 20, marginBottom: 16 }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: C.muted2, marginBottom: 14 }}>TEAM STATUS — RIGHT NOW</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 8 }}>
          {TEAM.map(m => (
            <div key={m.id} style={{ background: C.card2, borderRadius: 12, padding: "11px 13px", border: `1px solid ${C.border}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8 }}>
                <Av txt={m.avatar || m.name[0]} color={m.color} size={26} />
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: C.text }}>{m.name}</div>
                  <div style={{ fontSize: 9, color: m.color }}>{m.role.split(" ")[0]}</div>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: C.muted2, marginBottom: 5 }}>
                <span>{m.tasks} tasks</span>
                <span style={{ color: C.green, fontWeight: 700 }}>{m.rate}%</span>
              </div>
              <div style={{ height: 3, background: C.border, borderRadius: 3 }}>
                <div style={{ height: "100%", width: `${m.rate}%`, background: m.color, borderRadius: 3 }} />
              </div>
            </div>
          ))}
        </div>
      </Cd>

      {/* Slack + WhatsApp preview */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Cd>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "13px 18px", borderBottom: `1px solid ${C.border}` }}>
            <div style={{ width: 22, height: 22, background: C.purple, borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800 }}>#</div>
            <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>Slack — Live Feed</span>
            <div style={{ marginLeft: "auto", width: 8, height: 8, borderRadius: "50%", background: C.green }} />
          </div>
          <div style={{ padding: "12px 16px", maxHeight: 220, overflowY: "auto" }}>
            {SLACK.filter(m => m.ch === "general" || m.ch === "wins").map((m, i) => (
              <div key={i} style={{ display: "flex", gap: 9, marginBottom: 11 }}>
                <Av txt={m.user[0]} color={m.color} size={26} />
                <div>
                  <div style={{ display: "flex", gap: 7, marginBottom: 1 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: m.color }}>{m.user}</span>
                    <span style={{ fontSize: 9, color: C.muted2 }}>{m.time}</span>
                  </div>
                  <p style={{ fontSize: 11, color: C.text, lineHeight: 1.5, margin: 0 }}>{m.msg}</p>
                  {m.reactions.length > 0 && (
                    <div style={{ display: "flex", gap: 3, marginTop: 3 }}>
                      {m.reactions.map((r, j) => <span key={j} style={{ fontSize: 9, color: C.muted2, background: C.card2, border: `1px solid ${C.border}`, borderRadius: 20, padding: "1px 5px" }}>{r}</span>)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Cd>
        <Cd>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "13px 18px", borderBottom: `1px solid ${C.border}` }}>
            <div style={{ width: 22, height: 22, background: C.green, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>💬</div>
            <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>WhatsApp Business</span>
            <div style={{ marginLeft: "auto", background: C.red, color: "white", fontSize: 9, fontWeight: 800, borderRadius: "50%", width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>6</div>
          </div>
          <div>
            {WHATSAPP.map((chat, i) => (
              <div key={i} style={{ display: "flex", gap: 9, padding: "9px 16px", borderBottom: i < WHATSAPP.length - 1 ? `1px solid ${C.border}` : undefined }}>
                <div style={{ width: 34, height: 34, borderRadius: "50%", background: `linear-gradient(135deg,${C.purple},${C.pink})`, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 800, fontSize: 13, flexShrink: 0 }}>{chat.client[0]}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: C.text }}>{chat.client}</span>
                    <span style={{ fontSize: 9, color: C.muted2 }}>{chat.time}</span>
                  </div>
                  <div style={{ fontSize: 10, color: C.muted2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{chat.lastMsg}</div>
                  <div style={{ display: "flex", gap: 5, marginTop: 2 }}>
                    <Pill label={chat.value} color={chat.status === "hot" ? C.red : chat.status === "closing" ? C.yellow : C.muted2} />
                    <Pill label={chat.handler} color={TEAM.find(t => t.name === chat.handler)?.color || C.muted2} />
                  </div>
                </div>
                {chat.unread > 0 && <div style={{ width: 17, height: 17, borderRadius: "50%", background: C.green, color: "white", fontSize: 9, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{chat.unread}</div>}
              </div>
            ))}
          </div>
        </Cd>
      </div>
    </div>
  );
};

// ── TEAM TAB ──
const TeamTab = () => {
  const [dept, setDept] = useState("all");
  const [sel, setSel] = useState(null);
  const list = dept === "all" ? TEAM : TEAM.filter(m => m.dept === dept);
  const selM = TEAM.find(m => m.id === sel);

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {[{ id: "all", label: "All" }, ...Object.entries(DEPT_META).map(([id, d]) => ({ id, label: d.label }))].map(f => (
          <button key={f.id} onClick={() => setDept(f.id)} style={{ fontSize: 12, padding: "6px 14px", borderRadius: 20, border: `1px solid ${dept === f.id ? C.accent : C.border}`, background: dept === f.id ? `${C.accent}15` : "transparent", color: dept === f.id ? C.accent : C.muted2, cursor: "pointer" }}>{f.label}</button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
        {list.map(m => (
          <div key={m.id} onClick={() => setSel(sel === m.id ? null : m.id)} style={{ background: sel === m.id ? `${m.color}0d` : C.card, border: `1px solid ${sel === m.id ? m.color : C.border}`, borderRadius: 14, padding: 16, cursor: "pointer", transition: "all 0.15s" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <Av txt={m.avatar || m.name[0]} color={m.color} size={38} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{m.name}</div>
                  <div style={{ fontSize: 11, color: m.color }}>{m.role}</div>
                  <div style={{ fontSize: 9, color: C.muted2 }}>{DEPT_META[m.dept]?.label}</div>
                </div>
              </div>
              <StatusPill status={m.status} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 10 }}>
              {[[m.tasks, "Tasks", C.blue], [m.rate + "%", "Rate", m.rate >= 97 ? C.green : C.yellow], [m.time, "Resp.", C.muted2]].map(([v, l, c], i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: c }}>{v}</div>
                  <div style={{ fontSize: 9, color: C.muted2 }}>{l}</div>
                </div>
              ))}
            </div>
            <div style={{ height: 3, background: C.border, borderRadius: 3 }}>
              <div style={{ height: "100%", width: `${m.rate}%`, background: m.rate >= 97 ? C.green : C.yellow, borderRadius: 3 }} />
            </div>
            {sel === m.id && (
              <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 9, color: C.muted2, marginBottom: 6 }}>TOOLS</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 10 }}>
                  {m.tools.map((t, i) => <Pill key={i} label={t} color={m.color} />)}
                </div>
                <div style={{ fontSize: 11, color: C.muted2 }}>Cost/month: <span style={{ color: m.color, fontWeight: 700 }}>{m.cost}</span></div>
                {m.note && <div style={{ marginTop: 6, fontSize: 11, color: C.muted2, fontStyle: "italic" }}>{m.note}</div>}
                {m.prompt && (
                  <div style={{ marginTop: 10 }}>
                    <div style={{ fontSize: 9, color: C.muted2, marginBottom: 4, letterSpacing: 1 }}>SYSTEM PROMPT PREVIEW</div>
                    <div style={{ background: "#05050e", border: `1px solid ${m.color}22`, borderRadius: 8, padding: 10, fontSize: 10, color: "#9ca3af", lineHeight: 1.7, fontFamily: "monospace", maxHeight: 90, overflowY: "auto" }}>{m.prompt}</div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// ── ACTIVATE TAB ──
const ActivateTab = () => {
  const bots = TEAM.filter(m => m.type === "bot").sort((a, b) => a.priority - b.priority);
  const [sel, setSel] = useState(bots[0].id);
  const m = TEAM.find(t => t.id === sel);
  return (
    <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 16 }}>
      <Cd style={{ padding: 10, maxHeight: 620, overflowY: "auto" }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: C.muted2, marginBottom: 10 }}>BUILD ORDER</div>
        {bots.map((a, i) => (
          <div key={a.id} onClick={() => setSel(a.id)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 10px", borderRadius: 10, cursor: "pointer", marginBottom: 2, background: sel === a.id ? `${a.color}15` : "transparent", border: `1px solid ${sel === a.id ? a.color : C.border}`, transition: "all 0.12s" }}>
            <span style={{ fontSize: 9, fontWeight: 800, color: a.color, width: 16, textAlign: "center" }}>#{i + 1}</span>
            <Av txt={a.avatar || a.name[0]} color={a.color} size={28} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: sel === a.id ? a.color : C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.name}</div>
              <div style={{ fontSize: 9, color: C.muted2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.role}</div>
            </div>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: a.status === "live" ? C.green : a.status === "build" ? C.yellow : C.muted, flexShrink: 0 }} />
          </div>
        ))}
      </Cd>
      {m && (
        <div>
          <div style={{ display: "flex", gap: 16, alignItems: "center", background: C.card, border: `1px solid ${m.color}33`, borderRadius: 14, padding: "20px 24px", marginBottom: 16 }}>
            <Av txt={m.avatar || m.name[0]} color={m.color} size={56} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: m.color }}>{m.name}</div>
              <div style={{ fontSize: 13, color: C.muted2 }}>{m.role}</div>
              <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>{m.tools.map((t, i) => <Pill key={i} label={t} color={m.color} />)}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <StatusPill status={m.status} />
              <div style={{ fontSize: 12, color: C.muted2, marginTop: 6 }}>{m.cost}/mo</div>
            </div>
          </div>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: C.muted2, marginBottom: 10 }}>ACTIVATION STEPS</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
            {m.steps.map((step, i) => (
              <div key={i} style={{ display: "flex", gap: 12, padding: "12px 16px", background: C.card, borderRadius: 10, border: `1px solid ${C.border}` }}>
                <div style={{ width: 24, height: 24, borderRadius: "50%", background: `${m.color}20`, border: `1.5px solid ${m.color}55`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: m.color, flexShrink: 0 }}>{i + 1}</div>
                <div style={{ fontSize: 12, color: C.text, lineHeight: 1.6 }}>{step}</div>
              </div>
            ))}
          </div>
          {m.prompt && (
            <>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: C.muted2, marginBottom: 8 }}>SYSTEM PROMPT — PASTE INTO N8N CLAUDE NODE</div>
              <div style={{ background: "#040410", border: `1px solid ${m.color}30`, borderRadius: 10, padding: 16, fontFamily: "monospace", fontSize: 11, color: "#a0c080", lineHeight: 1.8, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{m.prompt}</div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

// ── COMMS TAB ──
const CommsTab = () => {
  const [selCh, setSelCh] = useState("general");
  const [selChat, setSelChat] = useState(0);
  const channels = [...new Set(SLACK.map(m => m.ch))];
  const chat = WHATSAPP[selChat];
  const convo = [
    { from: "client", msg: "Hi! We saw your portfolio. The AI automation work is impressive.", time: "Yesterday 3:14 PM" },
    { from: "bot", agent: "Selvan", msg: "Thank you! We would love to understand your requirements better. Could you share what kind of automation you are looking for?", time: "Yesterday 3:15 PM" },
    { from: "client", msg: "We run large events across India and need guest management, social media and post-event reports.", time: "Yesterday 3:22 PM" },
    { from: "bot", agent: "Selvan", msg: "That is exactly our sweet spot! We have worked with 12 event companies this year. Our AI can automate 80% of that workflow. Shall I send a custom proposal?", time: "Yesterday 3:23 PM" },
    { from: "client", msg: "Yes please! Budget is flexible if the solution is right.", time: "Yesterday 3:25 PM" },
    { from: "bot", agent: "Saras", msg: "Proposal sent to your email! Full AI automation suite — guest onboarding, social content, analytics reports. Investment: ₹3.2L + ₹45K/month retainer.", time: "Yesterday 4:01 PM" },
    { from: "client", msg: "That revised proposal looks great! When can we schedule a call?", time: "9:48 AM" },
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, height: 600 }}>
      <Cd style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ display: "flex", gap: 0, borderBottom: `1px solid ${C.border}`, overflowX: "auto" }}>
          {channels.map(ch => (
            <button key={ch} onClick={() => setSelCh(ch)} style={{ padding: "11px 14px", background: selCh === ch ? `${C.purple}15` : "transparent", color: selCh === ch ? C.purple : C.muted2, border: "none", borderBottom: `2px solid ${selCh === ch ? C.purple : "transparent"}`, cursor: "pointer", fontSize: 11, fontWeight: selCh === ch ? 700 : 400, whiteSpace: "nowrap" }}>
              #{ch}
            </button>
          ))}
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
          {SLACK.filter(m => selCh === "general" ? m.ch === "general" || m.ch === "wins" : m.ch === selCh).map((m, i) => (
            <div key={i} style={{ display: "flex", gap: 9, marginBottom: 13 }}>
              <Av txt={m.user[0]} color={m.color} size={30} />
              <div>
                <div style={{ display: "flex", gap: 7, marginBottom: 2 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: m.color }}>{m.user}</span>
                  <span style={{ fontSize: 9, color: C.muted2 }}>{m.time}</span>
                </div>
                <p style={{ fontSize: 12, color: C.text, lineHeight: 1.5, margin: 0 }}>{m.msg}</p>
                {m.reactions.length > 0 && <div style={{ display: "flex", gap: 3, marginTop: 4 }}>{m.reactions.map((r, j) => <span key={j} style={{ fontSize: 10, color: C.muted2, background: C.card2, border: `1px solid ${C.border}`, borderRadius: 20, padding: "2px 7px" }}>{r}</span>)}</div>}
              </div>
            </div>
          ))}
        </div>
        <div style={{ padding: "10px 14px", borderTop: `1px solid ${C.border}` }}>
          <div style={{ background: C.card2, border: `1px solid ${C.border}`, borderRadius: 10, padding: "8px 12px", fontSize: 12, color: C.muted2 }}>Message #{selCh}...</div>
        </div>
      </Cd>
      <Cd style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ padding: "11px 13px", borderBottom: `1px solid ${C.border}`, overflowX: "auto" }}>
          <div style={{ display: "flex", gap: 6, minWidth: "max-content" }}>
            {WHATSAPP.map((c, i) => (
              <button key={i} onClick={() => setSelChat(i)} style={{ padding: "4px 10px", borderRadius: 20, border: `1px solid ${selChat === i ? C.green : C.border}`, background: selChat === i ? `${C.green}15` : "transparent", cursor: "pointer", fontSize: 10, fontWeight: selChat === i ? 700 : 400, color: selChat === i ? C.green : C.muted2, whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 4 }}>
                {c.client.split(" ")[0]}{c.unread > 0 && <span style={{ background: C.green, color: "white", fontSize: 8, fontWeight: 800, borderRadius: "50%", width: 13, height: 13, display: "flex", alignItems: "center", justifyContent: "center" }}>{c.unread}</span>}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "10px 13px", borderBottom: `1px solid ${C.border}` }}>
          <div style={{ width: 34, height: 34, borderRadius: "50%", background: `linear-gradient(135deg,${C.purple},${C.pink})`, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 800, fontSize: 13 }}>{chat.client[0]}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{chat.client}</div>
            <div style={{ fontSize: 10, color: C.green }}>via {chat.handler} · {chat.value}</div>
          </div>
          <Pill label={chat.status === "hot" ? "🔥 Hot" : chat.status === "closing" ? "⭐ Closing" : "Active"} color={chat.status === "hot" ? C.red : chat.status === "closing" ? C.yellow : C.green} />
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: 12, background: "#06060d" }}>
          {convo.map((m, i) => (
            <div key={i} style={{ display: "flex", justifyContent: m.from === "client" ? "flex-start" : "flex-end", marginBottom: 9 }}>
              <div style={{ maxWidth: "78%", borderRadius: 12, padding: "8px 11px", background: m.from === "client" ? C.card2 : "#0a2010", border: `1px solid ${m.from === "client" ? C.border : C.green + "33"}` }}>
                {m.from === "bot" && <div style={{ fontSize: 9, color: C.green, fontWeight: 700, marginBottom: 2 }}>🤖 {m.agent}</div>}
                <p style={{ fontSize: 11, color: C.text, margin: 0, lineHeight: 1.5 }}>{m.msg}</p>
                <div style={{ fontSize: 9, color: C.muted2, marginTop: 3, textAlign: "right" }}>{m.time}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ padding: "9px 13px", borderTop: `1px solid ${C.border}` }}>
          <div style={{ background: C.card2, border: `1px solid ${C.border}`, borderRadius: 20, padding: "7px 14px", fontSize: 11, color: C.muted2 }}>Type a message (AI agent responds)...</div>
        </div>
      </Cd >
    </div >
  );
};

// ── PIPELINE TAB ──
const PipelineTab = () => {
  const mx = PIPELINE[0].count;
  const prices = [
    ["Brand Identity", 30000, 55000, 90000],
    ["UI/UX Design", 40000, 75000, 150000],
    ["Social Media /mo", 15000, 25000, 45000],
    ["Website + Dev", 50000, 100000, 200000],
    ["Motion / Reels", 20000, 40000, 80000],
    ["Content /mo", 20000, 35000, 60000],
    ["WhatsApp Bot", 30000, 50000, 80000],
    ["SEO /mo", 15000, 30000, 55000],
  ];
  const fmt = v => `₹${(v / 1000).toFixed(0)}K`;
  return (
    <div>
      <Cd style={{ padding: "22px", marginBottom: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 4 }}>Sales Pipeline</div>
        <div style={{ fontSize: 12, color: C.muted2, marginBottom: 22 }}>Total: ₹48L · Selvan, Saras and Rekha managing 24/7</div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 150 }}>
          {PIPELINE.map((stage, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 7 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: stage.color }}>{stage.value}</div>
              <div style={{ width: "100%", borderRadius: "8px 8px 0 0", background: `${stage.color}33`, border: `1px solid ${stage.color}55`, display: "flex", alignItems: "center", justifyContent: "center", height: `${(stage.count / mx) * 100}%`, minHeight: 28 }}>
                <span style={{ color: "white", fontWeight: 800, fontSize: 16 }}>{stage.count}</span>
              </div>
              <div style={{ fontSize: 10, color: C.muted2, textAlign: "center" }}>{stage.stage}</div>
            </div>
          ))}
        </div>
      </Cd>
      <Cd style={{ overflow: "hidden" }}>
        <div style={{ padding: "14px 18px", borderBottom: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>Pricing Menu</div>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr style={{ background: C.card2 }}>
              {["Service", "Starter", "Standard", "Premium"].map((h, i) => (
                <th key={i} style={{ textAlign: i === 0 ? "left" : "right", padding: "11px 16px", color: [C.muted2, C.muted2, C.blue, C.purple][i], fontWeight: 700, fontSize: 10, letterSpacing: 0.5, borderBottom: `1px solid ${C.border}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {prices.map((r, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${C.border}`, background: i % 2 === 0 ? "transparent" : C.card2 }}>
                <td style={{ padding: "10px 16px", color: C.text, fontWeight: 500 }}>{r[0]}</td>
                <td style={{ padding: "10px 16px", color: C.muted2, textAlign: "right" }}>{fmt(r[1])}</td>
                <td style={{ padding: "10px 16px", color: "#93c5fd", textAlign: "right", fontWeight: 600 }}>{fmt(r[2])}</td>
                <td style={{ padding: "10px 16px", color: "#c4b5fd", textAlign: "right", fontWeight: 700 }}>{fmt(r[3])}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ padding: "12px 18px", background: `${C.accent}08`, borderTop: `1px solid ${C.border}` }}>
          <span style={{ fontSize: 12, color: C.muted2 }}>20 clients across services = <span style={{ color: C.accent, fontWeight: 800 }}>₹9-10L/month</span> · All deliverables automated by AI agents</span>
        </div>
      </Cd>
    </div>
  );
};

// ── GAMEPLAN TAB ──
const GameplanTab = () => {
  const [sub, setSub] = useState("today");
  const [done, setDone] = useState({});
  const dc = DAY1.filter((_, i) => done[i]).length;
  return (
    <div>
      <div style={{ display: "flex", gap: 4, marginBottom: 20 }}>
        {[["today", "🔥 Start Today"], ["roadmap", "📅 Roadmap"], ["costs", "💸 Costs"]].map(([id, label]) => (
          <button key={id} onClick={() => setSub(id)} style={{ padding: "8px 18px", borderRadius: 8, border: `1px solid ${sub === id ? C.accent : C.border}`, background: sub === id ? `${C.accent}15` : "transparent", color: sub === id ? C.accent : C.muted2, cursor: "pointer", fontSize: 12, fontWeight: sub === id ? 700 : 400 }}>{label}</button>
        ))}
      </div>
      {sub === "today" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <div>
              <div style={{ fontSize: 17, fontWeight: 800 }}>5 tasks. ~80 minutes. Agency is live.</div>
              <div style={{ fontSize: 12, color: C.muted2 }}>After this, Selvan is qualifying leads automatically.</div>
            </div>
            <div style={{ textAlign: "right" }}><div style={{ fontSize: 26, fontWeight: 900, color: C.accent }}>{dc}/5</div><div style={{ fontSize: 9, color: C.muted2 }}>done</div></div>
          </div>
          <div style={{ height: 5, background: C.border, borderRadius: 5, marginBottom: 22 }}>
            <div style={{ height: "100%", width: `${(dc / 5) * 100}%`, background: `linear-gradient(90deg,${C.accent},${C.cyan})`, borderRadius: 5, transition: "width 0.4s" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {DAY1.map((item, i) => {
              const isDone = done[i];
              return (
                <Cd key={i} style={{ border: `1px solid ${isDone ? C.green : item.color}33`, opacity: isDone ? 0.65 : 1 }}>
                  <div style={{ padding: "15px 18px" }}>
                    <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                      <div onClick={() => setDone(d => ({ ...d, [i]: !d[i] }))} style={{ width: 40, height: 40, borderRadius: 11, background: isDone ? `${C.green}20` : `${item.color}15`, border: `2px solid ${isDone ? C.green : item.color}55`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, cursor: "pointer", fontSize: isDone ? 18 : 17, transition: "all 0.15s" }}>
                        {isDone ? "✓" : item.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", gap: 7, alignItems: "center", marginBottom: 3, flexWrap: "wrap" }}>
                          <span style={{ fontSize: 13, fontWeight: 700, color: isDone ? C.green : C.text, textDecoration: isDone ? "line-through" : "none" }}>{item.title}</span>
                          <Pill label={`⏱ ${item.time}`} color={item.color} />
                        </div>
                        <div style={{ fontSize: 11, color: C.muted2, marginBottom: 9 }}>{item.what}</div>
                        {item.steps.map((s, j) => (
                          <div key={j} style={{ display: "flex", gap: 7, marginBottom: 4 }}>
                            <div style={{ width: 15, height: 15, borderRadius: "50%", background: `${item.color}20`, border: `1px solid ${item.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 800, color: item.color, flexShrink: 0, marginTop: 1 }}>{j + 1}</div>
                            <div style={{ fontSize: 11, color: C.text, lineHeight: 1.5 }}>{s}</div>
                          </div>
                        ))}
                        {item.link && <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", marginTop: 8, fontSize: 11, color: item.color, textDecoration: "none", padding: "4px 11px", border: `1px solid ${item.color}44`, borderRadius: 7, background: `${item.color}10` }}>{item.link.replace("https://", "")} →</a>}
                      </div>
                    </div>
                  </div>
                </Cd>
              );
            })}
          </div>
        </div>
      )}
      {sub === "roadmap" && (
        <div>
          <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 4 }}>Zero → ₹10L/month in 6 months</div>
          <div style={{ fontSize: 12, color: C.muted2, marginBottom: 18 }}>Realistic, step-by-step. Start this week.</div>
          {[
            { week: "Week 1", label: "Foundation", color: C.red, rev: "₹0", goal: "First qualified lead in CRM", tasks: ["Deploy n8n + activate Selvan (3h)", "Activate Devi daily briefing (2h)", "Set up CRM Google Sheet (1h)", "Post BD on LinkedIn/Instagram (1h)", "Send 10 cold DMs to potential clients"] },
            { week: "Week 2", label: "First Revenue", color: C.orange, rev: "₹30K–80K", goal: "Deliver first project and invoice", tasks: ["Activate Saras proposal flow (4h)", "Activate Rekha follow-up flow (2h)", "Activate Vishwa + Seyon Artist (5h)", "Close first client", "Send first invoice via Razorpay"] },
            { week: "Wk 3–4", label: "Scale BD", color: C.yellow, rev: "₹1L–2L", goal: "3-5 active clients, retainers started", tasks: ["360dialog WhatsApp — Selvan goes fully auto", "Activate Maran social content (3h)", "Activate Kavi copywriting (2h)", "3 retainer clients at ₹20-35K/mo", "First testimonial + case study"] },
            { week: "Month 2", label: "Full Agency", color: C.accent, rev: "₹3L–5L", goal: "All core agents live", tasks: ["Activate Adi dev flow + GitHub + Vercel", "Activate Natraj motion + Creatomate", "Activate Arjun SEO weekly audit", "Activate Guru content calendar", "Land first website project ₹80K–1.5L"] },
            { week: "Mo 3–6", label: "₹10L Machine", color: C.green, rev: "₹7L–10L+", goal: "All 15 agents, recurring revenue", tasks: ["Build client portal (Adi builds it)", "Launch Seyon Studios website", "20+ clients across retainers + projects", "White-label system to freelancers", "Consider SaaS-ifying Seyon Artist"] },
          ].map((w, i) => (
            <Cd key={i} style={{ padding: "16px 20px", marginBottom: 10, borderLeft: `4px solid ${w.color}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, flexWrap: "wrap", gap: 8 }}>
                <div>
                  <div style={{ fontSize: 9, color: C.muted2, letterSpacing: 2 }}>{w.week.toUpperCase()}</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: w.color }}>{w.label}</div>
                  <div style={{ fontSize: 11, color: C.muted2 }}>{w.goal}</div>
                </div>
                <div style={{ padding: "7px 14px", background: `${w.color}15`, border: `1px solid ${w.color}33`, borderRadius: 20, fontWeight: 700, color: w.color, fontSize: 13, height: "fit-content" }}>{w.rev}</div>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {w.tasks.map((t, ti) => <div key={ti} style={{ fontSize: 11, color: C.text, background: `${w.color}0d`, padding: "3px 9px", borderRadius: 20, border: `1px solid ${w.color}20` }}><span style={{ color: w.color }}>✓ </span>{t}</div>)}
              </div>
            </Cd>
          ))}
        </div>
      )}
      {sub === "costs" && (
        <div>
          <div style={{ marginBottom: 14, padding: "13px 18px", background: `${C.green}0d`, border: `1px solid ${C.green}22`, borderRadius: 12 }}>
            <div style={{ fontWeight: 700, color: C.green }}>💸 Week 1 cost: ₹0 — Start for free, pay only when you earn</div>
            <div style={{ fontSize: 12, color: C.muted2, marginTop: 3 }}>Full infra at scale: ~₹8K/month = 0.8% of ₹10L revenue. Insane margins.</div>
          </div>
          <Cd>
            {COSTS.map((c, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 120px 1fr", gap: 16, padding: "11px 18px", borderBottom: i < COSTS.length - 1 ? `1px solid ${C.border}` : undefined, background: i % 2 === 0 ? "transparent" : C.card2, alignItems: "center" }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: C.text }}>{c.tool}</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: c.color }}>{c.mo}</span>
                <span style={{ fontSize: 11, color: C.muted2 }}>{c.note}</span>
              </div>
            ))}
          </Cd>
          <Cd style={{ padding: 18, marginTop: 14, borderColor: `${C.accent}22` }}>
            <div style={{ fontWeight: 700, color: C.accent, marginBottom: 10 }}>📱 Copy-paste this WhatsApp outreach right now</div>
            <div style={{ background: "#040410", borderRadius: 10, padding: 14, fontFamily: "monospace", fontSize: 11, color: "#a0c080", lineHeight: 1.9, whiteSpace: "pre-wrap" }}>{`Hey [Name]! 👋\n\nI've been building an AI-powered design studio — delivers brand identity, UI/UX, social media content, and video in days, not weeks.\n\nSame quality as a ₹5L/month agency. Way faster. Fraction of the cost.\n\nMind if I share a 2-min overview?\n\n— Bhuvi | Seyon Studios`}</div>
            <div style={{ fontSize: 11, color: C.muted2, marginTop: 8 }}>Send to 10 people today → 3 reply → 1 converts → ₹30K–₹80K week 1.</div>
          </Cd>
        </div>
      )}
    </div>
  );
};

// ── MAIN ──
const TABS = [
  { id: "command", label: "🎯 Command" },
  { id: "team", label: "👥 Team" },
  { id: "activate", label: "⚡ Activate" },
  { id: "comms", label: "💬 Comms" },
  { id: "pipeline", label: "🏷️ Pipeline" },
  { id: "gameplan", label: "🗺️ Gameplan" },
];

export default function SeyonFinalDashboard() {
  const [tab, setTab] = useState("command");
  const [clock, setClock] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setClock(new Date()), 1000); return () => clearInterval(t); }, []);

  const live = TEAM.filter(a => a.status === "live").length;
  const building = TEAM.filter(a => a.status === "build").length;
  const queued = TEAM.filter(a => a.status === "queue").length;

  return (
    <div style={{ background: C.bg, minHeight: "100vh", color: C.text, fontFamily: "'Inter',-apple-system,BlinkMacSystemFont,sans-serif" }}>
      {/* Header */}
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "0 28px" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg,${C.accent},${C.cyan})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 900, color: "#000" }}>S</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 900, letterSpacing: 1, background: `linear-gradient(90deg,${C.accent},${C.cyan})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>SEYON STUDIOS</div>
              <div style={{ fontSize: 9, color: C.muted, letterSpacing: 3, fontWeight: 600 }}>AI AGENCY · COMMAND CENTER</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
            {TEAM.slice(0, 12).map(a => (
              <div key={a.id} title={`${a.name} — ${a.role}`} style={{ width: 28, height: 28, borderRadius: "50%", background: `${a.color}18`, border: `2px solid ${a.status === "live" ? a.color : a.status === "build" ? a.color + "88" : C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 800, color: a.color, flexShrink: 0, opacity: a.status === "queue" ? 0.38 : 1, boxShadow: a.status === "live" ? `0 0 7px ${a.color}44` : "none" }}>
                {a.name[0]}
              </div>
            ))}
            <span style={{ fontSize: 9, color: C.muted2, marginLeft: 2 }}>+{TEAM.length - 12}</span>
          </div>
          <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
            <div style={{ display: "flex", gap: 14 }}>
              {[{ v: live, l: "LIVE", c: C.green }, { v: building, l: "BLDG", c: C.yellow }, { v: queued, l: "QUEUE", c: C.muted2 }].map((s, i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 17, fontWeight: 900, color: s.c, lineHeight: 1 }}>{s.v}</div>
                  <div style={{ fontSize: 8, color: C.muted, letterSpacing: 1 }}>{s.l}</div>
                </div>
              ))}
            </div>
            <div style={{ borderLeft: `1px solid ${C.border}`, paddingLeft: 18, textAlign: "right" }}>
              <div style={{ fontSize: 12, fontWeight: 700, fontFamily: "monospace", color: C.text }}>{clock.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</div>
              <div style={{ fontSize: 9, color: C.muted }}>{clock.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Nav */}
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "0 28px" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", gap: 2 }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ background: tab === t.id ? "rgba(255,255,255,0.05)" : "transparent", border: "none", borderBottom: `2px solid ${tab === t.id ? C.accent : "transparent"}`, color: tab === t.id ? C.text : C.muted2, padding: "13px 20px", fontSize: 13, fontWeight: tab === t.id ? 700 : 400, cursor: "pointer", transition: "all 0.12s", borderRadius: "4px 4px 0 0" }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "24px 28px" }}>
        {tab === "command" && <CommandTab />}
        {tab === "team" && <TeamTab />}
        {tab === "activate" && <ActivateTab />}
        {tab === "comms" && <CommsTab />}
        {tab === "pipeline" && <PipelineTab />}
        {tab === "gameplan" && <GameplanTab />}
      </div>

      {/* Footer */}
      <div style={{ borderTop: `1px solid ${C.border}`, padding: "12px 28px", background: C.surface, marginTop: 20 }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 10, color: C.muted }}>Seyon Studios © 2026 · CEO: <span style={{ color: C.yellow }}>Bhuvaneshwaran Prakasam</span> · 15 AI Agents · Claude + n8n + Google</div>
          <div style={{ display: "flex", gap: 20 }}>
            {[{ l: "Month 1", v: "₹10.2L ✓", c: C.green }, { l: "Month 2", v: "₹15L target", c: C.accent }, { l: "Infra/mo", v: "~₹8K", c: C.indigo }].map((s, i) => (
              <div key={i} style={{ textAlign: "right" }}><div style={{ fontSize: 11, fontWeight: 800, color: s.c }}>{s.v}</div><div style={{ fontSize: 9, color: C.muted }}>{s.l}</div></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
