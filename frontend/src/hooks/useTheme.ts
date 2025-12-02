import { useCallback, useEffect, useSyncExternalStore } from "react";

type Theme = "light" | "dark" | "system";

const STORAGE_KEY = "skillvector-theme";

function getSystemTheme(): "light" | "dark" {
	if (typeof window === "undefined") return "light";
	return window.matchMedia("(prefers-color-scheme: dark)").matches
		? "dark"
		: "light";
}

function applyTheme(theme: Theme) {
	const root = document.documentElement;
	const effectiveTheme = theme === "system" ? getSystemTheme() : theme;

	if (effectiveTheme === "dark") {
		root.classList.add("dark");
	} else {
		root.classList.remove("dark");
	}
}

// Shared store for theme state
let currentTheme: Theme = (() => {
	if (typeof window === "undefined") return "system";
	const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
	if (stored && ["light", "dark", "system"].includes(stored)) {
		return stored;
	}
	return "system";
})();

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
	listeners.add(listener);
	return () => listeners.delete(listener);
}

function getSnapshot() {
	return currentTheme;
}

function setThemeInternal(newTheme: Theme) {
	currentTheme = newTheme;
	localStorage.setItem(STORAGE_KEY, newTheme);
	applyTheme(newTheme);
	// Notify all subscribers
	for (const listener of listeners) {
		listener();
	}
}

// Apply initial theme
if (typeof window !== "undefined") {
	applyTheme(currentTheme);

	// Listen for system theme changes
	window
		.matchMedia("(prefers-color-scheme: dark)")
		.addEventListener("change", () => {
			if (currentTheme === "system") {
				applyTheme("system");
				// Notify listeners so effectiveTheme updates
				for (const listener of listeners) {
					listener();
				}
			}
		});
}

export function useTheme() {
	const theme = useSyncExternalStore(
		subscribe,
		getSnapshot,
		() => "system" as Theme,
	);

	const effectiveTheme: "light" | "dark" =
		theme === "system" ? getSystemTheme() : theme;

	const setTheme = useCallback((newTheme: Theme) => {
		setThemeInternal(newTheme);
	}, []);

	const toggleTheme = useCallback(() => {
		// Cycle through: system -> light -> dark -> system
		if (currentTheme === "system") setThemeInternal("light");
		else if (currentTheme === "light") setThemeInternal("dark");
		else setThemeInternal("system");
	}, []);

	// Re-apply theme when component mounts (for SSR/hydration)
	useEffect(() => {
		applyTheme(theme);
	}, [theme]);

	return {
		theme,
		effectiveTheme,
		setTheme,
		toggleTheme,
		isSystem: theme === "system",
	};
}
