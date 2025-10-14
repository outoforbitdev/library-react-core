import { useState } from "react";
import { getDomProps, IComponentProps } from "./IComponent";
import styles from "../styles/expandable.module.css";
import { DoubleArrowDown, DoubleArrowUp } from "./icons";
import { Button } from "./Button";

interface IExpandableProps extends IComponentProps {
  title?: string;
  titleAlwaysVisible?: boolean;
}

export function Expandable(props: IExpandableProps) {
  const [expanded, setExpanded] = useState(false);
  const showTitle = (expanded || props.titleAlwaysVisible) && props.title;
  return (
    <div {...getDomProps(props, styles.expandable)}>
      {showTitle ? (
        <span>
          <span className={styles.title}>{props.title}</span>
          <Button
            onClick={() => setExpanded(!expanded)}
            className={styles.toggle}
          >
            {expanded ? <DoubleArrowUp /> : <DoubleArrowDown />}
          </Button>
        </span>
      ) : (
        <Button
          onClick={() => setExpanded(!expanded)}
          className={styles.toggle}
        >
          {expanded ? <DoubleArrowUp /> : <DoubleArrowDown />}
        </Button>
      )}
      {expanded ? props.children : null}
    </div>
  );
}
