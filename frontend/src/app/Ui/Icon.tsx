import { memo, type SVGProps } from "react";
import type { IconType as ReactIconComponent } from "react-icons";
import {
	// wyrównanie tekstu
	TbAlignCenter,
	TbAlignJustified,
	TbAlignLeft,
	TbAlignRight,

	// strzałki wypełnione
	TbCaretDownFilled,
	TbCaretLeftFilled,
	TbCaretRightFilled,
	TbCaretUpFilled,

	// obracanie i przekształcanie
	TbFlipHorizontal,
	TbFlipVertical,
	TbLetterSpacing,
	TbLineHeight,
	TbRotate,
	TbChartPpf,

	// wielkość tekstu
	TbH1,
	TbH2,
	TbH3,
	TbH4,
	TbH5,
	TbH6,
	TbTextSize,
	TbUnderline,

	//
	TbLetterT,
	TbLetterH,
	TbLetterW,
	TbLetterX,
	TbLetterY,

	// trmplate
	TbCrop11,
	TbSquares,

	// index
	TbStackPop,
	TbStackPush,

	// udostępnianie linku
	TbLink,
	TbBrandAdobePhotoshop,

	// zamukanie/wylogowanie
	TbLogout,

	// kolory
	TbPalette,

	// widoczność
	TbEye,
	TbEyeClosed,
	TbLock,
	TbLockOpen,

	//edycja
	TbPencil,
	TbTrash,
	TbUpload,
	TbX,
	TbZoom,
	TbPlus,
	TbMinus,
	TbCloudDown,

	// mode
	TbSunHigh,
	TbMoon,
	TbDownload,
	TbHomeMove,
} from "react-icons/tb";

const IconType = {
	TextLeft: "textLeft",
	TextRight: "textRight",
	TextCenter: "textCenter",
	TextJustify: "textJustify",
	Width: "width",
	Height: "height",
	XPos: "xPos",
	YPos: "yPos",
	Palette: "palette",

	ArrowDown: "arrowDown",
	ArrowLeft: "arrowLeft",
	ArrowRight: "arrowRight",
	ArrowUp: "arrowUp",
	Close: "close",
	Text: "text",
	TextUnderline: "textUnderline",
	Angle: "angle",
	LineHeight: "lineHeight",
	LetterSpacing: "letterSpacing",
	TextSize: "textSize",
	FlipHorizontal: "flipHorizontal",
	FlipVertical: "flipVertical",
	Rotate: "rotate",
	MagnifyingGlass: "magnifyingGlass",
	Rectangle: "rectangle",
	LockClosed: "lockClosed",
	LockOpen: "lockOpen",
	Trash: "trash",
	Eye: "eye",
	EyeClosed: "eyeClosed",
	Psd: "psd",
	Pencil: "pencil",
	Save: "save",
	Plus: "plus",
	Minus: "minus",
	Clockwise: "clockwise",

	Header1: "header1",
	Header2: "header2",
	Header3: "header3",
	Header4: "header4",
	Header5: "header5",
	Header6: "header6",

	StackPop: "stackPop",
	StackPush: "stackPush",

	Link: "link",
	Copy: "copy",
	CloudDown: "cloudArrowDown",

	SunHigh: "sunHigh",
	Moon: "moon",
	HomeMove: "homeMove",
};

export type IconType = (typeof IconType)[keyof typeof IconType];

interface IconProps extends SVGProps<SVGElement> {
	type: IconType;
}
const ICON_MAP: Record<IconType, ReactIconComponent> = {
	[IconType.TextLeft]: TbAlignLeft,
	[IconType.TextRight]: TbAlignRight,
	[IconType.TextCenter]: TbAlignCenter,
	[IconType.TextJustify]: TbAlignJustified,

	[IconType.ArrowDown]: TbCaretDownFilled,
	[IconType.ArrowLeft]: TbCaretLeftFilled,
	[IconType.ArrowRight]: TbCaretRightFilled,
	[IconType.ArrowUp]: TbCaretUpFilled,

	[IconType.TextSize]: TbTextSize,
	[IconType.Palette]: TbPalette,

	[IconType.Text]: TbLetterT,
	[IconType.Width]: TbLetterW,
	[IconType.Height]: TbLetterH,
	[IconType.XPos]: TbLetterX,
	[IconType.YPos]: TbLetterY,
	[IconType.Rectangle]: TbCrop11,

	[IconType.Eye]: TbEye,
	[IconType.EyeClosed]: TbEyeClosed,
	[IconType.LockClosed]: TbLock,
	[IconType.LockOpen]: TbLockOpen,
	[IconType.Close]: TbX,

	[IconType.Trash]: TbTrash,
	[IconType.Angle]: TbChartPpf,

	[IconType.FlipHorizontal]: TbFlipHorizontal,
	[IconType.FlipVertical]: TbFlipVertical,
	[IconType.Rotate]: TbRotate,
	[IconType.LineHeight]: TbLineHeight,
	[IconType.LetterSpacing]: TbLetterSpacing,
	[IconType.Psd]: TbBrandAdobePhotoshop,

	[IconType.Save]: TbDownload,
	[IconType.Pencil]: TbPencil,
	[IconType.MagnifyingGlass]: TbZoom,
	[IconType.Plus]: TbPlus,
	[IconType.Minus]: TbMinus,

	[IconType.Header1]: TbH1,
	[IconType.Header2]: TbH2,
	[IconType.Header3]: TbH3,
	[IconType.Header4]: TbH4,
	[IconType.Header5]: TbH5,
	[IconType.Header6]: TbH6,
	[IconType.TextUnderline]: TbUnderline,
	[IconType.StackPop]: TbStackPop,
	[IconType.StackPush]: TbStackPush,

	[IconType.Link]: TbLink,
	[IconType.Copy]: TbSquares,
	[IconType.CloudDown]: TbCloudDown,

	[IconType.SunHigh]: TbSunHigh,
	[IconType.Moon]: TbMoon,
	[IconType.HomeMove]: TbHomeMove,
};

const IconComponent = ({ type, ...rest }: IconProps) => {
	const IconSvg = ICON_MAP[type];
	if (!IconSvg) {
		console.warn(`Icon: Unknown icon type "${type}"`);
		return null;
	}
	return <IconSvg {...rest} />;
};

export const Icon = memo(IconComponent);
