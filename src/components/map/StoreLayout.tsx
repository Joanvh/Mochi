import type { StoreLayout as StoreLayoutModel, StoreZone } from '../../types'

interface StoreLayoutProps {
  layout: StoreLayoutModel
}

function getZoneClassName(zone: StoreZone): string {
  return `store-map__zone store-map__zone--${zone.type.toLowerCase()}`
}

function getZoneInfo(zone: StoreZone): { icon: string; label: string } {
  const infoMap: Record<string, { icon: string; label: string }> = {
    'Frutas y verduras': { icon: '🍎', label: 'Fruta y verdura' },
    'Alimentación seca': { icon: '🥫', label: 'Secos' },
    'Panadería y bebidas': { icon: '🥖', label: 'Pan y bebidas' },
    Refrigerados: { icon: '🥩', label: 'Refrigerados' },
    Entrada: { icon: '🚪', label: 'Entrada' },
    Cajas: { icon: '🛒', label: 'Cajas' },
    Lácteos: { icon: '🥛', label: 'Lácteos' },
  }

  return infoMap[zone.name] ?? { icon: '📍', label: zone.name }
}

function getZoneHeaderY(zone: StoreZone): number {
  if (zone.type === 'CHECKOUT') {
    return zone.y + 12
  }
  if (zone.type === 'ENTRANCE') {
    return zone.y + 14
  }
  return zone.y + 12
}

export function StoreLayout({ layout }: StoreLayoutProps) {
  return <>
    <defs>
      {/* Subtle supermarket floor tile pattern */}
      <pattern id="store-floor-pattern" width="50" height="50" patternUnits="userSpaceOnUse">
        <rect width="50" height="50" fill="#f8f6f0" />
        <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#e8e2d4" strokeWidth="1" strokeOpacity="0.6" />
      </pattern>

      {/* Filter shadow for zones and cards */}
      <filter id="zone-card-shadow" x="-5%" y="-5%" width="110%" height="115%">
        <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.08" floodColor="#1c3037" />
      </filter>

      {/* Filter shadow for markers */}
      <filter id="map-marker-shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="3" stdDeviation="3" floodOpacity="0.2" floodColor="#000000" />
      </filter>
    </defs>

    {/* Background floor */}
    <rect className="store-map__boundary" x="0" y="0" width={layout.width} height={layout.height} rx="20" fill="url(#store-floor-pattern)" />

    {/* Store perimeter outline */}
    <rect x="6" y="6" width={layout.width - 12} height={layout.height - 12} rx="16" fill="none" stroke="#1c3037" strokeWidth="2" strokeOpacity="0.18" />

    {/* Walls if any */}
    {layout.walls?.map((wall) => (
      <line key={wall.id} className="store-map__wall" x1={wall.x1} y1={wall.y1} x2={wall.x2} y2={wall.y2} />
    ))}

    {/* Zones */}
    {layout.zones.map((zone) => {
      const { icon, label } = getZoneInfo(zone)
      const headerY = getZoneHeaderY(zone)
      const headerWidth = Math.min(zone.width - 16, 150)
      const headerX = zone.x + (zone.width - headerWidth) / 2

      return (
        <g key={zone.id} className="store-map__zone-group" filter="url(#zone-card-shadow)">
          {/* Main zone background */}
          <rect
            className={getZoneClassName(zone)}
            x={zone.x}
            y={zone.y}
            width={zone.width}
            height={zone.height}
            rx="12"
          />

          {/* Zone header pill/badge */}
          <rect
            className="store-map__zone-header-bg"
            x={headerX}
            y={headerY}
            width={headerWidth}
            height="32"
            rx="8"
          />

          {/* Zone Icon & Label */}
          <text
            className="store-map__zone-label"
            x={zone.x + zone.width / 2}
            y={headerY + 21}
          >
            {icon} {label}
          </text>
        </g>
      )
    })}

    {/* Shelves */}
    {layout.shelves.map((shelf) => (
      <g key={shelf.id} className="store-map__shelf-group">
        <title>{shelf.label ?? 'Estantería'}</title>
        {/* Main shelf block */}
        <rect
          className="store-map__shelf"
          x={shelf.x}
          y={shelf.y}
          width={shelf.width}
          height={shelf.height}
          rx="5"
        />
        {/* Gondola shelf top highlight */}
        <rect
          x={shelf.x + 2}
          y={shelf.y + 2}
          width={Math.max(0, shelf.width - 4)}
          height={Math.max(0, Math.floor(shelf.height / 2) - 1)}
          rx="3"
          fill="#ffffff"
          fillOpacity="0.22"
        />
        {/* Shelf interior dividers to look like aisles/shelves */}
        {shelf.width > 50 && (
          <>
            <line
              x1={shelf.x + shelf.width * 0.33}
              y1={shelf.y + 4}
              x2={shelf.x + shelf.width * 0.33}
              y2={shelf.y + shelf.height - 4}
              stroke="#ffffff"
              strokeWidth="1.5"
              strokeOpacity="0.3"
            />
            <line
              x1={shelf.x + shelf.width * 0.66}
              y1={shelf.y + 4}
              x2={shelf.x + shelf.width * 0.66}
              y2={shelf.y + shelf.height - 4}
              stroke="#ffffff"
              strokeWidth="1.5"
              strokeOpacity="0.3"
            />
          </>
        )}
      </g>
    ))}
  </>
}

