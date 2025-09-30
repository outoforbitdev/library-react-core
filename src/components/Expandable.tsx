import { useState } from "react";
import { getDomProps, IComponentProps } from "./IComponent";
import styles from "../styles/expandable.module.css";
import { DoubleArrowDown, DoubleArrowUp } from "./icons";
import { Button } from "./Button";

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
          <Button onClick={() => setExpanded(false)} className={styles.toggle}>
            <DoubleArrowUp />
          </Button>
        </span>
      ) : (
        <Button onClick={() => setExpanded(true)} className={styles.toggle}>
          <DoubleArrowDown />
        </Button>
      )}
      {expanded ? props.children : null}
    </div>
  );
}
