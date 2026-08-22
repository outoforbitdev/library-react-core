import type { Meta, StoryObj } from "@storybook/react";
import { Icons } from "../..";
import { IconVariations } from "./IconVariations";

const meta: Meta = {
  title: "Icons/ChevronRight",
  parameters: {
    layout: "centered",
  },
};

export default meta;

export const ChevronRight: StoryObj = {
  render: () => <IconVariations Component={Icons.ChevronRight} />,
};
