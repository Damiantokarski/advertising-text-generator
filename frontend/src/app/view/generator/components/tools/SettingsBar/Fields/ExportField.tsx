import { useState, type RefObject } from "react";
import { FieldWrapper } from "../../../../../../ui/FieldWrapper";
import { Input } from "../../../../../../ui/Input/Input";
import { Icon } from "../../../../../../ui/Icon";
import { Select } from "../../../../../../ui/Select/Select";
import Konva from "konva";
import { useCanvaExport } from "../../../../hooks/useCanvaExport";

const exportScales = ["0.5", "0.75", "1", "1.5", "2", "3", "4", "5"];
const exportFormat = ["png", "jpeg"];

interface ExportFieldProps {
	stageRef: RefObject<Konva.Stage | null>;
}

export const ExportField = ({ stageRef }: ExportFieldProps) => {
	const [name, setName] = useState("text");
	const [format, setFormat] = useState<(typeof exportFormat)[number]>("png");
	const [exportScale, setExportScale] =
		useState<(typeof exportScales)[number]>("1");

	const { exportSelection, hasSelection } = useCanvaExport(stageRef);

	const handleExportClick = () => {
		exportSelection({
			name,
			format,
			scale: Number(exportScale),
		});
	};

	return (
		<FieldWrapper title="Export" className="flex flex-col gap-3">
			<Input
				type="text"
				inputPrefix={<Icon type="text" />}
				value={name}
				onChange={(e) => setName(e.target.value)}
				inputSize="small"
			/>
			<div className="flex gap-3">
				<Select
					optionsList={exportScales}
					defaultValue={exportScale}
					onChange={(value) => setExportScale(value)}
					small
				/>
				<Select
					optionsList={exportFormat}
					defaultValue={format}
					onChange={(value) => setFormat(value as (typeof exportFormat)[number])}
					small
				/>
			</div>
			<button
				onClick={handleExportClick}
				disabled={!hasSelection}
				className="px-4 py-1.5 text-xs text-white rounded cursor-pointer bg-primary-blue hover:bg-primary-blue-shy disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
			>
				Export
			</button>
		</FieldWrapper>
	);
};
