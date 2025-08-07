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
- **Lint & Format**: `biome check --write` - Auto-fix code style and imports

## Architecture

### Core Components

**Variable Class** (`src/variable.ts`):
- Reactive wrapper around DOM elements with type-safe value transformation
- Supports `get()`, `set()`, `onChange()`, and `computed()` methods
- Modifier functions convert string values to desired types (number, boolean, etc.)

**KittoForm Class** (`src/form.ts`):  
- Manages dynamic form rendering based on component templates
- Uses `kitto-id` attributes to identify reusable form sections
- `render()` method accepts array of selectors and component objects with replacers
- Components can be cloned and have their `name` attributes dynamically replaced

**Integration Pattern** (`src/index.ts`):
- Creates Variable instances bound to form inputs
- Sets up reactive onChange handlers that trigger form re-rendering
- Uses renderForm function to determine which components to show based on current state

### Key Patterns

- **Reactive State**: Variables automatically trigger UI updates via onChange callbacks
- **Component Templates**: Form sections marked with `kitto-id` are stored and cloned as needed  
- **Dynamic Naming**: Component inputs get their `name` attributes replaced with dynamic values (parent, child-1, etc.)
- **Conditional Rendering**: Form sections appear/disappear based on reactive variable values

## Build System

- Uses **zshy** as the bundler with TypeScript source in `src/`
- **Biome** for linting, formatting, and import organization
- Exports configured in `zshy.exports` pointing to `src/index.ts`
- Strict TypeScript configuration with ES2020 target
- Import groups organized by type (Node/Bun, packages, aliases, relative paths)