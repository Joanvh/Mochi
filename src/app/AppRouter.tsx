import { Navigate, Route, Routes } from 'react-router-dom'
import { CheckoutPage } from '../features/checkout/pages/CheckoutPage'
import { DemoPage } from '../features/demo/pages/DemoPage'
import { FinishPage } from '../features/finish/pages/FinishPage'
import { LandingPage } from '../features/auth/pages/LandingPage'
import { NavigationPage } from '../features/navigation/pages/NavigationPage'
import { RouteSummaryPage } from '../features/navigation/pages/RouteSummaryPage'
import { RecommendationsPage } from '../features/recommendations/pages/RecommendationsPage'
import { ShoppingListPage } from '../features/shopping-list/pages/ShoppingListPage'
import { AppShell } from './AppShell'
import { NotFoundPage } from './NotFoundPage'

export function AppRouter() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<LandingPage />} />
        <Route path="list" element={<ShoppingListPage />} />
        <Route path="recommendations" element={<RecommendationsPage />} />
        <Route path="route" element={<RouteSummaryPage />} />
        <Route path="navigation" element={<NavigationPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="finish" element={<FinishPage />} />
        <Route path="demo" element={<DemoPage />} />
        <Route path="not-found" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate replace to="/not-found" />} />
      </Route>
    </Routes>
  )
}
