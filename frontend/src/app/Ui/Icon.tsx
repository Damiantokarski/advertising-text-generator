import React, { type JSX, memo } from "react";
import {
	PiTextAlignLeft,
	PiTextAlignRight,
	PiTextAlignCenter,
	PiTextAlignJustify,
	PiCaretDown,
	PiCaretLeft,
	PiCaretRight,
	PiCaretUp,
	PiX,
	PiTextT,
	PiAngle,
	PiArrowsOutLineVertical,
	PiArrowsOutLineHorizontal,
	PiArrowsInLineHorizontal,
	PiArrowsInLineVertical,
	PiArrowClockwiseFill,
	PiCaretDownFill,
	PiMagnifyingGlass,
	PiRectangle,
	PiEye,
	PiEyeClosed,
	PiDotsThreeBold,
	PiWarningDiamond,
	PiXCircle,
	PiSealCheck,
	PiQuestion,
	PiSwap,
	PiArrowsIn,
	PiFrameCorners,
	PiGearSix,
	PiSignOut,
	PiFileMagnifyingGlass,
	PiTrashSimple,
	PiListBullets,
	PiCheckBold,
	PiArrowsClockwise,
	PiPlusBold,
	PiFileArrowUpDuotone,
	PiNotePencil,
	PiCloudArrowDown,
	PiFloppyDisk,
} from "react-icons/pi";
import { TbTextSize } from "react-icons/tb";
import { RxLockClosed, RxLockOpen1 } from "react-icons/rx";
import { BsFiletypePsd, BsFileEarmarkFont } from "react-icons/bs";

const IconType = {
	TextLeft: "textLeft",
	TextRight: "textRight",
	TextCenter: "textCenter",
	TextJustify: "textJustify",
	ArrowDown: "arrowDown",
	ArrowLeft: "arrowLeft",
	ArrowRight: "arrowRight",
	ArrowUp: "arrowUp",
	Close: "close",
	Text: "text",
	Angle: "angle",
	LineHeight: "lineHeight",
	LetterSpacing: "letterSpacing",
	TextSize: "textSize",
	FlipHorizontal: "flipHorizontal",
	FlipVertical: "flipVertical",
	Rotate: "rotate",
	CaretDownFill: "caretDownFill",
	MagnifyingGlass: "magnifyingGlass",
	Rectangle: "rectangle",
	LockClosed: "lockClosed",
	LockOpen: "lockOpen",
	Trash: "trash",
	Eye: "eye",
	EyeClosed: "eyeClosed",
	FiletypePsd: "filetypePsd",
	FileEarmarkFont: "fileEarmarkFont",
	DotsThreeBold: "dotsThreeBold",
	AlertWarning: "alertWarning",
	AlertError: "alertError",
	AlertSuccess: "alertSuccess",
	AlertInfo: "alertInfo",
	Swap: "swap",
	ArrowsIn: "arrowsIn",
	FrameCorners: "frameCorners",
	Gear: "gear",
	SignOut: "signOut",
	FileMagnifyingGlass: "fileMagnifyingGlass",
	ListBullets: "listBullets",
	Check: "check",
	Clockwise: "clockwise",
	Plus: "plus",
	FileArrowUpDuotone: "fileArrowUpDuotone",
	NotePencil: "notePencil",
	CloudArrowDown: "cloudArrowDown",
	FloppyDisk: "floppyDisk",
};

export type IconType = (typeof IconType)[keyof typeof IconType];

interface IconProps extends React.SVGProps<SVGElement> {
	type: IconType;
}

const ICON_MAP: Record<IconType, JSX.Element> = {
	// generator
	[IconType.TextLeft]: <PiTextAlignLeft />,
	[IconType.TextRight]: <PiTextAlignRight />,
	[IconType.TextCenter]: <PiTextAlignCenter />,
	[IconType.TextJustify]: <PiTextAlignJustify />,

	[IconType.FlipHorizontal]: <PiArrowsInLineHorizontal />,
	[IconType.FlipVertical]: <PiArrowsInLineVertical />,
	[IconType.LineHeight]: <PiArrowsOutLineVertical />,
	[IconType.LetterSpacing]: <PiArrowsOutLineHorizontal />,
	[IconType.TextSize]: <TbTextSize />,
	[IconType.Rotate]: <PiArrowClockwiseFill />,
	[IconType.Angle]: <PiAngle />,
	[IconType.Text]: <PiTextT />,
	[IconType.Rectangle]: <PiRectangle />,

	// arrows
	[IconType.ArrowDown]: <PiCaretDown />,
	[IconType.ArrowLeft]: <PiCaretLeft />,
	[IconType.ArrowRight]: <PiCaretRight />,
	[IconType.ArrowUp]: <PiCaretUp />,

	// alerts
	[IconType.AlertWarning]: <PiWarningDiamond />,
	[IconType.AlertError]: <PiXCircle />,
	[IconType.AlertSuccess]: <PiSealCheck />,
	[IconType.AlertInfo]: <PiQuestion />,
	[IconType.FiletypePsd]: <BsFiletypePsd />,
	[IconType.FileEarmarkFont]: <BsFileEarmarkFont />,
	[IconType.FileArrowUpDuotone]: <PiFileArrowUpDuotone />,

	[IconType.LockClosed]: <RxLockClosed />,
	[IconType.LockOpen]: <RxLockOpen1 />,
	[IconType.Eye]: <PiEye />,
	[IconType.EyeClosed]: <PiEyeClosed />,

	// functionality
	[IconType.Close]: <PiX />,
	[IconType.Plus]: <PiPlusBold />,
	[IconType.Trash]: <PiTrashSimple />,
	[IconType.DotsThreeBold]: <PiDotsThreeBold />,
	[IconType.MagnifyingGlass]: <PiMagnifyingGlass />,
	[IconType.SignOut]: <PiSignOut />,
	[IconType.Check]: <PiCheckBold />,
	[IconType.Clockwise]: <PiArrowsClockwise />,

	//menu icons
	[IconType.FileMagnifyingGlass]: <PiFileMagnifyingGlass />,
	[IconType.Swap]: <PiSwap />,
	[IconType.Gear]: <PiGearSix />,
	[IconType.ArrowsIn]: <PiArrowsIn />,
	[IconType.ListBullets]: <PiListBullets />,
	[IconType.CaretDownFill]: <PiCaretDownFill />,
	[IconType.FrameCorners]: <PiFrameCorners />,
	[IconType.NotePencil]: <PiNotePencil />,
	[IconType.CloudArrowDown]: <PiCloudArrowDown />,
	[IconType.FloppyDisk]: <PiFloppyDisk />,
};

const IconComponent = ({ type, ...rest }: IconProps) => {
	const IconSvg = ICON_MAP[type] ?? null;
	if (!IconSvg) {
		console.warn(`Icon: Unknown icon type "${type}"`);
		return null;
	}

	return React.cloneElement(IconSvg, { ...rest });
};

export const Icon = memo(IconComponent);
