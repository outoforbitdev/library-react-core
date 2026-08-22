import type { Meta, StoryObj } from "@storybook/react";
import { Icons } from "../..";
import { IconVariations } from "./IconVariations";

const meta: Meta = {
  title: "Icons/Check",
  parameters: {
    layout: "centered",
  },
};

export default meta;

export const Check: StoryObj = {
  render: () => <IconVariations Component={Icons.Check} />,
};
