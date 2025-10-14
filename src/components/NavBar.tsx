import { useState } from "react";
import { getDomProps, IComponentProps } from "./IComponent";
import { HamburgerMenu, IconSize, X } from "./icons";
import styles from "../styles/nav.module.css";
import "../styles/theme-colors.css";
import "../styles/themes.css";
import { NavLink } from "./NavLink";

export interface INavBarProps extends IComponentProps {
  home?: string;
  homeLabel?: string;
}

export function NavBar(props: INavBarProps) {
  const [responsive, setResponsive] = useState(false);
  return (
    <nav
      {...getDomProps(props, styles.nav, responsive ? styles.responsive : "")}
    >
      {props.home ? (
        <a href={props.home} {...getDomProps({}, styles.nav, styles.home)}>
          {props.homeLabel ?? "Home"}
        </a>
      ) : null}
      {props.children}
      <NavLink
        to="#"
        onClick={() => toggleResponsive(responsive, setResponsive)}
        className={styles.hamburger}
      >
        {responsive ? (
          <X size={IconSize.Large} />
        ) : (
          <HamburgerMenu size={IconSize.Large} />
        )}
      </NavLink>
    </nav>
  );
}

function toggleResponsive(
  responsive: boolean,
  setResponsive: (responsive: boolean) => void,
) {
  setResponsive(!responsive);
}
