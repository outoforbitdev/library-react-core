import { getDomProps, IComponentProps } from "../IComponent";
import styles from "../../styles/infobox.module.css";
import "../../themes/themes.css";

export interface IInfoboxProps extends IComponentProps {}

export function Infobox(props: IInfoboxProps) {
  return (
    <table {...getDomProps(props, styles.infobox)}>{props.children}</table>
  );
}
