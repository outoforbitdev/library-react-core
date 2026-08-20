import type { Meta, StoryObj } from "@storybook/react";
import { Infobox } from "../components/infobox/Infobox";

interface ComponentInfoBoxProps {
  componentClassName?: string;
  customBlockOneClassName?: string;
  customBlockTwoClassName?: string;
}

const ComponentInfoBox = (props: ComponentInfoBoxProps) => {
  return (
    <Infobox className={props.componentClassName}>
      <tr>
        <td colSpan={3}>.....</td>
      </tr>
      <tr>
        <td>.....</td>
        <td>ood-text</td>
        <td>.....</td>
      </tr>
      <tr>
        <td colSpan={3}>.....</td>
      </tr>
      <tr>
        <td>.....</td>
        <td>ood-text <span className="ood-accent">ood-accent</span> ood-text</td>
        <td>.....</td>
      </tr>
      <tr>
        <td colSpan={3}>.....</td>
      </tr>
      <tr className={props.customBlockOneClassName}>
        <td>.....</td>
        <td>{props.customBlockOneClassName}</td>
        <td>.....</td>
      </tr>
      <tr>
        <td colSpan={3}>.....</td>
      </tr>
      <tr className={props.customBlockTwoClassName}>
        <td>.....</td>
        <td>{props.customBlockTwoClassName}</td>
        <td>.....</td>
      </tr>
      <tr>
        <td colSpan={3}>.....</td>
      </tr>
      <tr>
        <td>.....</td>
        <td>
          ood-text <a href="#">ood-link</a> ood-text
        </td>
        <td>.....</td>
      </tr>
      <tr>
        <td colSpan={3}>.....</td>
      </tr>
      <tr>
        <td>.....</td>
        <td className="ood-error">ood-error</td>
        <td>.....</td>
      </tr>
      <tr>
        <td colSpan={3}>.....</td>
      </tr>
      <tr>
        <td>.....</td>
        <td className="ood-error-block">ood-error-block</td>
        <td>.....</td>
      </tr>
      <tr>
        <td colSpan={3}>.....</td>
      </tr>
      <tr>
        <td>.....</td>
        <td className="ood-warning">ood-warning</td>
        <td>.....</td>
      </tr>
      <tr>
        <td colSpan={3}>.....</td>
      </tr>
      <tr>
        <td>.....</td>
        <td className="ood-warning-block">ood-warning-block</td>
        <td>.....</td>
      </tr>
      <tr>
        <td colSpan={3}>.....</td>
      </tr>
      <tr>
        <td>.....</td>
        <td className="ood-submit">ood-submit</td>
        <td>.....</td>
      </tr>
      <tr>
        <td colSpan={3}>.....</td>
      </tr>
      <tr>
        <td>.....</td>
        <td className="ood-submit-block">ood-submit-block</td>
        <td>.....</td>
      </tr>
      <tr>
        <td colSpan={3}>.....</td>
      </tr>
      <tr>
        <td>.....</td>
        <td style={{ color: "var(--ood-color-red)" }}>ood-color-red</td>
        <td style={{ background: "var(--ood-color-red)" }}>.....</td>
      </tr>
      <tr>
        <td>.....</td>
        <td style={{ color: "var(--ood-color-orange)" }}>ood-color-orange</td>
        <td style={{ background: "var(--ood-color-orange)" }}>.....</td>
      </tr>
      <tr>
        <td>.....</td>
        <td style={{ color: "var(--ood-color-yellow)" }}>ood-color-yellow</td>
        <td style={{ background: "var(--ood-color-yellow)" }}>.....</td>
      </tr>
      <tr>
        <td>.....</td>
        <td style={{ color: "var(--ood-color-green)" }}>ood-color-green</td>
        <td style={{ background: "var(--ood-color-green)" }}>.....</td>
      </tr>
      <tr>
        <td>.....</td>
        <td style={{ color: "var(--ood-color-teal)" }}>ood-color-teal</td>
        <td style={{ background: "var(--ood-color-teal)" }}>.....</td>
      </tr>
      <tr>
        <td>.....</td>
        <td style={{ color: "var(--ood-color-cyan)" }}>ood-color-cyan</td>
        <td style={{ background: "var(--ood-color-cyan)" }}>.....</td>
      </tr>
      <tr>
        <td>.....</td>
        <td style={{ color: "var(--ood-color-blue)" }}>ood-color-blue</td>
        <td style={{ background: "var(--ood-color-blue)" }}>.....</td>
      </tr>
      <tr>
        <td>.....</td>
        <td style={{ color: "var(--ood-color-indigo)" }}>ood-color-indigo</td>
        <td style={{ background: "var(--ood-color-indigo)" }}>.....</td>
      </tr>
      <tr>
        <td>.....</td>
        <td style={{ color: "var(--ood-color-purple)" }}>ood-color-purple</td>
        <td style={{ background: "var(--ood-color-purple)" }}>.....</td>
      </tr>
      <tr>
        <td>.....</td>
        <td style={{ color: "var(--ood-color-magenta)" }}>ood-color-magenta</td>
        <td style={{ background: "var(--ood-color-magenta)" }}>.....</td>
      </tr>
      <tr>
        <td>.....</td>
        <td style={{ color: "var(--ood-color-pink)" }}>ood-color-pink</td>
        <td style={{ background: "var(--ood-color-pink)" }}>.....</td>
      </tr>
      <tr>
        <td>.....</td>
        <td style={{ color: "var(--ood-color-gray)" }}>ood-color-gray</td>
        <td style={{ background: "var(--ood-color-gray)" }}>.....</td>
      </tr>
    </Infobox>
  );
};

const meta = {
  title: "Example/Themes",
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen",
  },
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <ComponentInfoBox
        componentClassName="ood-primary"
        customBlockOneClassName="ood-secondary"
        customBlockTwoClassName="ood-accent-block"
      />
      <ComponentInfoBox
        componentClassName="ood-secondary"
        customBlockOneClassName="ood-primary"
        customBlockTwoClassName="ood-accent-block"
      />
      <ComponentInfoBox
        componentClassName="ood-accent-block"
        customBlockOneClassName="ood-primary"
        customBlockTwoClassName="ood-secondary"
      />
    </div>
  ),
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Light: Story = {
  decorators: [(story) => <div data-theme="light">{story()}</div>],
};

export const Dark: Story = {
  decorators: [(story) => <div data-theme="dark">{story()}</div>],
};
