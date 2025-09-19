# Using `firewall-cmd` for configuring Firewall in linux

The `firewall-cmd` command is used to configure and manage the firewalld service on Linux systems.
It allows you to dynamically add, remove, and modify firewall rules without restarting the service.

---

## Check Firewall status

```bash
firewall-cmd --state
```

output:

```
running
```

## Listing Active Zones

Show all available zones and the default one:

```bash
firewall-cmd --get-active-zones
```

output:

```
public
  interfaces: eth0
```

## Allowing Service

Permit HTTP service in the public zone:

```bash
firewall-cmd --zone=public --add-service=http
```

To make it permanent after reboot, use param `--permanent`

```bash
firewall-cmd --zone=public --add-service=http --permanent
```

Reload the firewall to apply permanent rules:

```bash
firewall-cmd --reload
```

## Allowing a Specific Port

Open port 5432/tcp temporarily:

```bash
firewall-cmd --zone=public --add-port=5432/tcp
```

Make it permanent:

```bash
firewall-cmd --zone=public --add-port=5432/tcp --permanent
firewall-cmd --reload
```

## Blocking a Service

Remove SSH access from the public zone:

```bash
firewall-cmd --zone=public --remove-service=ssh --permanent
firewall-cmd --reload
```

## Listing All Rules

To see all active rules in the public zone:

```bash
firewall-cmd --zone=public --list-all
```

output:

```bash
public (active)
  target: default
  interfaces: eth0
  services: dhcpv6-client http https ssh
  ports: 5432/tcp
  masquerade: no
  forward-ports:
  icmp-blocks:
  rich rules:
```

Useful Flags

- `--permanent` → makes changes persistent across reboots.
- `--reload` → reloads configuration to apply permanent changes.
- `--list-all-zones` → displays rules for every zone.
- `--runtime-to-permanent` → copies current runtime config into permanent rules.

### Additional Notes

- firewall-cmd manages zones (trusted, public, internal, etc.), each with its own rules.
- Good practice: test rules without --permanent first, then apply permanently after confirming.
- Always keep a console session open when changing SSH rules, to avoid locking yourself out.