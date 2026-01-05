# Monitoring VM With Prometheus, Grafana, Node Exporter

Monitoring are essential to ensure optimal performance and reliability, as the application grow we need to track their health and maintaining uptime proactively, so in this guide we're going to setup simple monitoring with node exporter to export metric, prometheus to store the metric and query, and grafana to visualize.

## Environment

- Rocky Linux 8, 9, 10

## Setup Prometheus

1. Download Prometheus tarball from Github
   
```bash
wget https://github.com/prometheus/prometheus/releases/download/v3.8.1/prometheus-3.8.1.linux-amd64.tar.gz
```

2. Extract tarball *tar.gz* using `tar` command

```bash
tar -xvf prometheus-3.8.1.linux-amd64.tar.gz
```

3. Create new systemd service for prometheus `/etc/systemd/system/prometheus.service`, you could freely customize where prometheus dir located.

```
[Unit]
Description=Prometheus Server
Wants=network-online.target
After=network-online.target

[Service]
User=prometheus
Group=prometheus
Type=simple
ExecStart= /opt/prometheus/prometheus \
--config.file= /opt/prometheus/prometheus.yml \
--storage.tsdb.path=/opt/prometheus/ \
--web.console.templates= /opt/prometheus/consoles \
--web.console.libraries= /opt/prometheus/console_libraries

[Install]
WantedBy=multi-user.target
```

4. Start prometheus service and enable prometheus services.

```bash
systemctl enable --now prometheus
```

5. Add prometheus port to firewalld to whitelist the port, `9090` are default prometheus port

```bash
firewall-cmd --add-port=9090/tcp --permanent && firewall-cmd --reload
```

## Setup Node Exporter

1. Download Node Exporter tarball from Github 

```bash
wget https://github.com/prometheus/node_exporter/releases/download/v1.10.2/node_exporter-1.10.2.linux-amd64.tar.gz
```

Extract node-exporter tarball

```bash
tar -xvf node_exporter-1.10.2.linux-amd64.tar.gz
```

2. Create new systemd configuration for node_exporter `/etc/systemd/system/node_exporter.service`, you could also freely customize where node_exporter dir located.

```
[Unit]
Description=Node Exporter
Wants=network-online.target
After=network-online.target

[Service]
ExecStart=/etc/node_exporter/node_exporter
Restart=always

[Install]
WantedBy=multi-user.target
```

3. Enable node-exporter service and start

```bash
systemctl enable --now node_exporter
```

4. Add node_exporter port to firewalld to whitelist the port, `9100` are default node_exporter port

```bash
firewall-cmd --add-port=9100/tcp --permanent && firewall-cmd --reload
```

4. Update configuration file `prometheus.yml` to target the IP Address where node_exporter is located, it's used to make prometheus listen and receive metrics from node_exporter.

```
- job_name: 'node_exporter'
static_configs:
- targets: ['localhost:9100']
```

## Setup Grafana to visualize metrics

1. Import GPG key 

```bash
wget -q -O gpg.key https://rpm.grafana.com/gpg.key
sudo rpm --import gpg.key
```

2. Create grafana repository file `/etc/yum.repos.d/grafana.repo`

```bash
[grafana]
name=grafana
baseurl=https://rpm.grafana.com
repo_gpgcheck=1
enabled=1
gpgcheck=1
gpgkey=https://rpm.grafana.com/gpg.key
sslverify=1
sslcacert=/etc/pki/tls/certs/ca-bundle.crt
```

3. Install grafana opensource version

```bash
dnf install grafana
```

4. Enable and start grafana service

```bash
systemctl enable --now grafana-server
```

5. Open Grafana url using this url, change the IP Address with your server IP

```
http://<ip-address>:3000
```

if you can't open the url, make sure to whitelist grafana port in firewalld using command

```bash
firewall-cmd --add-port=3000/tcp --permanent && firewall-cmd --reload
```

## Reference

- [https://grafana.com/docs/grafana/latest/setup-grafana/installation/redhat-rhel-fedora/](https://grafana.com/docs/grafana/latest/setup-grafana/installation/redhat-rhel-fedora/)
- [https://jhooq.com/prometheous-grafan-setup/](https://jhooq.com/prometheous-grafan-setup/)
- [https://geekflare.com/prometheus-grafana-setup-for-linux/](https://geekflare.com/prometheus-grafana-setup-for-linux/)