/**
 * Selbst gezeichnete SVG-Illustrationen der Bauepochen (keine Fotos, keine Urheberrechte).
 * Alle Zeichnungen nutzen dieselbe Zeichenfläche: viewBox 0 0 400 260.
 * Die Erkennungsmerkmale (Marker) stehen in src/data/epochs.json und beziehen sich
 * auf diese Koordinaten. Ändert man eine Zeichnung, ggf. die Marker anpassen.
 */
import type { ReactElement } from "react";

function Backdrop({ sky, ground, horizon = 220 }: { sky: string; ground: string; horizon?: number }) {
  return (
    <>
      <rect width="400" height="260" fill={sky} />
      <ellipse cx="60" cy="40" rx="34" ry="11" fill="#fff" opacity="0.7" />
      <ellipse cx="88" cy="34" rx="24" ry="9" fill="#fff" opacity="0.7" />
      <ellipse cx="330" cy="30" rx="30" ry="10" fill="#fff" opacity="0.6" />
      <rect y={horizon} width="400" height={260 - horizon} fill={ground} />
    </>
  );
}

function Window({
  x,
  y,
  w,
  h,
  frame = "#fff",
  glass = "#bfdbfe",
  cross = true,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  frame?: string;
  glass?: string;
  cross?: boolean;
}) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={glass} stroke={frame} strokeWidth="3" />
      {cross && (
        <>
          <line x1={x + w / 2} y1={y} x2={x + w / 2} y2={y + h} stroke={frame} strokeWidth="2" />
          <line x1={x} y1={y + h / 2} x2={x + w} y2={y + h / 2} stroke={frame} strokeWidth="2" />
        </>
      )}
    </g>
  );
}

/* 1. Fachwerk -------------------------------------------------------- */
function Fachwerk() {
  const t = "#4a2c17";
  return (
    <g>
      <Backdrop sky="#dbeafe" ground="#86c56a" />
      {/* Schornstein */}
      <rect x="270" y="50" width="22" height="50" fill="#a16207" />
      <rect x="266" y="46" width="30" height="8" fill="#78350f" />
      {/* Dach */}
      <polygon points="60,116 200,40 340,116" fill="#9a3412" />
      {[58, 70, 82, 94, 106].map((y) => (
        <line key={y} x1={200 - (y - 40) * 1.842} y1={y} x2={200 + (y - 40) * 1.842} y2={y} stroke="#7c2d12" strokeWidth="2" opacity="0.6" />
      ))}
      {/* Obergeschoss (kragt aus) */}
      <rect x="78" y="116" width="244" height="50" fill="#fde9b8" />
      {/* Erdgeschoss */}
      <rect x="92" y="166" width="216" height="54" fill="#fde9b8" />
      <rect x="92" y="166" width="216" height="7" fill="#000" opacity="0.15" />
      {/* Sockel */}
      <rect x="92" y="210" width="216" height="10" fill="#78716c" />
      {/* Holzgerüst oben */}
      {[78, 138, 200, 262, 322].map((x) => (
        <rect key={x} x={x - 3} y="114" width="6" height="53" fill={t} />
      ))}
      <rect x="76" y="112" width="248" height="6" fill={t} />
      <rect x="76" y="162" width="248" height="7" fill={t} />
      {/* Streben (Andreaskreuz) */}
      <g stroke={t} strokeWidth="5">
        <line x1="141" y1="118" x2="197" y2="162" />
        <line x1="197" y1="118" x2="141" y2="162" />
        <line x1="203" y1="118" x2="259" y2="162" />
        <line x1="259" y1="118" x2="203" y2="162" />
      </g>
      {/* Holzgerüst unten */}
      {[92, 146, 254, 308].map((x) => (
        <rect key={x} x={x - 3} y="166" width="6" height="46" fill={t} />
      ))}
      <g stroke={t} strokeWidth="5">
        <line x1="149" y1="205" x2="176" y2="176" />
        <line x1="251" y1="205" x2="224" y2="176" />
      </g>
      {/* Fenster + Läden */}
      <Window x={98} y={124} w={26} h={30} frame="#fff" />
      <rect x="90" y="124" width="7" height="30" fill="#166534" />
      <rect x="125" y="124" width="7" height="30" fill="#166534" />
      <Window x={276} y={124} w={26} h={30} frame="#fff" />
      <rect x="268" y="124" width="7" height="30" fill="#166534" />
      <rect x="303" y="124" width="7" height="30" fill="#166534" />
      <Window x={104} y={182} w={24} h={22} frame="#fff" />
      <Window x={272} y={182} w={24} h={22} frame="#fff" />
      {/* Tür */}
      <path d="M180 220 V190 a20 20 0 0 1 40 0 V220 Z" fill="#7c2d12" stroke={t} strokeWidth="3" />
      <circle cx="212" cy="204" r="2" fill="#fbbf24" />
      {/* Busch */}
      <ellipse cx="70" cy="216" rx="20" ry="12" fill="#3f8f46" />
      <ellipse cx="335" cy="216" rx="18" ry="10" fill="#3f8f46" />
    </g>
  );
}

/* 2. Gründerzeit ----------------------------------------------------- */
function Gruenderzeit() {
  const stuck = "#f4e4bd";
  const shade = "#c9b17a";
  const cols = [100, 184, 268];
  return (
    <g>
      <Backdrop sky="#cfe3f6" ground="#a8a29e" horizon={222} />
      {/* Nachbarhäuser */}
      <rect x="20" y="70" width="60" height="152" fill="#d4c39a" />
      <rect x="320" y="90" width="60" height="132" fill="#cbb89a" />
      {/* Fassade */}
      <rect x="80" y="54" width="240" height="168" fill={stuck} />
      {/* Sockel / Rustika */}
      <rect x="80" y="182" width="240" height="40" fill={shade} />
      {[194, 206].map((y) => (
        <line key={y} x1="80" y1={y} x2="320" y2={y} stroke="#a58d5a" strokeWidth="1.5" />
      ))}
      {/* Kranzgesims + Attika */}
      <rect x="72" y="38" width="256" height="9" fill={shade} />
      <rect x="76" y="47" width="248" height="8" fill="#e6d3a0" />
      {[84, 100, 116, 132, 148, 164, 180, 196, 212, 228, 244, 260, 276, 292, 308].map((x) => (
        <rect key={x} x={x} y="47" width="4" height="8" fill={shade} />
      ))}
      {/* Gurtgesimse */}
      {[140, 98].map((y) => (
        <rect key={y} x="78" y={y} width="244" height="4" fill={shade} />
      ))}
      {/* Fenster mit Verdachungen */}
      {cols.map((x) => (
        <g key={x}>
          {/* 1. OG: Dreiecksgiebel */}
          <polygon points={`${x - 4},148 ${x + 16},135 ${x + 36},148`} fill={shade} />
          <Window x={x} y={148} w={32} h={30} frame="#fff" glass="#93b7d8" />
          {/* 2. OG: Segmentbogen */}
          <path d={`M${x - 4} 108 a20 12 0 0 1 40 0 Z`} fill={shade} />
          <Window x={x} y={108} w={32} h={28} frame="#fff" glass="#93b7d8" />
          {/* 3. OG: einfach */}
          <rect x={x - 3} y="60" width="38" height="4" fill={shade} />
          <Window x={x} y={64} w={32} h={28} frame="#fff" glass="#93b7d8" />
        </g>
      ))}
      {/* Balkon mittig */}
      <rect x="176" y="176" width="48" height="4" fill="#44403c" />
      {[180, 190, 200, 210, 220].map((x) => (
        <line key={x} x1={x} y1="166" x2={x} y2="176" stroke="#44403c" strokeWidth="1.5" />
      ))}
      <line x1="178" y1="166" x2="222" y2="166" stroke="#44403c" strokeWidth="2" />
      {/* Erdgeschoss: Portal und Läden */}
      <path d="M184 222 V200 a16 16 0 0 1 32 0 V222 Z" fill="#5b3a1e" stroke="#3b2412" strokeWidth="2" />
      <path d="M100 222 V204 a16 14 0 0 1 32 0 V222 Z" fill="#93b7d8" stroke="#fff" strokeWidth="3" />
      <path d="M268 222 V204 a16 14 0 0 1 32 0 V222 Z" fill="#93b7d8" stroke="#fff" strokeWidth="3" />
      {/* Laterne */}
      <rect x="62" y="150" width="3" height="72" fill="#292524" />
      <rect x="57" y="144" width="13" height="10" rx="2" fill="#fde047" />
    </g>
  );
}

/* 3. Jugendstil ------------------------------------------------------ */
function Jugendstil() {
  const wall = "#f3e2c0";
  const teal = "#0f766e";
  return (
    <g>
      <Backdrop sky="#e0f2fe" ground="#9ca79a" horizon={222} />
      {/* Hauptbaukörper mit Wellengiebel */}
      <path d="M130 222 V90 Q160 60 190 78 T250 70 T294 88 V222 Z" fill={wall} />
      {/* Erker / Turm links */}
      <rect x="72" y="100" width="64" height="122" fill="#ecd7ae" />
      <path d="M66 100 Q104 40 142 100 Z" fill={teal} />
      <path d="M104 44 v-14" stroke={teal} strokeWidth="3" />
      <circle cx="104" cy="28" r="4" fill="#fbbf24" />
      {/* Farbiges Fliesenband */}
      <rect x="72" y="176" width="222" height="16" fill="#14b8a6" />
      {Array.from({ length: 14 }).map((_, i) => (
        <circle key={i} cx={80 + i * 16} cy="184" r="4" fill="#fde68a" />
      ))}
      {/* Fenster (Rundbogen mit Speichen) */}
      <g>
        <path d="M176 160 V116 a24 24 0 0 1 48 0 V160 Z" fill="#a5c8e6" stroke="#fff" strokeWidth="4" />
        <path d="M200 92 V160 M176 128 H224 M182 108 L218 148 M218 108 L182 148" stroke="#fff" strokeWidth="2" />
      </g>
      <g>
        <path d="M236 160 V124 a16 16 0 0 1 32 0 V160 Z" fill="#a5c8e6" stroke="#fff" strokeWidth="3" />
        <path d="M252 108 V160" stroke="#fff" strokeWidth="2" />
      </g>
      <rect x="86" y="120" width="36" height="42" rx="18" fill="#a5c8e6" stroke="#fff" strokeWidth="3" />
      <path d="M104 120 V162 M86 141 H122" stroke="#fff" strokeWidth="2" />
      {/* Rundes Giebelfenster */}
      <circle cx="240" cy="92" r="9" fill="#fde68a" stroke="#fff" strokeWidth="3" />
      {/* Floralen Ornamente (Peitschenhiebe / Ranken) */}
      <g fill="none" stroke={teal} strokeWidth="3" strokeLinecap="round">
        <path d="M172 164 C160 140 160 120 172 100 C182 84 176 72 166 66" />
        <path d="M228 164 C240 146 234 128 228 112" />
        <path d="M138 190 C148 176 160 178 168 168" />
      </g>
      <g fill="#14b8a6">
        <circle cx="166" cy="66" r="5" />
        <circle cx="172" cy="100" r="4" />
        <circle cx="228" cy="112" r="4" />
      </g>
      {/* Tür */}
      <path d="M186 222 V198 a14 14 0 0 1 28 0 V222 Z" fill="#5b3a1e" stroke="#3b2412" strokeWidth="2" />
      <path d="M190 204 C196 196 204 196 210 204" fill="none" stroke="#fbbf24" strokeWidth="2" />
      {/* Balkon geschwungen */}
      <path d="M232 168 q18 -10 40 0" fill="none" stroke="#292524" strokeWidth="3" />
      <path d="M236 168 v-6 M248 165 v-8 M260 165 v-6 M270 168 v-6" stroke="#292524" strokeWidth="1.5" />
    </g>
  );
}

/* 4. 20er / Bauhaus -------------------------------------------------- */
function Bauhaus() {
  const win = "#33506f";
  return (
    <g>
      <Backdrop sky="#c7dbe9" ground="#a7c99a" />
      {/* Anbau */}
      <rect x="284" y="150" width="70" height="70" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1.5" />
      <rect x="280" y="146" width="78" height="5" fill="#e2e8f0" />
      <circle cx="318" cy="182" r="10" fill={win} stroke="#fff" strokeWidth="3" />
      {/* Hauptkubus */}
      <rect x="80" y="92" width="192" height="128" fill="#fafafa" stroke="#cbd5e1" strokeWidth="1.5" />
      <rect x="74" y="86" width="204" height="6" fill="#e5e7eb" />
      {/* Fensterbänder */}
      <rect x="90" y="120" width="144" height="24" fill={win} />
      {[114, 138, 162, 186, 210].map((x) => (
        <line key={x} x1={x} y1="120" x2={x} y2="144" stroke="#fff" strokeWidth="2" />
      ))}
      <rect x="90" y="168" width="100" height="24" fill={win} />
      {[112, 135, 158].map((x) => (
        <line key={x} x1={x} y1="168" x2={x} y2="192" stroke="#fff" strokeWidth="2" />
      ))}
      {/* Eckfenster oben */}
      <path d="M80 100 h14 v14 h-14 Z" fill={win} />
      {/* Verglastes Treppenhaus */}
      <rect x="240" y="96" width="24" height="124" fill="#7fa6c9" stroke="#fff" strokeWidth="2" />
      {[112, 128, 144, 160, 176, 192, 208].map((y) => (
        <line key={y} x1="240" y1={y} x2="264" y2={y} stroke="#fff" strokeWidth="1.5" />
      ))}
      {/* Dachterrasse-Geländer */}
      <line x1="80" y1="80" x2="180" y2="80" stroke="#64748b" strokeWidth="2" />
      {[80, 100, 120, 140, 160, 180].map((x) => (
        <line key={x} x1={x} y1="80" x2={x} y2="86" stroke="#64748b" strokeWidth="1.5" />
      ))}
      {/* Balkon mit Rohrgeländer */}
      <rect x="196" y="148" width="40" height="4" fill="#e5e7eb" stroke="#cbd5e1" />
      <line x1="196" y1="138" x2="236" y2="138" stroke="#64748b" strokeWidth="2" />
      <line x1="196" y1="138" x2="196" y2="148" stroke="#64748b" strokeWidth="2" />
      <line x1="236" y1="138" x2="236" y2="148" stroke="#64748b" strokeWidth="2" />
      {/* Eingang mit Vordach */}
      <rect x="196" y="196" width="34" height="24" fill="#374151" />
      <rect x="188" y="190" width="50" height="5" fill="#e5e7eb" stroke="#cbd5e1" />
      <ellipse cx="100" cy="222" rx="18" ry="6" fill="#4d8f4b" />
    </g>
  );
}

/* 5. 50er Wiederaufbau ----------------------------------------------- */
function Wiederaufbau() {
  return (
    <g>
      <Backdrop sky="#dbe7f0" ground="#a3c98f" />
      {/* Dach: flach geneigt */}
      <polygon points="56,102 200,70 344,102 344,108 56,108" fill="#7f5a4a" />
      <polygon points="56,108 200,76 344,108 344,112 56,112" fill="#5e4034" />
      {/* Baukörper */}
      <rect x="66" y="108" width="268" height="112" fill="#f0dfae" />
      <rect x="66" y="206" width="268" height="14" fill="#a8703f" />
      {/* Fenster in Reihen */}
      {[86, 122, 158].map((x) => (
        <g key={`l${x}`}>
          <Window x={x} y={122} w={22} h={26} frame="#fff" />
          <Window x={x} y={164} w={22} h={26} frame="#fff" />
        </g>
      ))}
      {[240, 276, 312].map((x) => (
        <g key={`r${x}`}>
          <Window x={x} y={122} w={22} h={26} frame="#fff" />
          <Window x={x} y={164} w={22} h={26} frame="#fff" />
        </g>
      ))}
      {/* Treppenhausfenster hoch und schmal */}
      <rect x="194" y="118" width="14" height="76" fill="#bfdbfe" stroke="#fff" strokeWidth="3" />
      {[134, 150, 166, 182].map((y) => (
        <line key={y} x1="194" y1={y} x2="208" y2={y} stroke="#fff" strokeWidth="2" />
      ))}
      {/* Kleiner Balkon */}
      <rect x="236" y="150" width="30" height="4" fill="#d6d3d1" />
      <line x1="236" y1="141" x2="266" y2="141" stroke="#57534e" strokeWidth="2" />
      {/* Eingang mit geschwungenem Vordach */}
      <rect x="185" y="198" width="32" height="22" fill="#4b3621" />
      <path d="M170 196 q31 -14 62 0 v6 h-62 Z" fill="#e7d9c1" stroke="#a8a29e" strokeWidth="1.5" />
      <rect x="182" y="202" width="2" height="18" fill="#57534e" />
      {/* Blumenkästen */}
      <rect x="84" y="150" width="26" height="4" fill="#57534e" />
      <ellipse cx="97" cy="149" rx="12" ry="3" fill="#f87171" />
    </g>
  );
}

/* 6. 60er/70er Großsiedlung ------------------------------------------ */
function Grossiedlung() {
  const concrete = "#a8adb6";
  const line = "#7c828d";
  return (
    <g>
      <Backdrop sky="#d5dee8" ground="#98a89a" />
      {/* niedriger Block links */}
      <rect x="12" y="140" width="84" height="80" fill="#b6b2a8" />
      {[0, 1, 2].map((r) =>
        [0, 1, 2, 3].map((c) => (
          <rect key={`${r}${c}`} x={20 + c * 20} y={150 + r * 22} width="12" height="12" fill="#6f8aa6" />
        )),
      )}
      {/* Hochhausscheibe */}
      <rect x="110" y="24" width="200" height="196" fill={concrete} />
      <rect x="104" y="18" width="212" height="8" fill="#7c828d" />
      {/* Aufzugsmaschinenraum */}
      <rect x="180" y="6" width="60" height="14" fill="#8b919c" />
      {/* Plattenfugen */}
      {[70, 116, 162, 208].map((y) => (
        <line key={y} x1="110" y1={y} x2="310" y2={y} stroke={line} strokeWidth="1" opacity="0.7" />
      ))}
      {[160, 210, 260].map((x) => (
        <line key={x} x1={x} y1="26" x2={x} y2="220" stroke={line} strokeWidth="1" opacity="0.7" />
      ))}
      {/* Fensterraster */}
      {Array.from({ length: 8 }).map((_, r) =>
        Array.from({ length: 6 }).map((_, c) => (
          <rect key={`${r}-${c}`} x={122 + c * 30} y={34 + r * 22} width="18" height="13" fill="#5f7c99" stroke="#eef2f7" strokeWidth="2" />
        )),
      )}
      {/* Balkonreihe rechts mit Betonbrüstung (Waschbeton, orange Akzent) */}
      {Array.from({ length: 8 }).map((_, r) => (
        <g key={r}>
          <rect x="296" y={32 + r * 22} width="26" height="16" fill="#d97706" />
          <rect x="296" y={32 + r * 22} width="26" height="16" fill="url(#speck)" />
        </g>
      ))}
      <defs>
        <pattern id="speck" width="6" height="6" patternUnits="userSpaceOnUse">
          <circle cx="1.5" cy="1.5" r="1" fill="#fff" opacity="0.5" />
          <circle cx="4.5" cy="4" r="0.9" fill="#000" opacity="0.25" />
        </pattern>
      </defs>
      {/* Eingangsbereich */}
      <rect x="180" y="194" width="60" height="26" fill="#4b5563" />
      <rect x="170" y="188" width="80" height="6" fill="#d1d5db" />
      {/* Garagen / Parkplatz */}
      <rect x="330" y="200" width="50" height="20" fill="#9ca3af" />
      <rect x="336" y="206" width="16" height="14" fill="#6b7280" />
      <rect x="358" y="206" width="16" height="14" fill="#6b7280" />
    </g>
  );
}

/* 7. 80er/90er ------------------------------------------------------- */
function Achtziger() {
  return (
    <g>
      <Backdrop sky="#dbeafe" ground="#7fbf6a" />
      {/* Garage links */}
      <rect x="18" y="164" width="72" height="56" fill="#f3d9c2" />
      <rect x="14" y="158" width="80" height="8" fill="#9a3412" />
      <rect x="28" y="176" width="52" height="44" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="2" />
      {[188, 200, 212].map((y) => (
        <line key={y} x1="28" y1={y} x2="80" y2={y} stroke="#9ca3af" strokeWidth="1.5" />
      ))}
      {/* Haupthaus */}
      <rect x="100" y="112" width="190" height="108" fill="#f7dcc3" />
      <rect x="100" y="188" width="190" height="32" fill="#b45309" />
      {[194, 204, 214].map((y) => (
        <line key={y} x1="100" y1={y} x2="290" y2={y} stroke="#7c3e0d" strokeWidth="1" opacity="0.6" />
      ))}
      {/* Satteldach */}
      <polygon points="88,116 195,44 302,116" fill="#8b2b1c" />
      {[62, 76, 90, 104].map((y) => (
        <line key={y} x1={195 - (y - 44) * 1.486} y1={y} x2={195 + (y - 44) * 1.486} y2={y} stroke="#6b1f14" strokeWidth="2" opacity="0.6" />
      ))}
      {/* Gaube */}
      <polygon points="120,116 140,90 160,116" fill="#8b2b1c" />
      <rect x="126" y="98" width="28" height="18" fill="#f7dcc3" />
      <Window x={130} y={101} w={20} h={14} frame="#fff" />
      {/* Ochsenauge im Giebel */}
      <circle cx="222" cy="92" r="11" fill="#bfdbfe" stroke="#fff" strokeWidth="4" />
      <line x1="211" y1="92" x2="233" y2="92" stroke="#fff" strokeWidth="2" />
      <line x1="222" y1="81" x2="222" y2="103" stroke="#fff" strokeWidth="2" />
      {/* Fenster mit Sprossen */}
      <Window x={116} y={132} w={30} h={34} frame="#fff" />
      <Window x={158} y={132} w={30} h={34} frame="#fff" />
      <rect x="112" y="166" width="38" height="4" fill="#fff" />
      {/* Erker */}
      <polygon points="206,128 254,128 262,140 262,176 198,176 198,140" fill="#f3d0b0" />
      <Window x={206} y={136} w={20} h={34} frame="#fff" />
      <Window x={230} y={136} w={20} h={34} frame="#fff" />
      <polygon points="192,128 268,128 230,110" fill="#8b2b1c" />
      {/* Eingang mit Rundbogen-Vordach */}
      <rect x="150" y="176" width="34" height="44" fill="#78350f" stroke="#fff" strokeWidth="3" />
      <path d="M144 176 a23 14 0 0 1 46 0" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="1.5" />
      {/* Wintergarten rechts */}
      <polygon points="290,150 350,150 350,220 290,220" fill="#c9e6f5" opacity="0.9" stroke="#fff" strokeWidth="4" />
      <polygon points="284,150 356,150 320,124" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="1.5" />
      {[310, 330].map((x) => (
        <line key={x} x1={x} y1="150" x2={x} y2="220" stroke="#fff" strokeWidth="3" />
      ))}
      <line x1="290" y1="182" x2="350" y2="182" stroke="#fff" strokeWidth="3" />
      {/* Büsche */}
      <ellipse cx="128" cy="218" rx="18" ry="9" fill="#2f7d3b" />
      <ellipse cx="270" cy="218" rx="16" ry="8" fill="#2f7d3b" />
    </g>
  );
}

/* 8. Neubau / KfW ---------------------------------------------------- */
function Neubau() {
  return (
    <g>
      <Backdrop sky="#dbeafe" ground="#9bcf8a" />
      {/* Erdgeschoss */}
      <rect x="70" y="140" width="236" height="80" fill="#f5f5f4" stroke="#d6d3d1" strokeWidth="1.5" />
      {/* Obergeschoss, versetzt, dunkle Fassade */}
      <rect x="120" y="86" width="230" height="54" fill="#3f4753" />
      {/* Pultdach mit Photovoltaik */}
      <polygon points="116,86 354,62 354,72 116,90" fill="#2d333d" />
      <g>
        {Array.from({ length: 6 }).map((_, i) => (
          <polygon
            key={i}
            points={`${132 + i * 38},84 ${166 + i * 38},80 ${166 + i * 38},70 ${132 + i * 38},74`}
            fill="#1e3a8a"
            stroke="#93c5fd"
            strokeWidth="1"
          />
        ))}
      </g>
      {/* Obergeschoss-Fensterband */}
      <rect x="150" y="98" width="170" height="30" fill="#9ec9ea" stroke="#1f2937" strokeWidth="4" />
      {[192, 234, 276].map((x) => (
        <line key={x} x1={x} y1="98" x2={x} y2="128" stroke="#1f2937" strokeWidth="3" />
      ))}
      {/* Große Glasfront unten */}
      <rect x="86" y="152" width="140" height="66" fill="#9ec9ea" stroke="#1f2937" strokeWidth="5" />
      {[133, 180].map((x) => (
        <line key={x} x1={x} y1="152" x2={x} y2="218" stroke="#1f2937" strokeWidth="4" />
      ))}
      <path d="M94 210 L120 160 M140 214 L172 160" stroke="#fff" strokeWidth="6" opacity="0.35" />
      {/* Haustür */}
      <rect x="248" y="158" width="34" height="62" fill="#1f2937" />
      <rect x="252" y="162" width="6" height="52" fill="#9ca3af" />
      {/* Terrasse mit Glasgeländer */}
      <rect x="236" y="132" width="70" height="4" fill="#d6d3d1" />
      <rect x="240" y="120" width="62" height="12" fill="#bae6fd" opacity="0.7" stroke="#0ea5e9" strokeWidth="1" />
      {/* Wärmepumpe */}
      <rect x="314" y="188" width="44" height="32" rx="3" fill="#d1d5db" stroke="#6b7280" strokeWidth="2" />
      <circle cx="336" cy="204" r="11" fill="#9ca3af" stroke="#4b5563" strokeWidth="2" />
      {[0, 60, 120].map((a) => (
        <line key={a} x1="336" y1="204" x2={336 + 9 * Math.cos((a * Math.PI) / 180)} y2={204 + 9 * Math.sin((a * Math.PI) / 180)} stroke="#4b5563" strokeWidth="2" />
      ))}
      {/* Gehweg + Wallbox */}
      <rect x="252" y="220" width="52" height="6" fill="#e5e7eb" />
      <rect x="374" y="186" width="10" height="20" rx="2" fill="#10b981" />
      <ellipse cx="60" cy="218" rx="20" ry="9" fill="#3f8f46" />
    </g>
  );
}

export const illustrations: Record<string, () => ReactElement> = {
  fachwerk: Fachwerk,
  gruenderzeit: Gruenderzeit,
  jugendstil: Jugendstil,
  bauhaus: Bauhaus,
  wiederaufbau: Wiederaufbau,
  grossiedlung: Grossiedlung,
  achtziger: Achtziger,
  neubau: Neubau,
};
