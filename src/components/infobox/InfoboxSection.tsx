import { getDomProps, IComponentProps } from "../IComponent";
import styles from "../../styles/infobox.module.css";

export interface IInfoboxSectionProps extends IComponentProps {
    title: string,
}

export function InfoboxSection(props: IInfoboxSectionProps) {
  return (
    <tbody {...getDomProps(props, styles.infoboxSection)}>
        <tr className={styles.infoboxSectionHeader}><th colSpan={2}>{props.title}</th></tr>
        {props.children}
    </tbody>
  );
}
