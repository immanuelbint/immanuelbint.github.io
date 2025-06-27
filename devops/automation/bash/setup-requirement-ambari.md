---
title: Automate Ambari Server Requirement Setup
description: Automate Ambari setup with bash to simplify and speed up deployment.
---

# ⚙️ Automating Ambari Server Requirement Setup

## 🚨 Problem

Manual setup of Ambari dependencies is repetitive, error-prone, and time-consuming.

## 💡 Goal

Automate the entire requirement setup using a shell script, ensuring consistency and speed.

## ⚙️ Solution – Bash Script for requirement setup

Automate the entire requirement setup using a shell script, ensuring consistency and speed.

### ✅ Features:
- Detects OS version (RHEL/CentOS/Rocky 7 or 8).
- Installs all required packages and Java dependencies.
- Enables firewalld and opens essential ports.
- Sets up `JAVA_HOME` and SSH key for Ambari.
- Disables SELinux (not ideal, but explained).
- Adds Ambari repo and installs the server.

---

### 🧪 Script Example

Create a file named `requirement.sh` and paste the following:

```bash
#!/bin/bash
## Set Environment Variables
set -euo pipefail
IFS=$'\n\t'
LOG="/var/log/ambari-setup.log"
SELINUX_CONF="/etc/selinux/config"

log(){ printf '%s\n' "$*" | tee -a "$LOG" >&2; }
fatal(){ log "ERROR: $*"; exit 1; }

PKGS_EL7=(epel-release curl wget zip tar net-tools mlocate chrony)
PKGS_EL8=(epel-release yum-utils python2 python2-devel python2-pip chrony curl wget zip tar net-tools mlocate)

## Detect OS 
function detect_os_version() {
OS_VER=$(awk -F= '/^ID=/{print $2}' /etc/os-release | tr -d '"')
MAJOR=$(awk -F= '/^VERSION_ID=/{print $2}' /etc/os-release | cut -d. -f1 | tr -d '"')

case "$OS_VER" in
  rhel|centos|rocky|almalinux) ;;
  *) fatal "Unsupported distro: $OS_VER";;
esac
}

## Check package manager
function check_pkg_manager() {
    PKG_MGR=$(command -v dnf || command -v yum)
    [[ -x $PKG_MGR ]] || fatal "command dnf/yum not found"
}

## Enable Powertools repository and set default python env for el8
function enable_powertools() {
    yum config-manager --enable epel
    yum config-manager --set-enabled powertools
    command -v python2 &> /dev/null || fatal "Python2 not installed"
    alternatives --set python /usr/bin/python2
}

## Install packages
function need_pkgs() {
    local missing=()
    for pkgs in "$@"; do 
        rpm -q "$pkgs" &>/dev/null || missing+=("$pkgs")
    done

    if ((${#missing[@]})); then
        "$PKG_MGR" -y install "${missing[@]}"
    else
        log "All requested packages already present."
    fi
}

## Setup JAVA
function setup_java() {
    local javahome="/usr/lib/jvm/java-1.8.0"
    need_pkgs java-1.8.0-openjdk{,-devel,-headless}
    grep -q "JAVA_HOME" ~/.bash_profile 2>/dev/null || {
      echo "export JAVA_HOME=${javahome}" >> ~/.bash_profile
      echo 'export PATH=$JAVA_HOME/bin:$PATH' >> ~/.bash_profile
      log "JAVA_HOME set to ${javahome}"
  }
}

## Generate ssh_key
function gen_ssh_key() {
    local key="$HOME/.ssh/id_rsa"
    [[ -f $key ]] || ssh-keygen -q -b 3072 -t rsa -N '' -f "$key"
}

## open ports
function open_ports() {
    ## Add your own ports here
    local ports=(8080 8440 50070 8020 50075 50010 50020 50090 50030 8021 51111 50060 10000 9083)
    systemctl enable --now firewalld chronyd
    for port in "${ports[@]}"; do firewall-cmd --permanent --add-port=${port}/tcp; done
    firewall-cmd --reload
}

## ⚠️ **Warning**: Disabling SELinux is not recommended for production systems. Update this step later to use proper SELinux policies.
function disabling_selinux() {
    sed -i 's/SELINUX=enforcing/SELINUX=disabled/g' ${SELINUX_CONF}
}

## Add ambari-repository
function add_ambari_repo() {
    local major=$1 
    local repo_host=$2
    local ambari_version=$3

  cat <<EOF >/etc/yum.repos.d/ambari.repo
[AMBARI-${ambari_version}]
name=Ambari-${ambari_version}
baseurl=http://${repo_host}/repos/ambari/rhel/${major}/x86_64/${ambari_version}
enabled=1
gpgcheck=0
EOF
}

## Setup Ambari-Server
function setup_ambari_server() {
    need_pkgs ambari-server
    ambari-server setup -j /usr/lib/jvm/java-1.8.0 && ambari-server start
}

## Main Program
function main() {
    local target=$1
    log "Starting the script ..."
    [[ $target =~ ^(7|8)$ ]] || fatal "usage: $0 <7|8>"
    [[ $(id -u) -eq 0 ]] || fatal "Run as root"

    detect_os_version
    check_pkg_manager

    if [[ ${target} == "8" ]]; then
        log "Installing required packages for Ambari Server"
        need_pkgs "${PKGS_EL8[@]}"
        enable_powertools
    else
        log "Installing required packages for Ambari Server"
        need_pkgs "${PKGS_EL7[@]}"
    fi

    log "Setup ssh-key ..."
    gen_ssh_key

    log "Installing and setup JAVA ..."
    setup_java

    log "Adding required ports to firewall ..."
    open_ports

    log "Disable SElinux"
    disabling_selinux

    read -rp "Repo host? " host
    read -rp "Enter ambari-version (default: 2.7.5): " user_input
    ambari_version="${user_input:-2.7.5}"
    add_ambari_repo "$target" "$host" "$ambari_version"

    log "Installing ambari-server ..."
    setup_ambari_server

    log "All done ✔"
}

main "${1:-}"
```

---

## 🚀 Usage

1. **Make the script executable:**

```bash
chmod +x requirement.sh
```

2. **Run the script:**

```bash
./requirement.sh
```

---

## 🧭 Notes & Improvements

> 🔄 This script is part of an ongoing learning project and may not fully reflect best practices. Future improvements include:
>
> * Improved error handling and logging.
> * Improved the SELinux handling without disable it.
>
> I'm actively improving this script toward production-ready standards.

---

## 📎 Related Topics

* [ODP Overview](https://www.opensourcedataplatform.com/)
---