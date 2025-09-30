import { getDomProps, IComponentProps } from "../IComponent";
import styles from "../../styles/infobox.module.css";
import "../../styles/theme-colors.css";
import "../../styles/themes.css";

export interface IInfoboxProps extends IComponentProps {
}

export function Infobox(props: IInfoboxProps) {
  return (
    <table {...getDomProps(props, styles.infobox)}>
        {props.children}
    </table>
  );
}
