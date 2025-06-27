---
title: Upgrading CentOS 7 to Rocky Linux 8
description: Step-by-step guide to upgrade centos 7 to rocky 8 using leap-upgrade.
tags: [leap, centos, rocky linux, upgrade]
---

# Upgrading CentOS 7 to Rocky Linux 8

## Introduction
Welcome to our Storage How-to Guides—a curated set of clear, step-by-step tutorials designed to simplify storage and system management tasks in Linux environments. This guide walks you through upgrading a CentOS 7 system to Rocky Linux 8 using the `leapp` tool. Whether you’re modernizing your OS or preparing for new software requirements, this tutorial provides practical steps to ensure a smooth transition. No deep expertise is needed—just follow along for reliable results.

## Environment
- **Operating System**: CentOS 7.
- **Target OS**: Rocky Linux 8.
- **Tools**: `leapp`, `elevate-release`, `leapp-data-rocky`.

## Prerequisites
- **Backup**: Back up all critical data and configurations to prevent data loss.
- **System Requirements**: Ensure the system meets Rocky Linux 8 requirements (e.g., 2 GB RAM, 20 GB disk space).
- **Internet Access**: Required for downloading packages and repositories.
- **Root Access**: Run commands as `root` or with `sudo`.

## Steps

### Step 1 - Update CentOS 7 Packages
Before upgrading, ensure all CentOS 7 packages are up to date:
```bash
sudo yum upgrade -y
```
- `-y`: Automatically confirms package updates.

### Step 2 - Reboot the System
Reboot to apply any kernel or system updates:
```bash
sudo reboot
```

### Step 3 - Update Packages Again
After rebooting, run another update to catch any remaining packages:
```bash
sudo yum update -y
```

### Step 4 - Reboot Again
Perform a second reboot to ensure the system is fully updated:
```bash
sudo reboot
```

### Step 5 - Verify OS and Kernel Version
Check the current CentOS version and kernel:
```bash
cat /etc/centos-release
uname -r
```
Example output:
```
CentOS Linux release 7.9.2009 (Core)
3.10.0-1160.el7.x86_64
```
- This confirms you’re running CentOS 7 with the latest updates.

### Step 6 - Install the Elevate Repository
Install the `elevate-release` package to enable the repository for the upgrade:
```bash
sudo yum install -y http://repo.almalinux.org/elevate/elevate-release-latest-el$(rpm --eval %rhel).noarch.rpm
```
- This sets up the repository for Enterprise Linux 7 (EL7).

### Step 7 - Install Leapp and Rocky Data Packages
Install the `leapp-upgrade` tool and the `leapp-data-rocky` package for Rocky Linux migration:
```bash
sudo yum install -y leapp-upgrade leapp-data-rocky
```

### Step 8 - Run the First Pre-Upgrade Check
Perform an initial pre-upgrade check to assess the system’s readiness:
```bash
sudo leapp preupgrade
```
- This analyzes packages, repositories, and system configuration for compatibility with Rocky Linux 8.
- Check the generated report for issues:
  - `/var/log/leapp/leapp-report.txt`: Lists potential problems and remediation steps.
  - `/var/log/leapp/answerfile`: Records pre-upgrade prompts and responses.

### Step 9 - Configure SSH and Leapp Settings
To address common issues during the upgrade:
1. Enable root login in SSH (required by `leapp`):
   ```bash
   echo "PermitRootLogin yes" | sudo tee -a /etc/ssh/sshd_config
   sudo systemctl restart sshd
   ```
2. Answer specific `leapp` checks to bypass known issues:
   ```bash
   leapp answer --section authselect_check.confirm=True
   leapp answer --section remove_pam_pkcs11_module_check.confirm=True
   ```

### Step 10 - Run the Second Pre-Upgrade Check
Repeat the pre-upgrade check to ensure all issues are resolved:
```bash
sudo leapp preupgrade
```
- Review `/var/log/leapp/leapp-report.txt` again for any remaining issues.
- Follow remediation steps if errors are reported (e.g., removing conflicting packages).

**Note**: Thoroughly inspect `/var/log/leapp/leapp-report.txt` and `/var/log/leapp/answerfile` to understand and resolve any issues before proceeding.

### Step 11 - Perform the Upgrade
Initiate the OS upgrade to Rocky Linux 8:
```bash
sudo leapp upgrade
```
- This prepares the system for the upgrade, creating a special boot entry.

### Step 12 - Reboot to Complete the Upgrade
Reboot the system to start the upgrade process:
```bash
sudo reboot
```
- During reboot, the system will use a temporary kernel to perform the upgrade from CentOS 7 to Rocky Linux 8.
- The VM may be temporarily inaccessible during this process as the upgrade modifies core system components.

### Step 13 - Verify the Upgrade
After the reboot, confirm the new OS version:
```bash
cat /etc/rocky-release
uname -r
```
Example output:
```
Rocky Linux release 8.10 (Green Obsidian)
4.18.0-553.el8.x86_64
```
- This confirms the system is now running Rocky Linux 8 with an updated kernel.

## Notes
- **Check Logs**: If issues arise, review `/var/log/leapp/leapp-report.txt` for detailed remediation steps.
- **Firewall and SELinux**: Adjust settings post-upgrade if needed for your environment.
- **Post-Upgrade**: Run `sudo dnf update -y` to ensure all Rocky Linux packages are current.
- **Backup**: Always have a full backup before upgrading, as the process is complex and risks data loss.

## 📎 Related Scripts
* 🚧 Content under construction