import type { Meta, StoryObj } from "@storybook/react";
import { Icons } from "../..";
import { IconVariations } from "./IconVariations";

const meta: Meta = {
  title: "Icons/Plus",
  parameters: {
    layout: "centered",
  },
};

export default meta;

export const Plus: StoryObj = {
  render: () => <IconVariations Component={Icons.Plus} />,
};
