import { forwardRef } from "react";
import { getDomProps, IComponentProps } from "./IComponent";
import styles from "../styles/button.module.css";
import "../styles/themes.css";

interface IButtonProps extends IComponentProps {
  borderless?: boolean;
  "aria-label"?: string;
  "aria-expanded"?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, IButtonProps>(
  function Button(props, ref) {
    return (
      <button
        ref={ref}
        {...getDomProps(
          props,
          styles.button,
          props.borderless ? styles.borderless : undefined,
        )}
        aria-label={props["aria-label"]}
        aria-expanded={props["aria-expanded"]}
      >
        {props.children}
      </button>
    );
  },
);
