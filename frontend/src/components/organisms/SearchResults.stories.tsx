import type { Meta, StoryObj } from "@storybook/react";
import { SearchResults } from "./SearchResults";

const meta: Meta<typeof SearchResults> = {
	title: "Organisms/SearchResults",
	component: SearchResults,
	parameters: {
		layout: "centered",
	},
};

export default meta;
type Story = StoryObj<typeof SearchResults>;

export const Default: Story = {
	render: () => (
		<SearchResults
			data={{
				success: true,
				query: "test",
				answer: "No results",
				people: [],
				timestamp: new Date().toISOString(),
			}}
		/>
	),
};
