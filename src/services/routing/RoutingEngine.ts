import type { RouteInput, RouteResult } from '../../types'
import { selectBestCheckout } from './CheckoutSelector.ts'
import { planMultiStopRoute } from './MultiStopRoutePlanner.ts'

export function calculateRoute(input: RouteInput): RouteResult | null {
  const routePlan = planMultiStopRoute(input.graph, input.currentNodeId, input.pendingProducts)
  if (!routePlan) {
    return null
  }

  const checkoutSelection = selectBestCheckout(input.graph, routePlan.lastNodeId, input.checkouts)
  if (!checkoutSelection) {
    return null
  }

  return {
    nodePath: [...routePlan.nodePath, ...checkoutSelection.path.nodePath.slice(1)],
    orderedProductIds: routePlan.orderedProductIds,
    estimatedTime: routePlan.estimatedTime + checkoutSelection.totalTime,
    estimatedDistance: routePlan.estimatedDistance + checkoutSelection.path.distance,
    checkoutId: checkoutSelection.checkoutId,
  }
}
