// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, vue3-vite, etc.
import type { Preview } from "@storybook/react-webpack5";

const preview = {
  args: {
    label: "Button",
  },
  argTypes: {
    // 👇 All stories expect a label arg
    style: {
      table: {
        disable: true,
      },
    },
  },
} satisfies Preview;

export default preview;
