import type { ReactNode } from "react";
import { useState } from "react";
import { getDomProps, IComponentProps } from "./IComponent";
import { HamburgerMenu, IconSize, X } from "./icons";
import styles from "../styles/nav.module.css";

export interface INavBarProps extends IComponentProps {
  header?: ReactNode;
}

export function NavBar(props: INavBarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleHamburgerClick = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav {...getDomProps(props, styles.nav)}>
      {/* Mobile Hamburger - left side */}
      <button
        className={styles.nav__hamburger}
        onClick={handleHamburgerClick}
        aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        aria-expanded={mobileMenuOpen}
      >
        {mobileMenuOpen ? (
          <X size={IconSize.Large} />
        ) : (
          <HamburgerMenu size={IconSize.Large} />
        )}
      </button>

      {/* Header - appears on both desktop and mobile */}
      {props.header && <div className={styles.nav__header}>{props.header}</div>}

      {/* Desktop children & mobile expanded menu */}
      <div
        className={`${styles.nav__content} ${
          mobileMenuOpen ? styles["nav__content--mobile-open"] : ""
        }`}
      >
        {props.children}
      </div>
    </nav>
  );
}
