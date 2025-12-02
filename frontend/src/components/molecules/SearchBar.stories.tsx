import { SearchBar } from "./SearchBar";

export default {
	title: "Molecules/SearchBar",
	component: SearchBar,
};

export const Default = () => (
	<div style={{ padding: "20px", width: "600px" }}>
		<SearchBar onSearch={(q) => console.log("search", q)} />
	</div>
);

export const Loading = () => (
	<div style={{ padding: "20px", width: "600px" }}>
		<SearchBar onSearch={(q) => console.log("search", q)} isLoading />
	</div>
);
