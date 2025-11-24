import { useState, type ReactElement, type ReactNode } from "react";
import { createPortal } from "react-dom";

import { Icon } from "../ui/Icon";
import {
	ModalContext,
	type ModalContextType,
	type ModalProps,
} from "../hooks/useModal";

interface ModalProviderProps {
	children: ReactNode;
}

export const ModalProvider = ({ children }: ModalProviderProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [modalProps, setModalProps] = useState<ModalProps>({});

	const openModal = (props: ModalProps) => {
		setModalProps(props);
		setIsOpen(true);
	};

	const closeModal = () => {
		setIsOpen(false);
	};

	const value: ModalContextType = {
		openModal,
		closeModal,
	};

	return (
		<ModalContext.Provider value={value}>
			{children}
			{isOpen && <Modal {...modalProps} onClose={closeModal} />}
		</ModalContext.Provider>
	);
};

interface InnerModalProps extends ModalProps {
	onClose: () => void;
}

const Modal = ({
	title,
	content,
	onClose,
	className,
}: InnerModalProps): ReactElement => {
	if (typeof document === "undefined") return <></>;

	return createPortal(
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			<div className="absolute inset-0 bg-gray-600/40" onClick={onClose} />

			<div
				className={`relative z-10 w-full rounded-lg bg-white shadow-md p-6 ${className ?? "max-w-lg"}`}
			>
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-2xl font-bold text-primary-ocean">
						{title ?? "Modal"}
					</h2>
					<button
						onClick={onClose}
						className="text-gray-500 hover:text-red-500 text-xl leading-none cursor-pointer"
					>
						<Icon type="close" />
					</button>
				</div>
				<div className="text-gray-700 text-sm">{content ?? "Brak treści"}</div>
			</div>
		</div>,
		document.body
	);
};
