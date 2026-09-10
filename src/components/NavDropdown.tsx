import { getDomProps, IComponentProps } from "./IComponent";
import { ChevronDown, IconSize } from "./icons";
import styles from "../styles/nav.module.css";
import { useState } from "react";
import { Button } from "./Button";

export interface INavDropdownProps extends IComponentProps {
  label: string;
  hideIcon?: boolean;
}

export function NavDropdown(props: INavDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div {...getDomProps(props, styles.nav__dropdown)}>
      <Button
        className={`${styles.nav__item} ${styles.nav__dropdown__button} ${isOpen ? styles["nav__dropdown__button--open"] : ""}`}
        borderless
        onClick={toggleDropdown}
      >
        {props.label}
        {props.hideIcon ? null : (
          <ChevronDown
            size={IconSize.ExtraSmall}
            className={styles.nav__dropdown__chevron}
          />
        )}
      </Button>
      <div
        className={`${styles.nav__dropdown__content} ${isOpen ? styles["nav__dropdown__content--open"] : ""}`}
      >
        {props.children}
      </div>
    </div>
  );
}
