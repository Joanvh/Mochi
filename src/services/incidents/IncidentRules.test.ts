import assert from 'node:assert/strict'
import test from 'node:test'
import type { GraphEdge, Incident } from '../../types/models.ts'
import { calculateEdgeCost } from '../routing/RouteCostCalculator.ts'
import { getIncidentEffect } from './IncidentRules.ts'

const edge: GraphEdge = {
  id: 'edge-a-b',
  from: 'a',
  to: 'b',
  distance: 8,
  baseTime: 10,
  bidirectional: true,
  enabled: true,
}

function incident(overrides: Partial<Incident>): Incident {
  return {
    id: 'incident-1',
    type: 'CONGESTION',
    targetType: 'EDGE',
    targetId: edge.id,
    severity: 'MEDIUM',
    source: 'DEMO',
    createdAt: '2026-10-05T09:00:00.000Z',
    status: 'ACTIVE',
    ...overrides,
  }
}

test('blocks traversal when an active spill targets the edge', () => {
  const cost = calculateEdgeCost(edge, [incident({ type: 'SPILL' })])

  assert.equal(cost, Number.POSITIVE_INFINITY)
})

test('applies congestion and restocking penalties to edge cost', () => {
  const cost = calculateEdgeCost(edge, [
    incident({ id: 'congestion', severity: 'HIGH' }),
    incident({ id: 'restocking', type: 'RESTOCKING' }),
  ])

  assert.ok(Math.abs(cost - 42) < 0.000001)
})

test('ignores inactive incidents and incidents aimed at another target type', () => {
  const cost = calculateEdgeCost(edge, [
    incident({ status: 'RESOLVED' }),
    incident({ id: 'product-incident', targetType: 'PRODUCT', targetId: 'product-1' }),
  ])

  assert.equal(cost, 10)
  assert.deepEqual(getIncidentEffect(incident({ status: 'EXPIRED' })), {
    blocksTraversal: false,
    costMultiplier: 1,
  })
})
