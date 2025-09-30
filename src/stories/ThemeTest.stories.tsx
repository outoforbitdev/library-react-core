import type { Meta, StoryObj } from "@storybook/react";
import { Infobox } from "../components/infobox/Infobox";

const meta = {
  title: "Example/Themes",
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen",
  },
  args: {
    className: "ood-primary",
  },
  render: (args) => (
    <Infobox {...args}>
      <tr>
        <td colSpan={3}>.....</td>
      </tr>
      <tr>
        <td>.....</td>
        <td>ood-primary</td>
        <td>.....</td>
      </tr>
      <tr>
        <td colSpan={3}>.....</td>
      </tr>
      <tr>
        <td>.....</td>
        <td>
          <a href="#">ood-link</a>
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
        <td style={{ color: "var(--ood-color-blue)" }}>ood-color-blue</td>
        <td style={{ background: "var(--ood-color-blue)" }}>.....</td>
      </tr>
      <tr>
        <td>.....</td>
        <td style={{ color: "var(--ood-color-violet)" }}>ood-color-violet</td>
        <td style={{ background: "var(--ood-color-violet)" }}>.....</td>
      </tr>
      <tr>
        <td>.....</td>
        <td style={{ color: "var(--ood-color-red)" }}>ood-color-red</td>
        <td style={{ background: "var(--ood-color-red)" }}>.....</td>
      </tr>
      <tr>
        <td>.....</td>
        <td style={{ color: "var(--ood-color-red)" }}>ood-color-red</td>
        <td style={{ background: "var(--ood-color-red)" }}>.....</td>
      </tr>
    </Infobox>
  ),
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: {
    className: "ood-secondary",
  },
};

export const Accent: Story = {
  args: {
    className: "ood-primary ood-accent",
  },
};

export const AccentBlock: Story = {
  args: {
    className: "ood-accent-block",
  },
};
