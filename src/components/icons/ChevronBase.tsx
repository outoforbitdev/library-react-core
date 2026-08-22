import { Icon, IIconProps } from "./Icon";

interface ChevronBaseProps extends IIconProps {
  rotateDegrees: number;
}

export function ChevronBase({ rotateDegrees, ...props }: ChevronBaseProps) {
  return (
    <Icon externalProps={props} viewBoxSize={100}>
      <g transform={`rotate(${rotateDegrees} 50 50)`}>
        <polyline
          points="30,20 70,50 30,80"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </Icon>
  );
}
