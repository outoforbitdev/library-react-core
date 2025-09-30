import { getDomProps, IComponentProps } from "../IComponent";
import styles from "../../styles/infobox.module.css";

export interface IInfoboxRowProps extends IComponentProps {
  label: string,
}

export function InfoboxRow(props: IInfoboxRowProps) {
  return (
    <tr {...getDomProps(props, styles.infoboxRow)}>
        <th>{props.label}</th>
        <td>{props.children}</td>
    </tr>
  );
}
