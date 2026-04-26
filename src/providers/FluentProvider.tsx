"use client";

import {
  FluentProvider,
  webDarkTheme,
} from "@fluentui/react-components";
import { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <FluentProvider theme={webDarkTheme}>
      {children}
    </FluentProvider>
  );
}
