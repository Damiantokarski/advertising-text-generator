import type { ChangeEvent } from "react";
import { FieldWrapper } from "../../../../../../ui/FieldWrapper";
import { Input } from "../../../../../../ui/Input/Input";
import { useUpdateText } from "../../../../hooks/useActiveCanvas";


export const SizeField = () => {
  const { value, updateValue, disabled } = useUpdateText();
  const width = value?.size.width ?? 0;
  const height = value?.size.height ?? 0;

  const onChangeWidth = (e: ChangeEvent<HTMLInputElement>) =>
    updateValue({
      size: {
        width: Number(e.target.value),
        height: Number(height),
      },
    });

  const onChangeHeight = (e: ChangeEvent<HTMLInputElement>) => {
    updateValue({
      size: {
        width: Number(width),
        height: Number(e.target.value),
      },
    });
  };
  return (
    <FieldWrapper title="Size" className="flex gap-3">
      <Input
        type="number"
        inputPrefix={<p>W:</p>}
        value={Math.floor(width)}
        onChange={onChangeWidth}
        disabled={disabled}
        inputSize="small"
      />
      <Input
        type="number"
        inputPrefix={<p>H:</p>}
        value={Math.floor(height)}
        onChange={onChangeHeight}
        disabled={disabled}
        inputSize="small"
      />
    </FieldWrapper>
  );
};
