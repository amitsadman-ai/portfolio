import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { children as initialChildren } from './data/children'
import { getActivity } from './data/activities'
import { discounts, familyBalance } from './data/discounts'

const ScoutsContext = createContext(null)

export const useScouts = () => {
  const ctx = useContext(ScoutsContext)
  if (!ctx) throw new Error('useScouts must be used within <ScoutsProvider>')
  return ctx
}

export function ScoutsProvider({ children }) {
  const [loggedIn, setLoggedIn] = useState(false)
  const [roster, setRoster] = useState(initialChildren)
  const [activeChildId, setActiveChildId] = useState(initialChildren[0].id)
  // cart shape: { [childId]: string[] (activity ids) }
  const [cart, setCart] = useState({})
  const [cartOpen, setCartOpen] = useState(false)

  const login = useCallback(() => setLoggedIn(true), [])
  const logout = useCallback(() => {
    setLoggedIn(false)
    setCart({})
    setCartOpen(false)
  }, [])

  const addChild = useCallback((child) => {
    setRoster((prev) => [...prev, child])
  }, [])

  const updateChild = useCallback((childId, patch) => {
    setRoster((prev) =>
      prev.map((c) => {
        if (c.id !== childId) return c
        const next = { ...c, ...patch }
        // Keep the composed `name` in sync if first/last changed
        if (patch.firstName !== undefined || patch.lastName !== undefined) {
          next.name = `${next.firstName} ${next.lastName || ''}`.trim()
        }
        return next
      }),
    )
  }, [])

  const removeChild = useCallback((childId) => {
    setRoster((prev) => prev.filter((c) => c.id !== childId))
    setCart((prev) => {
      if (!(childId in prev)) return prev
      const next = { ...prev }
      delete next[childId]
      return next
    })
    setActiveChildId((curr) => {
      if (curr !== childId) return curr
      const remaining = roster.filter((c) => c.id !== childId)
      return remaining[0]?.id ?? null
    })
  }, [roster])

  const isInCart = useCallback(
    (childId, activityId) => (cart[childId] || []).includes(activityId),
    [cart],
  )

  const addToCart = useCallback((childId, activityId) => {
    setCart((prev) => {
      const list = prev[childId] || []
      if (list.includes(activityId)) return prev
      return { ...prev, [childId]: [...list, activityId] }
    })
    setCartOpen(true)
  }, [])

  const removeFromCart = useCallback((childId, activityId) => {
    setCart((prev) => {
      const list = (prev[childId] || []).filter((id) => id !== activityId)
      const next = { ...prev, [childId]: list }
      if (list.length === 0) delete next[childId]
      return next
    })
  }, [])

  const clearCart = useCallback(() => setCart({}), [])

  /* Flattened cart lines with resolved activity + child objects. */
  const cartLines = useMemo(() => {
    const lines = []
    for (const child of roster) {
      for (const activityId of cart[child.id] || []) {
        const activity = getActivity(activityId)
        if (activity) lines.push({ child, activity })
      }
    }
    return lines
  }, [cart, roster])

  const cartCount = cartLines.length

  const linesForChild = useCallback(
    (childId) => cartLines.filter((l) => l.child.id === childId),
    [cartLines],
  )

  /* Pricing breakdown for the cart summary + checkout. */
  const summary = useMemo(() => {
    const subtotal = cartLines.reduce((sum, l) => sum + l.activity.priceILS, 0)

    // Sibling discount: highest-spending child pays full, the rest get 10% off.
    const perChild = {}
    for (const l of cartLines) {
      perChild[l.child.id] = (perChild[l.child.id] || 0) + l.activity.priceILS
    }
    const childTotals = Object.values(perChild).sort((a, b) => b - a)
    const siblingBase = childTotals.slice(1).reduce((s, v) => s + v, 0)
    const siblingDiscount = Math.round(siblingBase * 0.1)

    const veteranDiscount = Math.round(subtotal * 0.05)

    const credit = subtotal > 0 ? familyBalance.credit : 0
    const total = Math.max(
      0,
      subtotal - siblingDiscount - veteranDiscount - credit,
    )

    return { subtotal, siblingDiscount, veteranDiscount, credit, total }
  }, [cartLines])

  const value = useMemo(
    () => ({
      loggedIn,
      login,
      logout,
      roster,
      addChild,
      updateChild,
      removeChild,
      activeChildId,
      setActiveChildId,
      cart,
      isInCart,
      addToCart,
      removeFromCart,
      clearCart,
      cartLines,
      linesForChild,
      cartCount,
      cartOpen,
      openCart: () => setCartOpen(true),
      closeCart: () => setCartOpen(false),
      summary,
      discounts,
    }),
    [
      loggedIn, login, logout, roster, addChild, updateChild, removeChild, activeChildId, cart, isInCart,
      addToCart, removeFromCart, clearCart, cartLines, linesForChild, cartCount,
      cartOpen, summary,
    ],
  )

  return <ScoutsContext.Provider value={value}>{children}</ScoutsContext.Provider>
}
