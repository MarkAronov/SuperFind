import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { MOTION } from "../0-tokens/tokens";

interface AnimatedRouteProps {
	children: ReactNode;
}

/**
 * AnimatedRoute
 *
 * motion.div wrapper that animates page content on enter and exit.
 * Used inside PageTemplate around <main> so that only the content area
 * animates while Header/Footer remain stable.
 *
 * The key that drives enter/exit lives on <Outlet> in RootLayout (router.tsx),
 * following the official TanStack Router + Framer Motion example:
 * https://tanstack.com/router/latest/docs/framework/react/examples/with-framer-motion
 *
 * Variant keys:
 * - "initial" — entering: faded out, 8px below rest position
 * - "in"      — resting: fully visible at natural position
 * - "out"     — exiting: faded out, 4px above (lighter than entrance)
 */
export const AnimatedRoute = ({ children }: AnimatedRouteProps) => {
	return (
		<motion.div
			// No key here — key lives on <Outlet key={nextMatch.id}> in RootLayout
			initial="initial"
			animate="in"
			exit="out"
			variants={MOTION.page.variants}
			transition={MOTION.transition.slower}
		>
			{children}
		</motion.div>
	);
};
