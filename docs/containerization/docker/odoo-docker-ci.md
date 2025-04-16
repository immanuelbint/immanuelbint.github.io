# 🐳 Deploying Odoo 16 with GitLab CI/CD and Docker

## Introduction

This guide explains how to deploy a **custom Odoo 16 instance** using Docker and GitLab CI/CD, with integration for **external PostgreSQL**, custom addons, and fully automated deployment stages.

You'll learn:
- How to build and deploy Odoo Docker images
- Setup CI/CD pipeline using GitLab
- Connect to external PostgreSQL database securely
- Apply best practices for containerized Odoo

---

## Environment

- **App**: Odoo 16
- **CI/CD**: GitLab CI/CD with shell runner
- **Containerization**: Docker
- **Database**: External PostgreSQL
- **Target Host**: Linux with Docker installed
- **Registry**: GitLab Container Registry

---

## Prerequisites

- GitLab account & repository
- GitLab Runner registered with Docker or Shell executor
- External PostgreSQL running (cloud DB or self-hosted)
- Docker installed on the deployment server

---

## Directory Structure

```
odoo-docker-ci/
├── addons/                # Your custom modules
├── requirements.txt       # Python packages for Odoo
├── odoo.conf.raw          # Templated config file
├── Dockerfile             # Odoo + customizations
├── .gitlab-ci.yml         # GitLab CI/CD pipeline
└── README.md              # Documentation
```

---

## Dockerfile

```Dockerfile
FROM odoo:16

COPY ./addons /mnt/extra-addons
COPY ./odoo.conf /etc/odoo/odoo.conf
COPY ./requirements.txt /etc/odoo/requirements.txt

RUN pip3 install -r /etc/odoo/requirements.txt
```

---

## `odoo.conf.raw`

```ini
[options]
addons_path = /mnt/extra-addons
data_dir = /var/lib/odoo

db_host = $db_host
db_port = $db_port
db_user = $db_user
db_password = $db_password
db_name = False
```

This file uses variables injected at build time using `envsubst`.

---

## GitLab CI/CD Pipeline (`.gitlab-ci.yml`)

```yaml
stages:
  - build
  - deploy

build_image:
  stage: build
  before_script:
    - echo $CI_REGISTRY_PASSWORD | docker login -u $CI_REGISTRY_USER --password-stdin $CI_REGISTRY
  image: docker:stable
  tags: [shell]
  script:
    - VERSION=$(git rev-parse --short HEAD)
    - envsubst < odoo.conf.raw > odoo.conf
    - IMAGE_TAG="$CI_REGISTRY/$CI_PROJECT_NAMESPACE/$CI_PROJECT_NAME:$VERSION"
    - docker build -t "$IMAGE_TAG" .
    - docker push "$IMAGE_TAG"
  only: [main]

deploy_image:
  stage: deploy
  before_script:
    - echo $CI_REGISTRY_PASSWORD | docker login -u $CI_REGISTRY_USER --password-stdin $CI_REGISTRY
  image: docker:stable
  tags: [shell]
  script:
    - VERSION=$(git rev-parse --short HEAD)
    - IMAGE_TAG="$CI_REGISTRY/$CI_PROJECT_NAMESPACE/$CI_PROJECT_NAME:$VERSION"
    - docker pull "$IMAGE_TAG"
    - docker stop odoo-container || true
    - docker rm odoo-container || true
    - docker run -d -p 8069:8069 --name odoo-container "$IMAGE_TAG"
  only: [main]
```

---

## CI/CD Variables (GitLab → Settings → CI/CD → Variables)

| Key             | Example Value         | Masked | Protected |
|----------------|-----------------------|--------|-----------|
| `db_host`       | `postgres.example.com`| ✅     | ✅        |
| `db_port`       | `5432`                | ✅     | ✅        |
| `db_user`       | `odoo`                | ✅     | ✅        |
| `db_password`   | `supersecret`         | ✅     | ✅        |
| `CI_REGISTRY`   | `registry.gitlab.com` | ❌     | ✅        |
| `CI_REGISTRY_USER` | `<your_gitlab_username>` | ❌ | ✅        |
| `CI_REGISTRY_PASSWORD` | `<your_token>`   | ✅     | ✅        |

---

## Run Locally (for dev testing)

```bash
docker build -t odoo-custom:dev .
docker run -d -p 8069:8069 --name odoo-container odoo-custom:dev
```

To use your external PostgreSQL:
```bash
docker run -d -p 8069:8069 --name odoo-container \
  -e db_host=your_db_host \
  -e db_port=5432 \
  -e db_user=odoo \
  -e db_password=yourpass \
  odoo-custom:dev
```

---

## Production Deployment Example

Once pushed to `main`, CI/CD will:

- Build with env-substituted config
- Push image to GitLab registry
- Pull on target host and run `docker run -d ...`

You can monitor this on GitLab under **CI/CD → Pipelines**.

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `psycopg2` error | Add to `requirements.txt` |
| `db_host not found` | Ensure variable is passed properly |
| Port 8069 unavailable | Make sure nothing is running on it |
| Volume not writable | Use `chown` or run as correct user |

---

## Conclusion

You're now set to build, deploy, and manage Odoo 16 instances via GitLab and Docker in a modern CI/CD workflow. 🎉

For advanced topics like volume persistence, HTTPS via reverse proxy (e.g. Nginx), or scaling with Docker Compose — feel free to expand this guide!