import assert from 'node:assert/strict'
import test from 'node:test'
import type { StoreGraph } from '../../types/models.ts'
import { GraphService } from './GraphService.ts'
import { findShortestPath } from './ShortestPathSolver.ts'

const graph: StoreGraph = {
  nodes: [
    { id: 'a', x: 0, y: 0, type: 'ENTRANCE' },
    { id: 'b', x: 1, y: 0, type: 'INTERSECTION' },
    { id: 'c', x: 2, y: 0, type: 'INTERSECTION' },
    { id: 'd', x: 3, y: 0, type: 'EXIT' },
    { id: 'isolated', x: 0, y: 1, type: 'AISLE' },
  ],
  edges: [
    { id: 'ab', from: 'a', to: 'b', distance: 1, baseTime: 1, bidirectional: true, enabled: true },
    { id: 'bc', from: 'b', to: 'c', distance: 1, baseTime: 1, bidirectional: true, enabled: true },
    { id: 'cd', from: 'c', to: 'd', distance: 1, baseTime: 1, bidirectional: true, enabled: true },
    { id: 'ad', from: 'a', to: 'd', distance: 5, baseTime: 5, bidirectional: true, enabled: true },
  ],
}

test('GraphService returns neighbors and bidirectional edges', () => {
  const service = new GraphService(graph)
  assert.deepEqual(service.getNeighbors('b').map((node) => node.id), ['a', 'c'])
  assert.equal(service.getEdge('b', 'a')?.id, 'ab')
  assert.equal(service.getNode('missing'), null)
})

test('Dijkstra selects the lowest-cost path', () => {
  const result = findShortestPath(graph, 'a', 'd')
  assert.deepEqual(result?.nodePath, ['a', 'b', 'c', 'd'])
  assert.equal(result?.totalCost, 3)
  assert.equal(result?.distance, 3)
})

test('Dijkstra skips a blocked edge when an alternative exists', () => {
  const result = findShortestPath(graph, 'a', 'd', (edge) => edge.id === 'bc' ? Infinity : edge.baseTime)
  assert.deepEqual(result?.nodePath, ['a', 'd'])
  assert.equal(result?.totalCost, 5)
})

test('Dijkstra returns null when destination is unreachable', () => {
  assert.equal(findShortestPath(graph, 'a', 'isolated'), null)
})
