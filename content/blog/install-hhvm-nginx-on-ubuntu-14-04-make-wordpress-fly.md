+++
title = "				Install HHVM, Nginx on Ubuntu 14.04 - Make WordPress Fly		"
date = "2014-09-02 14:28:55"
tags = ['development', 'hhvm', 'install', 'nginx', 'setup', 'ubuntu']
+++


				Installing HHVM and Nginx on Ubuntu 14.04 is the next step in the "Make WordPress Fly" series. This tutorial assumes you have completed the <a title="Getting Started with an Ubuntu VPS Running 14.04" href="http://bryanapperson.com/blog/getting-started-ubuntu-vps-running-14-04/">prerequisites</a>, read <a title="HHVM, MariaDB and Nginx Make WordPress Fly – Intro" href="http://bryanapperson.com/blog/intro-hhvm-mariadb-nginx-wordpress/">Part 1</a> and completed <a title="MariaDB 10.1 Setup for Ubuntu 14.04 – Make WordPress Fly" href="http://bryanapperson.com/blog/make-wordpress-fly-mariadb-setup-ubuntu-14/">Part 2</a> of this guide. At this point you have a reasonably secure <a title="Ubuntu VPS Hosting" href="https://www.bitronictech.net/ubuntu-vps-hosting.php">Ubuntu 14.04 VPS</a> (if you don't click the link to get one for $5) with MariaDB installed and configured. In this (Part 3) of the "Make WordPress Fly" guide we will start out by preparing our system for Nginx.

The first step is to reconnect to your VM via SSH.
<pre class="lang:default decode:true " title="Connect to Your VM with SSH">ssh -p port user@you.rip.add.res</pre>
<h2>Installing Nginx on Ubuntu 14.04</h2>
After reconnecting we are going to install some prerequisites in this order to make sure HHVM plays nicely with Nginx and WordPress.
<pre class="lang:default decode:true " title="Install WordPress/Nginx Requirements">sudo apt-get update
sudo apt-get install php5-gd libssh2-php</pre>
After that process completes it is time to install Nginx. Installing Nginx on Ubuntu 14.04 is a very easy process. Ubuntu official repos come with a Nginx package but I prefer using <a href="http://wiki.nginx.org/Install#Official_Debian.2FUbuntu_packages">launchpad repo maintained by Nginx team</a>. We will also install the Naxsi WAF (Web Application Firewall) to provide some added security. You can choose not load Naxsi later as it slows down cached requests per second by around 3%. However, a full fledged WAF is worth a 3% requests per second hit.
<pre class="lang:default decode:true" title="Install Nginx from Launchpad Repo">sudo add-apt-repository ppa:nginx/stable
sudo apt-get update 
sudo apt-get install nginx-naxsi
</pre>
If you prefer to use Nginx package in Ubuntu repo, you can simply run following command:
<pre class="lang:default decode:true " title="Installing Nginx on Ubuntu 14.04">sudo apt-get install nginx-naxsi</pre>
That concludes the process of installing Nginx. We will configure it further in later parts of this tutorial series based on whether you use WordPress Multisite or a single install.
<h2>Installing HHVM on Ubuntu 14.04</h2>
Let's move on to installing HHVM on Ubuntu 14.04. We'll need to prepare the HHVM repositories. Using sudo or as root user it is recommended to run <code>sudo apt-get update</code> and <code>sudo apt-get upgrade</code> first, or you may receive errors. Then we are ready to add the repositories and install HHVM.
<pre class="lang:default decode:true" title="Adding HHVM Repositories for Ubuntu 14.04">wget -O - http://dl.hhvm.com/conf/hhvm.gpg.key | sudo apt-key add -
echo deb http://dl.hhvm.com/ubuntu trusty main | sudo tee /etc/apt/sources.list.d/hhvm.list
sudo apt-get update
sudo apt-get install hhvm</pre>
Now that HHVM is installed there are a few simple configurations to apply. HHVM comes bundled with a script that makes setting it up with Ubuntu very easy.

If you are already using Nginx with PHP-FPM, you'll have to modify the configuration file to disable the use of PHP-FPM. This file is normally located at <code>/etc/nginx/sites-available/default</code>

Look for the following section and make sure it's all commented (by adding a <code>#</code> at the beginning of each line)
<pre><code># pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000
#
#location ~ \.php$ {
#       fastcgi_split_path_info ^(.+\.php)(/.+)$;
#       # NOTE: You should have "cgi.fix_pathinfo = 0;" in php.ini
#
#       # With php5-cgi alone:
#       fastcgi_pass 127.0.0.1:9000;
#       # With php5-fpm:
#       fastcgi_pass unix:/var/run/php5-fpm.sock;
#       fastcgi_index index.php;
#       include fastcgi_params;
#}
</code></pre>
After doing this, execute the following script:
<pre><code>/usr/share/hhvm/install_fastcgi.sh
</code></pre>
Executing this script configures Nginx to start using HHVM to process the PHP code. It'll also restart the Nginx server so you don't have to do anything else.

Then you may want to tweak the max_upload_size of HHVM by editing /etc/hhvm/php.ini. Otherwise HHVM is now setup and working.
<h3>Verifying that HHVM is Working Correctly With Nginx and Ubuntu 14.04</h3>
It is important verify that HHVM is working with Nginx. You can verify this by creating a file in <code>/usr/share/nginx/html</code> called test.php.

Paste this inside:
<pre class="lang:php decode:true " title="Testing if PHP is Processing via HHVM">&lt;?php

echo  defined('HHVM_VERSION')?'Using HHVM':'Not using HHVM';

?&gt;</pre>
&nbsp;

Visit http://you.rip.add.res/test.php to view the output. This will verify that HHVM is handling PHP. Now just make sure that HHVM and Nginx run by default at startup.
<pre class="lang:default decode:true " title="Set Nginx and HHVM to Run at Startup">sudo update-rc.d nginx defaults
sudo update-rc.d hhvm defaults</pre>
You are ready to move on to the next part of this tutorial.
<h3>GITHUB REPOSITORY FOR THIS TUTORIAL</h3>
<a title="Deploying HHVM, MariaDB, Nginx and WordPress on Ubuntu 14.04" href="https://github.com/bitronictech/HHVM-Nginx-WordPress">https://github.com/bitronictech/HHVM-Nginx-WordPress</a>
<h3>Links to the Continued Guide "Make WordPress Fly":</h3>
<a title="Getting Started with an Ubuntu VPS Running 14.04" href="http://bryanapperson.com/blog/getting-started-ubuntu-vps-running-14-04/">Preliminary - Getting Started with an Ubuntu VPS Running 14.04</a>

<a title="HHVM, MariaDB and Nginx Make WordPress Fly – Intro" href="http://bryanapperson.com/blog/intro-hhvm-mariadb-nginx-wordpress/">Part 1 - HHVM, MariaDB and Nginx Make WordPress Fly - Intro</a>

<a title="MariaDB 10.1 Setup for Ubuntu 14.04 – Make WordPress Fly" href="http://bryanapperson.com/blog/make-wordpress-fly-mariadb-setup-ubuntu-14/">Part 2 - MariaDB Setup for Ubuntu 14.04 - Make WordPress Fly</a>

Part 3 - Install HHVM, Nginx on Ubuntu 14.04 - Make WordPress Fly

Leave your thoughts in the comments below. Thanks for reading!		