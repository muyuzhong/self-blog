export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)"
export const COARSE_POINTER_QUERY = "(pointer: coarse)"

export function matchesMotionQuery(query: string) {
  return typeof window !== "undefined" && window.matchMedia(query).matches
}

export function prefersReducedMotion() {
  return matchesMotionQuery(REDUCED_MOTION_QUERY)
}

export function shouldUseHeavyMotion(minWidth = 768) {
  if (typeof window === "undefined") return false

  return (
    !prefersReducedMotion() &&
    !matchesMotionQuery(COARSE_POINTER_QUERY) &&
    matchesMotionQuery(`(min-width: ${minWidth}px)`)
  )
}

export function motionAwareScrollBehavior(): ScrollBehavior {
  return prefersReducedMotion() ? "auto" : "smooth"
}
