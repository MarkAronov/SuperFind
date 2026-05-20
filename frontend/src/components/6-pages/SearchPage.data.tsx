import {
	Briefcase,
	MapPin,
	Search,
	SlidersHorizontal,
	Star,
} from "lucide-react";
import { SIZING } from "../1-ions/sizing";

// Hero section content
export const heroContent = {
	title: "Find the ",
	brand: "Perfect Talent",
	subtitle:
		"Semantic search powered by AI. Search by skills, experience, location, and more.",
};

// Search bar placeholder text
export const searchBarPlaceholder =
	"Search for people... (e.g., 'Python developers', 'DevOps from Europe')";

// Hint shown when no search query is active
export const hintContent = {
	text: "Tip: Visit",
	linkTo: "/people",
	linkLabel: "/people",
	suffix: "to see everyone",
};

// ─── Filter Option Definitions ────────────────────────────────────────────────

// Experience level options for the filter panel
export const experienceOptions = [
	{ value: "all", label: "All Levels" },
	{ value: "entry", label: "Entry (0-2 years)" },
	{ value: "junior", label: "Junior (2-5 years)" },
	{ value: "mid", label: "Mid (5-10 years)" },
	{ value: "senior", label: "Senior (10-15 years)" },
	{ value: "expert", label: "Expert (15+ years)" },
];

// Geographic region options for the filter panel
export const regionOptions = [
	{ value: "all", label: "All Regions" },
	{ value: "north-america", label: "North America" },
	{ value: "europe", label: "Europe" },
	{ value: "asia", label: "Asia" },
	{ value: "south-america", label: "South America" },
	{ value: "africa", label: "Africa" },
	{ value: "oceania", label: "Oceania" },
];

// Job role category options for the filter panel
export const roleOptions = [
	{ value: "all", label: "All Roles" },
	{ value: "engineering", label: "Engineering" },
	{ value: "design", label: "Design" },
	{ value: "product", label: "Product" },
	{ value: "data", label: "Data & Analytics" },
	{ value: "management", label: "Management" },
	{ value: "marketing", label: "Marketing" },
	{ value: "sales", label: "Sales" },
];

// Sort order options for the filter panel
export const sortOptions = [
	{ value: "relevance", label: "Relevance" },
	{ value: "experience-high", label: "Experience ↓" },
	{ value: "experience-low", label: "Experience ↑" },
	{ value: "name-asc", label: "Name A-Z" },
	{ value: "name-desc", label: "Name Z-A" },
];

// Filter panel config — icons + options bundled together for direct use in FilterPanel
export const filterPanelFilters = [
	{
		label: "Experience",
		value: "experience",
		icon: <Briefcase className={SIZING.ICON.sm} />,
		options: experienceOptions,
	},
	{
		label: "Region",
		value: "region",
		icon: <MapPin className={SIZING.ICON.sm} />,
		options: regionOptions,
	},
	{
		label: "Role",
		value: "role",
		icon: <Star className={SIZING.ICON.sm} />,
		options: roleOptions,
	},
	{
		label: "Sort",
		value: "sort",
		icon: <SlidersHorizontal className={SIZING.ICON.sm} />,
		options: sortOptions,
	},
];

// Search icon for the filter bar inline search input
export const filterSearchIcon = <Search className={SIZING.ICON.md} />;

// ─── Label Maps (used when building active filter tags) ───────────────────────

// Human-readable labels for active experience filter chips
export const experienceLabels: Record<string, string> = {
	entry: "Entry Level",
	junior: "Junior",
	mid: "Mid-Level",
	senior: "Senior",
	expert: "Expert",
};

// Human-readable labels for active sort filter chips
export const sortLabels: Record<string, string> = {
	"experience-high": "Experience ↓",
	"experience-low": "Experience ↑",
	"name-asc": "Name A-Z",
	"name-desc": "Name Z-A",
};

// ─── Keyword Maps (used for client-side filtering logic) ──────────────────────

// Region keyword map — location strings matched against these to assign region
export const regionMap: Record<string, string[]> = {
	"north-america": [
		"usa",
		"canada",
		"mexico",
		"united states",
		"u.s.",
		"u.s.a",
		"america",
		// US major cities — many records only store the city
		"new york",
		"california",
		"texas",
		"seattle",
		"chicago",
		"san francisco",
		"los angeles",
		"boston",
		"austin",
		// Canadian cities
		"toronto",
		"vancouver",
		"montreal",
	],
	europe: [
		"uk",
		"united kingdom",
		"england",
		"germany",
		"france",
		"spain",
		"italy",
		"poland",
		"netherlands",
		"europe",
		"sweden",
		"norway",
		"denmark",
		"finland",
		"switzerland",
		"austria",
		"belgium",
		"portugal",
		"ireland",
		"czech",
		"greece",
		"romania",
		"hungary",
		"ukraine",
		"russia",
		"turkey",
		// Major EU cities
		"london",
		"berlin",
		"paris",
		"amsterdam",
		"madrid",
		"rome",
		"warsaw",
		"stockholm",
	],
	asia: [
		"india",
		"china",
		"japan",
		"korea",
		"singapore",
		"asia",
		"vietnam",
		"thailand",
		"indonesia",
		"philippines",
		"malaysia",
		"taiwan",
		"hong kong",
		"bangladesh",
		"pakistan",
		"sri lanka",
		// Major Asian cities
		"mumbai",
		"delhi",
		"bangalore",
		"hyderabad",
		"chennai",
		"beijing",
		"tokyo",
		"seoul",
		"shanghai",
		"shenzhen",
	],
	"south-america": [
		"brazil",
		"argentina",
		"chile",
		"colombia",
		"peru",
		"venezuela",
		"ecuador",
		"uruguay",
		"bolivia",
		"south america",
		// Major SA cities
		"sao paulo",
		"buenos aires",
		"bogota",
		"lima",
	],
	africa: [
		"south africa",
		"egypt",
		"nigeria",
		"kenya",
		"africa",
		"ethiopia",
		"ghana",
		"tanzania",
		"morocco",
		"algeria",
		"mozambique",
		// Major African cities
		"johannesburg",
		"cairo",
		"lagos",
		"nairobi",
		"cape town",
	],
	oceania: [
		"australia",
		"new zealand",
		"oceania",
		"pacific",
		// Major Oceania cities
		"sydney",
		"melbourne",
		"brisbane",
		"perth",
		"auckland",
	],
};

// Role keyword map — role + description strings matched against these to assign category
export const roleMap: Record<string, string[]> = {
	engineering: [
		"engineer",
		"developer",
		"programmer",
		"software",
		"frontend",
		"front-end",
		"front end",
		"backend",
		"back-end",
		"back end",
		"fullstack",
		"full-stack",
		"full stack",
		"devops",
		"dev ops",
		"sre",
		"infrastructure",
		"platform",
		"architect",
		"mobile",
		"android",
		"ios",
		"cloud",
		"embedded",
		"systems",
		"web developer",
	],
	design: [
		"designer",
		"ux",
		"ui",
		"ux/ui",
		"ui/ux",
		"graphic",
		"visual",
		"creative",
		"interaction",
		"product designer",
	],
	product: [
		"product manager",
		"product owner",
		"pm",
		"scrum master",
		"agile coach",
		// Avoid matching "product engineer" etc — keep short tokens last
		"product lead",
	],
	data: [
		"data scientist",
		"data analyst",
		"data engineer",
		"analytics",
		"machine learning",
		"ml engineer",
		"deep learning",
		"artificial intelligence",
		"ai engineer",
		"researcher",
		"bi analyst",
		"business intelligence",
		"statistician",
	],
	management: [
		"manager",
		"director",
		"team lead",
		"lead",
		"cto",
		"ceo",
		"coo",
		"vp",
		"vice president",
		"head of",
		"principal",
		"chief",
	],
	marketing: [
		"marketing",
		"growth",
		"content",
		"copywriter",
		"seo",
		"brand",
		"communications",
		"social media",
	],
	sales: [
		"sales",
		"account executive",
		"account manager",
		"business development",
		"revenue",
	],
};
