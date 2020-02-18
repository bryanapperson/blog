+++
title = "Configure Nginx/HHVM for WP - Making WordPress Fly"
date = "2020-02-17 20:40:54"
publishdate = "2014-09-27 08:02:29"
tags = ['nginx', 'wordpress', 'hhvm']
series = ['WordPress HHVM']
prev = '/blog/mariadb-10-1-setup-for-ubuntu-14-04-make-wordpress-fly/'
+++

The next step in the tutorial "Making WordPress Fly" is to configure Nginx/HHVM
and install WordPress. This step has two options, configuring for single site
(this article) or configuring for multisite. This tutorial will assume that you
have [completed the prerequisites](http://bryanapperson.com/blog/getting-started-ubuntu-vps-running-14-04/ 'Getting started with an Ubuntu VPS')
and read the introduction
([part one](http://bryanapperson.com/blog/intro-hhvm-mariadb-nginx-wordpress/ 'Introduction to MariaDB, HHVM, Nginx and WordPress')).
It will also that you have completed both parts
[two](http://bryanapperson.com/blog/make-wordpress-fly-mariadb-setup-ubuntu-14/ 'Installing MariaDB')
and
[three](http://bryanapperson.com/blog/install-hhvm-nginx-ubuntu-14-04-make-wordpress-fly/ 'Installing HHVM and Nginx on Ubuntu 14.04').
We will also assume that you have an Ubuntu VPS. If you don't, you can get one
at
[BitronicTech](https://www.bitronictech.net/ubuntu-vps-hosting.php 'Ubuntu VPS from BitronicTech').
For the ease of keeping this configuration simple, I have created a
[github repository](https://github.com/bitronictech/HHVM-Nginx-WordPress 'HHVM, Nginx, MariaDB and WordPress Configurations')
for it. At this point you should have your VPS secured. You should also have
MariaDB, Nginx, and HHVM installed. The first step in this section is to
reconnect to your VM via SSH.

`ssh -p port user@you.rip.add.res`

After connecting to your instance, we are going to create a location to install
WordPress. We are going to use /var/www/html however you can use a different
directory like /var/www/html/domain-com/ if you choose to. Be aware that you
will have to update the configurations to match if you choose a different
directory structure. Creating the new directory is straightforward.

`sudo mkdir /var/www/html/`

We need to install WordPress to /var/www/html . The guide for that can be found
here. Once you have completed that, you are ready to move on to the next step.
Configuring Nginx for Multisite WordPress with W3 Total cache is the most
involved part of the "Making WordPress Fly" series. At this point we are going
to assume that you have been following the series since
[the beginning](http://bryanapperson.com/blog/intro-hhvm-mariadb-nginx-wordpress/ 'Intro - Making WordPress Fly').
We are also going to assume you already have an Ubuntu VPS (if not you can get
one
[here](https://www.bitronictech.net/ubuntu-vps-hosting.php 'Ubuntu VPS Hosting')).
So far we have secured an Ubuntu VPS, setup MariaDB, installed HHVM and
installed Nginx. Now we are ready for part 4a, to configure Nginx to work with
WordPress Multisite and W3 Total Cache. Part 4b is the alternative if you only
need a single site WordPress install on your HHVM enhanced, WordPress optimized
VPS. Choosing a multisite install definitely makes sense as you can use this VPS
to host more then a few sites, even if the get significant traffic.

## NGINX FOR MULTISITE WORDPRESS

Before we install WordPress, we should configure Nginx. Rest to be completed as
time allows. Sorry for this!
