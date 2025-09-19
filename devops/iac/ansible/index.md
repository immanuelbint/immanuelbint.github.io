---
title: Ansible
description: Automating infrastructure with Ansible playbooks and roles.
---

# Ansible

Ansible is an open-source automation tool for configuration management, application deployment, and orchestration.

## Why Ansible?
- Agentless (uses SSH).
- Human-readable YAML playbooks.
- Strong ecosystem of modules.

## Getting Started

### Install

```bash
pip install ansible
```

### First Inventory

`inventory.ini`


```ini
[webservers]
192.168.56.10
192.168.56.11
```

### First Playbook

`site.yml`

```yaml
- name: Install Apache Webserver
  hosts: webservers
  become: yes

  tasks:
    - name: Ensure Apache is installed
      apt:
        name: apache2
        state: present

    - name: Ensure Apache is running
      service:
        name: apache2
        state: started
```

### Run:

```bash
ansible-playbook -i inventory.ini site.yml
```

> More playbooks and homelab experiments with Ansible coming soon