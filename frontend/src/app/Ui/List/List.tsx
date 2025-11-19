import React from "react";

type ListProps = {
	children: React.ReactNode;
	type?: "ul" | "ol";
	className?: string;
};

const List = ({ children, type = "ul", className = "" }: ListProps) => {
	const Tag = type;
	return <Tag className={`space-y-1 ${className}`}>{children}</Tag>;
};

export default List;
