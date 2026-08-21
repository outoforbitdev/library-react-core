import { useId } from "react";
import {
  getDomProps,
  IChildlessComponentProps,
  IComponentProps,
} from "../IComponent";
import styles from "./icon.module.css";

export interface IIconProps extends IChildlessComponentProps {
  bordered?: boolean;
  clickable?: boolean;
  inverted?: boolean;
  size?: IconSize;
}

interface IIconInternalProps extends IComponentProps {
  externalProps: IIconProps;
  preventInvert?: boolean;
  viewBoxSize: number;
}

export enum IconSize {
  ExtraSmall = "xs",
  Small = "s",
  Medium = "m",
  Large = "l",
  ExtraLarge = "xl",
}

export function Icon(props: IIconInternalProps) {
  const maskId = useId();
  const sizeClass = getClassFromSize(props.externalProps.size);
  const isInverted = props.externalProps.inverted && !props.preventInvert;
  const isBordered = props.externalProps.bordered;
  const cornerRadius = props.viewBoxSize / 4;

  const getColor = (mode: "text" | "background") => {
    if (mode === "text") {
      return "var(--ood-text, currentColor)";
    }
    return "var(--ood-background, none)";
  };

  const iconColor = isInverted ? getColor("background") : getColor("text");
  const backgroundColor = isInverted
    ? getColor("text")
    : getColor("background");
  const borderColor = isInverted ? getColor("background") : getColor("text");

  const background = isInverted ? (
    <rect
      x={2}
      y={2}
      height={props.viewBoxSize - 4}
      width={props.viewBoxSize - 4}
      rx={cornerRadius}
      fill={backgroundColor}
      mask={`url(#${maskId})`}
    />
  ) : null;

  const border = isBordered ? (
    <rect
      x={2}
      y={2}
      height={props.viewBoxSize - 4}
      width={props.viewBoxSize - 4}
      rx={cornerRadius}
      fill="none"
      stroke={borderColor}
      strokeWidth={4}
    />
  ) : null;

  const clickableClass = props.externalProps.clickable
    ? styles.clickable
    : undefined;

  return (
    <svg
      stroke={iconColor}
      fill={iconColor}
      viewBox={`0 0 ${props.viewBoxSize} ${props.viewBoxSize}`}
      strokeWidth={10}
      {...getDomProps(props.externalProps, sizeClass, clickableClass)}
    >
      {isInverted ? (
        <defs>
          <mask id={maskId}>
            <rect
              x={0}
              y={0}
              height={props.viewBoxSize}
              width={props.viewBoxSize}
              fill="white"
            />
            <g stroke="black" fill="black">
              {props.children}
            </g>
          </mask>
        </defs>
      ) : null}
      {background}
      {!isInverted ? props.children : null}
      {border}
    </svg>
  );
}

function getClassFromSize(size?: IconSize) {
  switch (size) {
    case IconSize.ExtraSmall:
      return styles.xs;
    case IconSize.Small:
      return styles.s;
    case IconSize.Large:
      return styles.l;
    case IconSize.ExtraLarge:
      return styles.xl;
    case IconSize.Medium:
    default:
      return styles.m;
  }
}
