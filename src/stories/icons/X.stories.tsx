import type { Meta, StoryObj } from "@storybook/react";
import { Icons } from "../..";
import { IconVariations } from "./IconVariations";

const meta: Meta = {
  title: "Icons/X",
  parameters: {
    layout: "centered",
  },
};

export default meta;

export const X: StoryObj = {
  render: () => <IconVariations Component={Icons.X} />,
};
