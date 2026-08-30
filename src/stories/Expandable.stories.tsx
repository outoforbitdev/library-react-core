import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "storybook/test";

import { Expandable } from "../components/Expandable";

const meta = {
  title: "Example/Expandable",
  component: Expandable,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  render: (args) => <Expandable {...args}>Press Me</Expandable>,
} satisfies Meta<typeof Expandable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    className: "ood-primary",
  },
};

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

export const Submit: Story = {
  args: {
    className: "ood-primary ood-submit",
  },
};

export const SubmitBlock: Story = {
  args: {
    className: "ood-submit-block",
  },
};

export const Warning: Story = {
  args: {
    className: "ood-primary ood-warning",
  },
};

export const WarningBlock: Story = {
  args: {
    className: "ood-primary ood-warning-block",
  },
};

export const Error: Story = {
  args: {
    className: "ood-primary ood-error",
  },
};

export const ErrorBlock: Story = {
  args: {
    className: "ood-error-block",
  },
};

export const WithTitleExpanded: Story = {
  args: {
    className: "ood-primary",
    title: "Click to collapse this section",
    expanded: true,
  },
  render: (args) => (
    <Expandable {...args}>
      This content starts expanded and can be collapsed by clicking the title or
      chevron.
    </Expandable>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Find the button (which contains both title and chevron)
    const button = canvas.getByRole("button");
    expect(button).toBeInTheDocument();

    // Verify the title text is in the button
    expect(button).toHaveTextContent("Click to collapse this section");
  },
};

export const WithTitleCollapsed: Story = {
  args: {
    className: "ood-primary",
    title: "Click to expand this section",
    expanded: false,
    titleAlwaysVisible: true,
  },
  render: (args) => (
    <Expandable {...args}>
      This content is initially hidden and will appear when you click to expand.
    </Expandable>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Find the button
    const button = canvas.getByRole("button");
    expect(button).toBeInTheDocument();

    // Verify title is shown even when collapsed (because titleAlwaysVisible is true)
    expect(button).toHaveTextContent("Click to expand this section");

    // Click to expand and verify button is still there
    await userEvent.click(button);
    expect(button).toBeInTheDocument();
  },
};

export const NoTitle: Story = {
  args: {
    className: "ood-primary",
  },
  render: (args) => (
    <Expandable {...args}>
      Content with no title - only the chevron icon can be clicked to toggle.
    </Expandable>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Should still have a button with chevron
    const button = canvas.getByRole("button");
    expect(button).toBeInTheDocument();
  },
};
