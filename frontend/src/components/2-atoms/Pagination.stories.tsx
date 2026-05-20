import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { PaginationBar } from "./Pagination";

const meta: Meta<typeof PaginationBar> = {
	title: "Atoms/PaginationBar",
	component: PaginationBar,
	parameters: {
		// Full-width layout so the bar renders naturally
		layout: "padded",
	},
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof PaginationBar>;

// ---------------------------------------------------------------------------
// Interactive wrapper — lets you actually click through pages in Storybook
// ---------------------------------------------------------------------------
const InteractiveWrapper = ({
	initialPage = 1,
	totalPages,
}: {
	initialPage?: number;
	totalPages: number;
}) => {
	const [page, setPage] = useState(initialPage);

	return (
		<div className="flex flex-col gap-4 items-center">
			{/* Current page indicator */}
			<p className="text-sm text-muted-foreground">
				Page <strong>{page}</strong> of <strong>{totalPages}</strong>
			</p>
			<PaginationBar
				currentPage={page}
				totalPages={totalPages}
				onPageChange={setPage}
			/>
		</div>
	);
};

// ---------------------------------------------------------------------------
// Interactive — fully clickable, state tracked in wrapper
// ---------------------------------------------------------------------------
export const Interactive: Story = {
	render: () => <InteractiveWrapper totalPages={10} initialPage={5} />,
};

// ---------------------------------------------------------------------------
// FirstPage — Previous is visually disabled
// ---------------------------------------------------------------------------
export const FirstPage: Story = {
	args: {
		currentPage: 1,
		totalPages: 10,
		onPageChange: (_: number) => undefined,
	},
};

// ---------------------------------------------------------------------------
// MiddlePage — ellipsis visible on both sides  (1 … 4 5 6 … 10)
// ---------------------------------------------------------------------------
export const MiddlePage: Story = {
	args: {
		currentPage: 5,
		totalPages: 10,
		onPageChange: (_: number) => undefined,
	},
};

// ---------------------------------------------------------------------------
// LastPage — Next is visually disabled
// ---------------------------------------------------------------------------
export const LastPage: Story = {
	args: {
		currentPage: 10,
		totalPages: 10,
		onPageChange: (_: number) => undefined,
	},
};

// ---------------------------------------------------------------------------
// FewPages — ≤ 7 pages renders every page number, no ellipsis
// ---------------------------------------------------------------------------
export const FewPages: Story = {
	args: {
		currentPage: 3,
		totalPages: 5,
		onPageChange: (_: number) => undefined,
	},
};

// ---------------------------------------------------------------------------
// TwoPages — minimal case: previous + 1 + 2 + next
// ---------------------------------------------------------------------------
export const TwoPages: Story = {
	args: {
		currentPage: 1,
		totalPages: 2,
		onPageChange: (_: number) => undefined,
	},
};

// ---------------------------------------------------------------------------
// SinglePage — renders nothing (PaginationBar returns null when totalPages ≤ 1)
// The story renders a label to make the empty state visible in Storybook
// ---------------------------------------------------------------------------
export const SinglePage: Story = {
	render: () => (
		<div className="flex flex-col gap-2 items-center text-sm text-muted-foreground">
			<p>(PaginationBar renders nothing when there is only one page)</p>
			<PaginationBar
				currentPage={1}
				totalPages={1}
				onPageChange={(_: number) => undefined}
			/>
		</div>
	),
};

// ---------------------------------------------------------------------------
// LargeDataset — 50 pages, near the end (left ellipsis only)
// ---------------------------------------------------------------------------
export const LargeDatasetNearEnd: Story = {
	args: {
		currentPage: 48,
		totalPages: 50,
		onPageChange: (_: number) => undefined,
	},
};
