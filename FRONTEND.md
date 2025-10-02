# Frontend Documentation

This document explains SuperFind's React frontend application built with modern TypeScript, Vite, and TailwindCSS.

## 🎯 **Overview**

The frontend provides a clean, responsive interface for interacting with SuperFind's document processing and AI-powered search capabilities. Built with React 19 and modern tooling for optimal developer experience.

```
┌─────────────────────────┐    ┌─────────────────────────┐    ┌─────────────────────────┐
│   React Frontend        │    │   Build Tools           │    │   UI Components         │
│                         │────│                         │────│                         │
│ • TypeScript            │    │ • Vite (Build & Dev)    │    │ • shadcn/ui             │
│ • React 19              │    │ • TailwindCSS           │    │ • Lucide Icons          │
│ • Modern Hooks          │    │ • Biome (Linting)       │    │ • Responsive Design     │
└─────────────────────────┘    └─────────────────────────┘    └─────────────────────────┘
```

## 📁 **Project Structure**

```
frontend/
├── public/                      # Static assets
│   └── vite.svg                # Vite logo
├── src/                        # Source code
│   ├── components/             # React components
│   │   └── ui/                # Reusable UI components
│   │       └── input.tsx      # Input component
│   ├── lib/                   # Utility functions  
│   │   └── utils.ts           # Common utilities
│   ├── App.tsx                # Main application
│   ├── main.tsx              # React entry point
│   ├── index.css             # Global styles & Tailwind
│   └── vite-env.d.ts         # TypeScript definitions
├── index.html                 # HTML entry point
├── package.json              # Dependencies & scripts
├── vite.config.ts            # Vite configuration
├── tsconfig.json             # TypeScript config (references)
├── tsconfig.app.json         # App TypeScript config
├── tsconfig.node.json        # Bun/build TypeScript config
├── components.json           # shadcn/ui configuration
├── biome.json               # Linting & formatting config
└── README.md                # Frontend-specific docs
```

## 🛠️ **Technology Stack**

### **Core Framework**
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Vite 7** - Fast build tool and dev server

### **Styling & UI**
- **TailwindCSS 4** - Utility-first CSS framework
- **shadcn/ui** - High-quality component library
- **Lucide Icons** - Beautiful icon library
- **CSS Variables** - Dark/light theme support

### **Development Tools**
- **Biome** - Fast linter and formatter
- **tw-animate-css** - Animation utilities
- **clsx & tailwind-merge** - Conditional styling

## 🎨 **UI Components**

### **Input Component (`components/ui/input.tsx`)**
```tsx
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground",
        "flex h-9 w-full min-w-0 rounded-md border border-input",
        "bg-transparent px-3 py-1 text-base shadow-xs",
        "focus-visible:border-ring focus-visible:ring-ring/50",
        "disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}
```

**Features:**
- ✅ Accessible design with proper ARIA attributes
- ✅ Consistent styling with design system
- ✅ Focus states and disabled handling
- ✅ File input support
- ✅ Full TypeScript support

### **Utility Functions (`lib/utils.ts`)**
```tsx
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
    return twMerge(clsx(inputs));
};
```

**Purpose:**
- Combines multiple class names intelligently
- Handles conditional classes with clsx
- Resolves Tailwind class conflicts with twMerge
- Essential for component styling flexibility

## 🏗️ **Application Structure**

### **Main App (`App.tsx`)**
```tsx
import { useState } from "react";
import { Input } from "./components/ui/input";

function App() {
    const [inputValue, setInputValue] = useState("");

    return (
        <div className="flex items-center justify-center min-h-screen">
            <Input
                type="text"
                placeholder="Enter something..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-64"
            />
        </div>
    );
}
```

**Current Features:**
- Simple centered input field
- State management with React hooks
- Responsive design with Tailwind classes
- TypeScript with proper event handling

### **Entry Point (`main.tsx`)**
```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

**Features:**
- React 18+ createRoot API
- Strict mode for development checks
- CSS imports for global styles
- TypeScript non-null assertion for root element

## 🎨 **Styling System**

### **TailwindCSS Configuration**
The project uses TailwindCSS v4 with modern configuration:

```css
/* index.css */
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));
```

### **Design System Variables**
```css
:root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --secondary: oklch(0.97 0 0);
  --muted: oklch(0.97 0 0);
  --border: oklch(0.922 0 0);
  /* ... more variables */
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  /* ... dark theme overrides */
}
```

### **Component Styling Pattern**
```tsx
// Consistent styling with cn utility
className={cn(
  // Base styles
  "flex h-9 w-full rounded-md border",
  // State styles
  "focus-visible:border-ring focus-visible:ring-ring/50",
  // Conditional styles
  "disabled:pointer-events-none disabled:opacity-50",
  // Custom overrides
  className
)}
```

## 🔧 **Build Configuration**

### **Vite Config (`vite.config.ts`)**
```ts
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
});
```

**Features:**
- React plugin for JSX support
- TailwindCSS integration via Vite plugin
- Path aliases (@/* → src/*)
- TypeScript support out of the box

### **TypeScript Configuration**

#### **Root Config (`tsconfig.json`)**
```json
{
    "files": [],
    "references": [
        { "path": "./tsconfig.app.json" },
        { "path": "./tsconfig.node.json" }
    ],
    "compilerOptions": {
        "baseUrl": ".",
        "paths": {
            "@/*": ["./src/*"]
        }
    }
}
```

#### **App Config (`tsconfig.app.json`)**  
```json
{
    "compilerOptions": {
        "target": "ES2022",
        "lib": ["ES2022", "DOM", "DOM.Iterable"],
        "module": "ESNext",
        "jsx": "react-jsx",
        "moduleResolution": "bundler",
        "strict": true,
        "noUnusedLocals": true,
        "noUnusedParameters": true
    },
    "include": ["src"]
}
```

**Benefits:**
- Project references for better IDE performance
- Strict TypeScript settings for code quality
- Modern ES2022 target for latest features
- Path mapping for clean imports

## 📦 **Dependencies**

### **Core Dependencies**
```json
{
    "@tailwindcss/vite": "^4.1.12",     // TailwindCSS Vite integration
    "class-variance-authority": "^0.7.1", // Component variant handling
    "clsx": "^2.1.1",                   // Conditional classes
    "lucide-react": "^0.542.0",         // Icon library
    "react": "^19.1.1",                 // React framework
    "react-dom": "^19.1.1",             // React DOM rendering
    "tailwind-merge": "^3.3.1",         // Tailwind class merging
    "tailwindcss": "^4.1.12"            // CSS framework
}
```

### **Development Dependencies**
```json
{
    "@biomejs/biome": "2.2.2",          // Linting & formatting
    "@types/bun": "^1.1.14",           // Bun types
    "@types/react": "^19.1.10",         // React types
    "@types/react-dom": "^19.1.7",      // React DOM types
    "@vitejs/plugin-react": "^5.0.0",   // Vite React plugin
    "tw-animate-css": "^1.3.7",         // Animation utilities
    "typescript": "~5.8.3",             // TypeScript compiler
    "vite": "^7.1.2"                    // Build tool
}
```

## 🚀 **Development Workflow**

### **Available Scripts**
```json
{
    "dev": "vite",                    // Start development server
    "build": "tsc -b && vite build", // Build for production
    "lint": "eslint .",               // Lint code
    "preview": "vite preview"         // Preview production build
}
```

### **Development Server**
```bash
# Start development server with hot reload
bun run dev

# Server starts at http://localhost:5173
# Hot module replacement enabled
# TypeScript checking in real-time
```

### **Production Build**
```bash
# Build optimized production bundle
bun run build

# Outputs to dist/ folder
# TypeScript compilation check
# Asset optimization and minification
```

## 🎯 **Component Development Patterns**

### **State Management**
```tsx
// Local state with useState
const [inputValue, setInputValue] = useState("");
const [isLoading, setIsLoading] = useState(false);

// Derived state
const isValid = inputValue.length > 0;
```

### **Event Handling** 
```tsx
// Typed event handlers
const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
};

// Async operations
const handleSubmit = async () => {
    setIsLoading(true);
    try {
        await submitForm();
    } finally {
        setIsLoading(false);
    }
};
```

### **Component Composition**
```tsx
// Reusable component with proper TypeScript
interface InputProps extends React.ComponentProps<"input"> {
    label?: string;
    error?: string;
}

function Input({ label, error, className, ...props }: InputProps) {
    return (
        <div className="space-y-2">
            {label && <label className="text-sm font-medium">{label}</label>}
            <input className={cn("base-input-styles", className)} {...props} />
            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
}
```

## 🌟 **Planned Features**

### **File Upload Interface**
- Drag-and-drop file upload
- File type validation
- Progress indicators
- Error handling

### **Search Interface**
- Real-time search suggestions  
- Results display with highlighting
- Pagination and filtering
- Export functionality

### **Dashboard**
- System health indicators
- Processing statistics
- File management interface
- Configuration settings

## 🔧 **Configuration Files**

### **shadcn/ui Config (`components.json`)**
```json
{
    "$schema": "https://ui.shadcn.com/schema.json",
    "style": "new-york",
    "rsc": false,
    "tsx": true,
    "tailwind": {
        "config": "",
        "css": "src/index.css",
        "baseColor": "neutral",
        "cssVariables": true
    },
    "aliases": {
        "components": "@/components",
        "utils": "@/lib/utils"
    }
}
```

### **Biome Config (`biome.json`)**
```json
{
    "formatter": {
        "enabled": true,
        "indentStyle": "tab"
    },
    "linter": {
        "enabled": true,
        "rules": {
            "recommended": true
        }
    },
    "javascript": {
        "formatter": {
            "quoteStyle": "double"
        }
    }
}
```

## 🚀 **Best Practices**

### **1. Component Design**
- Keep components small and focused
- Use TypeScript interfaces for props
- Implement proper error boundaries
- Follow accessibility guidelines

### **2. Styling**
- Use Tailwind utility classes consistently
- Implement dark/light theme support
- Maintain responsive design principles
- Optimize for mobile devices

### **3. Performance**
- Use React.memo for expensive components
- Implement proper loading states
- Optimize bundle size with code splitting
- Use Vite's fast refresh for development

### **4. Code Quality**
- Enable strict TypeScript settings
- Use Biome for consistent formatting
- Implement proper error handling
- Write maintainable, readable code

The frontend provides a solid foundation for building SuperFind's user interface with modern React patterns and excellent developer experience.