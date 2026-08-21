import { Icon, IIconProps } from "./Icon";

export function Error(props: IIconProps) {
  return (
    <Icon externalProps={props} viewBoxSize={100}>
      <g strokeWidth={6}>
        <circle cx="50" cy="50" r="35" fill="none" />
        <line x1="35" y1="35" x2="65" y2="65" />
        <line x1="65" y1="35" x2="35" y2="65" />
      </g>
    </Icon>
  );
}
