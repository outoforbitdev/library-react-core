import type { Meta, StoryObj } from "@storybook/react";

import { NavBar } from "../components/NavBar";
import { NavLink } from "../components/NavLink";
import { NavDropdown } from "../components/NavDropdown";
import { ThemePalette } from "./ThemePalette";
import { IconSize, Spinner, Warning } from "../components/icons";

const meta = {
  title: "Components/NavBar",
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
    // header: <div style={{display: "flex", flexGrow: 1}}><NavLink to="#">My Site</NavLink>Search</div>,
    header: (
      <div style={{ display: "flex", alignItems: "center" }}>
        <NavLink to="#">
          <Warning size={IconSize.Medium} style={{ padding: "0 0.2rem 0 0" }} />
          My Site
        </NavLink>
        Search
      </div>
    ),
  },
  render: (args) =>
    ThemePalette({
      Component: (props) => (
        <NavBar {...args} {...props}>
          <NavLink to="#">A page</NavLink>
          {/* <NavDropdown label="More">
            <NavLink to="./">About</NavLink>
            <NavLink to="./">Contact</NavLink>
            <NavDropdown label="Even more">
              <NavLink to="./">Subpage 1</NavLink>
              <NavLink to="./">Subpage 2</NavLink>
            </NavDropdown>
          </NavDropdown> */}
          <NavLink to="#">Another page</NavLink>
        </NavBar>
      ),
    }),
} satisfies Meta<typeof NavBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
