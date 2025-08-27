---
title: Simple pipeline scanner
description: Lightweight pipeline scanner to prevent credentials leak
---

# Pipeline Scanner: Prevent Credential Leaks in CI/CD Pipelines

The pipeline-scanner is a lightweight Bash-based tool designed for DevOps engineers, SREs, and system administrators to audit CI/CD pipeline configuration files (e.g., YAML, Jenkinsfiles) for hardcoded credentials, such as secrets, tokens, or passwords. By catching sensitive data before it’s committed, this tool enhances security and prevents costly leaks, making it an essential utility for any pipeline management workflow.

## Problem

Hardcoding credentials in pipeline configuration files (e.g., docker-compose.yml, .github/workflows/*.yml, or Jenkinsfile) can lead to accidental leaks when files are pushed to repositories. This exposes sensitive information, such as API tokens or passwords, to unauthorized users.

## Goal

To prevent leaks of sensitive information by identifying hardcoded credentials in pipeline files before they are committed or deployed.

## Solution

The pipeline-scanner script automates the detection of hardcoded credentials using a lightweight, Bash-based approach. It scans for common keywords (e.g., aws_, slack_, password) and provides clear feedback to help secure your CI/CD pipelines.

---

## Features

- Scans `.yml`, `.yaml`, and `Jenkinsfile` by default
- Detects keywords like `aws_`, `slack_`, `github_`, `token`, `password`, `secret`
- Logs progress with clear output (`INFO` / `WARN` / `ERROR`)
- Fails gracefully with meaningful error messages
- Works with any target directory (default: current workdir)


---

## Script Example:

Create a file named `pipeline-scanner.sh` and paste the following:

```bash
#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

TARGET=${1:-"."}
CLEAN=0
ISSUE=0

## Setup logging
function log() {
  if [[ -n "${LOG:-}" ]]; then
    printf '%s\n' "$*" | tee -a "$LOG" >&2
  else
    printf '%s\n' "$*" >&2
  fi
}
function fatal() { log "ERROR: $*"; exit 1; }

## Scanning if there's still secrets intact on yaml files
function grep_keyword() {
    local file="$1"
    set +e
    grep -q -E '(aws_|slack_|github_|token|password|secret)' "$file"
    local status=$?

    if [[ $status == 0 ]]; then
        ((ISSUE++))
        log "WARN: Found secrets in $file, avoid hardcoding sensitive data"
    elif [[ $status == 1 ]]; then
        ((CLEAN++))
        log "INFO: File $file is clean"
    else
        fatal "Failed to scan file, check either file permission or checksum if its corrupted"
    fi
}

## Check if yaml file exist before scan
function scan_files() {
    local count="$1"
    if [[ "${count}" == 0 ]]; then
        log "INFO: No YAML/CI files found, skipping scan."
        return 1
    else
        return 0
    fi
}

## Loop through files on current workdir
function scan_path() {
    local TARGET="$1"
    local FILES
    FILES=$(find "$TARGET" -type f \( -name "*.yml" -o -name "*.yaml" -o -name "Jenkinsfile" \))

    local COUNT
    COUNT=$(find "$TARGET" -type f \( -name "*.yml" -o -name "*.yaml" -o -name "Jenkinsfile" \) | wc -l)
    scan_files "$COUNT"
    log "INFO: Found $COUNT file(s) to be scanned."

    for FILE in $FILES; do
        log "INFO: Scanning file $FILE"
        grep_keyword "$FILE"
    done
}

## Main function
function main() {
    log "Starting the scanner ..."
    log "INFO: Scanning directory $TARGET"
    
    scan_path "$TARGET"

    log "INFO: Scan finished."
    log "INFO: $CLEAN file(s) clean."
    log "WARN: $ISSUE file(s) with issues."
}

main
```

## Usage

```bash
# Scan current directory
bash pipeline-scanner.sh 

# Scan a specific directory or file
bash pipeline-scanner.sh /path/to/project
```

Example output

```bash
$ bash pipeline-scanner.sh /data/l2bot
Starting the scanner ...
INFO: Scanning directory /data/l2bot/
INFO: Found 1 file(s) to be scanned.
INFO: Scanning file /data/l2bot/docker-compose.yml
INFO: File /data/l2bot/docker-compose.yml is clean
INFO: Scan finished.
INFO: 1 file(s) clean.
WARN: 0 file(s) with issues.
```

Example with issue
```bash
$ bash pipeline-scanner.sh /data/project
Starting the scanner ...
INFO: Scanning directory /data/project/
INFO: Found 2 file(s) to be scanned.
INFO: Scanning file /data/project/.github/workflows/ci.yml
WARN: Found secrets in /data/project/.github/workflows/ci.yml, avoid hardcoding sensitive data
INFO: Scanning file /data/project/Jenkinsfile
INFO: File /data/project/Jenkinsfile is clean
INFO: Scan finished.
INFO: 1 file(s) clean.
WARN: 1 file(s) with issues.
```

---

## Requirements

* Rocky Linux, AlmaLinux, RHEL, CentOS
* Root/sudo access (if the target directory requires elevated permissions)

---

## What It Does

1. Automatically detects current path if not specified
2. Outputs success or error messages

---

## Future Improvements

- Add option for custom keyword patterns
- Export scan results to JSON/CSV for CI integration
- Add affected file name and which creds hardcoded
- Add Git pre-commit hook support
- Colorized output (green/red logs)


---