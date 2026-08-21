import { Icon, IIconProps } from "./Icon";

export function Error(props: IIconProps) {
  return (
    <Icon externalProps={props} viewBoxSize={100}>
      <circle cx="50" cy="30" r="6" />
      <line x1="50" y1="45" x2="50" y2="75" />
    </Icon>
  );
}
