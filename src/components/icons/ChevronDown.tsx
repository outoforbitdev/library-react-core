import { ChevronBase } from "./ChevronBase";
import { IIconProps } from "./Icon";

export function ChevronDown(props: IIconProps) {
  return <ChevronBase {...props} rotateDegrees={90} />;
}
