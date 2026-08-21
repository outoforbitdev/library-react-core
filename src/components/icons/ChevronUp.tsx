import { ChevronBase } from "./ChevronBase";
import { IIconProps } from "./Icon";

export function ChevronUp(props: IIconProps) {
  return <ChevronBase {...props} rotateDegrees={270} />;
}
