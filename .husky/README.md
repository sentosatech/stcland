# [Husky](https://typicode.github.io/husky/)

## Overview

This folder contains the configuration for Husky, a tool used to enforce quality checks before code is committed to the repository. Our current setup utilizes the `pre-commit` script located at the root `package.json`, which runs `lint-staged` and tests to ensure that code is in a clean state before it is committed.

## Benefits of Using This Setup

1. **Quality Checks**: By running linting and formatting tasks before committing code, we catch issues early in the development process. This helps maintain code quality and consistency across the project.

2. **Scoped Configuration**: We use a top-level `lint-staged` configuration located in `config/.lintstagedrc.base.js`. However, `lint-staged` will read the nearest configuration relative to the scoped package.

3. **Customizable Hooks**: While our current setup includes only the `pre-commit` hook, Husky supports a variety of Git hooks. These can be configured and managed within the `.husky` folder. Additional hooks such as `pre-push` and `commit-msg` can be set up to enforce further checks or tasks.

## Nice to Know

- **Testing Locally**: 
   - To test the hooks locally without creating a commit, add `exit 1` at the end of the hook file. This will prevent the commit and allow you to verify that the hooks work as expected.
   - *Not recommended* but if you want to skip commit hooks you can use `--no-verify` flag when doing a commit.

