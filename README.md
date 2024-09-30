# React + TypeScript + Vite + MUI + NgNeat Elf + Storybook + Tailwind

## Project Overview

This project implements a todo list application using React, TypeScript, and various modern web technologies.

## Technologies Used

- React with TypeScript
- Vite for build tooling
- Material-UI for component library
- NgNeat Elf for state management
- Storybook for component documentation
- Tailwind CSS for styling

## State Management

NgNeat Elf is used for state management. Learn more: [NgNeat Elf Documentation](https://ngneat.github.io/elf/docs/store)

## Testing

Tests are implemented using React Testing Library. Some challenges were encountered with testing the analytics capture functionality.

## Requirements Not Implemented

The following requirements were not fully implemented:

- The analytics capture test is incomplete due to challenges encountered.

## Helpful Resources

The following articles were instrumental in overcoming various challenges:

- [Testing Material-UI with React Testing Library](https://jskim1991.medium.com/react-dont-give-up-on-testing-when-using-material-ui-with-react-ff737969eec7)
- [Testing Material-UI Forms](https://www.codementor.io/@jesselangford472/testing-material-ui-forms-with-react-testing-library-1hkfj1yqap)
- [ESLint Plugin for Testing Library](https://github.com/testing-library/eslint-plugin-testing-library/blob/main/docs/rules/prefer-user-event.md)
- [Testing Material-UI Checkbox](https://stackoverflow.com/questions/53271663/how-to-test-material-ui-checkbox-is-checked-with-react-testing-library)
- [Checking Checkbox in React Testing Library](https://stackoverflow.com/questions/55177928/how-do-you-check-a-checkbox-in-react-testing-library)

## Project Structure

The project follows a clean and organized structure, adhering to best practices for React applications.

## Project Template

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```typescript
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```typescript
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
