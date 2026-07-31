"use client";

import * as React from "react";

/*
  Shared-element morph across a route change.

  React's <ViewTransition> ships in the canary Next vendors for the App
  Router, but @types/react tracks stable and doesn't declare it. Augmenting
  the module would assert an export that genuinely isn't there for anything
  type-checking against stable React, so this reads it at runtime instead and
  renders the children untouched when it's missing.

  That fallback is the same behaviour browsers without the View Transitions
  API get: the navigation works, it just doesn't animate.
*/

type Props = { name: string; children: React.ReactNode };

const Impl = (
  React as unknown as { unstable_ViewTransition?: React.ComponentType<Props> }
).unstable_ViewTransition;

export function Morph({ name, children }: Props) {
  if (!Impl) return <>{children}</>;
  return <Impl name={name}>{children}</Impl>;
}
