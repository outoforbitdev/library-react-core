import type { Preview } from "@storybook/react-webpack5";

const preview: Preview = {
  args: {
    className: "ood-primary",
  },
  argTypes: {
    // 👇 All stories expect a label arg
    children: {
      table: {
        disable: true,
      },
    },
    id: {
      table: {
        disable: true,
      },
    },
    onClick: {
      table: {
        disable: true,
      },
    },
    style: {
      table: {
        disable: true,
      },
    },
  },
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
