import assert from 'node:assert/strict'
import test from 'node:test'
import type { Incident } from '../../types/models.ts'
import { IncidentManager } from './IncidentManager.ts'

function createManager(initialIncidents: Incident[] = []): IncidentManager {
  return new IncidentManager(initialIncidents, {
    createId: () => 'incident-created',
    now: () => '2026-10-05T10:00:00.000Z',
  })
}

test('creates a valid incident and exposes it as active', () => {
  const manager = createManager()

  const created = manager.createIncident({
    type: 'SPILL',
    targetType: 'EDGE',
    targetId: 'edge-14',
    severity: 'HIGH',
    source: 'USER',
  })

  assert.equal(created.id, 'incident-created')
  assert.equal(created.createdAt, '2026-10-05T10:00:00.000Z')
  assert.deepEqual(manager.getActiveIncidents(), [created])
  assert.deepEqual(manager.getIncidentEffect(created.id), {
    blocksTraversal: true,
    costMultiplier: Number.POSITIVE_INFINITY,
  })
})

test('rejects incidents whose target does not match their type', () => {
  const manager = createManager()

  assert.throws(() => manager.createIncident({
    type: 'LONG_CHECKOUT_QUEUE',
    targetType: 'EDGE',
    targetId: 'edge-14',
    severity: 'MEDIUM',
    source: 'USER',
  }), /must target CHECKOUT/)
})

test('expires and removes incidents from the active collection', () => {
  const activeIncident: Incident = {
    id: 'incident-1',
    type: 'CONGESTION',
    targetType: 'EDGE',
    targetId: 'edge-10',
    severity: 'LOW',
    source: 'DEMO',
    createdAt: '2026-10-05T09:00:00.000Z',
    status: 'ACTIVE',
  }
  const manager = createManager([activeIncident])

  assert.equal(manager.expireIncident(activeIncident.id), true)
  assert.deepEqual(manager.getActiveIncidents(), [])
  assert.equal(manager.removeIncident(activeIncident.id), true)
  assert.equal(manager.removeIncident(activeIncident.id), false)
})
