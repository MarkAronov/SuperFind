import { RouterProvider } from "@tanstack/react-router";
import { Suspense } from "react";
import { router } from "./router";

// Loading fallback for lazy-loaded pages
function PageLoader() {
	return (
		<div className="min-h-screen flex items-center justify-center">
			<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
		</div>
	);
}

function App() {
	return (
		<Suspense fallback={<PageLoader />}>
			<RouterProvider router={router} />
		</Suspense>
	);
}

export default App;
test;
