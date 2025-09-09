import { useState } from "react";
import { getDomProps, IComponentProps } from "./IComponent";
import styles from "../styles/expandable.module.css";
import { DoubleArrowDown, DoubleArrowUp } from "./icons";

interface IExpandableProps extends IComponentProps {
  title?: string;
}

export function Expandable(props: IExpandableProps) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div {...getDomProps(props, styles.expandable)}>
      {expanded ? (
        <span>
          {expanded && props.title ? (
            <span className={styles.title}>{props.title}</span>
          ) : null}
          <DoubleArrowUp
            onClick={() => setExpanded(false)}
            className={styles.toggle}
            clickable
          />
        </span>
      ) : (
        <DoubleArrowDown
          onClick={() => setExpanded(true)}
          className={styles.toggle}
          clickable
        />
      )}
      {expanded ? props.children : null}
    </div>
  );
}
