import type { Meta, StoryObj } from "@storybook/react";
import { Icons } from "../..";
import { IconVariations } from "./IconVariations";

const meta: Meta = {
  title: "Icons/HamburgerMenu",
  parameters: {
    layout: "centered",
  },
};

export default meta;

export const HamburgerMenu: StoryObj = {
  render: () => <IconVariations Component={Icons.HamburgerMenu} />,
};
