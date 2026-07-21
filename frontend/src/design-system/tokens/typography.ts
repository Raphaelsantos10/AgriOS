export const typography = {
  family: {
    sans: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  size: {
    caption: "0.75rem",
    bodySm: "0.875rem",
    body: "1rem",
    h6: "1rem",
    h5: "1.125rem",
    h4: "1.25rem",
    h3: "1.5rem",
    h2: "2rem",
    h1: "2.5rem",
    display: "3.5rem",
  },
  lineHeight: { tight: 1.1, heading: 1.2, body: 1.5, relaxed: 1.65 },
  weight: { regular: 400, medium: 500, semibold: 600, bold: 700, extrabold: 800, black: 900 },
  tracking: { tight: "-0.035em", normal: "0", label: "0.02em", caps: "0.14em" },
} as const;
