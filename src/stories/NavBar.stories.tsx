import type { Meta, StoryObj } from "@storybook/react";
import { NavBar } from "../components/NavBar";
import { NavLink } from "../components/NavLink";
import { NavDropdown } from "../components/NavDropdown";

const meta = {
  title: "Components/NavBar",
  component: NavBar,
  subcomponents: { NavLink, NavDropdown },
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof NavBar>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic NavBar with links
export const Basic: Story = {
  render: () => (
    <NavBar header="My Site">
      <NavLink to="#page1">Page 1</NavLink>
      <NavLink to="#page2">Page 2</NavLink>
      <NavLink to="#page3">Page 3</NavLink>
    </NavBar>
  ),
};

// NavBar with dropdowns
export const WithDropdowns: Story = {
  render: () => (
    <NavBar header="My Site">
      <NavLink to="#page1">Home</NavLink>
      <NavDropdown label="Products">
        <NavLink to="#prod1">Product 1</NavLink>
        <NavLink to="#prod2">Product 2</NavLink>
        <NavLink to="#prod3">Product 3</NavLink>
      </NavDropdown>
      <NavLink to="#about">About</NavLink>
    </NavBar>
  ),
};

// NavBar with nested dropdowns
export const NestedDropdowns: Story = {
  render: () => (
    <NavBar header="My Site">
      <NavLink to="#home">Home</NavLink>
      <NavDropdown label="Products">
        <NavLink to="#all">All Products</NavLink>
        <NavDropdown label="Software">
          <NavLink to="#sw1">App A</NavLink>
          <NavLink to="#sw2">App B</NavLink>
        </NavDropdown>
        <NavDropdown label="Hardware">
          <NavLink to="#hw1">Device X</NavLink>
          <NavLink to="#hw2">Device Y</NavLink>
        </NavDropdown>
      </NavDropdown>
      <NavLink to="#about">About</NavLink>
    </NavBar>
  ),
};

// NavBar with custom flex-grow component (simulated search bar)
export const WithFlexGrowComponent: Story = {
  render: () => (
    <NavBar header="My Site">
      <NavLink to="#home">Home</NavLink>
      <input
        type="text"
        placeholder="Search..."
        style={{
          flexGrow: 1,
          padding: "0.5rem 1rem",
          margin: "0 0.5rem",
          border: "1px solid var(--ood-shade)",
          backgroundColor: "var(--ood-background)",
          color: "inherit",
        }}
      />
      <NavLink to="#about">About</NavLink>
    </NavBar>
  ),
};

// Primary theme
export const PrimaryTheme: Story = {
  args: {
    className: "ood-primary",
  },
  render: (args) => (
    <NavBar {...args} header="My Site">
      <NavLink to="#page1">Page 1</NavLink>
      <NavDropdown label="Menu">
        <NavLink to="#item1">Item 1</NavLink>
        <NavLink to="#item2">Item 2</NavLink>
      </NavDropdown>
      <NavLink to="#page3">Page 3</NavLink>
    </NavBar>
  ),
};

// Secondary theme
export const SecondaryTheme: Story = {
  args: {
    className: "ood-secondary",
  },
  render: (args) => (
    <NavBar {...args} header="My Site">
      <NavLink to="#page1">Page 1</NavLink>
      <NavDropdown label="Menu">
        <NavLink to="#item1">Item 1</NavLink>
        <NavLink to="#item2">Item 2</NavLink>
      </NavDropdown>
      <NavLink to="#page3">Page 3</NavLink>
    </NavBar>
  ),
};

// Accent theme
export const AccentTheme: Story = {
  args: {
    className: "ood-accent",
  },
  render: (args) => (
    <NavBar {...args} header="My Site">
      <NavLink to="#page1">Page 1</NavLink>
      <NavDropdown label="Menu">
        <NavLink to="#item1">Item 1</NavLink>
        <NavLink to="#item2">Item 2</NavLink>
      </NavDropdown>
      <NavLink to="#page3">Page 3</NavLink>
    </NavBar>
  ),
};

// Keyboard navigation (with visible focus indicators)
export const KeyboardNavigation: Story = {
  render: () => (
    <>
      <p style={{ padding: "1rem" }}>
        <strong>Test keyboard navigation:</strong> Tab to navigate, Space to
        open dropdowns, Arrow keys to move within dropdowns, Escape to close.
      </p>
      <NavBar header="Keyboard Test">
        <NavLink to="#link1">Link 1</NavLink>
        <NavDropdown label="Dropdown 1">
          <NavLink to="#item1">Item 1.1</NavLink>
          <NavLink to="#item2">Item 1.2</NavLink>
        </NavDropdown>
        <NavLink to="#link2">Link 2</NavLink>
      </NavBar>
    </>
  ),
};

// Mobile view (simulated with viewport)
export const MobileView: Story = {
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
  render: () => (
    <NavBar header="Mobile Nav">
      <NavLink to="#page1">Page 1</NavLink>
      <NavDropdown label="Menu">
        <NavLink to="#item1">Item 1</NavLink>
        <NavLink to="#item2">Item 2</NavLink>
        <NavDropdown label="Submenu">
          <NavLink to="#sub1">Sub 1</NavLink>
          <NavLink to="#sub2">Sub 2</NavLink>
        </NavDropdown>
      </NavDropdown>
      <NavLink to="#page2">Page 2</NavLink>
    </NavBar>
  ),
};

// Long content (test with many items)
export const LongContent: Story = {
  render: () => (
    <NavBar header="Site">
      {Array.from({ length: 8 }).map((_, i) => (
        <NavLink key={i} to={`#page${i + 1}`}>
          Page {i + 1}
        </NavLink>
      ))}
      <NavDropdown label="More">
        {Array.from({ length: 5 }).map((_, i) => (
          <NavLink key={i} to={`#extra${i + 1}`}>
            Extra {i + 1}
          </NavLink>
        ))}
      </NavDropdown>
    </NavBar>
  ),
};
