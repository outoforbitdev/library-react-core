import { Icon, IIconProps } from "./Icon";

export function Warning(props: IIconProps) {
  return (
    <Icon externalProps={props} viewBoxSize={100}>
      <g strokeWidth={6}>
        <polygon points="50,15 85,80 15,80" fill="none" />
        <line x1="50" y1="35" x2="50" y2="55" strokeLinecap="round" />
        <circle cx="50" cy="68" r="3" />
      </g>
    </Icon>
  );
}
