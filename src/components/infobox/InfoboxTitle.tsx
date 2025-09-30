import { getDomProps, IComponentProps } from "../IComponent";
import styles from "../../styles/infobox.module.css";

export interface IInfoboxTitleProps extends IComponentProps {
}

export function InfoboxTitle(props: IInfoboxTitleProps) {
  return (
    <thead {...getDomProps(props, styles.infoboxTitle)}>
        <tr><th colSpan={2}>{props.children}</th></tr>
    </thead>
  );
}
