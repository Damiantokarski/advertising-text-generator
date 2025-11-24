import { createContext, useContext, type ReactNode } from "react";

export const ModalContext = createContext<ModalContextType | undefined>(
	undefined
);

export type ModalProps = {
    title?: string;
    content?: ReactNode;
    className?: string;   
};

export type ModalContextType = {
	openModal: (props: ModalProps) => void;
	closeModal: () => void;
};

export const useModal = () => {
	const ctx = useContext(ModalContext);
	if (!ctx) {
		throw new Error("useModal must be used inside ModalProvider");
	}
	return ctx;
};
