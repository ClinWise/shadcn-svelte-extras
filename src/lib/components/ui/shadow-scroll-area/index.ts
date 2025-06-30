import ShadowScrollbar from "./shadow-scroll-area-scrollbar.svelte";
import Root from "./shadow-scroll-area.svelte";

export {
  Root,
  ShadowScrollbar,
  //,
  Root as   ShadowScrollArea,
  ShadowScrollbar as ShadowScrollAreaScrollbar,
};

// Enhanced ScrollArea Props Types
export type ShadowScrollAreaProps = {
  orientation?: "vertical" | "horizontal" | "both" | undefined;
  scrollbarXClasses?: string | undefined;
  scrollbarYClasses?: string | undefined;
  enableScrollShadows?: boolean;
  shadowSize?: "sm" | "md" | "lg";
  shadowColor?: "black" | "gray" | "slate";
  shadowOpacity?: number;
  shadowHideDelay?: number;
};
