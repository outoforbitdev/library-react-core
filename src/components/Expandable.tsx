import { useState } from "react";
import { getDomProps, IComponentProps } from "./IComponent";
import styles from "../styles/expandable.module.css";
import { ChevronDown, ChevronUp } from "./icons";
import { Button } from "./Button";

interface IExpandableProps extends IComponentProps {
  title?: string;
  hideTitleWhenCollapsed?: boolean;
  defaultExpanded?: boolean;
}

export function Expandable(props: IExpandableProps) {
  const [expanded, setExpanded] = useState(props.defaultExpanded ?? false);
  const showTitle = (expanded || !props.hideTitleWhenCollapsed) && props.title;
  return (
    <div {...getDomProps(props, styles.expandable)}>
      <Button
        onClick={() => setExpanded(!expanded)}
        className={styles.toggle}
        borderless
      >
        {showTitle && <span className={styles.title}>{props.title}</span>}
        {expanded ? <ChevronUp /> : <ChevronDown />}
      </Button>
      {expanded ? props.children : null}
    </div>
  );
}
