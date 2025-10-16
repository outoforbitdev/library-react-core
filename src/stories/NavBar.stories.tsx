import type { Meta, StoryObj } from "@storybook/react";

import { NavBar } from "../components/NavBar";
import { NavLink } from "../components/NavLink";
import { NavDropdown } from "../components/NavDropdown";

const meta = {
  title: "Example/NavBar",
  component: NavBar,
  subcomponents: {
    NavLink,
    NavDropdown,
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen",
  },
  args: {
    home: "#",
    homeLabel: "My Site",
  },
  render: (args) => (
    <NavBar {...args}>
      <NavLink to="#">A page</NavLink>
      <NavDropdown label="More">
        <NavLink to="./">About</NavLink>
        <NavLink to="./">Contact</NavLink>
      </NavDropdown>
    </NavBar>
  ),
} satisfies Meta<typeof NavBar>;

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
