import { useState, useRef } from "react";
import type { ReactNode } from "react";
import { getDomProps, IComponentProps } from "./IComponent";
import { ArrowDown } from "./icons";
import styles from "../styles/nav.module.css";

export interface INavDropdownProps extends IComponentProps {
  label: ReactNode;
  hideIcon?: boolean;
}

export function NavDropdown(props: INavDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    // Keyboard navigation handled in Part 2
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      handleToggle();
    }
  };

  return (
    <div
      {...getDomProps(
        props,
        styles.dropdown,
        isOpen ? styles["dropdown--open"] : "",
      )}
    >
      <button
        ref={buttonRef}
        className={styles.dropdown__button}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        {props.label}
        {!props.hideIcon && <ArrowDown />}
      </button>
      <div className={styles.dropdown__content} role="menu">
        {props.children}
      </div>
    </div>
  );
}
