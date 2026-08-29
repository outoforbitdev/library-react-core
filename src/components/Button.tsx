import { getDomProps, IComponentProps } from "./IComponent";
import styles from "../styles/button.module.css";
import "../styles/themes.css";

interface IButtonProps extends IComponentProps {
  borderless?: boolean;
}

export function Button(props: IButtonProps) {
  return (
    <button
      {...getDomProps(
        props,
        styles.button,
        props.borderless ? styles.borderless : undefined,
      )}
    >
      {props.children}
    </button>
  );
}
