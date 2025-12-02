import { Input } from "./Input";

export default {
	title: "Atoms/Input",
	component: Input,
};

export const Default = () => (
	<div className="w-full max-w-sm">
		<Input type="email" placeholder="Email" />
	</div>
);

export const WithValue = () => (
	<div className="w-full max-w-sm">
		<Input type="text" value="Read only value" readOnly />
	</div>
);

export const Disabled = () => (
	<div className="w-full max-w-sm">
		<Input type="text" placeholder="Disabled" disabled />
	</div>
);
