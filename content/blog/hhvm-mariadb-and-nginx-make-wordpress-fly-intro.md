+++
title = "				HHVM, MariaDB and Nginx Make WordPress Fly - Intro		"
date = "2014-09-02 00:44:21"
tags = ['development', 'hhvm', 'mariadb', 'nginx', 'ubuntu', 'wordpress']
+++

    			HHVM, MariaDB and Nginx Make WordPress fly (seriously). This site is running on what may the fastest possible software stack for WordPress. That stack is HHVM, MariaDB 10.1, Nginx and Ubuntu 14.04. As you are browsing this site you may notice that it is graphically intensive. It also leverages many CPU hungry plugins that would make it take 6-10 seconds to load on even good shared hosting. With this aforementioned software stack pages up to 5MB on this site still load in under a second, end-user pipe permitting. This is all happening on a VPS with 2 x 2.26Ghz cores and 2GB of RAM. Not only that but this stack can serve over 1000 2MB WordPress pages per second without losing stability:

<h2>AB BenchMark</h2>
<pre class="lang:sh decode:true" title="AB Benchmark for this Site">[user@host ~]# ab -c 50 -n 5000 http://bryanapperson.com/
This is ApacheBench, Version 2.3 &lt;$Revision: 655654 $&gt;
Copyright 1996 Adam Twiss, Zeus Technology Ltd, http://www.zeustech.net/
Licensed to The Apache Software Foundation, http://www.apache.org/

Benchmarking bryanapperson.com (be patient)
Completed 500 requests
Completed 1000 requests
Completed 1500 requests
Completed 2000 requests
Completed 2500 requests
Completed 3000 requests
Completed 3500 requests
Completed 4000 requests
Completed 4500 requests
Completed 5000 requests
Finished 5000 requests

Server Software: nginx
Server Hostname: bryanapperson.com
Server Port: 80

Document Path: /
Document Length: 16138 bytes

Concurrency Level: 50
Time taken for tests: 3.916 seconds
Complete requests: 5000
Failed requests: 0
Write errors: 0
Total transferred: 83046606 bytes
HTML transferred: 80706138 bytes
Requests per second: 1276.68 [#/sec](mean)
Time per request: 39.164 [ms](mean)
Time per request: 0.783 [ms] (mean, across all concurrent requests)
Transfer rate: 20707.77 [Kbytes/sec] received

Connection Times (ms)
min mean[+/-sd] median max
Connect: 1 1 0.2 1 5
Processing: 12 38 8.1 37 88
Waiting: 11 37 8.1 36 87
Total: 14 39 8.1 38 89

Percentage of the requests served within a certain time (ms)
50% 38
66% 41
75% 43
80% 44
90% 49
95% 54
98% 60
99% 66
100% 89 (longest request)</pre>

<h2>Pingdom Test</h2>
[stag_image style="no-filter" src="http://bryanapperson.com/wp-content/uploads/2014/09/pingdom.png" alignment="none" url=""]
<h2>Why HHVM for WordPress?</h2>
So you may be asking yourself, is that really possible? Yes, HHVM and WordPress work very well together. If you asked me a few days ago I might have said no. But after playing around with <a title="HHVM" href="http://hhvm.com/" target="_blank">HHVM</a>, also known as "Hip Hop for PHP", it is. HHVM is Facebook's production PHP server which has now gone open source. At this point it still has a few compatibility issues. Especially with the usual culprits like <a title="Ioncube" href="http://forum.ioncube.com/viewtopic.php?p=10357&amp;sid=45481ca609255e7435f1f4a938e5a786" target="_blank">Ioncube</a>. However it works very well with WordPress 3.9+. When combined with Nginx, MariaDB and Ubuntu "Trust Tahr" you get a pretty unbeatable platform for WordPress. Serving 200 request per second even on un-cached and heavy pages where PHP-FPM can only achieve 18 requests per second on a VM with the same resources (rendering the same un-cached pages).
<h2>MariaDB 10.1</h2>
<a title="MariaDB" href="https://mariadb.org/" target="_blank">MariaDB</a> provides a solid database back-end and can easily be scaled out into a Galera Cluster for larger deployments. MariaDB 10.1 outperforms MySQL 5.7.4 by a <a title="MariaDB 10.1 vs MySQL 5.7.4" href="https://blog.mariadb.org/performance-evaluation-of-mariadb-10-1-and-mysql-5-7-4-labs-tplc/" target="_blank">significant margin</a>, that is why it was chosen for this stack and it proved itself in implementation. MariaDB would perform better on SSD if available, but the above results were achieved on RAID10 7200RPM SATAIII with an LSI Megaraid BBU controller (512MB Cache).
<h2>Nginx</h2>
<a title="Nginx" href="http://nginx.com/" target="_blank">Nginx</a> can be somewhat less intuitive to configure then Apache. However it is a beast for serving static files especially <a title="Apache Vs. Nginx on Rasberry Pi" href="http://raspberrywebserver.com/raspberrypicluster/comparing-the-performance-of-nginx-and-apache-web-servers.html" target="_blank">per resource usage</a> when configured correctly. Which is mostly what it does in this stack as all PHP processing is done by HHVM. Nginx really shines in serving static files to many user concurrently with the configuration we'll outline in the coming articles.
<h2>Ubuntu 14.04 "Trusty Tahr"</h2>
Choosing Ubuntu 14.04 for this deployment made sense, because it is LTS (5 years of support) and apt-get makes it almost trivial to get all of this setup. Not to mention that Ubuntu is a stable OS (although I usually prefer CentOS/RHEL). Nginx is built into the native repos for Ubuntu 14.04 and having maintained repos for both HHVM and MariaDB with Ubuntu 14.04 makes this stack easy to update later on. If you need an Ubuntu VPS you can get one for $5 <a title="Ubuntu VM for $5" href="https://www.bitronictech.net/ubuntu-vps-hosting.php">here</a>.

Before you get started with this you will probably want to <a title="Secure Your Ubuntu VPS" href="http://bryanapperson.com/blog/getting-started-ubuntu-vps-running-14-04/">secure your Ubuntu VPS</a>.

<h2>WordPRess 3.9.2</h2>
This series of articles will show you how to set all of this up and make it work with both a WordPress multi-site network, and a single WordPress site. I used the multi-site network with WP MU Domain Mapper and Nginx helper for ease of moving my multiple blogs and family/friends WordPress sites on to one platform. We will also be leveraging <a title="W3 Total Cache" href="https://wordpress.org/plugins/w3-total-cache/" target="_blank">W3 Total Cache</a> and APC (which is built in to HHVM) for Opcode caching.
<h2>Concluding the Introduction</h2>
This setup is so efficient you wouldn't need to scale out past a single VM instance unless you were in the Alexa top 10000, so we won't handle that in this series. In articles to follow I will layout how to build this stack and use it for Lightning fast WordPress hosting on a shoestring budget. You'll be able to handle 50,000 page loads an hour or more on a 2GB RAM Xen VM (Check the <a title="Ubuntu VPS Hosting" href="https://www.bitronictech.net/ubuntu-vps-hosting.php" target="_blank">Ubuntu VPS</a> from Bitronic Technologies for best compatibility). I will update this article with links to the upcoming tutorials.
<h3>Github Repository for This Tutorial</h3>
<a title="Deploying HHVM, MariaDB, Nginx and WordPress on Ubuntu 14.04" href="https://github.com/bitronictech/HHVM-Nginx-WordPress">https://github.com/bitronictech/HHVM-Nginx-WordPress</a>
<h3>UPDATED: Links to the Continued Guide "Make WordPress Fly":</h3>
<a title="Getting Started with an Ubuntu VPS Running 14.04" href="http://bryanapperson.com/blog/getting-started-ubuntu-vps-running-14-04/">Preliminary - Getting Started with an Ubuntu VPS Running 14.04</a>

Part 1 - HHVM, MariaDB and Nginx Make WordPress Fly - Intro

<a title="MariaDB 10.1 Setup for Ubuntu 14.04 – Make WordPress Fly" href="http://bryanapperson.com/blog/make-wordpress-fly-mariadb-setup-ubuntu-14/">Part 2 - MariaDB Setup for Ubuntu 14.04 - Make WordPress Fly</a>

<a title="Install HHVM, Nginx on Ubuntu 14.04 – Make WordPress Fly" href="http://bryanapperson.com/blog/install-hhvm-nginx-ubuntu-14-04-make-wordpress-fly/">Part 3 - Install HHVM, Nginx on Ubuntu 14.04 - Make WordPress Fly</a>

The other parts are still in the works. In the meantime, thanks for reading - leave your thoughts in the comments below.
