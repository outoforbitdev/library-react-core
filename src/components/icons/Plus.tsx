import { Icon, IIconProps } from "./Icon";

export function Plus(props: IIconProps) {
  return (
    <Icon externalProps={props} viewBoxSize={100}>
      <line x1="50" y1="20" x2="50" y2="80" />
      <line x1="20" y1="50" x2="80" y2="50" />
    </Icon>
  );
}
