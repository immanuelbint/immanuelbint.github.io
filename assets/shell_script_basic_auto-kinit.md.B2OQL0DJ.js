import{_ as a,c as n,o as t,ag as e}from"./chunks/framework.BZemHgQ6.js";const q=JSON.parse('{"title":"Basic Shell Script to automate kinit","description":"","frontmatter":{},"headers":[],"relativePath":"shell_script/basic/auto-kinit.md","filePath":"shell_script/basic/auto-kinit.md"}'),p={name:"shell_script/basic/auto-kinit.md"};function i(l,s,o,c,u,r){return t(),n("div",null,s[0]||(s[0]=[e(`<h1 id="basic-shell-script-to-automate-kinit" tabindex="-1">Basic Shell Script to automate kinit <a class="header-anchor" href="#basic-shell-script-to-automate-kinit" aria-label="Permalink to &quot;Basic Shell Script to automate kinit&quot;">​</a></h1><h2 id="requirement" tabindex="-1">Requirement <a class="header-anchor" href="#requirement" aria-label="Permalink to &quot;Requirement&quot;">​</a></h2><ul><li>Linux</li><li>Kerberos client</li></ul><h2 id="step" tabindex="-1">Step <a class="header-anchor" href="#step" aria-label="Permalink to &quot;Step&quot;">​</a></h2><ol><li>Create script with your desired name, example <code>kinit.sh</code>, then copy content below</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#!/bin/bash</span></span>
<span class="line"><span>## Declaring keytab to Associative Array</span></span>
<span class="line"><span>declare -A KEYTABS</span></span>
<span class="line"><span>KEYTABS[&quot;hdfs&quot;]=&quot;/etc/security/keytabs/hdfs.headless.keytab&quot;</span></span>
<span class="line"><span>KEYTABS[&quot;yarn&quot;]=&quot;/etc/security/keytabs/yarn.service.keytab&quot;</span></span>
<span class="line"><span>KEYTABS[&quot;hbase&quot;]=&quot;/etc/security/keytabs/hbase.service.keytab&quot;</span></span>
<span class="line"><span>KEYTABS[&quot;hive&quot;]=&quot;/etc/security/keytabs/hive.service.keytab&quot;</span></span>
<span class="line"><span>KEYTABS[&quot;storm&quot;]=&quot;/etc/security/keytabs/storm.headless.keytab&quot;</span></span>
<span class="line"><span>KEYTABS[&quot;kafka&quot;]=&quot;/etc/security/keytabs/kafka.service.keytab&quot;</span></span>
<span class="line"><span>KEYTABS[&quot;solr&quot;]=&quot;/etc/security/keytabs/solr.service.keytab&quot;</span></span>
<span class="line"><span>KEYTABS[&quot;spark&quot;]=&quot;/etc/security/keytabs/spark.service.keytab&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## Reading the user input and check condition if exist on array or not</span></span>
<span class="line"><span>read -r -p &quot;Enter service name you&#39;d like to kinit =&gt; &quot; response</span></span>
<span class="line"><span>response=$(echo &quot;$response&quot; | tr &#39;[:upper:]&#39; &#39;[:lower:]&#39;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if [[ -n &quot;\${KEYTABS[$response]}&quot; ]]; then</span></span>
<span class="line"><span>    keytab_path=&quot;\${KEYTABS[$response]}&quot;</span></span>
<span class="line"><span>else</span></span>
<span class="line"><span>    echo &quot;Service not found / keytab didn&#39;t exist.&quot;</span></span>
<span class="line"><span>    read -r -p &quot;Do you still wanna to kinit with custom keytab? (y/n) =&gt; &quot; userinput</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    ## if else condition to custom keytabs</span></span>
<span class="line"><span>    if [[ &quot;$userinput&quot; =~ ^[Yy]$ ]]; then</span></span>
<span class="line"><span>        read -r -p &quot;Enter full path to keytab =&gt; &quot; keytab_path</span></span>
<span class="line"><span>    else</span></span>
<span class="line"><span>        exit 0</span></span>
<span class="line"><span>    fi</span></span>
<span class="line"><span>fi</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## check if the path is exist</span></span>
<span class="line"><span>if [[ -f &quot;$keytab_path&quot; ]]; then</span></span>
<span class="line"><span>    principal=$(klist -kt &quot;$keytab_path&quot; | grep @ | cut -d&#39; &#39; -f 7 | head -1)</span></span>
<span class="line"><span>    if [[ -n &quot;$principal&quot; ]]; then</span></span>
<span class="line"><span>        kinit -kt &quot;$keytab_path&quot; &quot;$principal&quot;</span></span>
<span class="line"><span>        echo &quot;Successfully kinit with keytab : $keytab_path&quot;</span></span>
<span class="line"><span>    else</span></span>
<span class="line"><span>        echo &quot;Error: Cannot find the requested principal in keytab!&quot;</span></span>
<span class="line"><span>    fi</span></span>
<span class="line"><span>else</span></span>
<span class="line"><span>    echo &quot;Error: File keytab not found in $keytab_path!&quot;</span></span>
<span class="line"><span>fi</span></span></code></pre></div><ol start="2"><li>Set the script executable with command</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>chmod +x &lt;namescript.sh&gt;</span></span></code></pre></div><ol start="3"><li>Then running the script without &lt;&gt;</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>bash &lt;namescript.sh&gt;</span></span></code></pre></div>`,10)]))}const d=a(p,[["render",i]]);export{q as __pageData,d as default};
