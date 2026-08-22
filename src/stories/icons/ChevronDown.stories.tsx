import type { Meta, StoryObj } from "@storybook/react";
import { Icons } from "../..";
import { IconVariations } from "./IconVariations";

const meta: Meta = {
  title: "Icons/ChevronDown",
  parameters: {
    layout: "centered",
  },
};

export default meta;

export const ChevronDown: StoryObj = {
  render: () => <IconVariations Component={Icons.ChevronDown} />,
};
