import { getDomProps, IComponentProps } from "./IComponent";
import styles from "../styles/button.module.css";
import "../styles/theme-colors.css";
import "../styles/themes.css";

interface IButtonProps extends IComponentProps {}

export function Button(props: IButtonProps) {
    return <button {...getDomProps(props, styles.button)}>{props.children}</button>;
}