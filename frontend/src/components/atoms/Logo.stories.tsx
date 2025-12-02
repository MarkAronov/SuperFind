import { Logo } from "./Logo";

export default {
	title: "Atoms/Logo",
	component: Logo,
};

export const Small = () => <Logo size="sm" />;
export const Medium = () => <Logo size="md" />;
export const Large = () => <Logo size="lg" />;
