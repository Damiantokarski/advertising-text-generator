import React from "react";

type ListItemProps = {
	children: React.ReactNode;
	icon?: React.ReactNode;
	className?: string;
};

const ListItem = ({ children, icon, className = "" }: ListItemProps) => {
	return (
		<li className={className}>
			{icon && <span className="mt-1">{icon}</span>}
			<span>{children}</span>
		</li>
	);
};

export default ListItem;
