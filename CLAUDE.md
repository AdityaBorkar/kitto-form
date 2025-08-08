# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Kitto Form is a reactive form management library built in vanilla TypeScript. It provides:
- **Variable**: Reactive variables that bind to DOM elements with type-safe transformations and change listeners
- **KittoForm**: Dynamic form rendering system that can show/hide form sections based on reactive state
- Component-based architecture using `kitto-id` attributes for reusable form sections

## Development Commands

- **Build**: `bun run build` - Builds the library using zshy bundler and runs Biome formatting
- **Type Check**: `bun run check:types` - Runs TypeScript type checking without emitting files
- **Code Quality**: `bun run check:code` - Runs Biome linting and formatting on changed files
- **Test**: `bun test` - Runs all tests using Bun's built-in test runner
- **Single Test**: `bun test <file>` - Run specific test file
- **Lint & Format**: `biome check --write` - Auto-fix code style and imports

## Architecture

### Core Components

**Variable Class** (`src/variable.ts`):
- Reactive wrapper around DOM elements with type-safe value transformation
- Supports `get()`, `set()`, `onChange()`, and `computed()` methods
- Modifier functions convert string values to desired types (number, boolean, etc.)

**KittoForm Class** (`src/form.ts`):  
- Fluent API with method chaining: `field().if().render()` or `field().modify().repeat().render()`
- Uses `kitto-slot` attributes for render targets and `kitto-component` for templates
- `render()` method accepts options: `{slot, show, name}` for component placement
- Components clone templates and replace `$parent` placeholders with dynamic names
- `repeat()` method enables dynamic repetition with `$n` index replacement

**Integration Pattern** (`src/index.ts`):
- Demonstrates usage with fluent API chaining for conditional and repeated rendering
- Variables automatically trigger re-rendering via onChange callbacks

### Key Patterns

- **Reactive State**: Variables automatically trigger UI updates via onChange callbacks
- **Component Templates**: Form sections marked with `kitto-component="@name"` are cloned as needed  
- **Dynamic Naming**: Component inputs get their `name` attributes replaced with dynamic values (`$parent` → parent, `$n` → 1, 2, 3...)
- **Conditional Rendering**: Form sections appear/disappear based on reactive variable values and fluent API conditions
- **Slot-based Rendering**: Components render into `kitto-slot` target elements

## Build System & Testing

- Uses **zshy** as the bundler with TypeScript source in `src/`
- **Biome** for linting, formatting, and import organization
- Exports configured in `zshy.exports` pointing to `src/index.ts`
- Strict TypeScript configuration with ES2020 target
- **Testing**: Bun test runner with JSDOM for DOM simulation (`tests/setup.ts`)
- Test files in `tests/` directory with `.test.ts` extension