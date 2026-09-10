import { getDomProps, IComponentProps } from "./IComponent";
import { ChevronDown, IconSize } from "./icons";
import styles from "../styles/nav.module.css";
import { FocusEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { Button } from "./Button";

export interface INavDropdownProps extends IComponentProps {
  label: string;
  hideIcon?: boolean;
}

export function NavDropdown(props: INavDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape" && isOpen) {
      event.stopPropagation();
      setIsOpen(false);
      buttonRef.current?.focus();
    }
  };

  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleOutsideMouseDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node | null)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideMouseDown);
    return () =>
      document.removeEventListener("mousedown", handleOutsideMouseDown);
  }, [isOpen]);

  return (
    <div
      ref={containerRef}
      {...getDomProps(props, styles.nav__dropdown)}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
    >
      <Button
        ref={buttonRef}
        className={`${styles.nav__item} ${styles.nav__dropdown__button} ${isOpen ? styles["nav__dropdown__button--open"] : ""}`}
        borderless
        onClick={toggleDropdown}
        aria-expanded={isOpen}
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
