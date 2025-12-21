"use client";
// Re-export Base UI utilities
export { useIsoLayoutEffect } from "@base-ui/utils/useIsoLayoutEffect";
export { useStableCallback } from "@base-ui/utils/useStableCallback";
export { useValueAsRef } from "@base-ui/utils/useValueAsRef";

// Keep legacy names as aliases for backward compatibility
export { useIsoLayoutEffect as useEnhancedEffect } from "@base-ui/utils/useIsoLayoutEffect";
export { useStableCallback as useEventCallback } from "@base-ui/utils/useStableCallback";
export { useValueAsRef as useLatestRef } from "@base-ui/utils/useValueAsRef";

// Export custom implementations
export { useAnimationsFinished } from "./useAnimationsFinished";
export { useTransitionStatus } from "./useTransitionStatus";
export type { TransitionStatus } from "./useTransitionStatus";
