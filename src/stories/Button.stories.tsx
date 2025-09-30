import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "../components/Button";

const meta = {
  title: "Example/Button",
  component: Button,
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
    <Button {...args}>Press Me</Button>
  ),
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
};

export const Secondary: Story = {
  args: {
    className: "ood-secondary",
  }
};

export const Accent: Story = {
  args: {
    className: "ood-primary ood-accent",
  }
};

export const AccentBlock: Story = {
  args: {
    className: "ood-accent-block",
  }
}

export const Submit: Story = {
  args: {
    className: "ood-primary ood-submit",
  }
}

export const SubmitBlock: Story = {
  args: {
    className: "ood-primary ood-submit-block",
  }
}

export const Warning: Story = {
  args: {
    className: "ood-primary ood-warning",
  }
}

export const WarningBlock: Story = {
  args: {
    className: "ood-primary ood-warning-block",
  }
}

export const Error: Story = {
  args: {
    className: "ood-primary ood-error",
  }
}

export const ErrorBlock: Story = {
  args: {
    className: "ood-primary ood-error-block",
  }
}
