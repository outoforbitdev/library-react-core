import { getDomProps, IComponentProps } from "./IComponent";
import styles from "../styles/nav.module.css";

export interface INavLinkProps extends IComponentProps {
  to: string;
}

export function NavLink(props: INavLinkProps) {
  return (
    <a href={props.to} {...getDomProps(props, styles.navlink)}>
      {props.children}
    </a>
  );
}
