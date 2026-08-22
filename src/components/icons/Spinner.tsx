import { Icon, IIconProps } from "./Icon";
import styles from "./icon.module.css";

export function Spinner(props: IIconProps) {
  return (
    <Icon externalProps={props} viewBoxSize={100}>
      <circle
        className={styles.spinner}
        cx="50"
        cy="50"
        r="40"
        fill="none"
        strokeDasharray="62.8"
        strokeLinecap="round"
      />
    </Icon>
  );
}
