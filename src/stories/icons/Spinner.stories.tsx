import type { Meta, StoryObj } from "@storybook/react";
import { Icons } from "../..";
import { IconVariations } from "./IconVariations";

const meta: Meta = {
  title: "Icons/Spinner",
  parameters: {
    layout: "centered",
  },
};

export default meta;

export const Spinner: StoryObj = {
  render: () => <IconVariations Component={Icons.Spinner} />,
};
