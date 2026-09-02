import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "storybook/test";

import { Expandable } from "../components/Expandable";
import { ThemePalette } from "./ThemePalette";

const meta = {
  title: "Example/Expandable",
  component: Expandable,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  render: (args) => (
    <ThemePalette
      Component={(props) => (
        <Expandable
          {...args}
          {...props}
          style={{ border: "1px solid var(--ood-border)" }}
        >
          <p>
            <a href="#">Lorem ipsum dolor sit amet</a>, consectetur adipiscing
            elit, sed do eiusmod tempor incididunt ut labore et dolore magna
            aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
            laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
            dolor in reprehenderit in voluptate velit esse cillum dolore eu
            fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
            proident, sunt in culpa qui officia deserunt mollit anim id est
            laborum.
          </p>
        </Expandable>
      )}
    />
  ),
} satisfies Meta<typeof Expandable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Title: Story = {
  args: {
    title: "Click to expand this section",
  },
};

export const WithTitleExpanded: Story = {
  args: {
    className: "ood-primary",
    title: "Click to collapse this section",
    defaultExpanded: true,
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
    defaultExpanded: false,
    hideTitleWhenCollapsed: false,
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

    // Verify title is shown even when collapsed (because hideTitleWhenCollapsed is false)
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
