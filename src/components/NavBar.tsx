import { ReactNode, useState } from "react";
import { getDomProps, IComponentProps } from "./IComponent";
import { HamburgerMenu, IconSize, X } from "./icons";
import styles from "../styles/nav.module.css";
import "../styles/themes.css";
import { NavLink } from "./NavLink";
import { Button } from "./Button";

export interface INavBarProps extends IComponentProps {
  header?: ReactNode;
}

/**
 * A navigation bar component that can be used to create a responsive navigation menu.
 * It supports a header, navigation links, and dropdown menus.
 * Renders a hamburger menu on smaller screens to toggle the visibility of the navigation links.
 */
export function NavBar(props: INavBarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleHamburgerClick = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav {...getDomProps(props, styles.nav)}>
      <div className={styles.nav__header}>
        <Button
          borderless
          className={styles.nav__hamburger}
          onClick={handleHamburgerClick}
        >
          {mobileMenuOpen ? (
            <X size={IconSize.Medium} />
          ) : (
            <HamburgerMenu size={IconSize.Medium} />
          )}
        </Button>
        {props.header}
      </div>
      <div
        className={`${styles.nav__children} ${mobileMenuOpen ? styles["nav__children--open"] : ""}`}
      >
        {props.children}
      </div>
    </nav>
  );
}
