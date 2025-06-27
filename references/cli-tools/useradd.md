# `useradd` – Create and manage users in Linux

The `useradd` command creates a new user account in the system.

---

## 🧱 Basic Usage

```bash
useradd <username>
```

>Creates a user without a password. You'll need to set it manually using passwd username.

## 🔐 Create user with expiry date and password

Best practice is to avoid repeating steps (DRY principle). You can set the expiry and hashed password at once:

```bash
useradd -e 2025-12-31 -p "$(openssl passwd -6 'yourpassword')" <username>
```

>⚠️ Security tip: Avoid exposing plaintext passwords in your shell history.

## 🛡️ Secure way using stdin

Use standard input to safely handle password creation:
```bash
read -s PWD
useradd -e 2025-12-31 -p "$(openssl passwd -6 <<< "$PWD")" <username"
```
Or:
```bash
openssl passwd -6 -stdin | useradd -e 2025-12-31 -p "$(cat -)" <username>
```

## Note
- -e: account expiration date (YYYY-MM-DD)
- -p: hashed password (use SHA-512 with `openssl passwd -6`)

---