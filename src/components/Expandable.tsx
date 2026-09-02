import { getDomProps, IComponentProps } from "./IComponent";
import styles from "../styles/expandable.module.css";
import "../styles/themes.css";
import { ChevronDown } from "./icons";

interface IExpandableProps extends IComponentProps {
  title?: string;
  hideTitleWhenCollapsed?: boolean;
  defaultExpanded?: boolean;
}

export function Expandable(props: IExpandableProps) {
  const showTitle =
    (!props.hideTitleWhenCollapsed || props.defaultExpanded) && props.title;

  return (
    <details
      {...getDomProps(props, styles.expandable)}
      open={props.defaultExpanded}
    >
      <summary className={styles.summary}>
        {showTitle && <span className={styles.title}>{props.title}</span>}
        <span className={styles.chevron}>
          <ChevronDown />
        </span>
      </summary>
      {props.children}
    </details>
  );
}
