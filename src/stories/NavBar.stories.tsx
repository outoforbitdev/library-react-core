import type { Meta, StoryObj } from '@storybook/react-webpack5';

import { NavBar } from '../components/NavBar';
import { NavLink } from '../components/NavLink';
import { NavDropdown } from '../components/NavDropdown';

const meta = {
  title: 'Example/NavBar',
  component: NavBar,
  subcomponents: {
    NavLink,
    NavDropdown,
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
  args: {
  },
} satisfies Meta<typeof NavBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LoggedIn: Story = {
  render: (args) => (
    <NavBar {...args}>
      <NavLink to="./">Home</NavLink>
      <NavDropdown label="More">
        <NavLink to="./">About</NavLink>
        <NavLink to="./">Contact</NavLink>
      </NavDropdown>
    </NavBar>
  ),
};

export const LoggedOut: Story = {};
