import { Icon, IIconProps } from "./Icon";

export function Check(props: IIconProps) {
  return (
    <Icon externalProps={props} viewBoxSize={100}>
      <polyline
        points="20,50 40,70 80,30"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
}
