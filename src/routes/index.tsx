import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Box,
  ChevronDown,
  CircleDot,
  Crosshair,
  Database,
  Download,
  FileWarning,
  Gauge,
  GitBranch,
  Layers3,
  Map,
  Menu,
  Network,
  Radar,
  Search,
  Server,
  ShieldAlert,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cortex OT | Command Center" },
      { name: "description", content: "Monitor OT security posture, urgent findings, asset visibility, and attack paths from one operational command center." },
      { property: "og:title", content: "Cortex OT | Command Center" },
      { property: "og:description", content: "Monitor OT security posture, urgent findings, asset visibility, and attack paths from one operational command center." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CortexCommandCenter,
});

type View = "command" | "paths";
type SelectedNode = "ws" | "switch" | "plc" | "gateway";

const navItems: Array<{ label: string; icon: typeof Gauge; count?: string; view?: View }> = [
  { label: "Command Center", icon: Gauge, view: "command" },
  { label: "Attack Paths", icon: GitBranch, count: "4", view: "paths" },
  { label: "Findings", icon: FileWarning, count: "17" },
  { label: "Assets", icon: Box, count: "1.2k" },
  { label: "Sensors", icon: Radar, count: "12" },
  { label: "Reports", icon: Download },
];

const nodeDetails: Record<SelectedNode, { name: string; type: string; zone: string; role: string; severity: string }> = {
  ws: { name: "WS-1042", type: "Windows workstation", zone: "DMZ", role: "Source asset", severity: "High" },
  switch: { name: "SW-08", type: "Layer 3 switch", zone: "Transit", role: "Pivot relationship", severity: "Medium" },
  plc: { name: "PLC P-11", type: "Siemens S7 controller", zone: "Process B", role: "Crown-jewel target", severity: "Critical" },
  gateway: { name: "G-02", type: "OT gateway", zone: "Process B", role: "Intermediate pivot", severity: "High" },
};

function CortexCommandCenter() {
  const [view, setView] = useState<View>("command");
  const [selectedNode, setSelectedNode] = useState<SelectedNode>("plc");
  const [site, setSite] = useState("Plant 04 — Riverside");
  const [zone, setZone] = useState("DMZ + Process");
  const [range, setRange] = useState("24h");
  const [actionState, setActionState] = useState<"idle" | "applied" | "escalated">("idle");

  const selected = nodeDetails[selectedNode];

  return (
    <div className="min-h-screen bg-ink font-sans text-paper">
      <div className="flex min-h-screen">
        <aside className="flex w-[212px] shrink-0 flex-col border-r border-white/10 bg-ink-2 max-lg:hidden">
          <div className="flex h-14 items-center gap-2.5 border-b border-white/10 px-4">
            <div className="grid size-7 place-items-center rounded-[9px] bg-amber"><span className="size-2.5 rounded-[3px] bg-ink" /></div>
            <div className="leading-none">
              <p className="font-display text-[15px] font-semibold tracking-tight">Cortex OT</p>
              <p className="mt-0.5 font-mono text-[9px] text-paper/45">ATTACK-PATH OPS · V2</p>
            </div>
          </div>
          <nav className="flex-1 space-y-0.5 px-2.5 py-3" aria-label="Primary navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = item.view === view;
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => item.view && setView(item.view)}
                  className={cn(
                    "flex h-9 w-full items-center gap-2.5 rounded-[8px] px-2.5 text-left font-mono text-[11px] transition-colors",
                    active ? "border border-amber/25 bg-amber/15 font-medium text-amber-2" : "text-paper/70 hover:bg-white/5",
                    !item.view && "cursor-default",
                  )}
                >
                  <Icon className="size-3.5" strokeWidth={1.7} />
                  <span className="flex-1">{item.label}</span>
                  {item.count && <span className="text-[10px] text-paper/35">{item.count}</span>}
                </button>
              );
            })}
          </nav>
          <div className="border-t border-white/10 p-3">
            <div className="rounded-[10px] bg-ink-3 p-3 ring-1 ring-white/10">
              <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-paper/45">Coverage</p>
              <p className="mt-1 font-display text-2xl font-semibold leading-none">87<span className="text-sm text-paper/50">%</span></p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full w-[87%] rounded-full bg-amber" /></div>
              <p className="mt-2 font-mono text-[10px] text-paper/55">1,204 / 1,383 assets</p>
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex min-h-14 shrink-0 flex-wrap items-center gap-3 border-b border-white/10 bg-ink-2/70 px-4 py-2.5 sm:px-5">
            <Button variant="ghost" size="icon" className="text-paper/60 hover:bg-white/5 hover:text-paper lg:hidden" aria-label="Open navigation"><Menu className="size-4" /></Button>
            <div className="flex items-center gap-2 font-mono text-[11px] text-paper/70">
              <span className="text-paper/40">SITE</span>
              <select aria-label="Site" value={site} onChange={(event) => setSite(event.target.value)} className="h-8 max-w-[180px] rounded-[8px] border border-white/10 bg-ink-3 px-2.5 font-mono text-[11px] text-paper outline-none focus:border-amber/50">
                <option>Plant 04 — Riverside</option><option>Plant 02 — Harbor</option><option>All Sites</option>
              </select>
            </div>
            <div className="hidden items-center gap-2 font-mono text-[11px] text-paper/70 sm:flex">
              <span className="text-paper/40">ZONE</span>
              <select aria-label="Zone" value={zone} onChange={(event) => setZone(event.target.value)} className="h-8 rounded-[8px] border border-white/10 bg-ink-3 px-2.5 font-mono text-[11px] text-paper outline-none focus:border-amber/50">
                <option>DMZ + Process</option><option>Segment A</option><option>Segment B</option>
              </select>
            </div>
            <div className="flex items-center gap-1 rounded-[8px] border border-white/10 bg-ink-3 p-0.5" aria-label="Time range">
              {["24h", "7d", "30d"].map((option) => <button key={option} type="button" onClick={() => setRange(option)} className={cn("h-7 rounded-[7px] px-2.5 font-mono text-[11px]", range === option ? "bg-amber font-medium text-ink" : "text-paper/60 hover:bg-white/5")}>{option}</button>)}
            </div>
            <div className="ml-auto flex items-center gap-2">
              <div className="hidden h-8 items-center gap-2 rounded-[8px] border border-white/10 bg-ink-3 px-3 font-mono text-[11px] text-paper/40 md:flex"><span className="live-pulse size-1.5 rounded-full bg-amber" /> LIVE · 14:32:07</div>
              <Button onClick={() => setView("paths")} className="h-8 rounded-[8px] bg-amber px-3.5 font-mono text-[11px] font-medium text-ink hover:bg-amber-2">New Investigation <ArrowRight className="ml-1.5 size-3.5" /></Button>
            </div>
          </header>

          {view === "command" ? (
            <Dashboard onOpenPaths={() => setView("paths")} />
          ) : (
            <AttackPathWorkspace selectedNode={selectedNode} onSelectNode={setSelectedNode} selected={selected} actionState={actionState} onAction={setActionState} onBack={() => setView("command")} site={site} zone={zone} />
          )}
        </div>
      </div>
    </div>
  );
}

function Dashboard({ onOpenPaths }: { onOpenPaths: () => void }) {
  return (
    <main className="flex-1 overflow-y-auto px-4 py-5 sm:px-5">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div><p className="font-mono text-[10px] uppercase tracking-[0.18em] text-amber-2">Operational brief · 14:32 UTC</p><h1 className="mt-1 font-display text-2xl font-semibold tracking-tight sm:text-[28px]">Command Center</h1></div>
        <div className="hidden items-center gap-2 font-mono text-[10px] text-paper/45 md:flex"><Activity className="size-3.5 text-ok" />Telemetry current · 41s sensor lag</div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <SummaryCard className="xl:col-span-4" tone="paper" label="Security Posture" meta="Δ 24h"><div className="mt-3 flex items-end gap-2"><span className="font-display text-4xl font-semibold leading-none text-crit">62</span><span className="mb-1 font-mono text-[11px] text-ink/50">/ 100</span></div><p className="mt-2 font-mono text-[11px] text-crit">▲ 4 pts · elevated</p><div className="mt-3 grid grid-cols-3 gap-2 border-t border-ink/10 pt-3 font-mono text-[10px]"><Metric value="1" label="Critical" tone="crit" /><Metric value="4" label="High" tone="amber" /><Metric value="12" label="Medium" tone="ink" /></div></SummaryCard>
        <SummaryCard className="xl:col-span-4" tone="dark" label="Asset Visibility" meta="LIVE"><div className="mt-3 flex items-end gap-4"><div><p className="font-display text-3xl font-semibold leading-none">1,204</p><p className="mt-1.5 font-mono text-[10px] text-paper/45">mapped</p></div><div className="pb-0.5"><p className="font-display text-xl font-semibold leading-none text-paper/70">179</p><p className="mt-1.5 font-mono text-[10px] text-amber-2/80">degraded</p></div></div><div className="mt-4 flex h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full w-[87%] bg-amber" /><div className="h-full w-[13%] bg-paper/20" /></div><p className="mt-3 font-mono text-[11px] text-paper/55">87% confirmed · 13% inferred</p><p className="mt-1 font-mono text-[10px] text-paper/40">Segment B sensor lag 41s</p></SummaryCard>
        <SummaryCard className="xl:col-span-4" tone="paper" label="Recent Changes" meta="6 today"><ul className="mt-3 space-y-2.5"><TimelineItem tone="crit" title="Rule R-2201 disabled" detail="14:02 · admin_k" /><TimelineItem tone="amber" title="PLC P-11 firmware v2.4" detail="11:47 · auto" /><TimelineItem tone="muted" title="HMI H-3 subnet changed" detail="09:15 · ops" /></ul></SummaryCard>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-12">
        <section className="flex flex-col rounded-[12px] bg-paper text-ink ring-1 ring-black/5 lg:col-span-5"><PanelHeader light icon={<ShieldAlert className="size-4 text-crit" />} title="Urgent Findings" meta="5 open" /><div className="divide-y divide-ink/10"><Finding title="RDP to PLC from workstation WS-1042" severity="Critical" confidence="94%" zone="DMZ" time="14:12" /><Finding title="Unknown vendor tag on HMI H-3" severity="High" confidence="71%" zone="A" time="13:40" /><Finding title="Modbus flood on segment B" severity="High" confidence="63%" zone="B" time="12:58" /></div><div className="p-3 pt-2"><Button variant="outline" className="h-8 w-full rounded-[8px] border-ink/15 bg-transparent font-mono text-[11px] text-ink hover:bg-ink/5">View all findings <ArrowRight className="ml-1.5 size-3.5" /></Button></div></section>
        <section className="flex flex-col rounded-[12px] bg-ink-2 ring-1 ring-white/10 lg:col-span-4"><PanelHeader icon={<GitBranch className="size-4 text-amber" />} title="Attack-Path Preview" meta="4 paths" /><div className="space-y-2.5 p-3"><PathPreview /><PathPreview secondary /></div><div className="mt-auto p-3 pt-0"><Button onClick={onOpenPaths} className="h-9 w-full rounded-[9px] bg-amber font-mono text-[12px] font-medium text-ink hover:bg-amber-2">Open investigation <ArrowRight className="ml-1.5 size-4" /></Button></div></section>
        <section className="flex flex-col rounded-[12px] bg-paper text-ink ring-1 ring-black/5 lg:col-span-3"><PanelHeader light icon={<Radar className="size-4 text-ink/60" />} title="Sensor Health" meta="12 feeds" /><div className="divide-y divide-ink/10"><Sensor name="IDS-01" status="Down" tone="crit" /><Sensor name="Flow-07" status="Degraded" tone="amber" pulse /><Sensor name="Log-12" status="Offline" tone="muted" /><Sensor name="IDS-03" status="OK" tone="ok" /></div><div className="mt-auto px-4 py-3"><div className="flex items-center gap-2 font-mono text-[10px] text-ink/45"><span className="size-1.5 rounded-full bg-crit" /> Visibility gap detected</div></div></section>
      </div>
    </main>
  );
}

function SummaryCard({ tone, label, meta, className, children }: { tone: "paper" | "dark"; label: string; meta: string; className?: string; children: React.ReactNode }) {
  const light = tone === "paper";
  return <section className={cn("flex min-h-[174px] flex-col rounded-[12px] p-4", light ? "bg-paper text-ink ring-1 ring-black/5" : "bg-ink-2 ring-1 ring-white/10", className)}><div className="flex items-center justify-between"><p className={cn("font-mono text-[10px] font-medium uppercase tracking-[0.14em]", light ? "text-ink/50" : "text-paper/45")}>{label}</p><span className={cn("font-mono text-[10px]", light ? "text-ink/40" : "text-amber-2/80")}>{meta}</span></div>{children}</section>;
}

function Metric({ value, label, tone }: { value: string; label: string; tone: "crit" | "amber" | "ink" }) { return <div><p className={cn("font-semibold leading-none text-base", tone === "crit" ? "text-crit" : tone === "amber" ? "text-amber" : "text-ink")}>{value}</p><p className="mt-1 text-ink/55">{label}</p></div>; }
function TimelineItem({ title, detail, tone }: { title: string; detail: string; tone: "crit" | "amber" | "muted" }) { return <li className="flex items-start gap-2"><span className={cn("mt-1 size-1.5 shrink-0 rounded-full", tone === "crit" ? "bg-crit" : tone === "amber" ? "bg-amber" : "bg-ink/40")} /><div><p className="font-mono text-[11px] leading-snug">{title}</p><p className="mt-0.5 font-mono text-[10px] text-ink/45">{detail}</p></div></li>; }
function PanelHeader({ icon, title, meta, light = false }: { icon: React.ReactNode; title: string; meta: string; light?: boolean }) { return <div className={cn("flex items-center justify-between border-b px-4 pb-3 pt-3.5", light ? "border-ink/10" : "border-white/10")}><div className="flex items-center gap-2">{icon}<h2 className="font-display text-[15px] font-semibold tracking-tight">{title}</h2></div><span className={cn("font-mono text-[10px]", light ? "text-ink/45" : "text-paper/45")}>{meta}</span></div>; }
function Finding({ title, severity, confidence, zone, time }: { title: string; severity: string; confidence: string; zone: string; time: string }) { const critical = severity === "Critical"; return <button type="button" className="block w-full px-4 py-3 text-left transition-colors hover:bg-ink/5"><div className="flex items-start justify-between gap-2"><p className="font-mono text-[12px] font-medium leading-snug">{title}</p><span className={cn("shrink-0 rounded-[4px] px-1.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wide", critical ? "bg-crit text-paper" : "bg-amber text-ink")}>{severity}</span></div><div className="mt-1.5 flex items-center gap-3 font-mono text-[10px] text-ink/50"><span>Conf <b className="font-semibold text-ink">{confidence}</b></span><span>Zone <b className="font-semibold text-ink">{zone}</b></span><span className="text-ink/35">{time}</span></div></button>; }
function PathPreview({ secondary = false }: { secondary?: boolean }) { return <div className={cn("rounded-[10px] bg-ink-3 p-3 ring-1 ring-white/5", secondary && "opacity-70")}><div className="flex items-center justify-between font-mono text-[10px] text-paper/50"><span>{secondary ? "HMI H-3" : "WS-1042"}</span><span className={secondary ? "text-paper/40" : "text-amber-2"}>→</span><span>{secondary ? "Gateway G-2" : "PLC P-11"}</span></div><div className="mt-2 flex items-center gap-1"><span className={cn("grid size-5 place-items-center rounded-full", secondary ? "border-2 border-paper/50" : "bg-amber")}><span className={cn("size-1.5 rounded-full", secondary ? "hidden" : "bg-ink")} /></span><span className={cn("h-px flex-1 border-t border-dashed", secondary ? "border-paper/25" : "border-amber/50")} /><span className={cn("size-4 rounded-full border-2", secondary ? "border-dashed border-paper/40" : "border-paper/60")} /><span className="h-px w-4 border-t border-dashed border-amber/50" /><span className={cn("grid size-5 place-items-center rounded-full", secondary ? "border border-paper/30" : "bg-crit")}><span className={cn("size-1.5 rounded-full", secondary ? "hidden" : "bg-paper")} /></span></div><div className="mt-2 flex items-center justify-between font-mono text-[9px] text-paper/45"><span>{secondary ? "unverified" : "vuln CVE-2024-XXXX"}</span><span className={secondary ? "text-paper/40" : "text-crit"}>{secondary ? "low confidence" : "exploitable"}</span></div></div>; }
function Sensor({ name, status, tone, pulse = false }: { name: string; status: string; tone: "crit" | "amber" | "muted" | "ok"; pulse?: boolean }) { return <div className="flex items-center justify-between px-4 py-2.5"><span className="font-mono text-[11px]">{name}</span><span className="flex items-center gap-1.5 font-mono text-[10px]"><span className={cn("size-1.5 rounded-full", pulse && "live-pulse", tone === "crit" ? "bg-crit" : tone === "amber" ? "bg-amber" : tone === "ok" ? "bg-ok" : "bg-ink/30")} />{status}</span></div>; }

function AttackPathWorkspace({ selectedNode, onSelectNode, selected, actionState, onAction, onBack, site, zone }: { selectedNode: SelectedNode; onSelectNode: (node: SelectedNode) => void; selected: (typeof nodeDetails)[SelectedNode]; actionState: "idle" | "applied" | "escalated"; onAction: (state: "idle" | "applied" | "escalated") => void; onBack: () => void; site: string; zone: string }) {
  return <main className="flex min-h-0 flex-1 flex-col overflow-hidden"><div className="flex flex-wrap items-center gap-3 border-b border-white/10 px-5 py-4"><Button variant="ghost" onClick={onBack} className="h-8 rounded-[8px] px-2.5 font-mono text-[11px] text-paper/60 hover:bg-white/5 hover:text-paper"><ArrowLeft className="mr-1.5 size-3.5" /> Command Center</Button><span className="text-paper/20">/</span><div><p className="font-mono text-[10px] uppercase tracking-[0.16em] text-amber-2">Investigation workspace</p><h1 className="font-display text-xl font-semibold">Attack Paths <span className="font-mono text-xs font-normal text-paper/45">· Path P-091</span></h1></div><div className="ml-auto flex items-center gap-2"><Button variant="outline" className="hidden h-8 rounded-[8px] border-white/10 bg-transparent font-mono text-[11px] text-paper/70 hover:bg-white/5 sm:flex"><SlidersHorizontal className="mr-1.5 size-3.5" /> Filters</Button><Button className="h-8 rounded-[8px] bg-amber font-mono text-[11px] text-ink hover:bg-amber-2"><Sparkles className="mr-1.5 size-3.5" /> Highlight critical</Button></div></div><div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px]"><div className="min-h-[540px] overflow-auto border-b border-white/10 p-4 lg:border-b-0 lg:border-r lg:p-5"><div className="mb-4 flex flex-wrap items-center gap-2"><div className="flex h-9 min-w-[220px] flex-1 items-center gap-2 rounded-[8px] border border-white/10 bg-ink-2 px-3"><Search className="size-3.5 text-paper/40" /><input aria-label="Search graph" placeholder="Search assets, zones, protocols" className="min-w-0 flex-1 bg-transparent font-mono text-[11px] text-paper outline-none placeholder:text-paper/35" /></div><div className="flex items-center gap-1 rounded-[8px] border border-white/10 bg-ink-2 p-1 font-mono text-[10px]"><span className="rounded-[6px] bg-amber px-2 py-1 text-ink">Single path</span><span className="px-2 py-1 text-paper/45">All paths</span></div><Button variant="outline" size="icon" className="size-9 rounded-[8px] border-white/10 bg-ink-2 text-paper/60 hover:bg-white/5" aria-label="Fit graph"><Crosshair className="size-4" /></Button></div><div className="relative min-h-[470px] overflow-hidden rounded-[12px] border border-white/10 bg-ink-2"><div className="absolute inset-0 opacity-60" style={{ backgroundImage: "linear-gradient(oklch(0.84 0.025 88 / 0.06) 1px, transparent 1px), linear-gradient(90deg, oklch(0.84 0.025 88 / 0.06) 1px, transparent 1px)", backgroundSize: "32px 32px" }} /><div className="absolute left-4 top-4 flex items-center gap-2 font-mono text-[10px] text-paper/40"><Map className="size-3.5" /> {site} · {zone} · 6 nodes · 5 relationships</div><GraphEdge className="left-[18%] top-[46%] w-[22%] rotate-[12deg]" active label="RDP · 3389" /><GraphEdge className="left-[38%] top-[41%] w-[18%] rotate-[-8deg]" active label="SMB · 445" /><GraphEdge className="left-[56%] top-[43%] w-[19%] rotate-[10deg]" active label="Modbus/TCP" /><GraphEdge className="left-[37%] top-[65%] w-[28%] rotate-[-17deg]" label="OPC-UA" dashed /><GraphNode node="ws" selectedNode={selectedNode} onSelect={onSelectNode} className="left-[10%] top-[43%]" role="SOURCE" /><GraphNode node="switch" selectedNode={selectedNode} onSelect={onSelectNode} className="left-[34%] top-[35%]" role="PIVOT" /><GraphNode node="gateway" selectedNode={selectedNode} onSelect={onSelectNode} className="left-[55%] top-[58%]" role="PIVOT" /><GraphNode node="plc" selectedNode={selectedNode} onSelect={onSelectNode} className="left-[78%] top-[39%]" role="TARGET" critical /><div className="absolute bottom-4 left-4 flex flex-wrap gap-3 rounded-[8px] border border-white/10 bg-ink/80 px-3 py-2 font-mono text-[9px] text-paper/50"><span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-amber" /> selected path</span><span className="flex items-center gap-1.5"><span className="size-2 rounded-full border border-paper/60" /> observed</span><span className="flex items-center gap-1.5"><span className="size-2 rounded-full border border-dashed border-amber" /> inferred</span></div><div className="absolute bottom-4 right-4 flex items-center gap-1 rounded-[8px] border border-white/10 bg-ink/80 p-1"><Button variant="ghost" size="icon" className="size-7 text-paper/60 hover:bg-white/5 hover:text-paper" aria-label="Zoom out">−</Button><span className="px-1 font-mono text-[10px] text-paper/50">100%</span><Button variant="ghost" size="icon" className="size-7 text-paper/60 hover:bg-white/5 hover:text-paper" aria-label="Zoom in">+</Button></div></div></div><aside className="flex min-h-0 flex-col bg-ink-2"><div className="flex items-center justify-between border-b border-white/10 px-4 py-4"><div><p className="font-mono text-[9px] uppercase tracking-[0.15em] text-paper/45">Selected {selected.role}</p><p className="font-display text-[15px] font-semibold">{selected.name}</p></div><Button variant="ghost" size="icon" className="size-8 text-paper/45 hover:bg-white/5 hover:text-paper" aria-label="Close selection"><X className="size-4" /></Button></div><div className="flex-1 overflow-y-auto px-4 py-4"><div className="flex items-center gap-2.5 border-b border-white/10 pb-4"><div className={cn("grid size-9 place-items-center rounded-[9px]", selected.severity === "Critical" ? "bg-crit" : "bg-amber")}><Server className="size-4 text-paper" /></div><div><p className="font-mono text-[13px] font-medium">{selected.name}</p><p className="font-mono text-[10px] text-paper/50">{selected.type} · {selected.zone}</p></div></div><DetailBlock title="Why it matters"><p className="font-mono text-[11px] leading-relaxed text-paper/70">This {selected.role.toLowerCase()} creates a viable movement opportunity toward a process-critical asset. The path is rated <span className="text-amber-2">{selected.severity.toLowerCase()}</span> with observed evidence on two relationships.</p></DetailBlock><DetailBlock title="Evidence"><EvidenceRow icon={<Network className="size-3.5" />} label="RDP session to 10.4.1.11" value="14:12:07 · conf 94%" /><EvidenceRow icon={<Database className="size-3.5" />} label="CVE-2024-XXXX present" value="firmware v2.3 · conf 88%" /><EvidenceRow icon={<AlertTriangle className="size-3.5" />} label="Lateral to G-02" value="inferred · conf 41%" muted /></DetailBlock><DetailBlock title="Recommended Action"><div className="rounded-[9px] bg-amber/10 p-3 ring-1 ring-amber/30"><p className="font-mono text-[12px] font-medium text-amber-2">{actionState === "applied" ? "Action applied" : actionState === "escalated" ? "Escalated to plant lead" : "Isolate WS-1042"}</p><p className="mt-1.5 font-mono text-[10px] leading-relaxed text-paper/60">Quarantine source host, block RDP to segment B, and patch PLC P-11 firmware to v2.4.</p><div className="mt-3 flex gap-2"><Button onClick={() => onAction("applied")} disabled={actionState === "applied"} className="h-8 rounded-[8px] bg-amber px-3 font-mono text-[11px] font-medium text-ink hover:bg-amber-2">{actionState === "applied" ? "Applied" : "Apply"}</Button><Button onClick={() => onAction("escalated")} variant="outline" className="h-8 rounded-[8px] border-white/15 bg-transparent px-3 font-mono text-[11px] text-paper/70 hover:bg-white/5">Escalate</Button></div></div></DetailBlock></div><div className="border-t border-white/10 px-4 py-3"><p className="font-mono text-[10px] text-paper/45">Graph context preserved · 6 nodes · 5 links</p></div></aside></div></main>;
}

function GraphEdge({ className, active = false, label, dashed = false }: { className: string; active?: boolean; label: string; dashed?: boolean }) { return <div className={cn("absolute h-px origin-left", active ? "bg-amber" : "bg-paper/25", dashed && "border-t border-dashed border-amber/50 bg-transparent", className)}><span className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[9px] text-paper/35">{label}</span></div>; }
function GraphNode({ node, selectedNode, onSelect, className, role, critical = false }: { node: SelectedNode; selectedNode: SelectedNode; onSelect: (node: SelectedNode) => void; className: string; role: string; critical?: boolean }) { const detail = nodeDetails[node]; const selected = selectedNode === node; return <button type="button" onClick={() => onSelect(node)} className={cn("absolute -translate-y-1/2 text-left outline-none", className)}><div className={cn("flex items-start gap-2 rounded-[9px] border px-2 py-1.5 transition-colors", selected ? "border-amber/70 bg-amber/10" : "border-transparent hover:border-white/15 hover:bg-white/5")}><span className={cn("mt-0.5 grid size-5 shrink-0 place-items-center rounded-full", critical ? "bg-crit" : selected ? "bg-amber" : "border-2 border-paper/60 bg-ink-2")}><CircleDot className={cn("size-2.5", critical || selected ? "text-ink" : "text-paper/60")} /></span><span><span className={cn("block whitespace-nowrap font-mono text-[11px] font-medium", critical || selected ? "text-amber-2" : "text-paper/80")}>{detail.name}</span><span className="block font-mono text-[9px] uppercase tracking-[0.12em] text-paper/40">{role} · {detail.zone}</span></span></div></button>; }
function DetailBlock({ title, children }: { title: string; children: React.ReactNode }) { return <section className="mt-5"><p className="mb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-paper/45">{title}</p>{children}</section>; }
function EvidenceRow({ icon, label, value, muted = false }: { icon: React.ReactNode; label: string; value: string; muted?: boolean }) { return <div className={cn("mb-2 rounded-[9px] p-2.5 ring-1", muted ? "bg-ink-3 ring-white/10" : "bg-paper text-ink ring-black/5")}><div className="flex items-start gap-2"><span className={cn("mt-0.5", muted ? "text-amber-2" : "text-ink/60")}>{icon}</span><div><p className={cn("font-mono text-[11px] font-medium", muted ? "text-paper/75" : "text-ink")}>{label}</p><p className={cn("mt-1 font-mono text-[10px]", muted ? "text-paper/40" : "text-ink/55")}>{value}</p></div></div></div>; }