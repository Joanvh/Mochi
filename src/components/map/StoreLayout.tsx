import type { StoreLayout as StoreLayoutModel, StoreZone } from '../../types'

interface StoreLayoutProps {
  layout: StoreLayoutModel
}

function getZoneClassName(zone: StoreZone): string {
  return `store-map__zone store-map__zone--${zone.type.toLowerCase()}`
}

function getZoneLabel(zone: StoreZone): string {
  const labels: Record<string, string> = {
    'Frutas y verduras': 'Fruta y verdura',
    'Alimentación seca': 'Secos',
    'Panadería y bebidas': 'Pan y bebidas',
    Refrigerados: 'Frío',
  }

  return labels[zone.name] ?? zone.name
}

function getZoneLabelY(zone: StoreZone): number {
  if (zone.type === 'CHECKOUT') {
    return zone.y + 30
  }

  if (zone.type === 'ENTRANCE') {
    return zone.y + zone.height - 22
  }

  return zone.y + zone.height / 2
}

export function StoreLayout({ layout }: StoreLayoutProps) {
  return <>
    <rect className="store-map__boundary" x="0" y="0" width={layout.width} height={layout.height} rx="16" />
    {layout.walls?.map((wall) => (
      <line key={wall.id} className="store-map__wall" x1={wall.x1} y1={wall.y1} x2={wall.x2} y2={wall.y2} />
    ))}
    {layout.zones.map((zone) => (
      <g key={zone.id}>
        <rect className={getZoneClassName(zone)} x={zone.x} y={zone.y} width={zone.width} height={zone.height} rx="10" />
        <text className="store-map__zone-label" x={zone.x + zone.width / 2} y={getZoneLabelY(zone)}>{getZoneLabel(zone)}</text>
      </g>
    ))}
    {layout.shelves.map((shelf) => (
      <g key={shelf.id}>
        <title>{shelf.label ?? 'Estantería'}</title>
        <rect className="store-map__shelf" x={shelf.x} y={shelf.y} width={shelf.width} height={shelf.height} rx="3" />
      </g>
    ))}
  </>
}
