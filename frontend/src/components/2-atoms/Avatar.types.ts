import type * as AvatarPrimitive from "@radix-ui/react-avatar";
import type * as React from "react";

export interface AvatarProps
	extends React.ComponentProps<typeof AvatarPrimitive.Root> {
	variant?: "default" | "nonagon";
}
