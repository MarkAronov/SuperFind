# Contributing to SuperFind

Thank you for your interest in contributing to SuperFind! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

Please be respectful and inclusive in all interactions. We're committed to providing a welcoming environment for all contributors.

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- Bun (package manager)
- Git

### Local Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/MarkAronov/SuperFind.git
   cd SuperFind
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory with required environment variables (ask maintainers for details)

4. **Run the project**
   ```bash
   # Start backend
   bun run dev
   
   # Start frontend (in another terminal)
   cd frontend
   bun run dev
   ```

## Development Workflow

### Branch Naming
- Feature: `feature/description`
- Bug fix: `fix/description`
- Improvement: `chore/description`

### Making Changes

1. Create a new branch from `main`
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes following the code style guidelines

3. Test your changes thoroughly
   ```bash
   bun run test
   ```

4. Format and lint your code
   ```bash
   bun run format
   bun run lint
   ```

5. Commit with clear, descriptive messages
   ```bash
   git commit -m "feat: add description of your changes"
   ```

### Pull Request Process

1. Push your branch to GitHub
   ```bash
   git push origin feature/your-feature-name
   ```

2. Open a Pull Request with a clear title and description
   - Reference any related issues
   - Describe the changes and why they're needed
   - Include screenshots or videos if applicable

3. Address any review comments promptly

4. Ensure all CI/CD checks pass

## Code Style Guidelines

### TypeScript
- Use explicit type annotations
- Follow existing naming conventions
- Keep functions focused and well-documented

### React Components
- Use functional components with hooks
- Keep components small and reusable
- Organize components by atomic design (atoms, molecules, organisms)

### General
- Use meaningful variable and function names
- Write comments for complex logic
- Keep lines under 100 characters when possible

## Project Structure

- `/src` - Backend source code
  - `/ai` - AI provider integrations
  - `/config` - Configuration files
  - `/parser` - Document parsing services
  - `/services` - Core services
  - `/vector` - Vector database services
- `/frontend` - React frontend application
  - `/src/components` - UI components (organized by atomic design)
  - `/src/hooks` - Custom React hooks
  - `/src/types` - TypeScript type definitions
- `/static-data` - Sample data for testing and development

## Testing

- Write tests for new features
- Ensure existing tests pass before submitting PR
- Aim for reasonable code coverage

## Documentation

- Update README.md if adding new features
- Document API endpoints clearly
- Include inline comments for complex logic
- Update environment variable documentation

## Issues and Bug Reports

- Check existing issues before creating new ones
- Provide clear reproduction steps for bugs
- Include environment information (OS, Node version, etc.)
- Use descriptive titles and detailed descriptions

## Questions?

- Open a GitHub issue with your question
- Check existing issues for similar questions
- Be as specific as possible about your question

## License

By contributing to SuperFind, you agree that your contributions will be licensed under the same license as the project (MIT License).

