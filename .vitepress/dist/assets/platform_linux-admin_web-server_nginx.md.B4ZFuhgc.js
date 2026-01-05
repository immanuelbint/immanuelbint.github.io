import{_ as n,c as a,o as e,ag as p}from"./chunks/framework.Bw-5EFTY.js";const i="/assets/defaultpage.ChC4-FgG.png",t="/assets/httpsnginx.CgJsLvQ1.png",m=JSON.parse('{"title":"Install Nginx on Rocky Linux","description":"Step-by-step guide to deploy Nginx with HTTPS and SELinux support.","frontmatter":{"title":"Install Nginx on Rocky Linux","description":"Step-by-step guide to deploy Nginx with HTTPS and SELinux support.","tags":["nginx","webserver","rocky linux","tls"]},"headers":[],"relativePath":"platform/linux-admin/web-server/nginx.md","filePath":"platform/linux-admin/web-server/nginx.md"}'),l={name:"platform/linux-admin/web-server/nginx.md"};function c(o,s,r,d,u,h){return e(),a("div",null,s[0]||(s[0]=[p(`<h1 id="how-to-install-nginx" tabindex="-1">How to Install Nginx <a class="header-anchor" href="#how-to-install-nginx" aria-label="Permalink to &quot;How to Install Nginx&quot;">​</a></h1><h2 id="introduction" tabindex="-1">Introduction <a class="header-anchor" href="#introduction" aria-label="Permalink to &quot;Introduction&quot;">​</a></h2><p>Nginx is a highly popular web server used for deploying web servers, reverse proxies, load balancers, and more. In this guide, we’ll walk through the process of installing Nginx specifically on a Rocky Linux-based operating system, configuring the firewall, and setting up self-signed certificates to enable HTTPS for our web server.</p><h2 id="prerequisites" tabindex="-1">Prerequisites <a class="header-anchor" href="#prerequisites" aria-label="Permalink to &quot;Prerequisites&quot;">​</a></h2><p>Before deploying Nginx, ensure you have a regular user account with <code>sudo</code> privileges.</p><h2 id="step-1-installing-nginx" tabindex="-1">Step 1 - Installing Nginx <a class="header-anchor" href="#step-1-installing-nginx" aria-label="Permalink to &quot;Step 1 - Installing Nginx&quot;">​</a></h2><p>Nginx is available by default in Rocky Linux repositories. You can install it using the <code>dnf</code> package manager with the following command:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>sudo dnf install nginx</span></span></code></pre></div><p>When prompted, review the installation details and press <code>y</code> to proceed. Once the installation is complete, enable and start the Nginx service with this command:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>sudo systemctl enable --now nginx</span></span></code></pre></div><p>This ensures Nginx starts automatically on boot and is running immediately.</p><h2 id="step-2-configuring-the-firewall-and-selinux" tabindex="-1">Step 2 - Configuring the Firewall and SELinux <a class="header-anchor" href="#step-2-configuring-the-firewall-and-selinux" aria-label="Permalink to &quot;Step 2 - Configuring the Firewall and SELinux&quot;">​</a></h2><p>If <code>firewalld</code> and SELinux are enabled (which is the default on Rocky Linux), you won’t be able to access Nginx’s default homepage on port 80 without additional configuration. You’ll need to allow HTTP traffic through the firewall and permit network connections for HTTP in SELinux.</p><p>Run the following commands to allow the HTTP service in <code>firewalld</code> and reload the configuration:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>sudo firewall-cmd --add-service=http --permanent &amp;&amp; sudo firewall-cmd --reload</span></span></code></pre></div><p>To verify the rule has been applied, check the firewall settings:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>sudo firewall-cmd --list-all</span></span></code></pre></div><p>You should see output similar to this:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public (active)</span></span>
<span class="line"><span>  target: default</span></span>
<span class="line"><span>  icmp-block-inversion: no</span></span>
<span class="line"><span>  interfaces: eth0</span></span>
<span class="line"><span>  sources:</span></span>
<span class="line"><span>  services: cockpit dhcpv6-client http ssh</span></span>
<span class="line"><span>  ports:</span></span>
<span class="line"><span>  protocols:</span></span>
<span class="line"><span>  forward: yes</span></span>
<span class="line"><span>  masquerade: no</span></span>
<span class="line"><span>  forward-ports:</span></span>
<span class="line"><span>  source-ports:</span></span>
<span class="line"><span>  icmp-blocks:</span></span>
<span class="line"><span>  rich rules:</span></span></code></pre></div><p>Next, allow HTTP network access in SELinux:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>sudo setsebool -P httpd_can_network_connect true</span></span></code></pre></div><h2 id="step-3-verifying-the-nginx-service" tabindex="-1">Step 3 - Verifying the Nginx Service <a class="header-anchor" href="#step-3-verifying-the-nginx-service" aria-label="Permalink to &quot;Step 3 - Verifying the Nginx Service&quot;">​</a></h2><p>Your web server should now be running. To confirm, check the status of the Nginx service:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>sudo systemctl status nginx</span></span></code></pre></div><p>If it’s running correctly, you’ll see output like this:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>● nginx.service - The nginx HTTP and reverse proxy server</span></span>
<span class="line"><span>     Loaded: loaded (/usr/lib/systemd/system/nginx.service; enabled; preset: disabled)</span></span>
<span class="line"><span>     Active: active (running) since Wed 2025-03-19 01:56:22 UTC; 31s ago</span></span>
<span class="line"><span>    Process: 362284 ExecStartPre=/usr/bin/rm -f /run/nginx.pid (code=exited, status=0/SUCCESS)</span></span>
<span class="line"><span>    Process: 362285 ExecStartPre=/usr/sbin/nginx -t (code=exited, status=0/SUCCESS)</span></span>
<span class="line"><span>    Process: 362286 ExecStart=/usr/sbin/nginx (code=exited, status=0/SUCCESS)</span></span>
<span class="line"><span>   Main PID: 362287 (nginx)</span></span>
<span class="line"><span>      Tasks: 2 (limit: 10892)</span></span>
<span class="line"><span>     Memory: 2.0M</span></span>
<span class="line"><span>        CPU: 36ms</span></span>
<span class="line"><span>     CGroup: /system.slice/nginx.service</span></span>
<span class="line"><span>             ├─362287 &quot;nginx: master process /usr/sbin/nginx&quot;</span></span>
<span class="line"><span>             └─362288 &quot;nginx: worker process&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Mar 19 01:56:22 homelab.immanuelbint.com systemd[1]: Starting The nginx HTTP and reverse proxy server...</span></span>
<span class="line"><span>Mar 19 01:56:22 homelab.immanuelbint.com nginx[362285]: nginx: the configuration file /etc/nginx/nginx.conf syntax is ok</span></span>
<span class="line"><span>Mar 19 01:56:22 homelab.immanuelbint.com nginx[362285]: nginx: configuration file /etc/nginx/nginx.conf test is successful</span></span>
<span class="line"><span>Mar 19 01:56:22 homelab.immanuelbint.com systemd[1]: Started The nginx HTTP and reverse proxy server.</span></span></code></pre></div><p>You can now access the default Nginx homepage by entering your server’s IP address in a browser, like this: <code>http://&lt;ip-address&gt;:80</code> (replace <code>&lt;ip-address&gt;</code> with your server’s actual IP).</p><p><img src="`+i+`" alt="Nginx default page"></p><h2 id="step-4-managing-nginx" tabindex="-1">Step 4 - Managing Nginx <a class="header-anchor" href="#step-4-managing-nginx" aria-label="Permalink to &quot;Step 4 - Managing Nginx&quot;">​</a></h2><p>With your web server running, here are some essential commands to manage the Nginx service:</p><ul><li><p><strong>Stop the Nginx service:</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>sudo systemctl stop nginx</span></span></code></pre></div></li><li><p><strong>Start the Nginx service:</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>sudo systemctl start nginx</span></span></code></pre></div></li><li><p><strong>Restart the Nginx service:</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>sudo systemctl restart nginx</span></span></code></pre></div></li></ul><p>Earlier, we enabled Nginx to start on boot. To disable this behavior, use:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>sudo systemctl disable nginx</span></span></code></pre></div><p>Now, let’s explore key Nginx directories:</p><h3 id="main-configuration-folders" tabindex="-1">Main Configuration Folders <a class="header-anchor" href="#main-configuration-folders" aria-label="Permalink to &quot;Main Configuration Folders&quot;">​</a></h3><ul><li><code>/etc/nginx</code>: The primary Nginx configuration directory.</li><li><code>/etc/nginx/nginx.conf</code>: The default configuration file for the homepage served on port 80.</li><li><code>/etc/nginx/conf.d</code>: A directory for additional server block configurations, such as hosted websites or reverse proxy settings.</li></ul><h3 id="nginx-logs" tabindex="-1">Nginx Logs <a class="header-anchor" href="#nginx-logs" aria-label="Permalink to &quot;Nginx Logs&quot;">​</a></h3><ul><li><code>/var/log/nginx/access.log</code>: Stores logs of all requests to the web server.</li><li><code>/var/log/nginx/error.log</code>: Records all Nginx-related errors.</li></ul><h2 id="step-5-setting-up-tls-ssl" tabindex="-1">Step 5 - Setting Up TLS/SSL <a class="header-anchor" href="#step-5-setting-up-tls-ssl" aria-label="Permalink to &quot;Step 5 - Setting Up TLS/SSL&quot;">​</a></h2><p>To enhance security, we’ll upgrade our HTTP connection to HTTPS. Since we’re not using a public domain or paid certificate, we’ll create a self-signed certificate for learning purposes.</p><p>First, create a directory to store certificates and keys:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>sudo mkdir -p /data/self-managed-ca/{certs,keys}</span></span>
<span class="line"><span>cd /data/self-managed-ca</span></span></code></pre></div><h3 id="create-a-certificate-authority-ca" tabindex="-1">Create a Certificate Authority (CA) <a class="header-anchor" href="#create-a-certificate-authority-ca" aria-label="Permalink to &quot;Create a Certificate Authority (CA)&quot;">​</a></h3><p>Generate a CA configuration file (you can name it as desired):</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>tee -a ca.cnf &lt;&lt;EOF</span></span>
<span class="line"><span># OpenSSL CA configuration file</span></span>
<span class="line"><span>[ ca ]</span></span>
<span class="line"><span>default_ca = CA_default</span></span>
<span class="line"><span></span></span>
<span class="line"><span>[ CA_default ]</span></span>
<span class="line"><span>default_days = 365</span></span>
<span class="line"><span>database = index.txt</span></span>
<span class="line"><span>serial = serial.txt</span></span>
<span class="line"><span>default_md = sha256</span></span>
<span class="line"><span>copy_extensions = copy</span></span>
<span class="line"><span>unique_subject = no</span></span>
<span class="line"><span></span></span>
<span class="line"><span>[ req ]</span></span>
<span class="line"><span>prompt=no</span></span>
<span class="line"><span>distinguished_name = distinguished_name</span></span>
<span class="line"><span>x509_extensions = extensions</span></span>
<span class="line"><span></span></span>
<span class="line"><span>[ distinguished_name ]</span></span>
<span class="line"><span>organizationName = Hostmaster</span></span>
<span class="line"><span>commonName = Hostmaster CA</span></span>
<span class="line"><span></span></span>
<span class="line"><span>[ extensions ]</span></span>
<span class="line"><span>keyUsage = critical,digitalSignature,nonRepudiation,keyEncipherment,keyCertSign</span></span>
<span class="line"><span>basicConstraints = critical,CA:true,pathlen:1</span></span>
<span class="line"><span></span></span>
<span class="line"><span>[ signing_policy ]</span></span>
<span class="line"><span>organizationName = supplied</span></span>
<span class="line"><span>commonName = optional</span></span>
<span class="line"><span></span></span>
<span class="line"><span>[ signing_node_req ]</span></span>
<span class="line"><span>keyUsage = critical,digitalSignature,keyEncipherment</span></span>
<span class="line"><span>extendedKeyUsage = serverAuth,clientAuth</span></span>
<span class="line"><span></span></span>
<span class="line"><span>[ signing_client_req ]</span></span>
<span class="line"><span>keyUsage = critical,digitalSignature,keyEncipherment</span></span>
<span class="line"><span>extendedKeyUsage = clientAuth</span></span>
<span class="line"><span>EOF</span></span></code></pre></div><p>Generate the CA key and set restrictive permissions:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>sudo openssl genrsa -out keys/ca.key 4096</span></span>
<span class="line"><span>sudo chmod 400 keys/ca.key</span></span></code></pre></div><p>Create the CA certificate:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>openssl req \\</span></span>
<span class="line"><span>  -new -x509 \\</span></span>
<span class="line"><span>  -config ca.cnf \\</span></span>
<span class="line"><span>  -key keys/ca.key \\</span></span>
<span class="line"><span>  -out certs/ca.crt \\</span></span>
<span class="line"><span>  -days 365 \\</span></span>
<span class="line"><span>  -batch</span></span></code></pre></div><h3 id="create-a-client-certificate" tabindex="-1">Create a Client Certificate <a class="header-anchor" href="#create-a-client-certificate" aria-label="Permalink to &quot;Create a Client Certificate&quot;">​</a></h3><p>To simplify configuration, use variables for the hostname and IP address:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>ip=$(hostname -I | awk &#39;{print $1}&#39;)</span></span>
<span class="line"><span>hostname=$(hostname -f)</span></span></code></pre></div><p>Verify the variables:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>echo $ip    # Example output: 172.30.2.4</span></span>
<span class="line"><span>echo $hostname    # Example output: homelab.immanuelbint.com</span></span></code></pre></div><p>Reset the CA database:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>rm -f index.txt serial.txt</span></span>
<span class="line"><span>touch index.txt</span></span>
<span class="line"><span>echo &#39;01&#39; &gt; serial.txt</span></span></code></pre></div><p>Create a node configuration file:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>tee -a node.cnf &lt;&lt;EOF</span></span>
<span class="line"><span>[ req ]</span></span>
<span class="line"><span>prompt=no</span></span>
<span class="line"><span>distinguished_name = distinguished_name</span></span>
<span class="line"><span>req_extensions = extensions</span></span>
<span class="line"><span></span></span>
<span class="line"><span>[ distinguished_name ]</span></span>
<span class="line"><span>organizationName = Hostmaster</span></span>
<span class="line"><span></span></span>
<span class="line"><span>[ extensions ]</span></span>
<span class="line"><span>subjectAltName = critical,DNS:&quot;$hostname&quot;,DNS:&quot;$hostname&quot;,IP:&quot;$ip&quot;</span></span>
<span class="line"><span>EOF</span></span></code></pre></div><p>Generate the client key:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>openssl genrsa -out certs/&quot;$hostname&quot;.key 4096</span></span>
<span class="line"><span>chmod 400 certs/&quot;$hostname&quot;.key</span></span></code></pre></div><p>Create a Certificate Signing Request (CSR):</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>openssl req \\</span></span>
<span class="line"><span>  -new \\</span></span>
<span class="line"><span>  -config node.cnf \\</span></span>
<span class="line"><span>  -key certs/&quot;$hostname&quot;.key \\</span></span>
<span class="line"><span>  -out &quot;$hostname&quot;.csr \\</span></span>
<span class="line"><span>  -batch</span></span></code></pre></div><p>Sign the CSR with the CA:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>openssl ca \\</span></span>
<span class="line"><span>  -config ca.cnf \\</span></span>
<span class="line"><span>  -keyfile keys/ca.key \\</span></span>
<span class="line"><span>  -cert certs/ca.crt \\</span></span>
<span class="line"><span>  -policy signing_policy \\</span></span>
<span class="line"><span>  -extensions signing_node_req \\</span></span>
<span class="line"><span>  -in &quot;$hostname&quot;.csr \\</span></span>
<span class="line"><span>  -out certs/&quot;$hostname&quot;.crt \\</span></span>
<span class="line"><span>  -outdir certs/ \\</span></span>
<span class="line"><span>  -batch</span></span></code></pre></div><p>If successful, you’ll see output like this:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Using configuration from ca.cnf</span></span>
<span class="line"><span>Check that the request matches the signature</span></span>
<span class="line"><span>Signature ok</span></span>
<span class="line"><span>The Subject&#39;s Distinguished Name is as follows</span></span>
<span class="line"><span>organizationName      :ASN.1 12:&#39;Hostmaster&#39;</span></span>
<span class="line"><span>Certificate is to be certified until Mar 19 02:43:58 2026 GMT (365 days)</span></span>
<span class="line"><span>Write out database with 1 new entries</span></span>
<span class="line"><span>Database updated</span></span></code></pre></div><p>Verify the certificate:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>openssl x509 -in certs/&quot;$hostname&quot;.crt -text | grep &quot;X509v3 Subject Alternative Name&quot; -A 1</span></span></code></pre></div><p>Expected output:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>            X509v3 Subject Alternative Name: critical</span></span>
<span class="line"><span>                DNS:homelab.immanuelbint.com, DNS:homelab.immanuelbint.com, IP Address:172.30.2.4</span></span></code></pre></div><h3 id="update-nginx-configuration" tabindex="-1">Update Nginx Configuration <a class="header-anchor" href="#update-nginx-configuration" aria-label="Permalink to &quot;Update Nginx Configuration&quot;">​</a></h3><p>Modify the Nginx configuration to use the SSL certificate. Replace the paths below with your actual certificate locations (e.g., <code>/data/self-managed-ca</code>):</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>sudo tee /etc/nginx/nginx.conf &lt;&lt;EOF</span></span>
<span class="line"><span>user nginx;</span></span>
<span class="line"><span>worker_processes auto;</span></span>
<span class="line"><span>error_log /var/log/nginx/error.log;</span></span>
<span class="line"><span>pid /run/nginx.pid;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>include /usr/share/nginx/modules/*.conf;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>events {</span></span>
<span class="line"><span>    worker_connections 1024;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>http {</span></span>
<span class="line"><span>    log_format main &#39;\\$remote_addr - \\$remote_user [\\$time_local] &quot;\\$request&quot; &#39;</span></span>
<span class="line"><span>                     &#39;\\$status \\$body_bytes_sent &quot;\\$http_referer&quot; &#39;</span></span>
<span class="line"><span>                     &#39;&quot;\\$http_user_agent&quot; &quot;\\$http_x_forwarded_for&quot;&#39;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    access_log /var/log/nginx/access.log main;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    sendfile            on;</span></span>
<span class="line"><span>    tcp_nopush          on;</span></span>
<span class="line"><span>    tcp_nodelay         on;</span></span>
<span class="line"><span>    keepalive_timeout   65;</span></span>
<span class="line"><span>    types_hash_max_size 4096;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    include             /etc/nginx/mime.types;</span></span>
<span class="line"><span>    default_type        application/octet-stream;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    include /etc/nginx/conf.d/*.conf;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    server {</span></span>
<span class="line"><span>        listen       80 default_server;</span></span>
<span class="line"><span>        listen       [::]:80 default_server;</span></span>
<span class="line"><span>        server_name  &quot;$ip&quot;;</span></span>
<span class="line"><span>        return 301 https://\\$host\\$request_uri; # Redirect to HTTPS</span></span>
<span class="line"><span>        root         /usr/share/nginx/html;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        include /etc/nginx/default.d/*.conf;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        location / {</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        error_page 404 /404.html;</span></span>
<span class="line"><span>            location = /404.html {</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        error_page 500 502 503 504 /50x.html;</span></span>
<span class="line"><span>            location = /50x.html {</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    server {</span></span>
<span class="line"><span>        listen       443 ssl http2;</span></span>
<span class="line"><span>        listen       [::]:443 ssl http2;</span></span>
<span class="line"><span>        server_name  &quot;$ip&quot;;</span></span>
<span class="line"><span>        root         /usr/share/nginx/html;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        ssl_certificate &quot;/data/self-managed-ca/certs/$hostname.crt&quot;;</span></span>
<span class="line"><span>        ssl_certificate_key &quot;/data/self-managed-ca/certs/$hostname.key&quot;;</span></span>
<span class="line"><span>        ssl_session_cache shared:SSL:1m;</span></span>
<span class="line"><span>        ssl_session_timeout  10m;</span></span>
<span class="line"><span>        ssl_ciphers HIGH:!aNULL:!MD5;</span></span>
<span class="line"><span>        ssl_prefer_server_ciphers on;</span></span>
<span class="line"><span>        ssl_protocols TLSv1.2;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        include /etc/nginx/default.d/*.conf;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        location / {</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        error_page 404 /404.html;</span></span>
<span class="line"><span>            location = /404.html {</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        error_page 500 502 503 504 /50x.html;</span></span>
<span class="line"><span>            location = /50x.html {</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>EOF</span></span></code></pre></div><p>Test the configuration:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>sudo nginx -t</span></span></code></pre></div><p>If successful, you’ll see:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>nginx: the configuration file /etc/nginx/nginx.conf syntax is ok</span></span>
<span class="line"><span>nginx: configuration file /etc/nginx/nginx.conf test is successful</span></span></code></pre></div><p>Restart Nginx to apply the changes:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>sudo systemctl restart nginx</span></span></code></pre></div><h3 id="allow-https-in-the-firewall" tabindex="-1">Allow HTTPS in the Firewall <a class="header-anchor" href="#allow-https-in-the-firewall" aria-label="Permalink to &quot;Allow HTTPS in the Firewall&quot;">​</a></h3><p>Before testing, allow HTTPS traffic through the firewall:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>sudo firewall-cmd --add-service=https --permanent &amp;&amp; sudo firewall-cmd --reload</span></span></code></pre></div><p>Now, access your server at <code>https://&lt;hostname&gt;:443</code> (replace <code>&lt;hostname&gt;</code> with your actual hostname). You may see a &quot;not secure&quot; warning due to the self-signed certificate. To bypass this temporarily, import the CA certificate (<code>certs/ca.crt</code>) into your browser.</p><p><img src="`+t+'" alt="Nginx default page with HTTPS"></p><h2 id="related-scripts" tabindex="-1">Related Scripts <a class="header-anchor" href="#related-scripts" aria-label="Permalink to &quot;Related Scripts&quot;">​</a></h2><ul><li>Content under construction</li></ul>',86)]))}const b=n(l,[["render",c]]);export{m as __pageData,b as default};
