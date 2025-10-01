---
title: Terraform provision single node on KVM
description: Step-by-step guide to provision single-node vm with terraform.
tags: [terraform, iac, libvirtd, provision]
---

# Using Terraform to provision single node virtual machine on KVM

## Environment
- **Virtualization**: KVM (via Libvirt)
- **Tool**: Terraform
- **Operating System**: Rocky Linux or another Red Hat-based OS (e.g., CentOS, RHEL)

## Diagram

![](https://github.com/immanuelbint/iac-labs/blob/main/terraform/resources/single-node-diagram.png?raw=true)

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

variable "vm_hostname" {
    description = "vm hostname"
    default     = "homelab"
}

variable "vm_cpu" {
    description = "number of CPU cores for the virtual machine"
    type        = number
    default     = 2
}

variable "vm_memory" {
    description = "memory size for the virtual machine in MB"
    type        = number
    default     = 4096
}

variable "ip_address" {
    type        = string
    description = "IP Addresses to be used by virtual machine (with CIDR)"
    default     = "172.23.0.89/26"
}
```

- Use `virsh pool-list` to find available storage pools if unsure about `libvirt_pool_name`.
- Adjust IP addresses and network settings to match your setup.

4. Create `main.tf` for the master VM:

```hcl
data "template_file" "user_data" {
    template = file("${path.module}/conf/user_data.yaml")
    vars = {
        hostname = var.vm_hostname
        domain   = var.vm_domain
    }
}

data "template_file" "network_config" {
  template = file("${path.module}/conf/network_config.yaml")
  vars  = {
    ip_address = var.ip_address
  }
}

resource "libvirt_volume" "instance_vol" {
    name    = "${var.vm_hostname}-vol"
    pool    = var.libvirt_pool_name
    source  = var.base_image_path
    format  = "qcow2"
}

resource "libvirt_cloudinit_disk" "cloudinit" {
    name            = "${var.vm_hostname}-cloudinit.iso"
    user_data       = data.template_file.user_data.rendered
    network_config  = data.template_file.network_config.rendered
    pool            = var.libvirt_pool_name
}

resource "libvirt_domain" "node" {
    name        = var.vm_hostname
    memory      = var.vm_memory
    vcpu      = var.vm_cpu
    cloudinit   = libvirt_cloudinit_disk.cloudinit.id
    autostart   = true

    cpu {
        mode = "host-passthrough"
    }

    network_interface {
        macvtap         = "enp4s7"
        wait_for_lease  = "false"
        hostname        = var.vm_hostname
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
        volume_id   = libvirt_volume.instance_vol.id
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
$ virsh list
 Id   Name       State
--------------------------
 28   homelab    running
```

## Test the VMs
From the KVM host, test SSH connectivity to a VM:

```bash
ssh root@<your-ip-address>
```
- Replace `<your-ip-address>` with an IP from `ip_address_master` or `ip_address` (e.g., `172.23.0.89`).
- If SSH fails, ensure the VM is running (`virsh list --all`) and the network is configured correctly.

## References
- [https://computingforgeeks.com/how-to-install-terraform-on-linux/](https://computingforgeeks.com/how-to-install-terraform-on-linux/)
- [https://dev.to/ruanbekker/terraform-with-kvm-2d9e](https://dev.to/ruanbekker/terraform-with-kvm-2d9e)
- [https://computingforgeeks.com/how-to-provision-vms-on-kvm-with-terraform/](https://computingforgeeks.com/how-to-provision-vms-on-kvm-with-terraform/)w
- [https://github.com/Mosibi/centos8-terraform](https://github.com/Mosibi/centos8-terraform)