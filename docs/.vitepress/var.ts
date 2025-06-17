export const listMenu = (title: string, url: string) => ({
    text: title,
    link: url,
  });


const menu = {
    how_to: '/how_to',
    iac: '/iac',
    shell_script: '/shell_script',
    linux_admin: '/linux_admin',
    containerization: '/containerization',
    storage: '/storage'
}
  
export const path = {
    // How-to List
    deploy_web_server: `${menu.how_to}/deploy_web_server`,
    repository: `${menu.how_to}/repository`,
    libvirt: `${menu.how_to}/libvirt`,

    // Infrastructure as Code
    opentofu: `${menu.iac}/opentofu`,
    ansible: `${menu.iac}/ansible`,
  
    // Shell Scripting
    basic: `${menu.shell_script}/basic`,
    advanced: `${menu.shell_script}/advanced`,
    debugging: `${menu.shell_script}/debugging`,

    // Linux Admin
    upgrade: `${menu.linux_admin}/upgrade`,

    // Storage Backup
    storage: `${menu.storage}`,

    // Containerization
    docker: `${menu.containerization}/docker`,
    kubernetes: `${menu.containerization}/kubernetes`,

    //Getting Started
    started: `/getting-started`,
  }