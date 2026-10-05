import assert from 'node:assert/strict'
import test from 'node:test'
import type { Checkout, Incident, ProductLocation, StoreGraph } from '../../types/models.ts'
import { selectBestCheckout } from './CheckoutSelector.ts'
import { planMultiStopRoute } from './MultiStopRoutePlanner.ts'
import { calculateRoute } from './RoutingEngine.ts'

const graph: StoreGraph = {
  nodes: [
    { id: 'start', x: 0, y: 0, type: 'ENTRANCE' },
    { id: 'fruit', x: 1, y: 0, type: 'PRODUCT_ACCESS' },
    { id: 'dairy', x: 2, y: 0, type: 'PRODUCT_ACCESS' },
    { id: 'checkout_near', x: 3, y: 0, type: 'CHECKOUT' },
    { id: 'checkout_fast', x: 2, y: 1, type: 'CHECKOUT' },
  ],
  edges: [
    { id: 'start_fruit', from: 'start', to: 'fruit', distance: 1, baseTime: 1, bidirectional: true, enabled: true },
    { id: 'fruit_dairy', from: 'fruit', to: 'dairy', distance: 1, baseTime: 1, bidirectional: true, enabled: true },
    { id: 'dairy_near', from: 'dairy', to: 'checkout_near', distance: 1, baseTime: 1, bidirectional: true, enabled: true },
    { id: 'dairy_fast', from: 'dairy', to: 'checkout_fast', distance: 2, baseTime: 2, bidirectional: true, enabled: true },
  ],
}

const productLocations: ProductLocation[] = [
  { productId: 'milk', storeId: 'store', nodeId: 'dairy' },
  { productId: 'apple', storeId: 'store', nodeId: 'fruit' },
]

const checkouts: Checkout[] = [
  { id: 'near', name: 'Caja cercana', nodeId: 'checkout_near', status: 'OPEN', queueMinutes: 8 },
  { id: 'fast', name: 'Caja rápida', nodeId: 'checkout_fast', status: 'OPEN', queueMinutes: 2 },
  { id: 'closed', name: 'Caja cerrada', nodeId: 'checkout_near', status: 'CLOSED', queueMinutes: 0 },
]

test('multi-stop planner follows the nearest unvisited product', () => {
  const route = planMultiStopRoute(graph, 'start', productLocations)
  assert.deepEqual(route?.orderedProductIds, ['apple', 'milk'])
  assert.deepEqual(route?.nodePath, ['start', 'fruit', 'dairy'])
})

test('checkout selection prioritizes total travel and queue time', () => {
  const checkout = selectBestCheckout(graph, 'dairy', checkouts)
  assert.equal(checkout?.checkoutId, 'fast')
  assert.equal(checkout?.totalTime, 4)
})

test('routing engine returns products, route, and final checkout', () => {
  const route = calculateRoute({ graph, currentNodeId: 'start', pendingProducts: productLocations, incidents: [], checkouts })
  assert.deepEqual(route?.orderedProductIds, ['apple', 'milk'])
  assert.equal(route?.checkoutId, 'fast')
  assert.equal(route?.estimatedTime, 6)
})

test('routing engine avoids a checkout path blocked by an incident', () => {
  const incidents: Incident[] = [{
    id: 'spill-dairy-fast',
    type: 'SPILL',
    targetType: 'EDGE',
    targetId: 'dairy_fast',
    severity: 'HIGH',
    source: 'DEMO',
    createdAt: '2026-10-05T09:00:00.000Z',
    status: 'ACTIVE',
  }]

  const route = calculateRoute({ graph, currentNodeId: 'start', pendingProducts: productLocations, incidents, checkouts })

  assert.equal(route?.checkoutId, 'near')
  assert.deepEqual(route?.nodePath, ['start', 'fruit', 'dairy', 'checkout_near'])
})
