---
title: OpenTofu
description: Infrastructure as Code with OpenTofu (Terraform fork).
---

# OpenTofu

OpenTofu is a community-driven fork of Terraform. It allows you to define and provision infrastructure using declarative configuration files.

## Why OpenTofu?
- Open-source and not vendor-controlled.
- Compatible with existing Terraform configs.
- Strong focus on community governance.

## Getting Started

### Install

```bash
brew install opentofu   # macOS
apt-get install opentofu # Linux (via package repo)
dnf install opentofu # RedHat / Fedora
```

### Basic Usage
1. Initialize a working directory:

```bash
tofu init
```

2. Validate configuration:


```bash
tofu validate
```

3. Apply infrastructure:

```bash
tofu apply
```

### Example: Provisioning an EC2 Instance

```hcl
provider "aws" {
  region = "us-east-1"
}

resource "aws_instance" "web" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t2.micro"

  tags = {
    Name = "opentofu-web"
  }
}
```

Run:

```bash
tofu init
tofu plan
tofu apply
```

> More labs and homelab experiments with OpenTofu coming soon