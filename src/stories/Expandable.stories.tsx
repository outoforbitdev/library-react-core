import type { Meta, StoryObj } from "@storybook/react";

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

export const Submit: Story = {
  args: {
    className: "ood-primary ood-submit",
  },
};

export const SubmitBlock: Story = {
  args: {
    className: "ood-primary ood-submit-block",
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
    className: "ood-primary ood-error-block",
  },
};
