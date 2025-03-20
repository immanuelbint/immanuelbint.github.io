import { defineConfig } from 'vitepress'
import { path, listMenu } from "./var";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/',
  title: "Immanuel Bintang Docs",
  description: "Documentation",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'How-to Guides', link: 'how_to' },
      { text: 'Infrastructure as Code', link: 'iac' },
      { text: 'Container Orchestration', link: 'containerization'},
      { 
        text: 'SysAdmin', 
        items: [
          { text: 'Shell Script', link: 'shell_script' },
          { text: 'Networking', link: 'networking' },
          { text: 'Monitoring & Logging', link: 'monitoring' },
          { text: 'Security & Hardening', link: 'security' },
          { text: 'Linux Admin', link: 'linux_admin' },
          { text: 'Storage & Backup', link: 'storage' },
        ]
      },
    ],

    sidebar: {
      how_to: [
        {
        text: 'How-to Guides',
        items: [
          { 
            text: 'Deploy Web Server', 
            collapsed: true,
            items: [
              listMenu("Nginx",`${path.deploy_web_server}/install-nginx`),
            ],
          },
          { 
            text: 'Repository', 
            collapsed: true,
            items: [
              listMenu("Deploy Local Repository",`${path.repository}/setup-local-repo`),
            ],
          },
          { 
            text: 'Libvirt KVM', 
            collapsed: true,
            items: [
              listMenu("Convert and resize images",`${path.libvirt}/managing-libvirt`),
              listMenu("Encrypt QCOW2 images",`${path.libvirt}/encrypt-images`),
              listMenu("Mount QCOW2 Images to Physical Server",`${path.libvirt}/mount-images`),
              listMenu("Mount Luks images",`${path.libvirt}/mount-luks-images`),
            ],
          },
        ],
      },
    ],
      shell_script: [
        {
        text: 'Shell Script',
        items: [
          { 
            text: 'Basic', 
            collapsed: true,
            items: [
              listMenu("create-user",`${path.basic}/create-user`),
              listMenu("auto-kinit",`${path.basic}/auto-kinit`),
            ],
          },
        ],
      },
    ],
    iac: [
      {
      text: 'OpenTofu',
      items: [
        { 
          text: 'OpenTofu', 
          collapsed: true,
          items: [
            listMenu("Deploy VM with OpenTofu via KVM",`${path.opentofu}/deploying-vm`),
          ],
        },
      ],
    },
    {
      text: 'Ansible',
      items: [
        { 
          text: 'Ansible', 
          collapsed: true,
          items: [
            listMenu("Install FreeIPA Server with Ansible",`${path.ansible}/freeipaserver`),
            listMenu("Install FreeIPA Client with Ansible",`${path.ansible}/freeipaclient`),
          ],
        },
      ],
    },
  ],
  }
  }
})
