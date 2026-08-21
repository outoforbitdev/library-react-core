import type { Meta, StoryObj } from "@storybook/react";
import * as Icons from "../components/icons";
import { IconSize } from "../components/icons";

const meta: Meta = {
  title: "Icons",
  parameters: {
    layout: "centered",
  },
};

export default meta;

const AllIcons = [
  { name: "Check", Component: Icons.Check },
  { name: "ChevronDown", Component: Icons.ChevronDown },
  { name: "ChevronUp", Component: Icons.ChevronUp },
  { name: "ChevronLeft", Component: Icons.ChevronLeft },
  { name: "ChevronRight", Component: Icons.ChevronRight },
  { name: "Error", Component: Icons.Error },
  { name: "HamburgerMenu", Component: Icons.HamburgerMenu },
  { name: "Plus", Component: Icons.Plus },
  { name: "Spinner", Component: Icons.Spinner },
  { name: "Warning", Component: Icons.Warning },
  { name: "X", Component: Icons.X },
];

export const AllDefault: StoryObj = {
  render: () => (
    <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
      {AllIcons.map(({ name, Component }) => (
        <div key={name} style={{ textAlign: "center" }}>
          <Component />
          <p style={{ marginTop: "0.5rem", fontSize: "0.875rem" }}>{name}</p>
        </div>
      ))}
    </div>
  ),
};

export const AllBordered: StoryObj = {
  render: () => (
    <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
      {AllIcons.map(({ name, Component }) => (
        <div key={name} style={{ textAlign: "center" }} className="ood-primary">
          <Component bordered />
          <p style={{ marginTop: "0.5rem", fontSize: "0.875rem" }}>{name}</p>
        </div>
      ))}
    </div>
  ),
};

export const AllInverted: StoryObj = {
  render: () => (
    <div
      style={{
        display: "flex",
        gap: "2rem",
        flexWrap: "wrap",
        padding: "1rem",
        backgroundColor: "#f0f0f0",
      }}
    >
      {AllIcons.map(({ name, Component }) => (
        <div key={name} style={{ textAlign: "center" }}>
          <Component inverted />
          <p style={{ marginTop: "0.5rem", fontSize: "0.875rem" }}>{name}</p>
        </div>
      ))}
    </div>
  ),
};

export const AllBorderedInverted: StoryObj = {
  render: () => (
    <div
      style={{
        display: "flex",
        gap: "2rem",
        flexWrap: "wrap",
        padding: "1rem",
        backgroundColor: "#f0f0f0",
      }}
    >
      {AllIcons.map(({ name, Component }) => (
        <div key={name} style={{ textAlign: "center" }}>
          <Component bordered inverted />
          <p style={{ marginTop: "0.5rem", fontSize: "0.875rem" }}>{name}</p>
        </div>
      ))}
    </div>
  ),
};

export const Sizes: StoryObj = {
  render: () => (
    <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
      <div style={{ textAlign: "center" }}>
        <Icons.Check size={IconSize.ExtraSmall} bordered />
        <p style={{ fontSize: "0.75rem" }}>XS</p>
      </div>
      <div style={{ textAlign: "center" }}>
        <Icons.Check size={IconSize.Small} bordered />
        <p style={{ fontSize: "0.875rem" }}>S</p>
      </div>
      <div style={{ textAlign: "center" }}>
        <Icons.Check size={IconSize.Medium} bordered />
        <p style={{ fontSize: "1rem" }}>M (default)</p>
      </div>
      <div style={{ textAlign: "center" }}>
        <Icons.Check size={IconSize.Large} bordered />
        <p style={{ fontSize: "1.125rem" }}>L</p>
      </div>
      <div style={{ textAlign: "center" }}>
        <Icons.Check size={IconSize.ExtraLarge} bordered />
        <p style={{ fontSize: "1.25rem" }}>XL</p>
      </div>
    </div>
  ),
};

export const ChevronAdditiveRotation: StoryObj = {
  render: () => (
    <div
      style={{
        display: "flex",
        gap: "2rem",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <Icons.ChevronDown />
        <p>ChevronDown (0° rotation)</p>
      </div>
      <div style={{ textAlign: "center" }}>
        <Icons.ChevronDown style={{ transform: "rotate(90deg)" }} />
        <p>ChevronDown + 90° consumer rotation</p>
      </div>
      <div style={{ textAlign: "center" }}>
        <Icons.ChevronDown style={{ transform: "rotate(180deg)" }} />
        <p>ChevronDown + 180° consumer rotation</p>
      </div>
    </div>
  ),
};
