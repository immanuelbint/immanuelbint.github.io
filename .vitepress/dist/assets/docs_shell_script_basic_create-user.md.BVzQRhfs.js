import{_ as a,c as e,o as n,ae as p}from"./chunks/framework.BHrE6nLq.js";const h=JSON.parse('{"title":"Basic Shell Script to Create User","description":"","frontmatter":{},"headers":[],"relativePath":"docs/shell_script/basic/create-user.md","filePath":"docs/shell_script/basic/create-user.md"}'),t={name:"docs/shell_script/basic/create-user.md"};function i(l,s,c,r,o,u){return n(),e("div",null,s[0]||(s[0]=[p(`<h1 id="basic-shell-script-to-create-user" tabindex="-1">Basic Shell Script to Create User <a class="header-anchor" href="#basic-shell-script-to-create-user" aria-label="Permalink to &quot;Basic Shell Script to Create User&quot;">​</a></h1><h2 id="requirement" tabindex="-1">Requirement <a class="header-anchor" href="#requirement" aria-label="Permalink to &quot;Requirement&quot;">​</a></h2><ul><li>Linux</li></ul><h2 id="step" tabindex="-1">Step <a class="header-anchor" href="#step" aria-label="Permalink to &quot;Step&quot;">​</a></h2><ol><li>Create script with your desired name, example <code>create-user.sh</code>, then copy content below</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#!/bin/bash</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## Created by Immanuelbint</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## Function read user input</span></span>
<span class="line"><span>read_user_input() {</span></span>
<span class="line"><span>    read -r -p &quot;Enter username you&#39;d like to create = &quot; username</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## Function create user</span></span>
<span class="line"><span>create_user() {</span></span>
<span class="line"><span>    sudo useradd &quot;$username&quot;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## Function check if user exists</span></span>
<span class="line"><span>check_if_user_exist() {</span></span>
<span class="line"><span>    read_user_input</span></span>
<span class="line"><span>    while grep -q &quot;$username&quot; /etc/passwd;</span></span>
<span class="line"><span>    do</span></span>
<span class="line"><span>        echo &quot;User $username already exist&#39;s, please enter other name&quot;</span></span>
<span class="line"><span>        read_user_input</span></span>
<span class="line"><span>    done</span></span>
<span class="line"><span>    create_user &amp;&amp; echo &quot;create user $username success&quot;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## Main program</span></span>
<span class="line"><span>check_if_user_exist</span></span></code></pre></div><ol start="2"><li>Set the script executable with command</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>chmod +x &lt;namescript.sh&gt;</span></span></code></pre></div><ol start="3"><li>Then running the script without &lt;&gt;</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>bash &lt;namescript.sh&gt;</span></span></code></pre></div>`,10)]))}const m=a(t,[["render",i]]);export{h as __pageData,m as default};
