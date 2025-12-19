import { memo, type SVGProps } from "react";
import type { IconType as ReactIconComponent } from "react-icons";

import {
	PiAngle, // angle
	PiArrowClockwise, //rorate
	PiArrowsOutLineVerticalFill, // space vertical
	PiArrowsOutLineHorizontal, // space horizontal
	PiBoxArrowDown, // save
	PiCaretDown, // arrow down
	PiCaretRight, // arrow right
	PiCaretLeft, // arrow left
	PiCaretUp, // arrow up
	PiEye, //eye
	PiEyeClosed, // close eye
	PiHouse, //home
	PiLinkSimple, //link
	PiLockSimple, //lock
	PiLockSimpleOpen, //lock open
	PiMagnifyingGlass, // search
	PiPencilSimple, // pencil
	PiPlus, // add
	PiMinus,
	PiRectangle, // template
	PiSignOut, // logout
	PiSun, // sun
	PiMoon, // moon
	PiTextAlignCenter, //center
	PiTextAlignJustify, //justify
	PiTextAlignLeft, //left
	PiTextAlignRight, //right
	PiTextHOne,
	PiTextHTwo,
	PiTextHThree,
	PiTextHFour,
	PiTextHFive,
	PiTextHSix,
	PiTextUnderline,
	PiTextT,
	PiX, //close
	PiTextAa, // font
	PiTrash, // trash
	PiFileArrowUpDuotone, //upload file
	PiTextH, // height
	PiCloudArrowDown, // cloud
	PiSelectionBackground,
	PiSelectionForeground,
	PiFlipHorizontal,
	PiFlipVertical,
} from "react-icons/pi";

const IconType = {
	TextLeft: "textLeft",
	TextRight: "textRight",
	TextCenter: "textCenter",
	TextJustify: "textJustify",

	Header: "header",

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

	Logout: "logout",
};

export type IconType = (typeof IconType)[keyof typeof IconType];

interface IconProps extends SVGProps<SVGElement> {
	type: IconType;
}
const ICON_MAP: Record<IconType, ReactIconComponent> = {
	[IconType.TextLeft]: PiTextAlignLeft,
	[IconType.TextRight]: PiTextAlignRight,
	[IconType.TextCenter]: PiTextAlignCenter,
	[IconType.TextJustify]: PiTextAlignJustify,

	[IconType.ArrowDown]: PiCaretDown,
	[IconType.ArrowLeft]: PiCaretLeft,
	[IconType.ArrowRight]: PiCaretRight,
	[IconType.ArrowUp]: PiCaretUp,

	[IconType.TextSize]: PiTextAa,

	[IconType.Text]: PiTextT,
	[IconType.Header]: PiTextH,
	[IconType.Rectangle]: PiRectangle,

	[IconType.Eye]: PiEye,
	[IconType.EyeClosed]: PiEyeClosed,
	[IconType.LockClosed]: PiLockSimple,
	[IconType.LockOpen]: PiLockSimpleOpen,
	[IconType.Close]: PiX,

	[IconType.Trash]: PiTrash,
	[IconType.Angle]: PiAngle,

	[IconType.FlipHorizontal]: PiFlipHorizontal,
	[IconType.FlipVertical]: PiFlipVertical,
	[IconType.Rotate]: PiArrowClockwise,
	[IconType.LineHeight]: PiArrowsOutLineVerticalFill,
	[IconType.LetterSpacing]: PiArrowsOutLineHorizontal,
	[IconType.Psd]: PiFileArrowUpDuotone,

	[IconType.Save]: PiBoxArrowDown,
	[IconType.Pencil]: PiPencilSimple,
	[IconType.MagnifyingGlass]: PiMagnifyingGlass,
	[IconType.Plus]: PiPlus,
	[IconType.Minus]: PiMinus,

	[IconType.Header1]: PiTextHOne,
	[IconType.Header2]: PiTextHTwo,
	[IconType.Header3]: PiTextHThree,
	[IconType.Header4]: PiTextHFour,
	[IconType.Header5]: PiTextHFive,
	[IconType.Header6]: PiTextHSix,
	[IconType.TextUnderline]: PiTextUnderline,
	[IconType.StackPop]: PiSelectionBackground,
	[IconType.StackPush]: PiSelectionForeground,

	[IconType.Copy]: PiLinkSimple,
	[IconType.CloudDown]: PiCloudArrowDown,

	[IconType.SunHigh]: PiSun,
	[IconType.Moon]: PiMoon,
	[IconType.HomeMove]: PiHouse,

	[IconType.Logout]: PiSignOut,
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
