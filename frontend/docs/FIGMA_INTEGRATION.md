# Figma + Storybook Integration Guide

This project supports bidirectional integration between Figma and Storybook.

## 🎨 Viewing Figma Designs in Storybook

Use the `@storybook/addon-designs` to embed Figma frames directly in your stories.

### How to Link a Figma Design to a Story

1. **Get the Figma URL**: In Figma, right-click on a frame → "Copy link to selection"

2. **Add to your story**:

```tsx
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
  title: "atoms/Button",
  component: Button,
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/file/YOUR_FILE_ID/YOUR_FILE_NAME?node-id=XX-XX",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: "primary",
    children: "Button",
  },
};

// You can also add design to individual stories
export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Button",
  },
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/file/YOUR_FILE_ID/YOUR_FILE_NAME?node-id=YY-YY",
    },
  },
};
```

3. **View in Storybook**: A "Design" tab will appear in the addon panel showing the embedded Figma design

### Multiple Designs Per Story

```tsx
parameters: {
  design: [
    {
      name: "Desktop",
      type: "figma",
      url: "https://www.figma.com/file/xxx?node-id=1-1",
    },
    {
      name: "Mobile", 
      type: "figma",
      url: "https://www.figma.com/file/xxx?node-id=2-2",
    },
  ],
},
```

### Embedding Figma Prototypes

```tsx
parameters: {
  design: {
    type: "figma",
    url: "https://www.figma.com/proto/YOUR_FILE_ID/...",
    allowFullscreen: true,
  },
},
```

---

## 🔗 Viewing Storybook Components in Figma

Use the **Storybook Connect** Figma plugin to view live Storybook stories inside Figma.

### Setup Steps

1. **Install the Plugin**: Go to [Storybook Connect](https://www.figma.com/community/plugin/1056265616080331589) in Figma Community and install it

2. **Publish your Storybook** (optional but recommended):
   - Deploy to Chromatic, Vercel, Netlify, or any hosting
   - Or use `localhost` for local development

3. **Link Stories to Figma Frames**:
   - Select a frame in Figma
   - Open Storybook Connect plugin (Plugins → Storybook Connect)
   - Paste your Storybook URL (e.g., `https://your-storybook.vercel.app`)
   - Browse and select the story to link
   - The frame will now show the live component

### Benefits

- **Live Preview**: See actual rendered components, not static designs
- **Always Up-to-Date**: Changes to code automatically reflect in Figma
- **Design Handoff**: Developers and designers stay in sync

---

## 📤 Exporting Code to Figma (html.to.design)

For creating Figma designs from your existing components:

1. Run Storybook locally: `bun run storybook`
2. In Figma, install [html.to.design](https://www.figma.com/community/plugin/1159123024924461424)
3. Run the plugin and enter your Storybook URL (e.g., `http://localhost:6006`)
4. Select the story/page to import
5. The plugin converts it to editable Figma layers

---

## 🛠️ Development Workflow

### Recommended Workflow

1. **Design First**: Create designs in Figma
2. **Link to Stories**: Add Figma URLs to story parameters
3. **Build Components**: Implement the designs in React
4. **Verify**: Compare side-by-side in Storybook's Design tab
5. **Update Figma**: Use Storybook Connect to show live components

### Commands

```bash
# Start Storybook locally
bun run storybook

# Build Storybook for deployment
bun run build-storybook
```

---

## 📚 Resources

- [addon-designs Documentation](https://storybook.js.org/addons/@storybook/addon-designs)
- [Storybook Connect Plugin](https://www.figma.com/community/plugin/1056265616080331589)
- [html.to.design Plugin](https://www.figma.com/community/plugin/1159123024924461424)
