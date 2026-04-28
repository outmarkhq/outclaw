# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in Outclaw, **please do not open a public issue**. Instead, report it responsibly so we can address it before it is disclosed publicly.

### How to Report

Send an email to **security@outmarkhq.com** with the following details:

- A description of the vulnerability
- Steps to reproduce the issue
- The potential impact
- Any suggested fixes, if you have them

### What to Expect

- We will acknowledge your report within **48 hours**.
- We will provide an initial assessment within **5 business days**.
- We will work with you to understand and resolve the issue.
- Once the fix is released, we will publicly credit you (unless you prefer to remain anonymous).

## Supported Versions

| Version | Supported |
|---|---|
| Latest `main` | Yes |
| Older releases | Best effort |

## Security Best Practices for Self-Hosting

When deploying Outclaw on your own infrastructure, follow these recommendations:

- **Use strong secrets**: Generate a unique, random `JWT_SECRET` (at least 32 characters).
- **Encrypt in transit**: Always use HTTPS in production. Place Outclaw behind a reverse proxy (nginx, Caddy) with TLS.
- **Restrict database access**: Ensure your MySQL instance is not publicly accessible. Use firewall rules and strong passwords.
- **Keep dependencies updated**: Run `pnpm audit` regularly and update dependencies.
- **Protect API keys**: Store LLM provider API keys securely. Outclaw encrypts them at rest in the database, but ensure your database itself is secured.
- **Limit admin access**: Only grant admin roles to trusted users. Admin accounts have full workspace management capabilities.

## Scope

This security policy covers the Outclaw application code in this repository. It does not cover:

- Third-party services (LLM providers, email services, S3 storage)
- Your hosting infrastructure configuration
- Browser extensions or client-side modifications

---

Thank you for helping keep Outclaw and its users safe.
