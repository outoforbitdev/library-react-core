import { Icon, IIconProps } from "./Icon";

export function Warning(props: IIconProps) {
  return (
    <Icon externalProps={props} viewBoxSize={100}>
      <polygon points="50,15 85,80 15,80" fill="none" />
      <line x1="50" y1="40" x2="50" y2="60" />
      <circle cx="50" cy="72" r="3" />
    </Icon>
  );
}
