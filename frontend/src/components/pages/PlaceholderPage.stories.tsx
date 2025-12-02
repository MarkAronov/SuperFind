import { PlaceholderPage } from "./PlaceholderPage";

export default {
	title: "Pages/PlaceholderPage",
	component: PlaceholderPage,
	parameters: {
		layout: "fullscreen",
	},
};

export const Default = () => (
	<PlaceholderPage
		title="Coming Soon"
		description="This feature is under development."
	/>
);

export const WithoutDescription = () => (
	<PlaceholderPage title="Under Construction" />
);
export const CustomContent = () => (
	<PlaceholderPage
		title="New Feature"
		description="We are working on something exciting. Stay tuned!"
	/>
);
