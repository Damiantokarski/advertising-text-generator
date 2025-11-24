import type { ComponentPropsWithoutRef } from "react";

export type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

interface TitleProps extends ComponentPropsWithoutRef<HeadingTag> {
	as?: HeadingTag;
	title: string;
}

export const Title = ({ as = "h1", title, ...props }: TitleProps) => {
	const Tag = as;
	return <Tag {...props}>{title}</Tag>;
};
