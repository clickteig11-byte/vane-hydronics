import React, { useState, useId } from 'react';
import { 
  ArrowUpRight, 
  CheckCircle2, 
  Compass, 
  Flame, 
  Gauge, 
  Info, 
  Menu, 
  Sliders, 
  X,
  ShieldCheck,
  FileText
} from 'lucide-react';

interface PipeSpec {
  nominal: string;
  idIn: number;
}

const TYPE_L_COPPER: PipeSpec[] = [
  { nominal: '3/4" Type L', idIn: 0.785 },
  { nominal: '1" Type L', idIn: 1.025 },
  { nominal: '1-1/4" Type L', idIn: 1.265 },
  { nominal: '1-1/2" Type L', idIn: 1.505 },
  { nominal: '2" Type L', idIn: 1.985 },
  { nominal: '2-1/2" Type L', idIn: 2.465 },
  { nominal: '3" Type L', idIn: 2.945 },
  { nominal: '4" Type L', idIn: 3.905 },
];

interface StationDetail {
  id: string;
  name: string;
  model: string;
  dataKind: 'Design Condition' | 'Factory Benchmark';
  tempSupply: string;
  tempReturn: string;
  flowGpm: string;
  pressurePsi: string;
  material: string;
  sourceStandard: string;
  docLinkText: string;
  description: string;
}

const STATIONS: Record<string, StationDetail> = {
  boiler: {
    id: 'boiler',
    name: 'Primary Boiler Loop',
    model: 'Lochinvar Knight XL (KBX400)',
    dataKind: 'Design Condition',
    tempSupply: '170°F (76.7°C) Supply Header',
    tempReturn: '130°F (54.4°C) Condensing Return',
    flowGpm: '19.95 GPM at Full Fire (40°F Loop ΔT)',
    pressurePsi: '24.0 PSI Operating (50 PSI ASME Safety Relief)',
    material: '2" Type L Hard-Drawn Copper (ASTM B88)',
    sourceStandard: 'AHRI Certified · 97.0% Thermal Efficiency · 10:1 Turndown · ASME Sec. IV',
    docLinkText: 'Lochinvar Knight XL Technical Manual (Rev H, Doc KBX-I-O)',
    description: 'Modulating stainless steel fire-tube heat exchanger operating in high condensing efficiency. Features integrated outdoor temperature reset schedule to minimize standby radiation loss.'
  },
  separator: {
    id: 'separator',
    name: '4-Port Hydraulic Separator',
    model: 'Caleffi SEP4 549552A (2" ANSI Flanged)',
    dataKind: 'Design Condition',
    tempSupply: '168°F Primary Supply Header',
    tempReturn: '128°F System Common Return',
    flowGpm: '60 GPM Rated Hydraulic Capacity',
    pressurePsi: '0.4 PSI ΔP at 20 GPM Design Flow',
    material: 'Epoxy-Coated Carbon Steel Body with Internal Coalescing Mesh & Magnet',
    sourceStandard: 'Caleffi SEP4 Submittal 02930-4_NA · 5-Micron Dirt & Magnetic Separation',
    docLinkText: 'Caleffi North America Technical Submittal 02930-4_NA',
    description: 'Completely uncouples primary boiler loop circulator from multiple secondary distribution zone pumps while continuously venting micro-bubbles and capturing sub-micron magnetite particles.'
  },
  radiant: {
    id: 'radiant',
    name: 'Radiant Mixing & Manifold',
    model: 'Viega Stainless Manifold & 3-Way Thermostatic Mixing Station',
    dataKind: 'Design Condition',
    tempSupply: '110°F (43.3°C) Blended In-Slab Supply',
    tempReturn: '90°F (32.2°C) Radiant Floor Return',
    flowGpm: '8.4 GPM Total Across 8 Zone Circuits',
    pressurePsi: '16.5 PSI Design Head Loss',
    material: 'AISI 304 Stainless Trunk · 1/2" PEX-a EVOH Oxygen Barrier Tubing',
    sourceStandard: 'DIN 4725 / EN 1264 Radiant Surface Standard · DIN 4726 Oxygen Diffusion Barrier',
    docLinkText: 'Viega ProRadiant Stainless Manifold Technical Specification Sheet',
    description: 'Thermostatic 3-way injection mixing valve continuously tempers 168°F primary supply with return water to deliver uniform 110°F supply, protecting wide-plank oak and honed limestone floors.'
  },
  dhw: {
    id: 'dhw',
    name: 'Indirect Domestic Hot Water',
    model: 'HTP SuperStor Ultra SSU-119N',
    dataKind: 'Factory Benchmark',
    tempSupply: '170°F Boiler Supply to Internal Coil',
    tempReturn: '140°F Potable Storage Tank Setpoint',
    flowGpm: '14.0 GPM Boiler Coil Circulation Flow',
    pressurePsi: '150 PSI Potable Vessel Working Rating',
    material: '316L Passivated Stainless Tank · Finned Cupronickel Coil Exchanger',
    sourceStandard: '423 GPH First-Hour Rating (180°F Boiler Water / 90°F Potable Rise per HTP Spec)',
    docLinkText: 'HTP SuperStor Ultra SpecSheet HTP_MKTLIT-111 (Rev 1.18.24)',
    description: 'Generational indirect domestic storage vessel equipped with an ASSE 1017 thermostatic mixing valve delivering anti-scald 120°F water to high-flow master showers.'
  },
  drainage: {
    id: 'drainage',
    name: 'Acoustic Hubless Soil Stack',
    model: 'Charlotte Pipe No-Hub Cast Iron System with Neoprene Isolation',
    dataKind: 'Factory Benchmark',
    tempSupply: 'Atmospheric Gravity Sanitary Drainage',
    tempReturn: 'Continuous Air Venting Stack',
    flowGpm: 'Intermittent Fixture Drainage Demand',
    pressurePsi: 'Zero Static Pressure (Gravity Drainage)',
    material: 'ASTM A888 / CISPI 301 Hubless Gray Iron · Neoprene Spring Riser Clamps',
    sourceStandard: 'CISPI 301 / ASTM A888 Cast Iron Standard · Attenuates Water Noise 15–20 dB vs PVC',
    docLinkText: 'Charlotte Pipe Cast Iron Technical & Installation Manual (Doc BR-CI)',
    description: 'High-density graphite matrix cast iron wrapped with elastomeric neoprene couplings; attenuates water rush sound by 15–20 dB compared to Schedule 40 PVC to maintain an ambient room sound floor below NC-20.'
  }
};

export default function App() {
  const [activeStation, setActiveStation] = useState<string>('boiler');
  const [heatLoadBtu, setHeatLoadBtu] = useState<number>(180000);
  const [deltaT, setDeltaT] = useState<number>(20);
  const [targetMaxVelocity, setTargetMaxVelocity] = useState<number>(4.0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [intakeSuccess, setIntakeSuccess] = useState<boolean>(false);
  const [architectName, setArchitectName] = useState<string>('');
  const [projectLocation, setProjectLocation] = useState<string>('');
  const [buildingType, setBuildingType] = useState<string>('Custom Residential Residence (3,000–8,000 sq.ft)');

  // Physics calculation
  const calculatedGpm = heatLoadBtu / (500 * deltaT);

  // Exact fluid velocity equation: V (ft/s) = 0.4085 * GPM / (ID_inches ^ 2)
  const calculateVelocityFps = (gpm: number, idIn: number): number => {
    return (0.4085 * gpm) / Math.pow(idIn, 2);
  };

  // Find smallest Type L copper nominal size that satisfies target velocity
  const compliantPipe = TYPE_L_COPPER.find((p) => calculateVelocityFps(calculatedGpm, p.idIn) <= targetMaxVelocity) || 
    TYPE_L_COPPER[TYPE_L_COPPER.length - 1];

  const actualVelocity = calculateVelocityFps(calculatedGpm, compliantPipe.idIn);
  const station = STATIONS[activeStation] || STATIONS.boiler;

  const handleCommissionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIntakeSuccess(true);
  };

  const heatLoadInputId = useId();
  const deltaTInputId = useId();
  const velocitySelectId = useId();

  return (
    <div className="plant-wrapper">
      {/* SWISS TOP BENCHMARK TICKER */}
      <aside className="status-top-bar" aria-label="System Standards Readout">
        <div className="top-bar-container">
          <div className="status-item">
            <span className="pulse-indicator" aria-hidden="true"></span>
            <span className="mono-label">DISPATCH READY:</span>
            <span className="status-value">LICENSED MASTER MECHANICAL ENGINEERS</span>
          </div>
          <div className="status-item hide-mobile">
            <span className="mono-label">STANDARDS:</span>
            <span>ASME SEC. IV · ASTM B88 · ASTM A888 · CISPI 301</span>
          </div>
          <div className="status-item hide-mobile">
            <span className="mono-label">ACOUSTIC CRITERION:</span>
            <span>&lt; NC-20 BEDROOM SOUND FLOOR IN CHASE ASSEMBLIES</span>
          </div>
          <div className="status-item">
            <span className="mono-label">STUDIO STATIONS:</span>
            <span className="coords-text">BOSTON &amp; GENÈVE</span>
          </div>
        </div>
      </aside>

      {/* SWISS EDGE HEADER */}
      <header className="master-header">
        <div className="header-inner">
          <div className="brand-group">
            <a href="#hero" className="brand-link">
              <span className="brand-primary">VANE &amp; TOR</span>
              <span className="brand-tag">ARCHITECTURAL HYDRONICS &amp; SANITARY PLANT</span>
            </a>
          </div>

          <nav className="header-nav" aria-label="Primary Navigation">
            <a href="#schematic" className="nav-item">01. SCHEMATIC</a>
            <a href="#calculator" className="nav-item">02. HYDRODYNAMICS</a>
            <a href="#drainage" className="nav-item">03. ACOUSTIC CHASE</a>
            <a href="#materials" className="nav-item">04. METALLURGY</a>
            <a href="#commission" className="nav-item">05. COMMISSIONING</a>
          </nav>

          <div className="header-action-group">
            <a href="#commission" className="swiss-button">
              COMMISSION RIG
              <ArrowUpRight size={13} aria-hidden="true" />
            </a>
            <button 
              type="button" 
              className="mobile-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* MOBILE SLIDE-DOWN NAVIGATION */}
        {mobileMenuOpen && (
          <nav className="mobile-nav-tray" aria-label="Mobile Navigation">
            <a href="#schematic" onClick={() => setMobileMenuOpen(false)}>01. SCHEMATIC EXPLORER</a>
            <a href="#calculator" onClick={() => setMobileMenuOpen(false)}>02. HYDRODYNAMIC SIZING</a>
            <a href="#drainage" onClick={() => setMobileMenuOpen(false)}>03. ACOUSTIC DRAINAGE</a>
            <a href="#materials" onClick={() => setMobileMenuOpen(false)}>04. METALLURGY ARCHIVE</a>
            <a href="#commission" onClick={() => setMobileMenuOpen(false)}>05. COMMISSIONING INTAKE</a>
          </nav>
        )}
      </header>

      {/* HERO SECTION */}
      <section id="hero" className="hero-section">
        <div className="hero-media-wrapper">
          <img 
            src="/images/plant-room-hero.jpg" 
            alt="Natural sunlit residential plant room with hand-soldered Type L copper manifolds, hydronic circulators, and brass isolation valves" 
            className="hero-image"
          />
          <div className="hero-light-gradient"></div>
          
          <div className="image-caption-badge">
            <Compass size={13} className="caption-icon" aria-hidden="true" />
            <span>RESIDENTIAL PLANT ROOM · CAMBRIDGE, MA · 8-ZONE COPPER MANIFOLD</span>
          </div>
        </div>

        <div className="hero-content-shelf">
          <div className="hero-content-inner">
            <div className="kicker-tag">
              <Flame size={13} className="accent-icon" aria-hidden="true" />
              <span>ARCHITECTURAL MECHANICAL ENGINEERING &amp; HYDRONIC CRAFT</span>
            </div>

            <h1 className="hero-headline">
              PARALLEL COPPER RUNS.<br />
              CALIBRATED FOR SILENCE.
            </h1>

            <p className="hero-descriptor">
              Custom condensing boilers, 4-port hydraulic separation, and mass-damped hubless cast-iron drainage engineered for residences where mechanical noise is intolerable and craft is non-negotiable.
            </p>

            <div className="hero-action-cluster">
              <a href="#schematic" className="primary-trade-btn">
                <span>INSPECT HYDRONIC SCHEMATIC</span>
                <Sliders size={15} aria-hidden="true" />
              </a>
              <a href="#calculator" className="secondary-trade-btn">
                <span>OPEN HYDRODYNAMIC CALCULATOR</span>
                <Gauge size={15} aria-hidden="true" />
              </a>
            </div>

            <div className="hero-quiet-caption">
              <span>BENCHMARK DATA: 97.0% THERMAL EFFICIENCY · &lt; 4.0 FT/S VELOCITY LIMIT · 50 PSI 4-HR HYDROSTATIC ZERO-LEAK TEST</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 01: ACCURATE 4-PORT SCHEMATIC EXPLORER */}
      <section id="schematic" className="schematic-section">
        <header className="section-head">
          <div className="section-kicker">01 / HYDRONIC TOPOLOGY</div>
          <h2 className="section-title">THE ARCHITECTURAL MECHANICAL RIG</h2>
          <p className="section-lead">
            Inspect the decoupled primary-secondary hydronic loop. Click any station in the schematic to inspect design temperatures, flow rates, metallurgy, and manufacturer engineering citations.
          </p>
        </header>

        <div className="schematic-layout-grid">
          {/* STATION SELECTOR */}
          <div className="schematic-selector-column">
            <div className="station-nav" role="tablist" aria-label="Mechanical Rig Stations">
              {Object.keys(STATIONS).map((key, idx) => {
                const s = STATIONS[key];
                const isActive = activeStation === key;
                return (
                  <button
                    key={key}
                    type="button"
                    role="tab"
                    id={`tab-${key}`}
                    aria-controls={`panel-${key}`}
                    aria-selected={isActive}
                    onClick={() => setActiveStation(key)}
                    className={`station-button ${isActive ? 'station-button-active' : ''}`}
                  >
                    <div className="btn-index">0{idx + 1}</div>
                    <div className="btn-content">
                      <div className="btn-title">{s.name}</div>
                      <div className="btn-sub">{s.model.split('(')[0]}</div>
                    </div>
                    {isActive && <div className="btn-active-pill">SELECTED</div>}
                  </button>
                );
              })}
            </div>

            <article 
              id={`panel-${station.id}`}
              role="tabpanel"
              aria-labelledby={`tab-${station.id}`}
              className="station-spec-card"
            >
              <div className="spec-card-header">
                <span className="spec-card-badge">{station.dataKind.toUpperCase()}</span>
                <span className="spec-card-id">VT-{station.id.toUpperCase()}-04</span>
              </div>

              <h3 className="spec-component-name">{station.model}</h3>
              <p className="spec-description">{station.description}</p>

              <div className="spec-data-table">
                <div className="data-row">
                  <span className="row-label">Supply Parameter</span>
                  <span className="row-value highlight-copper">{station.tempSupply}</span>
                </div>
                <div className="data-row">
                  <span className="row-label">Return / Delivery</span>
                  <span className="row-value">{station.tempReturn}</span>
                </div>
                <div className="data-row">
                  <span className="row-label">Flow Specification</span>
                  <span className="row-value tabular-num">{station.flowGpm}</span>
                </div>
                <div className="data-row">
                  <span className="row-label">Pressure Limit</span>
                  <span className="row-value tabular-num">{station.pressurePsi}</span>
                </div>
                <div className="data-row">
                  <span className="row-label">Metallurgical Material</span>
                  <span className="row-value mono-compact">{station.material}</span>
                </div>
                <div className="data-row">
                  <span className="row-label">Standard &amp; Rating</span>
                  <span className="row-value mono-compact">{station.sourceStandard}</span>
                </div>
                <div className="data-row citation-row">
                  <span className="row-label">Manufacturer Citation</span>
                  <span className="row-value mono-compact citation-text">
                    <FileText size={11} className="inline-icon" aria-hidden="true" />
                    {station.docLinkText}
                  </span>
                </div>
              </div>
            </article>
          </div>

          {/* VISUAL DIAGRAM DISPLAY */}
          <div className="schematic-diagram-column">
            <div className="diagram-canvas">
              <div className="canvas-header">
                <div className="canvas-title-group">
                  <span className="canvas-badge">CAD SCHEMATIC</span>
                  <span className="canvas-sub">DECOUPLED PRIMARY-SECONDARY HYDRONIC SYSTEM</span>
                </div>
                <div className="canvas-status">BALANCED ΔT 40°F CONDENSING / ΔT 20°F RADIANT</div>
              </div>

              <div className="diagram-svg-holder">
                <svg viewBox="0 0 740 480" className="schematic-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Grid Background */}
                  <pattern id="cadGrid3" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(11, 21, 40, 0.05)" strokeWidth="0.8" />
                  </pattern>
                  <rect width="740" height="480" fill="url(#cadGrid3)" />

                  {/* Primary Supply Loop (Boiler to Separator Top Port 1) */}
                  <path d="M 120 160 L 260 160" stroke="#8F3B0A" strokeWidth="6" strokeLinecap="round" />
                  {/* Primary Circulator Pump */}
                  <circle cx="190" cy="160" r="14" fill="#FFFFFF" stroke="#0B1528" strokeWidth="2" />
                  <polygon points="186,153 197,160 186,167" fill="#8F3B0A" />
                  <text x="190" y="186" textAnchor="middle" fill="#5A6A80" fontSize="8" fontFamily="JetBrains Mono">PRIMARY PUMP</text>

                  {/* Primary Return Loop (Separator Bottom Port 2 to Boiler) */}
                  <path d="M 260 290 L 120 290" stroke="#0B1528" strokeWidth="6" strokeLinecap="round" />

                  {/* Separator Body (4-Port Caleffi SEP4 with Internal Coalescing Mesh & Magnet) */}
                  <rect x="250" y="120" width="36" height="210" rx="4" fill="#EFECE4" stroke="#0B1528" strokeWidth="2.5" />
                  <line x1="268" y1="120" x2="268" y2="330" stroke="#8F3B0A" strokeWidth="2" strokeDasharray="3 3" />
                  {/* Neodymium Magnet Symbol */}
                  <rect x="262" y="200" width="12" height="40" rx="2" fill="#0B1528" />

                  {/* Secondary Supply Loop (Separator Port 3 to Radiant & DHW Headers) */}
                  <path d="M 286 160 L 390 160 L 390 110 L 450 110" stroke="#8F3B0A" strokeWidth="5" strokeLinecap="round" />
                  
                  {/* Secondary DHW Supply Branch (Fully connected into DHW Tank) */}
                  <path d="M 390 160 L 390 250 L 530 250" stroke="#8F3B0A" strokeWidth="5" strokeLinecap="round" />
                  {/* DHW Priority Circulator */}
                  <circle cx="430" cy="250" r="12" fill="#FFFFFF" stroke="#0B1528" strokeWidth="2" />
                  <polygon points="426,244 435,250 426,256" fill="#8F3B0A" />

                  {/* Thermostatic 3-Way Radiant Mixing Valve */}
                  <polygon points="450,100 470,110 450,120" fill="#7A531C" stroke="#0B1528" strokeWidth="1.5" />
                  {/* Blended 110°F Radiant Supply */}
                  <path d="M 470 110 L 530 110" stroke="#7A531C" strokeWidth="4" strokeDasharray="5 2" />
                  {/* Radiant Circulation Pump */}
                  <circle cx="495" cy="110" r="11" fill="#FFFFFF" stroke="#0B1528" strokeWidth="2" />
                  <polygon points="492,105 500,110 492,115" fill="#7A531C" />

                  {/* Radiant Return line with temper bypass into 3-way valve */}
                  <path d="M 530 150 L 460 150 L 460 120" stroke="#0B1528" strokeWidth="3" />
                  {/* Secondary Return into Separator Port 4 */}
                  <path d="M 460 150 L 400 150 L 400 290 L 286 290" stroke="#0B1528" strokeWidth="5" strokeLinecap="round" />
                  {/* DHW Return line into Separator Port 4 */}
                  <path d="M 530 330 L 400 330 L 400 290" stroke="#0B1528" strokeWidth="5" strokeLinecap="round" />

                  {/* STATION 1: BOILER BLOCK */}
                  <g 
                    className={`cad-node ${activeStation === 'boiler' ? 'cad-node-active' : ''}`}
                    onClick={() => setActiveStation('boiler')}
                    style={{ cursor: 'pointer' }}
                  >
                    <rect x="30" y="120" width="90" height="190" rx="3" fill="#FFFFFF" stroke={activeStation === 'boiler' ? '#8F3B0A' : '#0B1528'} strokeWidth="2.5" />
                    <rect x="42" y="135" width="66" height="24" rx="2" fill="#F6F4EE" stroke="#CBC7BA" />
                    <text x="75" y="150" textAnchor="middle" fill="#0B1528" fontSize="9" fontFamily="JetBrains Mono" fontWeight="700">BOILER</text>
                    <text x="75" y="185" textAnchor="middle" fill="#8F3B0A" fontSize="11" fontFamily="JetBrains Mono" fontWeight="700">KBX400</text>
                    <text x="75" y="205" textAnchor="middle" fill="#5A6A80" fontSize="8" fontFamily="General Sans">97.0% Thermal</text>
                    <text x="75" y="260" textAnchor="middle" fill="#0B1528" fontSize="8" fontFamily="JetBrains Mono">10:1 TURNDOWN</text>
                  </g>

                  {/* STATION 2: SEPARATOR GROUP */}
                  <g 
                    className={`cad-node ${activeStation === 'separator' ? 'cad-node-active' : ''}`}
                    onClick={() => setActiveStation('separator')}
                    style={{ cursor: 'pointer' }}
                  >
                    <circle cx="268" cy="225" r="32" fill="#FFFFFF" stroke={activeStation === 'separator' ? '#8F3B0A' : '#0B1528'} strokeWidth="2.5" />
                    <text x="268" y="221" textAnchor="middle" fill="#0B1528" fontSize="9" fontFamily="JetBrains Mono" fontWeight="700">SEP4</text>
                    <text x="268" y="233" textAnchor="middle" fill="#8F3B0A" fontSize="8" fontFamily="JetBrains Mono">MAGNET</text>
                    <text x="268" y="245" textAnchor="middle" fill="#5A6A80" fontSize="7" fontFamily="JetBrains Mono">60 GPM 4-PORT</text>
                  </g>

                  {/* STATION 3: RADIANT MANIFOLD */}
                  <g 
                    className={`cad-node ${activeStation === 'radiant' ? 'cad-node-active' : ''}`}
                    onClick={() => setActiveStation('radiant')}
                    style={{ cursor: 'pointer' }}
                  >
                    <rect x="530" y="70" width="180" height="105" rx="3" fill="#FFFFFF" stroke={activeStation === 'radiant' ? '#8F3B0A' : '#0B1528'} strokeWidth="2.5" />
                    <text x="620" y="95" textAnchor="middle" fill="#0B1528" fontSize="10" fontFamily="JetBrains Mono" fontWeight="700">RADIANT MANIFOLD</text>
                    <text x="620" y="112" textAnchor="middle" fill="#7A531C" fontSize="9" fontFamily="JetBrains Mono">110°F BLENDED INJECTION</text>
                    {/* Visual branch loops */}
                    {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                      <line key={i} x1={545 + i * 22} y1="125" x2={545 + i * 22} y2="155" stroke="#8F3B0A" strokeWidth="2.5" />
                    ))}
                  </g>

                  {/* STATION 4: DHW INDIRECT STORAGE */}
                  <g 
                    className={`cad-node ${activeStation === 'dhw' ? 'cad-node-active' : ''}`}
                    onClick={() => setActiveStation('dhw')}
                    style={{ cursor: 'pointer' }}
                  >
                    <rect x="530" y="215" width="180" height="135" rx="6" fill="#FFFFFF" stroke={activeStation === 'dhw' ? '#8F3B0A' : '#0B1528'} strokeWidth="2.5" />
                    <text x="620" y="245" textAnchor="middle" fill="#0B1528" fontSize="10" fontFamily="JetBrains Mono" fontWeight="700">INDIRECT DHW TANK</text>
                    <text x="620" y="265" textAnchor="middle" fill="#8F3B0A" fontSize="9" fontFamily="JetBrains Mono">SSU-119N · 119 GAL</text>
                    <text x="620" y="290" textAnchor="middle" fill="#5A6A80" fontSize="8" fontFamily="General Sans">Finned CuNi Coil Exchanger</text>
                    <text x="620" y="310" textAnchor="middle" fill="#0B1528" fontSize="8" fontFamily="JetBrains Mono">423 GPH FIRST HOUR</text>
                  </g>

                  {/* STATION 5: ACOUSTIC SOIL STACK CHASE */}
                  <g 
                    className={`cad-node ${activeStation === 'drainage' ? 'cad-node-active' : ''}`}
                    onClick={() => setActiveStation('drainage')}
                    style={{ cursor: 'pointer' }}
                  >
                    <rect x="20" y="385" width="700" height="65" rx="3" fill="#FFFFFF" stroke={activeStation === 'drainage' ? '#8F3B0A' : '#0B1528'} strokeWidth="2" />
                    <text x="40" y="422" fill="#0B1528" fontSize="11" fontFamily="JetBrains Mono" fontWeight="700">ACOUSTIC DRAINAGE CHASE</text>
                    <text x="280" y="422" fill="#5A6A80" fontSize="9" fontFamily="JetBrains Mono">ASTM A888 / CISPI 301 HUBLESS CAST IRON</text>
                    <text x="540" y="422" fill="#166534" fontSize="9" fontFamily="JetBrains Mono" fontWeight="700">STC 56 CHASE · &lt; NC-20 SOUND FLOOR</text>
                  </g>
                </svg>
              </div>

              <div className="canvas-footer">
                <div className="legend-item">
                  <span className="legend-color legend-supply" aria-hidden="true"></span>
                  <span>170°F Primary Loop (Type L Copper)</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color legend-radiant" aria-hidden="true"></span>
                  <span>110°F Blended Radiant (PEX-a Barrier)</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color legend-return" aria-hidden="true"></span>
                  <span>128°F Secondary Return (Decoupled Loop)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 02: DYNAMIC VELOCITY HYDRODYNAMIC SIZING CALCULATOR */}
      <section id="calculator" className="calc-section">
        <header className="section-head">
          <div className="section-kicker">02 / FLUID DYNAMICS CALIBRATOR</div>
          <h2 className="section-title">VOLUMETRIC FLOW &amp; COPPER VELOCITY</h2>
          <p className="section-lead">
            Hydronic engineering governed strictly by fluid mechanics. Calculates volumetric flow demand and tests published inside diameters to maintain fluid velocity below erosion-corrosion thresholds.
          </p>
        </header>

        <div className="calc-panel-grid">
          <div className="calc-inputs-pane">
            <h3 className="pane-title">SYSTEM DESIGN INPUTS</h3>

            <div className="input-group">
              <div className="input-header">
                <label htmlFor={heatLoadInputId}>Design Heat Load (BTU/hr)</label>
                <span className="input-readout tabular-num">{heatLoadBtu.toLocaleString()} BTU/HR</span>
              </div>
              <input
                id={heatLoadInputId}
                type="range"
                min="40000"
                max="400000"
                step="10000"
                value={heatLoadBtu}
                onChange={(e) => setHeatLoadBtu(Number(e.target.value))}
                className="custom-range"
              />
              <div className="range-bounds">
                <span>40k (Studio)</span>
                <span>200k (Townhome)</span>
                <span>400k (Estate Rig)</span>
              </div>
            </div>

            <div className="input-group">
              <div className="input-header">
                <label htmlFor={deltaTInputId}>System Delta-T (ΔT °F)</label>
                <span className="input-readout tabular-num">{deltaT}°F TEMP DROP</span>
              </div>
              <input
                id={deltaTInputId}
                type="range"
                min="10"
                max="40"
                step="2"
                value={deltaT}
                onChange={(e) => setDeltaT(Number(e.target.value))}
                className="custom-range"
              />
              <div className="range-bounds">
                <span>10°F (High Flow)</span>
                <span>20°F (Hydronic Benchmark)</span>
                <span>40°F (Low Return)</span>
              </div>
            </div>

            <div className="input-group">
              <div className="input-header">
                <label htmlFor={velocitySelectId}>Max Target Velocity (ft/sec)</label>
                <span className="input-readout tabular-num">{targetMaxVelocity.toFixed(1)} FT/SEC</span>
              </div>
              <select 
                id={velocitySelectId}
                value={targetMaxVelocity} 
                onChange={(e) => setTargetMaxVelocity(Number(e.target.value))}
                className="select-field"
              >
                <option value={4.0}>4.0 ft/sec — Residential Acoustic Benchmark (Recommended)</option>
                <option value={5.0}>5.0 ft/sec — Distribution Header Standard</option>
                <option value={6.0}>6.0 ft/sec — Maximum Commercial Limit</option>
              </select>
            </div>

            <div className="physics-callout">
              <Info size={16} className="info-icon" aria-hidden="true" />
              <div>
                <strong>Fluid Mechanics Governing Equation:</strong>
                <p>
                  Flow demand: <code>GPM = Heat Load / (500 × ΔT)</code>.<br />
                  Velocity: <code>V = 0.4085 × GPM / d²</code> where <code>d</code> is actual Type L copper inside diameter per ASTM B88.
                </p>
              </div>
            </div>
          </div>

          <div className="calc-results-pane">
            <h3 className="pane-title">CALCULATED METRICS &amp; SPECIFICATION</h3>

            <div className="output-cards-grid">
              <div className="output-metric-card">
                <span className="card-kicker">CALCULATED FLOW DEMAND</span>
                <div className="card-big-value tabular-num">
                  {calculatedGpm.toFixed(1)} <span className="unit">GPM</span>
                </div>
                <span className="card-subtext">At {deltaT}°F system temperature drop</span>
              </div>

              <div className="output-metric-card highlight-card">
                <span className="card-kicker">RECOMMENDED COPPER SIZE</span>
                <div className="card-big-value card-size-val">{compliantPipe.nominal}</div>
                <span className="card-subtext">
                  Actual ID: {compliantPipe.idIn.toFixed(3)}" · ASTM B88
                </span>
              </div>

              <div className="output-metric-card">
                <span className="card-kicker">COMPUTED WATER VELOCITY</span>
                <div className="card-big-value tabular-num">
                  {actualVelocity.toFixed(2)} <span className="unit">FT/SEC</span>
                </div>
                <span className="card-subtext">
                  {actualVelocity <= targetMaxVelocity ? '✓ Compliant with target threshold' : '⚠ Exceeds velocity limit'}
                </span>
              </div>

              <div className="output-metric-card">
                <span className="card-kicker">PRESSURE TEST MARGIN</span>
                <div className="card-big-value tabular-num">50 <span className="unit">PSI</span></div>
                <span className="card-subtext">4-Hour Hydrostatic Decay Test (Zero Drop)</span>
              </div>
            </div>

            <div className="calc-status-bar">
              <CheckCircle2 size={16} className="success-icon" aria-hidden="true" />
              <span>
                VELOCITY CHECK: {actualVelocity.toFixed(2)} FT/SEC IN {compliantPipe.nominal} REMAINS BELOW {targetMaxVelocity.toFixed(1)} FT/SEC LIMIT
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 03: ACOUSTIC DRAINAGE BENCHMARK */}
      <section id="drainage" className="drainage-section">
        <header className="section-head">
          <div className="section-kicker">03 / ACOUSTIC MECHANICAL ENGINEERING</div>
          <h2 className="section-title">THE ZERO-CAVITATION SOIL STACK</h2>
          <p className="section-lead">
            Ordinary residential construction installs hollow Schedule 40 PVC or ABS plastic drainage that telegraphs rushing wastewater through bedroom wall assemblies. Vane &amp; Tor builds exclusively in mass-damped hubless cast iron.
          </p>
        </header>

        <div className="acoustic-comparison-grid">
          <article className="acoustic-card pvc-card">
            <div className="card-badge badge-warning">ORDINARY CONTRACTOR SPEC</div>
            <h3 className="card-title">Schedule 40 PVC Plastic Drainage</h3>
            
            <div className="decibel-meter">
              <div className="meter-label">
                <span>WALL CHASE ACOUSTIC PERFORMANCE:</span>
                <span className="meter-db">STC 32 (NOISY)</span>
              </div>
              <div className="meter-bar-outer">
                <div className="meter-bar-fill fill-loud" style={{ width: '80%' }}></div>
              </div>
              <span className="meter-note">Water rush cascade measures 48–54 dBA in adjacent bedroom suites</span>
            </div>

            <ul className="acoustic-points">
              <li>Low mass-density allows high-velocity water impacts to resonate through thin thermoplastic walls</li>
              <li>Directly anchored plastic clamps transmit structure-borne sound into wood studs and floor joists</li>
              <li>Thermal expansion generates audible ticking and clicking behind finished drywall</li>
              <li>Requires costly secondary mass-loaded vinyl wraps with incomplete acoustic isolation</li>
            </ul>
          </article>

          <article className="acoustic-card cast-iron-card">
            <div className="card-badge badge-success">VANE &amp; TOR MASTER SPEC</div>
            <h3 className="card-title">ASTM A888 Hubless Cast Iron Stack</h3>
            
            <div className="decibel-meter">
              <div className="meter-label">
                <span>WALL CHASE ACOUSTIC PERFORMANCE:</span>
                <span className="meter-db">STC 56 CHASE (WHISPER)</span>
              </div>
              <div className="meter-bar-outer">
                <div className="meter-bar-fill fill-quiet" style={{ width: '25%' }}></div>
              </div>
              <span className="meter-note">Attenuates water rush noise by 15–20 dB vs PVC; measured &lt; NC-20 room floor</span>
            </div>

            <ul className="acoustic-points">
              <li>Dense graphite flake matrix dissipates acoustic energy directly through material mass attenuation</li>
              <li>Heavy-duty elastomeric neoprene couplings isolate every individual pipe segment to break vibration paths</li>
              <li>Spring-isolated riser clamps isolate vibration from building joists and structural floor framing</li>
              <li>100+ year service life with non-combustible Class A fire rating (zero toxic smoke risk)</li>
            </ul>
          </article>
        </div>
      </section>

      {/* SECTION 04: METALLURGICAL REGISTRY */}
      <section id="materials" className="materials-section">
        <header className="section-head">
          <div className="section-kicker">04 / MATERIAL ARCHIVE</div>
          <h2 className="section-title">THE SPECIFICATION ARCHIVE</h2>
          <p className="section-lead">
            Every valve, fitting, and manifold specified by Vane &amp; Tor is traceable to certified metallurgical mills and verified prior to commissioning.
          </p>
        </header>

        <div className="materials-grid">
          <article className="material-card">
            <div className="material-idx">SPEC 01</div>
            <h3 className="material-title">Type L Hard Copper &amp; Viega ProPress</h3>
            <p className="material-desc">
              Cold-formed mechanical copper press fittings with Smart Connect EPDM seals. Conforms to ASTM B88 and ASME B16.51 with zero open-flame torch fire hazard during historic renovations.
            </p>
            <div className="material-stat">
              <span className="stat-label">FACTORY PROOF</span>
              <span className="stat-val">300 PSI TESTED</span>
            </div>
          </article>

          <article className="material-card">
            <div className="material-idx">SPEC 02</div>
            <h3 className="material-title">Charlotte Pipe Hubless Cast Iron</h3>
            <p className="material-desc">
              Continuously cast gray iron conforming to ASTM A888 and CISPI 301. Coupled with heavy-gauge stainless steel bands and elastomeric neoprene sleeves for lifetime acoustic suppression.
            </p>
            <div className="material-stat">
              <span className="stat-label">ACOUSTIC DAMPING</span>
              <span className="stat-val">15–20 dB QUIETER</span>
            </div>
          </article>

          <article className="material-card">
            <div className="material-idx">SPEC 03</div>
            <h3 className="material-title">DZR Lead-Free Brass Ball Valves</h3>
            <p className="material-desc">
              Dezincification-resistant brass bodies with chrome-plated stainless balls, blowout-proof stems, and pure PTFE packing. Full-port design prevents pressure drops across manifold banks.
            </p>
            <div className="material-stat">
              <span className="stat-label">WORKING RATING</span>
              <span className="stat-val">600 WOG BRASS</span>
            </div>
          </article>

          <article className="material-card">
            <div className="material-idx">SPEC 04</div>
            <h3 className="material-title">Caleffi SEP4 4-in-1 Separator</h3>
            <p className="material-desc">
              Performs air separation down to micro-bubbles, dirt separation to 5 microns, magnetic iron oxide/magnetite capture, and hydraulic decoupling across primary and secondary loops.
            </p>
            <div className="material-stat">
              <span className="stat-label">DE-AERATION</span>
              <span className="stat-val">5-MICRON PURITY</span>
            </div>
          </article>
        </div>
      </section>

      {/* SECTION 05: INTAKE & COMMISSIONING */}
      <section id="commission" className="intake-section">
        <header className="section-head">
          <div className="section-kicker">05 / PROJECT INTAKE</div>
          <h2 className="section-title">COMMISSION A PLANT ROOM</h2>
          <p className="section-lead">
            Direct coordination for architects, general contractors, and estate owners in New England and Switzerland.
          </p>
        </header>

        <div className="intake-box">
          {intakeSuccess ? (
            <div className="success-banner" role="status">
              <CheckCircle2 size={32} className="success-banner-icon" aria-hidden="true" />
              <div>
                <h3 className="success-title">PLANT ROOM SPECIFICATION RECORDED (DEMO CONSOLE)</h3>
                <p className="success-text">
                  Project intake parameters successfully validated and saved locally for <strong>{architectName || 'Architectural Principal'}</strong> at <strong>{projectLocation || 'Site Location'}</strong> ({buildingType}). In production deployment, our master mechanical team initiates plan review within 2 business hours.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleCommissionSubmit} className="intake-form">
              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="arch-name-input">Architect / Principal Firm Name</label>
                  <input 
                    id="arch-name-input" 
                    type="text" 
                    required 
                    value={architectName}
                    onChange={(e) => setArchitectName(e.target.value)}
                    placeholder="e.g. KieranTimberlake / Ann Beha Architects" 
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="proj-loc-input">Site Location (City &amp; Zip)</label>
                  <input 
                    id="proj-loc-input" 
                    type="text" 
                    required 
                    value={projectLocation}
                    onChange={(e) => setProjectLocation(e.target.value)}
                    placeholder="e.g. Cambridge, MA 02138 or Genève 1204" 
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="bldg-top-select">Building Topology</label>
                  <select 
                    id="bldg-top-select" 
                    value={buildingType} 
                    onChange={(e) => setBuildingType(e.target.value)}
                  >
                    <option value="Custom Residential Residence (3,000–8,000 sq.ft)">Custom Residence (3,000 – 8,000 sq.ft)</option>
                    <option value="Historic Brownstone Restoration">Historic Townhome / Brownstone Renovation</option>
                    <option value="Multi-Family Luxury Residential">Boutique Multi-Family Residential</option>
                    <option value="Institutional Plant or Museum">Institutional / Museum Mechanical Plant</option>
                  </select>
                </div>
                <div className="form-field">
                  <label htmlFor="heat-src-select">Primary Heat Source</label>
                  <select id="heat-src-select">
                    <option value="condensing-boiler">Condensing Gas Boiler (Lochinvar KBX400 / Viessmann)</option>
                    <option value="geothermal-hybrid">Geothermal Heat Pump + Hydronic Buffer Tank</option>
                    <option value="air-water-hp">Air-to-Water Cold-Climate Heat Pump</option>
                    <option value="steam-conversion">Historic Steam-to-Hydronic Conversion</option>
                  </select>
                </div>
              </div>

              <div className="form-field">
                <label htmlFor="scope-notes-input">Mechanical Scope &amp; Special Acoustic Constraints</label>
                <textarea 
                  id="scope-notes-input" 
                  rows={3} 
                  placeholder="Describe radiant floor zones, acoustic bedroom boundaries, or municipal water pressure requirements..."
                ></textarea>
              </div>

              <div className="form-submit-row">
                <button type="submit" className="submit-trade-btn">
                  <span>DISPATCH MECHANICAL CONSULTATION</span>
                  <ArrowUpRight size={15} aria-hidden="true" />
                </button>
                <span className="submit-disclaimer">Zero automated marketing · Direct coordination with licensed master plumbers</span>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* SWISS FOOTER */}
      <footer className="master-footer">
        <div className="footer-inner">
          <div className="footer-col-brand">
            <span className="footer-brand-title">VANE &amp; TOR HYDRONICS</span>
            <p className="footer-brand-desc">
              Precision mechanical contracting, high-recovery hydronic boilers, and vibration-damped sanitary infrastructure. Engineered to outlive the buildings they serve.
            </p>
            <div className="footer-certs">
              <span>ASME SEC. IV</span>
              <span>·</span>
              <span>CSA B51</span>
              <span>·</span>
              <span>ISO 9001</span>
              <span>·</span>
              <span>MASS. MASTER LIC. #11849</span>
            </div>
          </div>

          <div className="footer-col-links">
            <span className="footer-heading">BOSTON HEADQUARTERS</span>
            <p>1200 Beacon Street, Suite 400<br />Boston, MA 02215<br />Tel: +1 (617) 849-2900</p>
          </div>

          <div className="footer-col-links">
            <span className="footer-heading">GENÈVE OFFICE</span>
            <p>Rue du Rhône 42<br />1204 Genève, Switzerland<br />Tel: +41 22 819 4400</p>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <span>© {new Date().getFullYear()} VANE &amp; TOR MECHANICAL CORP. ALL RIGHTS RESERVED.</span>
          <span>DAYLIGHT LIGHT-MODE ARCHITECTURE · ZERO SLOP GUARANTEE</span>
        </div>
      </footer>
    </div>
  );
}
