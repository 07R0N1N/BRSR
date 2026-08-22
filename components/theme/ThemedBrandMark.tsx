"use client";

/**
 * BrandMark that follows AppThemeWrapper light/dark. Must render inside
 * the wrapper — marketing Header/Footer keep the unthemed BrandMark and
 * pass `onDark` themselves.
 */

import { BrandMark } from "@/app/(marketing)/components/shared";
import { useAppTheme } from "./AppThemeWrapper";

export function ThemedBrandMark({ size = 36 }: { size?: number }) {
  const { theme } = useAppTheme();
  return <BrandMark size={size} onDark={theme === "dark"} />;
}
