import type { Meta, StoryObj } from "@storybook/react";
import { cn } from "@/lib/utils";
import { CURSOR } from "../1-ions/cursor";
import { Tooltip, TooltipContent, TooltipTrigger } from "./Tooltip";

const meta = {
	title: "atoms/Tooltip",
	component: Tooltip,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<Tooltip delayDuration={200}>
			<TooltipTrigger asChild>
				<span className={cn("underline", CURSOR.help)}>
					Hover or long-press me
				</span>
			</TooltipTrigger>
			<TooltipContent>This is a tooltip message</TooltipContent>
		</Tooltip>
	),
};

export const LongContent: Story = {
	render: () => (
		<Tooltip delayDuration={200}>
			<TooltipTrigger asChild>
				<span className={cn("underline", CURSOR.help)}>
					Hover for longer text
				</span>
			</TooltipTrigger>
			<TooltipContent>
				This is a much longer tooltip that might wrap on some screens
			</TooltipContent>
		</Tooltip>
	),
};

export const TopPosition: Story = {
	render: () => (
		<Tooltip>
			<TooltipTrigger asChild>
				<span className={cn("underline", CURSOR.help)}>Positioned above</span>
			</TooltipTrigger>
			<TooltipContent>Hover me</TooltipContent>
		</Tooltip>
	),
};

export const BottomPosition: Story = {
	render: () => (
		<Tooltip>
			<TooltipTrigger asChild>
				<span className={cn("underline", CURSOR.help)}>Positioned below</span>
			</TooltipTrigger>
			<TooltipContent>Hover me</TooltipContent>
		</Tooltip>
	),
};

export const LeftPosition: Story = {
	render: () => (
		<Tooltip>
			<TooltipTrigger asChild>
				<span className={cn("underline", CURSOR.help)}>Positioned left</span>
			</TooltipTrigger>
			<TooltipContent>Hover me</TooltipContent>
		</Tooltip>
	),
};

export const RightPosition: Story = {
	render: () => (
		<Tooltip>
			<TooltipTrigger asChild>
				<span className={cn("underline", CURSOR.help)}>Positioned right</span>
			</TooltipTrigger>
			<TooltipContent>Hover me</TooltipContent>
		</Tooltip>
	),
};
