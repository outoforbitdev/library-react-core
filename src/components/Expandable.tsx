import { getDomProps, IComponentProps } from "./IComponent";
import styles from "../styles/expandable.module.css";
import "../styles/themes.css";
import { ChevronDown } from "./icons";

interface IExpandableProps extends IComponentProps {
  title: string;
  hideTitle?: boolean;
  defaultExpanded?: boolean;
}

export function Expandable(props: IExpandableProps) {
  return (
    <details
      {...getDomProps(props, styles.expandable)}
      open={props.defaultExpanded}
    >
      <summary className={styles.summary}>
        <span
          className={`${styles.title} ${props.hideTitle ? styles.hidden : ""}`}
        >
          {props.title}
        </span>
        <span className={styles.chevron}>
          <ChevronDown />
        </span>
      </summary>
      {props.children}
    </details>
  );
}
