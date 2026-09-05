import { useState, useRef, useEffect } from "react";
import type { ReactNode } from "react";
import { getDomProps, IComponentProps } from "./IComponent";
import { ChevronDown } from "./icons";
import styles from "../styles/nav.module.css";

export interface INavDropdownProps extends IComponentProps {
  label: ReactNode;
  hideIcon?: boolean;
}

function getDepthLevel(element: Element | null): number {
  let depth = 0;
  let current = element?.parentElement;
  while (current) {
    if (current.classList?.contains(styles.dropdown__content)) {
      depth++;
      current = current.parentElement?.parentElement;
    } else {
      current = current.parentElement;
    }
  }
  return depth;
}

export function NavDropdown(props: INavDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [depthLevel, setDepthLevel] = useState(0);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [focusedItemIndex, setFocusedItemIndex] = useState(-1);

  useEffect(() => {
    const depth = getDepthLevel(buttonRef.current);
    setDepthLevel(depth);
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    setFocusedItemIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    switch (e.key) {
      case " ":
      case "Enter":
        e.preventDefault();
        handleToggle();
        break;
      case "Escape":
        if (isOpen) {
          e.preventDefault();
          setIsOpen(false);
          setFocusedItemIndex(-1);
          buttonRef.current?.focus();
        }
        break;
      case "ArrowDown":
        if (!isOpen) {
          e.preventDefault();
          handleToggle();
        } else {
          e.preventDefault();
          navigateItems(1);
        }
        break;
      case "ArrowUp":
        if (isOpen) {
          e.preventDefault();
          navigateItems(-1);
        }
        break;
      case "ArrowRight":
        if (depthLevel === 0 && isOpen) {
          e.preventDefault();
          navigateItems(1);
        }
        break;
      default:
        break;
    }
  };

  const navigateItems = (direction: 1 | -1) => {
    const items = contentRef.current?.querySelectorAll(
      "a, button",
    ) as NodeListOf<HTMLAnchorElement | HTMLButtonElement>;
    if (!items || items.length === 0) return;

    let nextIndex = focusedItemIndex + direction;
    if (nextIndex < 0) nextIndex = items.length - 1;
    if (nextIndex >= items.length) nextIndex = 0;

    setFocusedItemIndex(nextIndex);
    items[nextIndex]?.focus();
  };

  const handleContentKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      setIsOpen(false);
      setFocusedItemIndex(-1);
      buttonRef.current?.focus();
    }
  };

  const isNested = depthLevel > 0;
  const nestedClass = isNested ? styles["dropdown--nested"] : "";
  const depthClass = isNested ? styles[`dropdown--nested-L${depthLevel}`] : "";

  return (
    <div
      {...getDomProps(
        props,
        styles.dropdown,
        isOpen ? styles["dropdown--open"] : "",
        nestedClass,
        depthClass,
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
        {!props.hideIcon && <ChevronDown />}
      </button>
      <div
        ref={contentRef}
        className={styles.dropdown__content}
        role="menu"
        onKeyDown={handleContentKeyDown}
      >
        {props.children}
      </div>
    </div>
  );
}
