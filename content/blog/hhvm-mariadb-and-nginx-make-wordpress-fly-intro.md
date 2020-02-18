+++
title = "HHVM, MariaDB and Nginx Make WordPress Fly - Intro"
date = "2020-02-17 20:17:30"
description = "Introduction to a series on how to deploy a seriously fast server stack for WordPress."
publishdate = "2014-09-02 00:44:21"
tags = ['development', 'hhvm', 'mariadb', 'nginx', 'ubuntu', 'wordpress']
series = ['WordPress HHVM']
prev = '/blog/getting-started-with-an-ubuntu-vps-running-14-04/'
next = '/blog/mariadb-10-1-setup-for-ubuntu-14-04-make-wordpress-fly/'
+++

HHVM, MariaDB and Nginx Make WordPress fly (seriously). This site is running
on what may the fastest possible software stack for WordPress. That stack is
HHVM, MariaDB 10.1, Nginx and Ubuntu 14.04. As you are browsing this site you
may notice that it is graphically intensive. It also leverages many CPU hungry
plugins that would make it take 6-10 seconds to load on even good shared
hosting. With this aforementioned software stack pages up to 5MB on this site
still load in under a second, end-user pipe permitting. This is all happening on
a VPS with 2 x 2.26Ghz cores and 2GB of RAM. Not only that but this stack can
serve over 1000 2MB WordPress pages per second without losing stability:

## AB BenchMark

```bash
[user@host ~]# ab -c 50 -n 5000 http://bryanapperson.com/
This is ApacheBench, Version 2.3 <$Revision: 655654 $>
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
Requests per second: 1276.68 \[#/sec\](mean)
Time per request: 39.164 \[ms\](mean)
Time per request: 0.783 \[ms\] (mean, across all concurrent requests)
Transfer rate: 20707.77 \[Kbytes/sec\] received

Connection Times (ms)
min mean\[+/-sd\] median max
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
100% 89 (longest request)
```

## Why HHVM for WordPress?

So you may be asking yourself, is that really possible? Yes, HHVM and WordPress
work very well together. If you asked me a few days ago I might have said no.
But after playing around with [HHVM](http://hhvm.com/ 'HHVM'), also known as
"Hip Hop for PHP", it is. HHVM is Facebook's production PHP server which has now
gone open source. At this point it still has a few compatibility issues.
Especially with the usual culprits like
[Ioncube](http://forum.ioncube.com/viewtopic.php?p=10357&sid=45481ca609255e7435f1f4a938e5a786 'Ioncube').
However it works very well with WordPress 3.9+. When combined with Nginx,
MariaDB and Ubuntu "Trust Tahr" you get a pretty unbeatable platform for
WordPress. Serving 200 request per second even on un-cached and heavy pages
where PHP-FPM can only achieve 18 requests per second on a VM with the same
resources (rendering the same un-cached pages).

## MariaDB 10.1

[MariaDB](https://mariadb.org/ 'MariaDB') provides a solid database back-end and
can easily be scaled out into a Galera Cluster for larger deployments. MariaDB
10.1 outperforms MySQL 5.7.4 by a
[significant margin](https://blog.mariadb.org/performance-evaluation-of-mariadb-10-1-and-mysql-5-7-4-labs-tplc/ 'MariaDB 10.1 vs MySQL 5.7.4'),
that is why it was chosen for this stack and it proved itself in implementation.
MariaDB would perform better on SSD if available, but the above results were
achieved on RAID10 7200RPM SATAIII with an LSI Megaraid BBU controller (512MB
Cache).

## Nginx

[Nginx](http://nginx.com/ 'Nginx') can be somewhat less intuitive to configure
then Apache. However it is a beast for serving static files especially
[per resource usage](http://raspberrywebserver.com/raspberrypicluster/comparing-the-performance-of-nginx-and-apache-web-servers.html 'Apache Vs. Nginx on Rasberry Pi')
when configured correctly. Which is mostly what it does in this stack as all PHP
processing is done by HHVM. Nginx really shines in serving static files to many
user concurrently with the configuration we'll outline in the coming articles.

## Ubuntu 14.04 "Trusty Tahr"

Choosing Ubuntu 14.04 for this deployment made sense, because it is LTS (5 years
of support) and apt-get makes it almost trivial to get all of this setup. Not to
mention that Ubuntu is a stable OS (although I usually prefer CentOS/RHEL).
Nginx is built into the native repos for Ubuntu 14.04 and having maintained
repos for both HHVM and MariaDB with Ubuntu 14.04 makes this stack easy to
update later on. If you need an Ubuntu VPS you can get one for [here](https://www.vultr.com/).
Before you get started with this you will probably want to
[secure your Ubuntu VPS](/blog/getting-started-with-an-ubuntu-vps-running-14-04/).

## WordPress 3.9.2

This series of articles will show you how to set all of this up and make it work
with both a WordPress multi-site network, and a single WordPress site. I used
the multi-site network with WP MU Domain Mapper and Nginx helper for ease of
moving my multiple blogs and family/friends WordPress sites on to one platform.
We will also be leveraging
[W3 Total Cache](https://wordpress.org/plugins/w3-total-cache/ 'W3 Total Cache')
and APC (which is built in to HHVM) for Opcode caching.

## Concluding the Introduction

This setup is so efficient you wouldn't need to scale out past a single VM
instance unless you were in the Alexa top 10000, so we won't handle that in this
series. In articles to follow I will layout how to build this stack and use it
for Lightning fast WordPress hosting on a shoestring budget. You'll be able to
handle 50,000 page loads an hour or more on a 2GB RAM Xen VM. I will update this
article with links to the upcoming tutorials.
