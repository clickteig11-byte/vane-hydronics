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
    description: 'Modulating 316L stainless steel water-tube heat exchanger operating in high condensing efficiency. Features integrated outdoor temperature reset schedule to minimize standby radiation loss.'
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

  const [submissionId, setSubmissionId] = useState<string>('');

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
  const stationKeys = Object.keys(STATIONS);

  const handleStationKeyDown = (e: React.KeyboardEvent, currentKey: string) => {
    const currentIndex = stationKeys.indexOf(currentKey);
    let nextIndex = -1;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      nextIndex = (currentIndex + 1) % stationKeys.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      nextIndex = (currentIndex - 1 + stationKeys.length) % stationKeys.length;
    } else if (e.key === 'Home') {
      e.preventDefault();
      nextIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      nextIndex = stationKeys.length - 1;
    }
    if (nextIndex !== -1) {
      const nextKey = stationKeys[nextIndex];
      setActiveStation(nextKey);
      document.getElementById(`tab-${nextKey}`)?.focus();
    }
  };

  const handleCommissionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `VT-${Date.now().toString(36).toUpperCase()}`;
    setSubmissionId(newId);
    const submission = {
      id: newId,
      submittedAt: new Date().toISOString(),
      architectName: architectName || 'Undisclosed Architecture Studio',
      projectLocation: projectLocation || 'Greater Boston Metropolitan Area',
      buildingType,
      calculatedLoadBtu: heatLoadBtu,
      designDeltaT: deltaT,
      primaryHeaderSize: compliantPipe.nominal,
      flowGpm: Number(calculatedGpm.toFixed(2)),
      velocityFps: Number(actualVelocity.toFixed(2))
    };
    try {
      const stored = JSON.parse(localStorage.getItem('vane_intake_submissions') || '[]');
      stored.unshift(submission);
      localStorage.setItem('vane_intake_submissions', JSON.stringify(stored.slice(0, 25)));
    } catch {
      // Local storage fallback
    }
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
            <span className="mono-label">READY FOR WORK:</span>
            <span className="status-value">LICENSED PLUMBERS &amp; HEATING ENGINEERS</span>
          </div>
          <div className="status-item hide-mobile">
            <span className="mono-label">STANDARDS:</span>
            <span>ASME · ASTM · CISPI CERTIFIED</span>
          </div>
          <div className="status-item hide-mobile">
            <span className="mono-label">TESTING:</span>
            <span>WHISPER-QUIET OPERATION IN WALLS</span>
          </div>
          <div className="status-item">
            <span className="mono-label">OFFICES:</span>
            <span className="coords-text">BOSTON &amp; GENEVA</span>
          </div>
        </div>
      </aside>

      {/* SWISS EDGE HEADER */}
      <header className="master-header">
        <div className="header-inner">
          <div className="brand-group">
            <a href="#hero" className="brand-link">
              <span className="brand-primary">VANE &amp; TOR</span>
              <span className="brand-tag">CUSTOM HEATING &amp; ARCHITECTURAL PLUMBING</span>
            </a>
          </div>

          <nav className="header-nav" aria-label="Primary Navigation">
            <a href="#schematic" className="nav-item">01. THE SYSTEM</a>
            <a href="#calculator" className="nav-item">02. PIPE SIZING</a>
            <a href="#drainage" className="nav-item">03. QUIET WALLS</a>
            <a href="#materials" className="nav-item">04. MATERIALS</a>
            <a href="#commission" className="nav-item">05. CONTACT</a>
          </nav>

          <div className="header-action-group">
            <a href="#commission" className="swiss-button">
              TALK TO AN ENGINEER
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
            <a href="#schematic" onClick={() => setMobileMenuOpen(false)}>01. THE SYSTEM</a>
            <a href="#calculator" onClick={() => setMobileMenuOpen(false)}>02. PIPE SIZING</a>
            <a href="#drainage" onClick={() => setMobileMenuOpen(false)}>03. QUIET WALLS</a>
            <a href="#materials" onClick={() => setMobileMenuOpen(false)}>04. MATERIALS</a>
            <a href="#commission" onClick={() => setMobileMenuOpen(false)}>05. CONTACT</a>
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
              <span>PRECISION HEATING &amp; PLUMBING</span>
            </div>

            <h1 className="hero-headline">
              PARALLEL COPPER RUNS.<br />
              CALIBRATED FOR SILENCE.
            </h1>

            <p className="hero-descriptor">
              High-efficiency boilers, quiet copper heating loops, and cast-iron drainage pipes built for homes where unwanted noise is unacceptable and clean craftsmanship matters.
            </p>

            <div className="hero-action-cluster">
              <a href="#schematic" className="primary-trade-btn">
                <span>EXPLORE THE SYSTEM</span>
                <Sliders size={15} aria-hidden="true" />
              </a>
              <a href="#calculator" className="secondary-trade-btn">
                <span>CHECK PIPE SIZING</span>
                <Gauge size={15} aria-hidden="true" />
              </a>
            </div>

            <div className="hero-quiet-caption">
              <span>97% BOILER EFFICIENCY · &lt; 4.0 FT/S WATER SPEED · 50 PSI 4-HOUR PRESSURE TESTED</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 01: ACCURATE 4-PORT SCHEMATIC EXPLORER */}
      <section id="schematic" className="schematic-section">
        <header className="section-head">
          <div className="section-kicker">01 / SYSTEM LAYOUT</div>
          <h2 className="section-title">HOW THE HEATING SYSTEM IS BUILT</h2>
          <p className="section-lead">
            Click any component in the diagram below to see water temperatures, flow rates, pipe sizes, and manufacturer details.
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
                    tabIndex={isActive ? 0 : -1}
                    onKeyDown={(e) => handleStationKeyDown(e, key)}
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

            {Object.keys(STATIONS).map((key) => {
              const s = STATIONS[key];
              const isSelected = activeStation === key;
              return (
                <article 
                  key={key}
                  id={`panel-${key}`}
                  role="tabpanel"
                  aria-labelledby={`tab-${key}`}
                  className="station-spec-card"
                  hidden={!isSelected}
                >
                  <div className="spec-card-header">
                    <span className="spec-card-badge">{s.dataKind.toUpperCase()}</span>
                    <span className="spec-card-id">VT-{s.id.toUpperCase()}-04</span>
                  </div>

                  <h3 className="spec-component-name">{s.model}</h3>
                  <p className="spec-description">{s.description}</p>

                  <div className="spec-data-table">
                    <div className="data-row">
                      <span className="row-label">Supply Parameter</span>
                      <span className="row-value highlight-copper">{s.tempSupply}</span>
                    </div>
                    <div className="data-row">
                      <span className="row-label">Return / Delivery</span>
                      <span className="row-value">{s.tempReturn}</span>
                    </div>
                    <div className="data-row">
                      <span className="row-label">Flow Specification</span>
                      <span className="row-value tabular-num">{s.flowGpm}</span>
                    </div>
                    <div className="data-row">
                      <span className="row-label">Pressure Limit</span>
                      <span className="row-value tabular-num">{s.pressurePsi}</span>
                    </div>
                    <div className="data-row">
                      <span className="row-label">Metallurgical Material</span>
                      <span className="row-value mono-compact">{s.material}</span>
                    </div>
                    <div className="data-row">
                      <span className="row-label">Standard &amp; Rating</span>
                      <span className="row-value mono-compact">{s.sourceStandard}</span>
                    </div>
                    <div className="data-row citation-row">
                      <span className="row-label">Manufacturer Citation</span>
                      <span className="row-value mono-compact citation-text">
                        <FileText size={11} className="inline-icon" aria-hidden="true" />
                        {s.docLinkText}
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
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
                  <path d="M 286 160 L 390 160 L 390 110 L 448 110" stroke="#8F3B0A" strokeWidth="5" strokeLinecap="round" />
                  
                  {/* Secondary DHW Supply Branch (Fully connected into DHW Tank) */}
                  <path d="M 390 160 L 390 250 L 530 250" stroke="#8F3B0A" strokeWidth="5" strokeLinecap="round" />
                  {/* DHW Priority Circulator */}
                  <circle cx="430" cy="250" r="12" fill="#FFFFFF" stroke="#0B1528" strokeWidth="2" />
                  <polygon points="426,244 435,250 426,256" fill="#8F3B0A" />

                  {/* Standard 3-Port Thermostatic Radiant Mixing Valve at (460, 110) */}
                  <g className="mixing-valve-symbol" id="valve-mixing-3port">
                    {/* Left port triangle (primary hot inlet from separator) */}
                    <polygon points="448,104 460,110 448,116" fill="#8F3B0A" stroke="#0B1528" strokeWidth="1.5" />
                    {/* Right port triangle (tempered radiant supply outlet) */}
                    <polygon points="472,104 460,110 472,116" fill="#7A531C" stroke="#0B1528" strokeWidth="1.5" />
                    {/* Bottom port triangle (return temper bypass inlet) */}
                    <polygon points="454,122 460,110 466,122" fill="#0B1528" stroke="#0B1528" strokeWidth="1.5" />
                    {/* Center pivot point */}
                    <circle cx="460" cy="110" r="2.5" fill="#0B1528" />
                    <text x="460" y="96" textAnchor="middle" fill="#7A531C" fontSize="7.5" fontFamily="JetBrains Mono" fontWeight="700">3-WAY</text>
                  </g>

                  {/* Blended 110°F Radiant Supply */}
                  <path d="M 472 110 L 530 110" stroke="#7A531C" strokeWidth="4" strokeDasharray="5 2" />
                  {/* Radiant Circulation Pump */}
                  <circle cx="500" cy="110" r="11" fill="#FFFFFF" stroke="#0B1528" strokeWidth="2" />
                  <polygon points="497,105 505,110 497,115" fill="#7A531C" />

                  {/* Radiant Return line with temper bypass directly into bottom port at (460, 122) */}
                  <path d="M 530 150 L 460 150 L 460 122" stroke="#0B1528" strokeWidth="3" strokeLinecap="round" />
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
          <div className="section-kicker">02 / PIPE SIZING CALCULATOR</div>
          <h2 className="section-title">FIND THE RIGHT COPPER PIPE SIZE</h2>
          <p className="section-lead">
            Water moving too fast causes pipe humming and premature copper wear. Use this calculator to find the right pipe size for your home's heating demand.
          </p>
        </header>

        <div className="calc-panel-grid">
          <div className="calc-inputs-pane">
            <h3 className="pane-title">HEATING INPUTS</h3>

            <div className="input-group">
              <div className="input-header">
                <label htmlFor={heatLoadInputId}>Heating Demand (BTU/hr)</label>
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
                <span>40k (Apartment)</span>
                <span>200k (Townhome)</span>
                <span>400k (Large Residence)</span>
              </div>
            </div>

            <div className="input-group">
              <div className="input-header">
                <label htmlFor={deltaTInputId}>Water Temperature Drop (ΔT °F)</label>
                <span className="input-readout tabular-num">{deltaT}°F DROP</span>
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
                <span>20°F (Standard Heating)</span>
                <span>40°F (Condensing Return)</span>
              </div>
            </div>

            <div className="input-group">
              <div className="input-header">
                <label htmlFor={velocitySelectId}>Maximum Water Speed (ft/sec)</label>
                <span className="input-readout tabular-num">{targetMaxVelocity.toFixed(1)} FT/SEC</span>
              </div>
              <select 
                id={velocitySelectId}
                value={targetMaxVelocity} 
                onChange={(e) => setTargetMaxVelocity(Number(e.target.value))}
                className="select-field"
              >
                <option value={4.0}>4.0 ft/sec — Quiet Residential Standard (Recommended)</option>
                <option value={5.0}>5.0 ft/sec — Standard Heating Header</option>
                <option value={6.0}>6.0 ft/sec — Commercial Maximum</option>
              </select>
            </div>

            <div className="physics-callout">
              <Info size={16} className="info-icon" aria-hidden="true" />
              <div>
                <strong>How Pipe Sizing Is Calculated:</strong>
                <p>
                  Flow rate: <code>GPM = Heating Load / (500 × ΔT)</code>.<br />
                  Water speed: <code>V = 0.4085 × GPM / d²</code> where <code>d</code> is the inner diameter of copper pipe.
                </p>
              </div>
            </div>
          </div>

          <div className="calc-results-pane">
            <h3 className="pane-title">RECOMMENDED PIPE SIZES</h3>

            <div className="output-cards-grid">
              <div className="output-metric-card">
                <span className="card-kicker">WATER FLOW DEMAND</span>
                <div className="card-big-value tabular-num">
                  {calculatedGpm.toFixed(1)} <span className="unit">GPM</span>
                </div>
                <span className="card-subtext">Gallons per minute needed</span>
              </div>

              <div className="output-metric-card highlight-card">
                <span className="card-kicker">RECOMMENDED COPPER SIZE</span>
                <div className="card-big-value card-size-val">{compliantPipe.nominal}</div>
                <span className="card-subtext">
                  Type L Copper ({compliantPipe.idIn.toFixed(3)}" inner diameter)
                </span>
              </div>

              <div className="output-metric-card">
                <span className="card-kicker">WATER SPEED IN PIPE</span>
                <div className="card-big-value tabular-num">
                  {actualVelocity.toFixed(2)} <span className="unit">FT/SEC</span>
                </div>
                <span className="card-subtext">
                  {actualVelocity <= 4.0 ? '✓ Quiet: Below 4.0 ft/s threshold' : 'Within target range'}
                </span>
              </div>

              <div className="output-metric-card">
                <span className="card-kicker">PRESSURE TEST STANDARD</span>
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
          <div className="section-kicker">03 / QUIET DRAINAGE</div>
          <h2 className="section-title">SILENT CAST IRON DRAINAGE PIPES</h2>
          <p className="section-lead">
            Most modern homes use thin plastic PVC pipes that let you hear every toilet flush through bedroom walls. We install heavy cast iron pipe wrapped in rubber seals so drainage stays whisper quiet.
          </p>
        </header>

        <div className="acoustic-comparison-grid">
          <article className="acoustic-card pvc-card">
            <div className="card-badge badge-warning">TYPICAL CONTRACTOR PIPE</div>
            <h3 className="card-title">Thin Plastic PVC Drainage</h3>
            
            <div className="decibel-meter">
              <div className="meter-label">
                <span>SOUND LEVEL IN NEARBY ROOMS:</span>
                <span className="meter-db">48–54 dB (LOUD)</span>
              </div>
              <div className="meter-bar-outer">
                <div className="meter-bar-fill fill-loud" style={{ width: '80%' }}></div>
              </div>
              <span className="meter-note">Water rushing down pipes is easily heard through bedroom drywall</span>
            </div>

            <ul className="acoustic-points">
              <li>Thin plastic walls let water impact sounds vibrate into the room</li>
              <li>Rigid plastic brackets send vibration directly into wall framing</li>
              <li>Hot and cold water expansion causes clicking and ticking noises in walls</li>
              <li>Requires noisy aftermarket insulation wraps that rarely fix the problem</li>
            </ul>
          </article>

          <article className="acoustic-card cast-iron-card">
            <div className="card-badge badge-success">VANE &amp; TOR STANDARD</div>
            <h3 className="card-title">Heavy Cast Iron Soil Pipe</h3>
            
            <div className="decibel-meter">
              <div className="meter-label">
                <span>SOUND LEVEL IN NEARBY ROOMS:</span>
                <span className="meter-db">&lt; 30 dB (WHISPER QUIET)</span>
              </div>
              <div className="meter-bar-outer">
                <div className="meter-bar-fill fill-quiet" style={{ width: '25%' }}></div>
              </div>
              <span className="meter-note">15–20 dB quieter than PVC plastic pipe</span>
            </div>

            <ul className="acoustic-points">
              <li>Dense, heavy iron blocks water rush noise before it leaves the pipe</li>
              <li>Thick rubber isolation couplings stop vibrations from reaching wall studs</li>
              <li>Spring-cushioned pipe hangers eliminate rattles and thumps</li>
              <li>Lasts 100+ years and will not melt or burn in a house fire</li>
            </ul>

            <div className="acoustic-citation" style={{ marginTop: '1.2rem', paddingTop: '0.8rem', borderTop: '1px solid var(--border-subtle)', fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'JetBrains Mono, monospace' }}>
              <FileText size={12} aria-hidden="true" style={{ color: 'var(--copper-accent)', flexShrink: 0 }} />
              <span>Specification: Charlotte Pipe ASTM A888 / CISPI 301 Hubless Gray Iron</span>
            </div>
          </article>
        </div>
      </section>

      {/* SECTION 04: METALLURGICAL REGISTRY */}
      <section id="materials" className="materials-section">
        <header className="section-head">
          <div className="section-kicker">04 / MATERIALS &amp; HARDWARE</div>
          <h2 className="section-title">MATERIALS BUILT TO LAST A CENTURY</h2>
          <p className="section-lead">
            We install commercial-grade copper, stainless steel, and bronze from trusted North American and European manufacturers.
          </p>
        </header>

        <div className="materials-grid">
          <article className="material-card">
            <div className="material-idx">SPEC 01</div>
            <h3 className="material-title">Heavy Type L Copper &amp; Press Fittings</h3>
            <p className="material-desc">
              Cold-pressed copper joints with leak-detecting rubber seals. Eliminates open welding flames inside your home during renovations.
            </p>
            <div className="material-stat">
              <span className="stat-label">PRESSURE RATING</span>
              <span className="stat-val">300 PSI TESTED</span>
            </div>
          </article>

          <article className="material-card">
            <div className="material-idx">SPEC 02</div>
            <h3 className="material-title">Charlotte Cast Iron Soil Pipe</h3>
            <p className="material-desc">
              Heavy gray cast iron coupled with stainless steel bands and thick neoprene sleeves for quiet, lifetime wastewater drainage.
            </p>
            <div className="material-stat">
              <span className="stat-label">SOUND REDUCTION</span>
              <span className="stat-val">15–20 dB QUIETER</span>
            </div>
          </article>

          <article className="material-card">
            <div className="material-idx">SPEC 03</div>
            <h3 className="material-title">Lead-Free Brass Isolation Valves</h3>
            <p className="material-desc">
              Commercial-grade brass with stainless steel internal balls and blowout-proof stems. Full-port design ensures maximum water flow.
            </p>
            <div className="material-stat">
              <span className="stat-label">WORKING RATING</span>
              <span className="stat-val">600 WOG BRASS</span>
            </div>
          </article>

          <article className="material-card">
            <div className="material-idx">SPEC 04</div>
            <h3 className="material-title">Magnetic Air &amp; Dirt Separator</h3>
            <p className="material-desc">
              Removes micro-air bubbles and captures iron sediment with internal rare-earth magnets to keep heating pumps running cleanly for decades.
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap', marginBottom: '0.4rem' }}>
                  <h3 className="success-title" style={{ margin: 0 }}>PROJECT DETAILS RECEIVED</h3>
                  <span className="mono-compact" style={{ padding: '0.2rem 0.6rem', background: '#FFFFFF', border: '1px solid #166534', color: '#166534', fontWeight: 700, fontSize: '0.8rem' }}>
                    REF ID: {submissionId}
                  </span>
                </div>
                <p className="success-text">
                  Thank you. Your project notes have been saved for <strong>{architectName || 'Architectural Client'}</strong> in <strong>{projectLocation || 'the Greater Boston Area'}</strong> ({buildingType}). A lead plumbing engineer will review your details and respond within one business day.
                </p>
                <div style={{ marginTop: '0.8rem', display: 'flex', gap: '1rem', alignItems: 'center', fontSize: '0.8rem', color: '#166534', flexWrap: 'wrap' }}>
                  <span>✓ Saved: <code>{submissionId}</code></span>
                  <span>·</span>
                  <span>Header Pipe: {compliantPipe.nominal}</span>
                  <span>·</span>
                  <span>Target Flow: {calculatedGpm.toFixed(1)} GPM</span>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleCommissionSubmit} className="intake-form">
              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="arch-name-input">Architect, Builder, or Owner Name</label>
                  <input 
                    id="arch-name-input" 
                    type="text" 
                    required 
                    value={architectName}
                    onChange={(e) => setArchitectName(e.target.value)}
                    placeholder="e.g. Sarah Jenkins or Studio Architecture" 
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="proj-loc-input">Project Location (City &amp; Zip)</label>
                  <input 
                    id="proj-loc-input" 
                    type="text" 
                    required 
                    value={projectLocation}
                    onChange={(e) => setProjectLocation(e.target.value)}
                    placeholder="e.g. Cambridge, MA 02138 or Geneva 1204" 
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="bldg-top-select">Building Type</label>
                  <select 
                    id="bldg-top-select" 
                    value={buildingType} 
                    onChange={(e) => setBuildingType(e.target.value)}
                  >
                    <option value="Custom Residential Residence (3,000–8,000 sq.ft)">Single Family Residence (3,000 – 8,000 sq.ft)</option>
                    <option value="Historic Brownstone Restoration">Historic Townhome / Brownstone Renovation</option>
                    <option value="Multi-Family Luxury Residential">Boutique Multi-Family Residence</option>
                    <option value="Commercial or Specialty Facility">Commercial or Specialty Facility</option>
                  </select>
                </div>
                <div className="form-field">
                  <label htmlFor="heat-src-select">Heating Source</label>
                  <select id="heat-src-select">
                    <option value="condensing-boiler">High-Efficiency Gas Boiler (Lochinvar / Viessmann)</option>
                    <option value="geothermal-hybrid">Geothermal Heat Pump</option>
                    <option value="air-water-hp">Air-to-Water Cold-Climate Heat Pump</option>
                    <option value="steam-conversion">Historic Steam Radiator Conversion</option>
                  </select>
                </div>
              </div>

              <div className="form-field">
                <label htmlFor="scope-notes-input">Project Notes &amp; Noise Concerns</label>
                <textarea 
                  id="scope-notes-input" 
                  rows={3} 
                  placeholder="Tell us about your heating goals, quiet wall requirements, or radiant floor zones..."
                ></textarea>
              </div>

              <div className="form-submit-row">
                <button type="submit" className="submit-trade-btn">
                  <span>SEND PROJECT DETAILS</span>
                  <ArrowUpRight size={15} aria-hidden="true" />
                </button>
                <span className="submit-disclaimer">No sales calls. You will speak directly with a licensed plumbing engineer.</span>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* SWISS FOOTER */}
      <footer className="master-footer">
        <div className="footer-inner">
          <div className="footer-col-brand">
            <span className="footer-brand-title">VANE &amp; TOR</span>
            <p className="footer-brand-desc">
              Custom residential heating systems, clean copper piping, and quiet cast-iron drainage. Built by licensed craftsmen to last for generations.
            </p>
            <div className="footer-certs">
              <span>ASME CERTIFIED</span>
              <span>·</span>
              <span>ASTM COMPLIANT</span>
              <span>·</span>
              <span>LICENSED &amp; INSURED</span>
              <span>·</span>
              <span>MASS. MASTER LIC. #11849</span>
            </div>
          </div>

          <div className="footer-col-links">
            <span className="footer-heading">BOSTON OFFICE</span>
            <p>1200 Beacon Street, Suite 400<br />Boston, MA 02215<br />Tel: +1 (617) 849-2900</p>
          </div>

          <div className="footer-col-links">
            <span className="footer-heading">GENEVA OFFICE</span>
            <p>Rue du Rhône 42<br />1204 Genève, Switzerland<br />Tel: +41 22 819 4400</p>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <span>© {new Date().getFullYear()} VANE &amp; TOR MECHANICAL. ALL RIGHTS RESERVED.</span>
          <span>PRECISION PLUMBING &amp; HYDRONIC HEATING</span>
        </div>
      </footer>
    </div>
  );
}
