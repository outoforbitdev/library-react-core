import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "storybook/test";

import { NavBar } from "../components/NavBar";
import { NavLink } from "../components/NavLink";
import { NavDropdown } from "../components/NavDropdown";
import { ThemePalette } from "./ThemePalette";
import { IconSize, Spinner, Warning } from "../components/icons";
import styles from "../styles/nav.module.css";

const meta = {
  title: "Components/NavBar",
  component: NavBar,
  subcomponents: {
    NavLink,
    NavDropdown,
  },
  tags: ["test", "!dev"],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "padded",
  },
  args: {
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
  render: (args) => (
    <NavBar {...args} className="ood-primary">
      <NavLink to="#">A page</NavLink>
      <NavDropdown label="More">
        <NavLink to="./">About</NavLink>
        <NavDropdown label="Even more">
          <NavLink to="./">Subpage 1</NavLink>
          <NavLink to="./">Subpage 2</NavLink>
        </NavDropdown>
        <NavLink to="./">Contact</NavLink>
      </NavDropdown>
      <NavLink to="#">Another page</NavLink>
    </NavBar>
  ),
} satisfies Meta<typeof NavBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  tags: ["autodocs", "!test"],
};

export const ThemeRender: Story = {
  tags: ["dev", "!test"],
  render: (args) =>
    ThemePalette({
      Component: (props) => (
        <NavBar {...args} {...props}>
          <NavLink to="#">A page</NavLink>
          <NavDropdown label="More">
            <NavLink to="./">About</NavLink>
            <NavDropdown label="Even more">
              <NavLink to="./">Subpage 1</NavLink>
              <NavLink to="./">Subpage 2</NavLink>
            </NavDropdown>
            <NavLink to="./">Contact</NavLink>
          </NavDropdown>
          <NavLink to="#">Another page</NavLink>
        </NavBar>
      ),
    }),
};

export const MobileMenuToggle: Story = {
  render: (args) => (
    <NavBar {...args}>
      <NavLink to="#">A page</NavLink>
      <NavLink to="#">Another page</NavLink>
    </NavBar>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const toggle = canvas.getByLabelText("Open menu");
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    const childrenContainer = canvasElement.querySelector(
      "nav > div:last-child",
    );
    expect(childrenContainer).not.toHaveClass(styles["nav__children--open"]);

    await userEvent.click(toggle);

    const closeToggle = canvas.getByLabelText("Close menu");
    expect(closeToggle).toBe(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(childrenContainer).toHaveClass(
      styles["nav__children--open"] as string,
    );

    await userEvent.click(toggle);

    expect(canvas.getByLabelText("Open menu")).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(childrenContainer).not.toHaveClass(
      styles["nav__children--open"] as string,
    );
  },
};

export const DropdownOpensAndClosesOnClick: Story = {
  render: (args) => (
    <NavBar {...args}>
      <NavDropdown label="More">
        <NavLink to="#">About</NavLink>
        <NavLink to="#">Contact</NavLink>
      </NavDropdown>
    </NavBar>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: "More" });

    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(canvas.getByText("About")).not.toBeVisible();

    await userEvent.click(trigger);

    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(canvas.getByText("About")).toBeVisible();

    await userEvent.click(trigger);

    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(canvas.getByText("About")).not.toBeVisible();
  },
};

export const DropdownClosesOnOutsideClick: Story = {
  render: (args) => (
    <NavBar {...args}>
      <NavDropdown label="More">
        <NavLink to="#">About</NavLink>
      </NavDropdown>
    </NavBar>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: "More" });

    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    await userEvent.click(canvasElement);

    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(canvas.getByText("About")).not.toBeVisible();
  },
};

export const DropdownClosesOnEscapeAndReturnsFocus: Story = {
  render: (args) => (
    <NavBar {...args}>
      <NavDropdown label="More">
        <NavLink to="#">About</NavLink>
      </NavDropdown>
    </NavBar>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: "More" });

    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(trigger).toHaveFocus();

    await userEvent.keyboard("{Escape}");

    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(canvas.getByText("About")).not.toBeVisible();
    expect(trigger).toHaveFocus();
  },
};

export const NestedDropdownEscapeClosesInnermostOnly: Story = {
  render: (args) => (
    <NavBar {...args}>
      <NavDropdown label="More">
        <NavLink to="#">About</NavLink>
        <NavDropdown label="Even more">
          <NavLink to="#">Subpage</NavLink>
        </NavDropdown>
      </NavDropdown>
    </NavBar>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const outerTrigger = canvas.getByRole("button", { name: "More" });

    await userEvent.click(outerTrigger);
    expect(outerTrigger).toHaveAttribute("aria-expanded", "true");

    const innerTrigger = canvas.getByRole("button", { name: "Even more" });

    await userEvent.click(innerTrigger);
    expect(innerTrigger).toHaveAttribute("aria-expanded", "true");
    expect(innerTrigger).toHaveFocus();

    await userEvent.keyboard("{Escape}");

    expect(innerTrigger).toHaveAttribute("aria-expanded", "false");
    expect(outerTrigger).toHaveAttribute("aria-expanded", "true");
    expect(innerTrigger).toHaveFocus();

    await userEvent.keyboard("{Escape}");

    expect(outerTrigger).toHaveAttribute("aria-expanded", "false");
    expect(outerTrigger).toHaveFocus();
  },
};
