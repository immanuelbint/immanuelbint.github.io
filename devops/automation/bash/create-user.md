---
title: Create User Script
description: Automate user creation using shell script to reduce time-consuming
---

# Automating `useradd` Using Shell Script

## Problem

In Linux environments, creating users is a common task. However, doing it manually can be time consuming, especially when handling multiple users at once.

## Goal

To reduce repetition by automating the `useradd` process, while still allowing manual override when needed.

---

## Solution – Bash Script for `useradd`

## Features:
- Create user with expiration date to meet the best practice
- Validate user existence before attempt to create user
- Print success/failure feedback.

---

## Script Example

Create a file named `useradd.sh` and paste the following:

```bash
#!/bin/bash
## setup logging
function log() {
  if [[ -n "${LOG:-}" ]]; then
    printf '%s\n' "$*" | tee -a "$LOG" >&2
  else
    printf '%s\n' "$*" >&2
  fi
}
function fatal() { log "ERROR: $*"; exit 1; }

## Function read user input
function read_user_input() {
    default_expiry=$(date -d "+1 month" "+%Y-%m-%d")
    read -r -p "Enter username you'd like to create = " username
    read -r -p "Enter expiration date for user (default: $default_expiry): " input
    exp_date="${input:-$default_expiry}"
}

## Function create user
function create_user() {
    if sudo useradd "${username}" -e "${exp_date}"; then
        log "INFO: User '${username}' created successfully with expiry: ${exp_date}"
    else
        fatal "Failed to create user '${username}'. Check permissions or inputs."
    fi
}

## Function check if user exists
function check_if_user_exist() {
    read_user_input
    while grep -q "${username}" /etc/passwd;
    do
        log "User '${username}' already exist's, please enter other name"
        read_user_input
    done
    create_user && log "INFO: create user '${username}' success"
}

## Main program
check_if_user_exist
```

---

## Usage

1. **Make the script executable:**

```bash
chmod +x useradd.sh
```

2. **Run the script:**

```bash
bash useradd.sh
```

---

## Notes & Improvements

> This script is part of an ongoing learning project and may not fully reflect best practices. Future improvements include:
>
> * Adding support for multi-user creation
> * Secure credential handling via stdin or environment variables.
>
> I'm actively improving this script toward production-ready standards.

---

## Related Topics

* [Create User RedHat Docs](https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/6/html/deployment_guide/s2-users-cl-tools)
---