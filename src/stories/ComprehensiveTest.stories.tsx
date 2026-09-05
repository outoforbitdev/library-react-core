import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import {
  NavBar,
  NavLink,
  NavDropdown,
  Expandable,
  Button,
  Infobox,
  InfoboxTitle,
  InfoboxSection,
  InfoboxRow,
  Icons,
} from "../index";

const { Error: ErrorIcon, Warning: WarningIcon } = Icons;

const meta = {
  title: "Comprehensive Test Story",
  parameters: {
    layout: "fullscreen",
  },
  render: () => {
    const [showError, setShowError] = useState(false);
    const [showWarning, setShowWarning] = useState(false);

    return (
      <div
        className="ood-primary"
        style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
      >
        {/* Navigation Bar */}
        <NavBar home="#" homeLabel="Test App" className="ood-secondary">
          <NavLink to="#">Home</NavLink>
          <NavDropdown label="Features">
            <NavLink to="#">Components</NavLink>
            <NavLink to="#">Documentation</NavLink>
            <NavLink to="#">Examples</NavLink>
          </NavDropdown>
          <NavLink to="#">About</NavLink>
          <Button
            onClick={() => setShowError(!showError)}
            aria-label={showError ? "Hide Error" : "Show Error"}
            borderless
          >
            <ErrorIcon bordered className="ood-error-block" />
          </Button>
          <Button
            onClick={() => setShowWarning(!showWarning)}
            aria-label={showWarning ? "Hide Warning" : "Show Warning"}
            borderless
          >
            <WarningIcon bordered className="ood-warning-block" />
          </Button>
        </NavBar>

        {/* Main Content */}
        <div style={{ flex: 1, padding: "2rem", margin: "0 auto" }}>
          {/* Primary Section */}
          <section style={{ marginBottom: "3rem" }}>
            <h1 className="ood-accent">
              Welcome to the Comprehensive Test Story
            </h1>
            <ExampleInfobox />
            <p>
              <strong>This is a test story</strong>, designed to exercise all of
              the components in this component library.
            </p>
            <p>
              Within this story, you can interact with the navigation bar,
              toggle status messages, expand and collapse sections, and view
              different theme variants. The purpose of this story is to provide
              a comprehensive demonstration of the library's capabilities in a
              single view.
            </p>
          </section>

          {/* Status Messages */}
          {showError && (
            <div
              className="ood-primary ood-accent"
              style={{
                padding: "1rem",
                marginBottom: "1rem",
                borderRadius: "0.25rem",
                borderLeft: "4px solid var(--ood-error)",
              }}
            >
              <strong style={{ color: "var(--ood-error)" }}>Error:</strong> This
              is an error message example.
            </div>
          )}
          {showWarning && (
            <div
              className="ood-primary ood-accent"
              style={{
                padding: "1rem",
                marginBottom: "1rem",
                borderRadius: "0.25rem",
                borderLeft: "4px solid var(--ood-warning)",
              }}
            >
              <strong style={{ color: "var(--ood-warning)" }}>Warning:</strong>{" "}
              This is a warning message example.
            </div>
          )}

          {/* Expandable Sections */}
          <section style={{ marginBottom: "3rem" }}>
            <h2 style={{ marginBottom: "1rem" }}>Expandable Sections</h2>
            <Expandable
              className="ood-primary"
              title="Primary Section - Click to Expand"
              style={{ marginBottom: "1rem" }}
            >
              <p style={{ lineHeight: "1.6" }}>
                This is primary text content inside an expandable section. You
                can click the title or chevron to expand or collapse this
                content. The section starts in a collapsed state by default.
              </p>
            </Expandable>

            <Expandable
              className="ood-secondary"
              title="Secondary Section - Click to Expand"
              style={{ marginBottom: "1rem" }}
            >
              <p style={{ lineHeight: "1.6" }}>
                This is secondary text content inside another expandable
                section. Notice the different styling applied through the{" "}
                <code>ood-secondary</code> class name.
              </p>
            </Expandable>

            <Expandable
              className="ood-primary ood-accent"
              title="Accent Section - Click to Expand"
              defaultExpanded
              style={{ marginBottom: "1rem" }}
            >
              <p style={{ lineHeight: "1.6" }}>
                <strong>Accent text</strong> is displayed here with the{" "}
                <code>ood-accent</code> modifier. This section starts in an
                expanded state to showcase the content immediately. You can
                still click to collapse it.
              </p>
              <ul style={{ lineHeight: "1.6", paddingLeft: "1.5rem" }}>
                <li>Expandable sections can contain rich HTML content</li>
                <li>They support semantic formatting like lists and links</li>
                <li>
                  <a href="#">Links can be included</a> within the content
                </li>
              </ul>
            </Expandable>
          </section>

          {/* Theme Demonstration */}
          <section>
            <h2>Theme Variants</h2>
            <ThemeExpandable title="Text Themes">
              <ThemeCard className="ood-primary" title="Primary Theme">
                This section uses the primary theme variant.
              </ThemeCard>
              <ThemeCard className="ood-accent" title="Accent Theme">
                This section uses the primary theme with accent modifier.
              </ThemeCard>
              <ThemeCard className="ood-error" title="Error Theme">
                This section uses the primary theme with error modifier.
              </ThemeCard>
              <ThemeCard className="ood-warning" title="Warning Theme">
                This section uses the primary theme with warning modifier.
              </ThemeCard>
              <ThemeCard className="ood-submit" title="Submit Theme">
                This section uses the primary theme with submit modifier.
              </ThemeCard>
            </ThemeExpandable>
            <ThemeExpandable title="Block Themes">
              <ThemeCard className="ood-secondary" title="Secondary Theme">
                This section uses the secondary theme variant.
              </ThemeCard>
              <ThemeCard
                className="ood-accent-block"
                title="Accent Block Theme"
              >
                This section uses the accent-block theme variant.
              </ThemeCard>
              <ThemeCard className="ood-error-block" title="Error Block Theme">
                This section uses the error-block theme variant.
              </ThemeCard>
              <ThemeCard
                className="ood-warning-block"
                title="Warning Block Theme"
              >
                This section uses the warning-block theme variant.
              </ThemeCard>
              <ThemeCard
                className="ood-submit-block"
                title="Submit Block Theme"
              >
                This section uses the submit-block theme variant.
              </ThemeCard>
            </ThemeExpandable>
          </section>
        </div>
      </div>
    );
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const ComprehensiveTest: Story = {};

const ExampleInfobox = () => {
  return (
    <Infobox className="ood-accent-block" style={{ float: "right" }}>
      <InfoboxTitle>Component Information</InfoboxTitle>
      <InfoboxSection title="Details">
        <InfoboxRow label="Type">Comprehensive Test Story</InfoboxRow>
        <InfoboxRow label="Purpose">
          Showcase all library components in one view
        </InfoboxRow>
        <InfoboxRow label="Components Included">
          <ul style={{ marginTop: "0.25rem", paddingLeft: "1.5rem" }}>
            <li>
              <a href="./?path=/docs/example-navbar--docs">NavBar</a> with
              navigation links
            </li>
            <li>Status icon buttons (Error, Warning)</li>
            <li>
              <a href="./?path=/docs/example-expandable--docs">Expandable</a>{" "}
              sections
            </li>
            <li>
              <a href="./?path=/docs/example-infobox--docs">Infobox</a> with
              structured information
            </li>
            <li>Multiple theme variants</li>
          </ul>
        </InfoboxRow>
      </InfoboxSection>
      <InfoboxSection title="Styling Options">
        <InfoboxRow label="Primary">
          <code className="ood-primary">className="ood-primary"</code>
        </InfoboxRow>
        <InfoboxRow label="Secondary">
          <code className="ood-secondary">className="ood-secondary"</code>
        </InfoboxRow>
        <InfoboxRow label="Accent">
          <code className="ood-accent">className="ood-accent"</code>
        </InfoboxRow>
        <InfoboxRow label="Accent Block">
          <code className="ood-accent-block">className="ood-accent-block"</code>
        </InfoboxRow>
        <InfoboxRow label="Error">
          <code className="ood-error">className="ood-error"</code>
        </InfoboxRow>
        <InfoboxRow label="Error Block">
          <code className="ood-error-block">className="ood-error-block"</code>
        </InfoboxRow>
        <InfoboxRow label="Warning">
          <code className="ood-warning">className="ood-warning"</code>
        </InfoboxRow>
        <InfoboxRow label="Warning Block">
          <code className="ood-warning-block">
            className="ood-warning-block"
          </code>
        </InfoboxRow>
        <InfoboxRow label="Submit">
          <code className="ood-submit">className="ood-submit"</code>
        </InfoboxRow>
        <InfoboxRow label="Submit Block">
          <code className="ood-submit-block">className="ood-submit-block"</code>
        </InfoboxRow>
      </InfoboxSection>
    </Infobox>
  );
};

const ThemeExpandable = (props: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <Expandable
      title={props.title}
      style={{
        border: "1px solid var(--ood-border)",
        marginBottom: "1rem",
        display: "block",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1rem",
          padding: "1rem",
        }}
      >
        {props.children}
      </div>
    </Expandable>
  );
};

const ThemeCard = (props: {
  className: string;
  title: string;
  children: string;
}) => {
  return (
    <div
      className={props.className}
      style={{
        padding: "1.5rem",
        borderRadius: "0.25rem",
        border: "1px solid var(--ood-border)",
      }}
    >
      <h3 style={{ marginTop: 0 }}>{props.title}</h3>
      <p>{props.children}</p>
    </div>
  );
};
