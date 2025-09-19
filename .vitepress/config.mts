import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/',
  title: "Immanuelbint Docs",
  themeConfig: {
    // ===================== Search Menu =====================
    search: {
      provider: "local",
    },
    // ===================== Navbar Menu =====================
    nav: [
      { text: 'Home', link: '/' },
      { text: 'DevOps', link: '/devops/' },
      { text: 'Platform', link: '/platform/' },
      {
        text: 'References',
        items: [
          { text: 'CLI Tools', link: '/references/cli-tools/cut' },
        ]
      },
      {
        text: 'GitHub',
        link: 'https://github.com/immanuelbint/immanuelbint.github.io',
      }
    ],
    // ===================== Sidebar Menu =====================
    sidebar: [
      {
        text: 'Introduction',
        items: [
          { text: 'Home', link: '/' },
          { text: 'Contact', link: '/contact/' },
        ]
      },
      {
        text: 'DevOps',
        collapsed: true,
        items: [
          { text: 'Overview', link: '/devops/' },
          {
            text: 'Automation',
            collapsed: true,
            items: [
              { text: 'Index', link: '/devops/automation/' },
              { text: 'Auto Kinit', link: '/devops/automation/bash/auto-kinit' },
              { text: 'Create User', link: '/devops/automation/bash/create-user' },
              { text: 'Setup Requirement Ambari', link: '/devops/automation/bash/setup-requirement-ambari' },
              { text: 'Get Python', link: '/devops/automation/bash/get-python' },
              { text: 'Pipeline Scanner', link: '/devops/automation/bash/pipeline-scanner' },
            ]
          },
          {
            text: 'Containers',
            collapsed: true,
            items: [
              { text: 'Overview', link: '/devops/containers/' },
              { text: 'Docker', link: '/devops/containers/docker/' },
              { text: 'Docker Limit', link: '/devops/containers/docker/docker-limit' },
              { text: 'Kubernetes', link: '/devops/containers/kubernetes/' },
            ]
          },
          { 
            text: 'IaC',
            collapsed: true,
            items: [
              { text: 'Overview', link: '/devops/iac/' },
              { text: 'Overview', link: '/devops/iac/ansible/' },
              { text: 'Overview', link: '/devops/iac/opentofu/' },
            ]
          },
        ]
      },
      {
        text: 'Platform',
        collapsed: true,
        items: [
          { text: 'Overview', link: '/platform/' },
          { text: 'Big Data', link: '/platform/bigdata/' },
          {
            text: 'Linux Admin',
            collapsed: true,
            items: [
              { text: 'Overview', link: '/platform/linux-admin/' },
              {
                text: 'Upgrade',
                items: [
                  { text: 'Index', link: '/platform/linux-admin/upgrade/' },
                  { text: 'Leapp', link: '/platform/linux-admin/upgrade/leapp' },
                ]
              },
              {
                text: 'Web Server',
                items: [
                  { text: 'Overview', link: '/platform/linux-admin/web-server/' },
                  { text: 'Nginx', link: '/platform/linux-admin/web-server/nginx' },
                ]
              }
            ]
          },
          { text: 'Monitoring', link: '/platform/monitoring/' },
          { text: 'Networking', link: '/platform/networking/' },
          {
            text: 'Security',
            collapsed: true,
            items: [
              { text: 'Overview', link: '/platform/security/' },
              { text: 'Firewall', link: '/platform/security/firewall/' },
            ]
          },
          {
            text: 'Storage',
            collapsed: true,
            items: [
              { text: 'Overview', link: '/platform/storage/' },
              {
                text: 'LVM',
                items: [
                  { text: 'Index', link: '/platform/storage/lvm/' },
                  { text: 'Resize LVM', link: '/platform/storage/lvm/resize-lvm' },
                ]
              }
            ]
          },
        ]
      },
      {
        text: 'References',
        collapsed: true,
        items: [
          { text: 'Overview', link: '/references/' },
          {
            text: 'CLI Tools',
            items: [
              { text: 'awk', link: '/references/cli-tools/awk' },
              { text: 'aws-cli', link: '/references/cli-tools/aws-cli' },
              { text: 'cut', link: '/references/cli-tools/cut' },
              { text: 'find', link: '/references/cli-tools/find' },
              { text: 'useradd', link: '/references/cli-tools/useradd' },
              { text: 'xargs', link: '/references/cli-tools/xargs' },
            ]
          }
        ]
      }
    ]
  }
})
