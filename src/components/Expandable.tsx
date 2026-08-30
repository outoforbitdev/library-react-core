import { useState } from "react";
import { getDomProps, IComponentProps } from "./IComponent";
import styles from "../styles/expandable.module.css";
import { ChevronDown, ChevronUp } from "./icons";

interface IExpandableProps extends IComponentProps {
  title?: string;
  titleAlwaysVisible?: boolean;
  expanded?: boolean;
}

export function Expandable(props: IExpandableProps) {
  const [expanded, setExpanded] = useState(props.expanded ?? false);
  const showTitle = (expanded || props.titleAlwaysVisible) && props.title;
  return (
    <div {...getDomProps(props, styles.expandable)}>
      <button
        onClick={() => setExpanded(!expanded)}
        className={styles.toggle}
        type="button"
      >
        {showTitle && <span className={styles.title}>{props.title}</span>}
        {expanded ? <ChevronUp /> : <ChevronDown />}
      </button>
      {expanded ? props.children : null}
    </div>
  );
}
