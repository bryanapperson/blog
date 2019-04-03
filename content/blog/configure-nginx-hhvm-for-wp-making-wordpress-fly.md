+++
title = "				Configure Nginx/HHVM for WP - Making WordPress Fly		"
date = "2014-09-27 08:02:29"
tags = ['development', 'linux-tutorials']
+++

    			The next step in the tutorial "Making WordPress Fly" is to configure Nginx/HHVM and install WordPress. This step has two options, configuring for single site (this article) or configuring for multisite. This tutorial will assume that you have <a title="Getting started with an Ubuntu VPS" href="http://bryanapperson.com/blog/getting-started-ubuntu-vps-running-14-04/">completed the prerequisites</a> and read the introduction (<a title="Introduction to MariaDB, HHVM, Nginx and WordPress" href="http://bryanapperson.com/blog/intro-hhvm-mariadb-nginx-wordpress/">part one</a>). It will also that you have completed both parts <a title="Installing MariaDB" href="http://bryanapperson.com/blog/make-wordpress-fly-mariadb-setup-ubuntu-14/">two</a> and <a title="Installing HHVM and Nginx on Ubuntu 14.04" href="http://bryanapperson.com/blog/install-hhvm-nginx-ubuntu-14-04-make-wordpress-fly/">three</a>. We will also assume that you have an Ubuntu VPS. If you don't, you can get one at <a title="Ubuntu VPS from BitronicTech" href="https://www.bitronictech.net/ubuntu-vps-hosting.php">BitronicTech</a>.

For the ease of keeping this configuration simple, I have created a <a title="HHVM, Nginx, MariaDB and WordPress Configurations" href="https://github.com/bitronictech/HHVM-Nginx-WordPress">github repository</a> for it. At this point you should have your VPS secured. You should also have MariaDB, Nginx, and HHVM installed. The first step in this section is to reconnect to your VM via SSH.

<pre class="lang:default decode:true " title="Connect to Your VM Via SSH">ssh -p port user@you.rip.add.res</pre>

After connecting to your instance, we are going to create a location to install WordPress. We are going to use <span class="lang:default decode:true crayon-inline ">/var/www/html</span> however you can use a different directory like <span class="lang:default decode:true crayon-inline ">/var/www/html/domain-com/</span> if you choose to. Be aware that you will have to update the configurations to match if you choose a different directory structure. Creating the new directory is straightforward.

<pre class="lang:default decode:true " title="Create Directory for WordPress">sudo mkdir /var/www/html/</pre>

We need to install WordPress to <span class="lang:default decode:true crayon-inline ">/var/www/html</span> . The guide for that can be found here. Once you have completed that, you are ready to move on to the next step.

Configuring Nginx for Multisite WordPress with W3 Total cache is the most involved part of the "Making WordPress Fly" series. At this point we are going to assume that you have been following the series since <a title="Intro - Making WordPress Fly" href="http://bryanapperson.com/blog/intro-hhvm-mariadb-nginx-wordpress/">the beginning</a>. We are also going to assume you already have an Ubuntu VPS (if not you can get one <a title="Ubuntu VPS Hosting" href="https://www.bitronictech.net/ubuntu-vps-hosting.php">here</a>). So far we have secured an Ubuntu VPS, setup MariaDB, installed HHVM and installed Nginx. Now we are ready for part 4a, to configure Nginx to work with WordPress Multisite and W3 Total Cache. Part 4b is the alternative if you only need a single site WordPress install on your HHVM enhanced, WordPress optimized VPS. Choosing a multisite install definitely makes sense as you can use this VPS to host more then a few sites, even if the get significant traffic.

<h2>NGINX FOR MULTISITE WORDPRESS</h2>
Before we install WordPress, we should configure Nginx.

Rest to be completed as time allows. Sorry for this!
