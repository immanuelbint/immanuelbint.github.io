---
title: Docker Container Resource Limiter
description: CLI-based script to limit and monitor CPU/Memory on Docker containers
---

# 🐳 Automating Docker Resource Management

## 🚨 Problem

Containers without resource limits can consume system memory and CPU without restriction, causing host-level performance issues.

## 💡 Goal

Provide a quick CLI tool for setting, monitoring, and resetting CPU/memory limits on Docker containers interactively.

---

## ⚙️ Solution – Bash Menu Script

### ✅ Features:
- Limit CPU usage by core
- Limit memory and swap
- Monitor resource usage live (`docker stats`)
- Reset all limitations

---

## 🧪 Script Example

```bash
#!/bin/bash
#!/bin/bash

menu="
Enter menu you'd like to use :
1. Limit CPU Docker Container
2. Limit Memory Docker Container
3. Monitor Docker Container
4. Reset CPU + Memory limitation
==============================
q: quit the script

=> "

## Function limit memory docker container
function limit_memory_docker() {
    read -r -p "Set memory limit (e.g. 4g, 512m): " memlimit
    read -r -p "Set total memory + swap limit (e.g. 6g, 1g): " swaplimit
    read -r -p "Enter Docker container name or ID to apply limit: " containername
    docker update --memory "$memlimit" --memory-swap "$swaplimit" "$containername" && echo "✅ Successfully updated memory limits for container: $containername"
}
## Function limit cpu docker container
function limit_cpu_docker() {
    read -r -p "Set CPU cores to allow (e.g. 0-1, 2 for core #2): " cpulimit
    read -r -p "Enter Docker container name or ID to apply limit: " containername
    docker update  --cpuset-cpus "$cpulimit" "$containername" && echo "✅ Successfully updated CPU core assignment for container: $containername"
}
## Function to reset cpu/memory limitation
function reset_limit_docker() {
    read -r -p "Enter Docker container name or ID you'd like to reset limitation: " containername
    docker update --cpuset-cpus="" --memory="" --memory-swap="" "$containername" && echo "✅ Successfully reset CPU + Memory limitation for container: $containername"
}

## Function monitor docker container
function monitor_docker() {
    docker container stats
}

## Main Program
while true; do
read -p "$menu" choice
case $choice in
    1) limit_cpu_docker ;;
    2) limit_memory_docker  ;;
    3) monitor_docker ;;
    4) reset_limit_docker ;;
    q) exit 0 ;;
    *) echo "Oops, Invalid choice";;
  esac
done #!/bin/bash

menu="
Enter menu you'd like to use :
1. Limit CPU Docker Container
2. Limit Memory Docker Container
3. Monitor Docker Container
4. Reset CPU + Memory limitation
==============================
q: quit the script

=> "

## Function limit memory docker container
function limit_memory_docker() {
    read -r -p "Set memory limit (e.g. 4g, 512m): " memlimit
    read -r -p "Set total memory + swap limit (e.g. 6g, 1g): " swaplimit
    read -r -p "Enter Docker container name or ID to apply limit: " containername
    docker update --memory "$memlimit" --memory-swap "$swaplimit" "$containername" && echo "✅ Successfully updated memory limits for container: $containername"
}
## Function limit cpu docker container
function limit_cpu_docker() {
    read -r -p "Set CPU cores to allow (e.g. 0-1, 2 for core #2): " cpulimit
    read -r -p "Enter Docker container name or ID to apply limit: " containername
    docker update  --cpuset-cpus "$cpulimit" "$containername" && echo "✅ Successfully updated CPU core assignment for container: $containername"
}
## Function to reset cpu/memory limitation
function reset_limit_docker() {
    read -r -p "Enter Docker container name or ID you'd like to reset limitation: " containername
    docker update --cpuset-cpus="" --memory="" --memory-swap="" "$containername" && echo "✅ Successfully reset CPU + Memory limitation for container: $containername"
}

## Function monitor docker container
function monitor_docker() {
    docker container stats
}

## Main Program
while true; do
read -p "$menu" choice
case $choice in
    1) limit_cpu_docker ;;
    2) limit_memory_docker  ;;
    3) monitor_docker ;;
    4) reset_limit_docker ;;
    q) exit 0 ;;
    *) echo "Oops, Invalid choice";;
  esac
done 
````

---

## 🚀 Usage

1. Save as `docker-limiter.sh`
2. Make executable:

```bash
chmod +x docker-limiter.sh
```

3. Run the script:

```bash
./docker-limiter.sh
```

---

## 🧭 Notes & Improvements

> * Script assumes Docker is already installed and the user has appropriate permissions.
> * Future improvements:
>
>   * Add CPU quota limits (`--cpu-quota`, `--cpu-period`)
>   * Include container auto-complete
>   * Add logging feature for changes

---

## 📎 Related Topics

* [Docker Resource Constraints Docs](https://docs.docker.com/config/containers/resource_constraints/)
* [docker stats](https://docs.docker.com/engine/reference/commandline/stats/)

---