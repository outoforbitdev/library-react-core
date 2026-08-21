import { getDomProps, IComponentProps } from "./IComponent";
import { ChevronDown } from "./icons";
import styles from "../styles/nav.module.css";

export interface INavDropdownProps extends IComponentProps {
  label: string;
  hideIcon?: boolean;
}

export function NavDropdown(props: INavDropdownProps) {
  return (
    <div {...getDomProps(props, styles.dropdown, "hoverable")}>
      <button className={styles.dropdown_button}>
        {props.label}
        {props.hideIcon ? null : <ChevronDown />}
      </button>
      <div className={styles.dropdown_content}>{props.children}</div>
    </div>
  );
}
