import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "storybook/test";

import { Expandable } from "../components/Expandable";
import { ThemePalette } from "./ThemePalette";

const meta = {
  title: "Components/Expandable",
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

    // Find the details element
    const details = canvasElement.querySelector("details");
    expect(details).toBeInTheDocument();

    // Verify component is initially open
    expect(details).toHaveAttribute("open");

    // Find the summary element using text
    const summary = canvas.getByText("Click to collapse this section");
    expect(summary).toBeInTheDocument();

    // Click to close
    await userEvent.click(summary);

    // Verify component is now closed
    expect(details).not.toHaveAttribute("open");
  },
};

export const WithTitleCollapsed: Story = {
  args: {
    className: "ood-primary",
    title: "Click to expand this section",
    defaultExpanded: false,
  },
  render: (args) => (
    <Expandable {...args}>
      This content is initially hidden and will appear when you click to expand.
    </Expandable>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Find the details element
    const details = canvasElement.querySelector("details");
    expect(details).toBeInTheDocument();

    // Verify component is initially collapsed (no open attribute)
    expect(details).not.toHaveAttribute("open");

    // Find the summary element using text
    const summary = canvas.getByText("Click to expand this section");
    expect(summary).toBeInTheDocument();

    // Click to expand
    await userEvent.click(summary);

    // Verify component is now open
    expect(details).toHaveAttribute("open");
  },
};

export const HiddenTitle: Story = {
  args: {
    className: "ood-primary",
    title: "Expandable section",
    hideTitle: true,
  },
  render: (args) => (
    <Expandable {...args}>
      Title is hidden visually but still accessible to screen readers. Only the
      chevron icon is visible to click.
    </Expandable>
  ),
  play: async ({ canvasElement }) => {
    // Find the summary element - it should be the first child of details
    const details = canvasElement.querySelector("details");
    const summary = details?.querySelector("summary");
    expect(summary).toBeInTheDocument();
  },
};
