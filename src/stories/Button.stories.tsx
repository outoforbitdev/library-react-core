import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";

import { Button } from "../components/Button";
import { ThemePalette } from "./ThemePalette";

const meta = {
  title: "Example/Button",
  component: Button,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen",
  },
  render: (args) =>
    ThemePalette({
      Component: (props) => (
        <Button {...args} {...props}>
          Press Me
        </Button>
      ),
    }),
  argTypes: {
    onClick: { action: "clicked" },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Bordered: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const buttons = canvas.getAllByRole("button");
    expect(buttons.length).toBeGreaterThan(0);
  },
};

export const Borderless: Story = {
  args: {
    borderless: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const buttons = canvas.getAllByRole("button");
    expect(buttons.length).toBeGreaterThan(0);
  },
};

export const BorderlessWithClick: Story = {
  args: {
    borderless: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const buttons = canvas.getAllByRole("button");
    const firstButton = buttons[0];

    // Verify button exists
    expect(firstButton).toBeInTheDocument();

    // Click the button and verify it's still there
    await userEvent.click(firstButton);
    expect(firstButton).toBeInTheDocument();
  },
};
