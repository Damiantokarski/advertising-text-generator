import React, { useCallback, useRef, useState, useEffect } from "react";
import { HexAlphaColorPicker } from "react-colorful";
import { useUpdateText } from "../../../../hooks/useActiveCanvas";
import { useClickOutside } from "../../../../../../hooks/useClickOutside";
import { FieldWrapper } from "../../../../../../ui/FieldWrapper";
import { Input } from "../../../../../../ui/Input/Input";

export const ColorField = () => {
	const fillRef = useRef<HTMLDivElement | null>(null);
	const { value, updateValue, disabled } = useUpdateText();
	const color = value?.color ?? "#b1b1b1";

	const [inputValue, setInputValue] = useState(color);
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		setInputValue(color);
	}, [color]);

	const toggleColorPicker = useCallback(() => {
		if (!disabled) setIsOpen((o) => !o);
	}, [disabled]);

	const handleSelectColor = useCallback(
		(newColor: string) => {
			if (!newColor.startsWith("#")) return;
			updateValue({ color: newColor });
		},
		[updateValue]
	);

	const handleInputChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			setInputValue(e.target.value);
		},
		[]
	);

	const handleInputBlur = useCallback(() => {
		if (inputValue.startsWith("#")) {
			updateValue({ color: inputValue });
		} else {
			setInputValue(color);
		}
	}, [inputValue, updateValue, color]);

	useClickOutside(fillRef, () => setIsOpen(false));

	return (
		<FieldWrapper ref={fillRef} title="Fill">
			<div className="flex items-center w-full gap-2  rounded-sm">
				<Input
					type="text"
					value={inputValue}
					disabled={disabled}
					maxLength={9}
					onChange={handleInputChange}
					onBlur={handleInputBlur}
					inputSize="small"
					inputPrefix={
						<button
							onClick={toggleColorPicker}
							disabled={disabled}
							className="w-4 h-4 rounded-sm cursor-pointer mr-1"
							style={{ backgroundColor: color }}
						/>
					}
				/>
			</div>

			{isOpen && !disabled && (
				<div className="fixed p-4 right-80 bg-surface -mt-8 rounded-lg shadow custom-layout border-2 border-primary-blue-sky">
					<HexAlphaColorPicker color={color} onChange={handleSelectColor} />
				</div>
			)}
		</FieldWrapper>
	);
};
