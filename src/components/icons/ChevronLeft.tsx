import { ChevronBase } from "./ChevronBase";
import { IIconProps } from "./Icon";

export function ChevronLeft(props: IIconProps) {
  return <ChevronBase {...props} rotateDegrees={180} />;
}
