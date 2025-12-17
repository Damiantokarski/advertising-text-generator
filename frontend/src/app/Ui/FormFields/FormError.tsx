interface FormErrorProps {
  id: string;
  error: string;
}

export const FormError = ({ id, error }: FormErrorProps) => (
  <p id={`${id}-error`} className="text-fire text-xs mt-1" role="alert">
    {error}
  </p>
);
