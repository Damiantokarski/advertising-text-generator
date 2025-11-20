import { type UseFormRegisterReturn } from "react-hook-form";
import { Icon } from "./Icon";

type CheckboxProps = {
	id?: string;
	label?: string;
	register: UseFormRegisterReturn;
};

export const Checkbox = ({ label = "Label", id, register }: CheckboxProps) => {
	return (
		<div className="flex">
			<label className="flex items-center gap-2 cursor-pointer">
				<input type="checkbox" className="sr-only peer" id={id} {...register} />

				<span className="w-4 h-4 flex items-center justify-center rounded-sm border border-primary-blue-sky bg-white peer-checked:bg-primary-blue-sky peer-checked:border-primary-blue-sky transition-colors">
					<Icon
						type="check"
						className="text-white text-sm opacity-0 peer-checked:opacity-100 transition-opacity"
					/>
				</span>

				<span className="text-sm select-none">{label}</span>
			</label>
		</div>
	);
};
