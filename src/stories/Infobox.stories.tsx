import type { Meta, StoryObj } from "@storybook/react";

import { Infobox } from "../components/infobox/Infobox";
import { InfoboxTitle } from "../components/infobox/InfoboxTitle";
import { InfoboxSection } from "../components/infobox/InfoboxSection";
import { InfoboxRow } from "../components/infobox/InfoboxRow";

const meta: Meta<typeof Infobox> = {
  title: "Example/Infobox",
  component: Infobox,
  subcomponents: {
    InfoboxTitle,
    InfoboxSection,
    InfoboxRow,
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen",
  },
  args: {
    className: "ood-primary",
  },
  render: (args) => (
    <Infobox {...args}>
      <InfoboxTitle>Title</InfoboxTitle>
      <InfoboxSection title="Section 1">
        <InfoboxRow label="Row 1">Value 1</InfoboxRow>
        <InfoboxRow label="Row 2">
          <a href="#">Value 2</a>
        </InfoboxRow>
        <InfoboxRow label="Row 3">Value 3</InfoboxRow>
      </InfoboxSection>
      <InfoboxSection title="Section 2">
        <InfoboxRow label="Row 4">
          <ul>
            <li>Value 4a</li>
            <li>Value 4b</li>
            <li>
              Value 4c
              <ul>
                <li>Value 4c i</li>
                <li>Value 4c ii</li>
                <li>Value 4c iii</li>
              </ul>
            </li>
          </ul>
        </InfoboxRow>
        <InfoboxRow label="Row 5">Value 5</InfoboxRow>
      </InfoboxSection>
    </Infobox>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: {
    className: "ood-secondary",
  },
};

export const Accent: Story = {
  args: {
    className: "ood-primary ood-accent",
  },
};

export const AccentBlock: Story = {
  args: {
    className: "ood-accent-block",
  },
};
