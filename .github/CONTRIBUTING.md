## 🤝 Contributing to AI Content Studio

First off, thank you for considering contributing to AI Content Studio! It's people like you that make this project better.

### 📜 Code of Conduct

This project and everyone participating in it is governed by basic respect and professionalism. By participating, you are expected to uphold this standard.

### 🔄 How Can I Contribute?

#### Reporting Bugs

- Use the **Bug Report** template when creating a new issue
- Include as much detail as possible: OS, browser, steps to reproduce
- Check if the bug has already been reported in existing issues

#### Suggesting Features

- Use the **Feature Request** template
- Explain the problem your feature would solve
- Provide use cases and, if possible, mockups

#### Pull Requests

1. **Fork** the repository
2. Create a **feature branch** (`git checkout -b feature/my-new-feature`)
3. **Commit** your changes (`git commit -m 'Add some feature'`)
4. **Push** to the branch (`git push origin feature/my-new-feature`)
5. Open a **Pull Request**

### 📏 Development Guidelines

#### Code Style

- Use **TypeScript** for all new code
- Follow the existing **ESLint** configuration
- Use **Prettier** for consistent formatting
- Write **meaningful commit messages**

#### Component Guidelines

- Use **shadcn/ui** components as building blocks
- Follow the existing component structure in `src/components/`
- Use **Tailwind CSS** for styling — avoid inline styles
- Add **proper TypeScript types** for all props

#### API Guidelines

- Follow RESTful conventions for API routes
- Include proper **error handling** and **validation**
- Use **Zod** for request body validation
- Return consistent **response formats**

#### Database Changes

- Update the **Prisma schema** for any database changes
- Run `npx prisma generate` after schema changes
- Test migrations locally before pushing

### 🧪 Testing

Before submitting a PR:

- [ ] All existing features still work correctly
- [ ] New features have been manually tested
- [ ] Build passes (`npm run build`)
- [ ] No TypeScript errors
- [ ] No ESLint warnings

### 📋 Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How has this been tested?

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-reviewed the code
- [ ] No new warnings generated
- [ ] Documentation updated if needed
```

### ⚠️ Important Notes

- This project is licensed under **CC BY-NC-SA 4.0** — all contributions will be licensed under the same terms
- **Commercial use** of contributed code requires written permission from the author
- You retain copyright of your contributions, but grant a license under the project's terms

Thank you for your contributions! 🎉
