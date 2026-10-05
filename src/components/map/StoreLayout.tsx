import type { StoreLayout as StoreLayoutModel, StoreZone } from '../../types'

interface StoreLayoutProps {
  layout: StoreLayoutModel
}

function getZoneClassName(zone: StoreZone): string {
  return `store-map__zone store-map__zone--${zone.type.toLowerCase()}`
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
        <text className="store-map__zone-label" x={zone.x + zone.width / 2} y={zone.y + 28}>{zone.name}</text>
      </g>
    ))}
    {layout.shelves.map((shelf) => (
      <g key={shelf.id}>
        <rect className="store-map__shelf" x={shelf.x} y={shelf.y} width={shelf.width} height={shelf.height} rx="3" />
        {shelf.label && <text className="store-map__shelf-label" x={shelf.x + shelf.width / 2} y={shelf.y + shelf.height + 18}>{shelf.label}</text>}
      </g>
    ))}
  </>
}
