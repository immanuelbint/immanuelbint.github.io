---
title: Terraform provision multi node on KVM
description: Step-by-step guide to provision multi-node vm with terraform.
tags: [terraform, iac, libvirtd, provision]
---

# Using Terraform to provision multiple node virtual machine on KVM

## Environment
- **Virtualization**: KVM (via Libvirt)
- **Tool**: Terraform
- **Operating System**: Rocky Linux or another Linux OS distro (e.g., CentOS, RHEL)

## Diagram

![](https://github.com/immanuelbint/iac-labs/blob/main/terraform/resources/multi-node-diagram.png?raw=true)

## Configure Terraform

### Steps
1. Set up a directory for your terraform project:

```bash
mkdir -p ~/workspace/homelab-kvm/
cd ~/workspace/homelab-kvm/
```

2. Create `provider.tf` to connect to the local KVM instance:

```hcl
provider "libvirt" {
    uri = "qemu:///system"
}

terraform {
    required_providers {
        libvirt = {
            source  = "dmacvicar/libvirt"
            version = "0.8.3"
        }
    }
}
```

- `qemu:///system`: Connects to the system-wide KVM instance (requires root or Libvirt permissions).

3. Create `variables.tf` to store customizable settings. Adjust the defaults to match your environment:

```hcl
variable "libvirt_pool_name" {
    description = "KVM storage pool"
    default     = "pool-1"
}

variable "base_image_path" {
    description = "images path to be used by virtual machine"
    type        = string
    default     = "/pool/1/images/Rocky-8-GenericCloud-Base.latest.x86_64.qcow2"
}

variable "vm_domain" {
    description = "domain for virtual machine"
    default     = "example.com"
}

# --- Master node variable --- #

variable "master_hostname" {
    description = "vm master hostname"
    default     = "masternode"
}

variable "master_cpu" {
    description = "number of CPU cores for the master virtual machine"
    type        = number
    default     = 1
}

variable "master_memory" {
    description = "memory size for the master virtual machine in MB"
    type        = number
    default     = 2048
}

variable "master_ip_address" {
    type        = list(string)
    description = "IP Addresses to be used by master virtual machine (with CIDR)"
    default     = ["172.23.0.87/26"]
}

variable "master_count" {
    description = "Number of master VMs to create"
    default     = 1
}

# --- Worker node variable --- #

variable "worker_hostname" {
    description = "vm worker hostname"
    default     = "workernode"
}

variable "worker_cpu" {
    description = "number of CPU cores for the worker virtual machine"
    type        = number
    default     = 1
}

variable "worker_memory" {
    description = "memory size for the worker virtual machine in MB"
    type        = number
    default     = 4096
}

variable "worker_ip_address" {
    type        = list(string)
    description = "IP Addresses to be used by worker virtual machine (with CIDR)"
    default     = ["172.23.0.88/26", "172.23.0.89/26"]
}

variable "worker_count" {
    description = "Number of worker VMs to create"
    default     = 2
}
```

- This configuration will create 1 master instance, and 2 worker instances, if you want to change it, don't forget to change on `master_count` and `worker_count` variable.
- Use `virsh pool-list` to find available storage pools if unsure about `libvirt_pool_name`.
- Adjust IP addresses and network settings to match your setup.

4. Create `main.tf` for the master VM:

```hcl
# --- Master node resources --- #

data "template_file" "master_user_data" {
    count       = var.master_count
    template    = file("${path.module}/conf/user_data.yaml")
    vars        = {
        hostname = "${var.master_hostname}-${count.index}"
        domain   = var.vm_domain
    }
}

data "template_file" "master_network_config" {
    count       = var.master_count
    template    = file("${path.module}/conf/network_config.yaml")
    vars        = {
    ip_address = var.master_ip_address[count.index]
  }
}

resource "libvirt_volume" "master_instance_vol" {
    count   = var.master_count
    name    = "${var.master_hostname}-vol.${count.index}"
    pool    = var.libvirt_pool_name
    source  = var.base_image_path
    format  = "qcow2"
}

resource "libvirt_cloudinit_disk" "master_cloudinit" {
    count           = var.master_count
    name            = "${var.master_hostname}-cloudinit.${count.index}.iso"
    user_data       = data.template_file.master_user_data[count.index].rendered
    network_config  = data.template_file.master_network_config[count.index].rendered
    pool            = var.libvirt_pool_name
}

resource "libvirt_domain" "master_node" {
    count       = var.master_count
    name        = "${var.master_hostname}-${count.index}"
    memory      = var.master_memory
    vcpu        = var.master_cpu
    cloudinit   = libvirt_cloudinit_disk.master_cloudinit[count.index].id
    autostart   = true

    cpu {
        mode = "host-passthrough"
    }

    network_interface {
        macvtap         = "enp4s7"
        wait_for_lease  = "false"
        hostname        = "${var.master_hostname}-${count.index}"
    }

    console {
        type        = "pty"
        target_port = "0"
        target_type = "serial"
    }

    console {
        type        = "pty"
        target_port = "1"
        target_type = "virtio"
    }

    disk {
        volume_id   = libvirt_volume.master_instance_vol[count.index].id
    }
}

# --- Worker node resources --- #

data "template_file" "worker_user_data" {
    count       = var.worker_count
    template    = file("${path.module}/conf/user_data.yaml")
    vars        = {
        hostname = "${var.worker_hostname}-${count.index}"
        domain   = var.vm_domain
    }
}

data "template_file" "worker_network_config" {
    count       = var.worker_count
    template    = file("${path.module}/conf/network_config.yaml")
    vars        = {
    ip_address = var.worker_ip_address[count.index]
  }
}

resource "libvirt_volume" "worker_instance_vol" {
    count   = var.worker_count
    name    = "${var.worker_hostname}-vol.${count.index}"
    pool    = var.libvirt_pool_name
    source  = var.base_image_path
    format  = "qcow2"
}

resource "libvirt_cloudinit_disk" "worker_cloudinit" {
    count           = var.worker_count
    name            = "${var.worker_hostname}-cloudinit.${count.index}.iso"
    user_data       = data.template_file.worker_user_data[count.index].rendered
    network_config  = data.template_file.worker_network_config[count.index].rendered
    pool            = var.libvirt_pool_name
}

resource "libvirt_domain" "worker_node" {
    count       = var.worker_count
    name        = "${var.worker_hostname}-${count.index}"
    memory      = var.worker_memory
    vcpu        = var.worker_cpu
    cloudinit   = libvirt_cloudinit_disk.worker_cloudinit[count.index].id
    autostart   = true

    cpu {
        mode = "host-passthrough"
    }

    network_interface {
        macvtap         = "enp4s7"
        wait_for_lease  = "false"
        hostname        = "${var.worker_hostname}-${count.index}"
    }

    console {
        type        = "pty"
        target_port = "0"
        target_type = "serial"
    }

    console {
        type        = "pty"
        target_port = "1"
        target_type = "virtio"
    }

    disk {
        volume_id   = libvirt_volume.worker_instance_vol[count.index].id
    }
}
```
   
- Replace `enp4s7` with your network interface if using MacVTAP (check with `ip link`).

6. Create a `config` directory and add the following files:

```bash
mkdir conf
```

- `networks_config.yml`:
```yaml
version: 2
ethernets:
  eth0:
    dhcp4: false
    dhcp6: false
    addresses:
      - ${ip_address}
    gateway4: 172.23.0.1
    nameservers:
      addresses:
        - 8.8.8.8  
```

- Adjust `gateway4` to match your network.

- `user_data.yml`:

```yaml
#cloud-config
# vim: syntax=yaml
hostname: ${hostname}
fqdn: ${hostname}.${domain}
prefer_fqdn_over_hostname: true
ssh_pwauth: true
disable_root: false
chpasswd:
  list: |
    root:password
  expire: false

users:
  - name: apps
    sudo: ALL=(ALL) NOPASSWD:ALL
    groups: users, admin
    home: /home/apps
    shell: /bin/bash
    lock_passwd: true
    ssh-authorized-keys: # list SSH Keys to authenticate
      - ssh-rsa <your-id-rsa>
```

- Replace `password` with a secure password and `<your-id-rsa>` with your public SSH key.

## Deploy Terraform

### Steps
1. **Initialize Terraform**, Download required plugins and initialize the project:

```bash
terraform init
```

Example output:
   
```bash
Initializing the backend...

Initializing provider plugins...
- Reusing previous version of dmacvicar/libvirt from the dependency lock file
- Reusing previous version of hashicorp/template from the dependency lock file
- Using previously-installed hashicorp/template v2.2.0
- Using previously-installed dmacvicar/libvirt v0.8.3
```

2. **Plan the Deployment**, Preview the changes Terraform will make:

```bash
terraform plan
```

3. **Apply the Configuration**, Deploy the VMs:

```bash
terraform apply
```

- Confirm with `yes` when prompted. Wait for the process to complete (time depends on image size and system resources).

Verify the vm instance by running `virsh list` to check vm state

```bash
# virsh list
 Id   Name           State
------------------------------
 29   workernode-1   running
 30   workernode-0   running
 31   masternode-0   running

```

## Test the VMs
From the KVM host, test SSH connectivity to a VM:

```bash
ssh root@<your-ip-address>
```
- Replace `<your-ip-address>` with an IP from `ip_address_master` or `ip_address` (e.g., `172.23.0.89`).
- If SSH fails, ensure the VM is running (`virsh list --all`) and the network is configured correctly.

## Notes and Future Improvement

- Adding another data partition instead of only main disk OS

## References
- [https://computingforgeeks.com/how-to-install-terraform-on-linux/](https://computingforgeeks.com/how-to-install-terraform-on-linux/)
- [https://dev.to/ruanbekker/terraform-with-kvm-2d9e](https://dev.to/ruanbekker/terraform-with-kvm-2d9e)
- [https://computingforgeeks.com/how-to-provision-vms-on-kvm-with-terraform/](https://computingforgeeks.com/how-to-provision-vms-on-kvm-with-terraform/)w
- [https://github.com/Mosibi/centos8-terraform](https://github.com/Mosibi/centos8-terraform)