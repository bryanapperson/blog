+++
title = "Install HHVM, Nginx on Ubuntu 14.04 - Make WordPress Fly"
date = "2014-09-02 14:28:55"
tags = ['development', 'hhvm', 'install', 'nginx', 'setup', 'ubuntu']
+++

Installing HHVM and Nginx on Ubuntu 14.04 is the next step in the "Make
WordPress Fly" series. This tutorial assumes you have completed the
[prerequisites](/blog/getting-started-with-an-ubuntu-vps-running-14-04/),
read
[Part 1](http://bryanapperson.com/blog/intro-hhvm-mariadb-nginx-wordpress/ 'HHVM, MariaDB and Nginx Make WordPress Fly – Intro')
and completed
[Part 2](http://bryanapperson.com/blog/make-wordpress-fly-mariadb-setup-ubuntu-14/ 'MariaDB 10.1 Setup for Ubuntu 14.04 – Make WordPress Fly')
of this guide. At this point you have a reasonably secure box with MariaDB installed and
configured. In this (Part 3) of the "Make WordPress Fly" guide we will start out
by preparing our system for Nginx. The first step is to reconnect to your VM via
SSH.

`ssh -p port user@you.rip.add.res`

## Installing Nginx on Ubuntu 14.04

After reconnecting we are going to install some prerequisites in this order to
make sure HHVM plays nicely with Nginx and WordPress.

```
sudo apt-get update
sudo apt-get install php5-gd libssh2-php
```

After that process completes it is time to install Nginx. Installing Nginx on
Ubuntu 14.04 is a very easy process. Ubuntu official repos come with a Nginx
package but I prefer using
[launchpad repo maintained by Nginx team](http://wiki.nginx.org/Install#Official_Debian.2FUbuntu_packages).
We will also install the Naxsi WAF (Web Application Firewall) to provide some
added security. You can choose not load Naxsi later as it slows down cached
requests per second by around 3%. However, a full fledged WAF is worth a 3%
requests per second hit.

```
sudo add-apt-repository ppa:nginx/stable
sudo apt-get update
sudo apt-get install nginx-naxsi
```

If you prefer to use Nginx package in Ubuntu repo, you can simply run following
command:

`sudo apt-get install nginx-naxsi`

That concludes the process of installing Nginx. We will configure it further in
later parts of this tutorial series based on whether you use WordPress Multisite
or a single install.

## Installing HHVM on Ubuntu 14.04

Let's move on to installing HHVM on Ubuntu 14.04. We'll need to prepare the HHVM
repositories. Using sudo or as root user it is recommended to run
`sudo apt-get update` and `sudo apt-get upgrade` first, or you may receive
errors. Then we are ready to add the repositories and install HHVM.

```
wget -O - http://dl.hhvm.com/conf/hhvm.gpg.key | sudo apt-key add -
echo deb http://dl.hhvm.com/ubuntu trusty main | sudo tee /etc/apt/sources.list.d/hhvm.list
sudo apt-get update
sudo apt-get install hhvm
```

Now that HHVM is installed there are a few simple configurations to apply. HHVM
comes bundled with a script that makes setting it up with Ubuntu very easy. If
you are already using Nginx with PHP-FPM, you'll have to modify the
configuration file to disable the use of PHP-FPM. This file is normally located
at `/etc/nginx/sites-available/default` Look for the following section and make
sure it's all commented (by adding a `#` at the beginning of each line)

```
# pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000
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

```

After doing this, execute the following script:

```
/usr/share/hhvm/install_fastcgi.sh

```

Executing this script configures Nginx to start using HHVM to process the PHP
code. It'll also restart the Nginx server so you don't have to do anything else.
Then you may want to tweak the max_upload_size of HHVM by editing
/etc/hhvm/php.ini. Otherwise HHVM is now setup and working.

### Verifying that HHVM is Working Correctly With Nginx and Ubuntu 14.04

It is important verify that HHVM is working with Nginx. You can verify this by
creating a file in `/usr/share/nginx/html` called test.php. Paste this inside:

```
<?php

echo  defined('HHVM\_VERSION')?'Using HHVM':'Not using HHVM';

?>
```

Visit `http://you.rip.add.res/test.php` to view the output. This will verify
that HHVM is handling PHP. Now just make sure that HHVM and Nginx run by default
at startup.

```
sudo update-rc.d nginx defaults
sudo update-rc.d hhvm defaults
```

You are ready to move on to the next part of this tutorial.

### GITHUB REPOSITORY FOR THIS TUTORIAL

[https://github.com/bitronictech/HHVM-Nginx-WordPress](https://github.com/bitronictech/HHVM-Nginx-WordPress 'Deploying HHVM, MariaDB, Nginx and WordPress on Ubuntu 14.04')

### Links to the Continued Guide "Make WordPress Fly":

[Preliminary - Getting Started with an Ubuntu VPS Running 14.04](http://bryanapperson.com/blog/getting-started-ubuntu-vps-running-14-04/ 'Getting Started with an Ubuntu VPS Running 14.04')
[Part 1 - HHVM, MariaDB and Nginx Make WordPress Fly - Intro](http://bryanapperson.com/blog/intro-hhvm-mariadb-nginx-wordpress/ 'HHVM, MariaDB and Nginx Make WordPress Fly – Intro')
[Part 2 - MariaDB Setup for Ubuntu 14.04 - Make WordPress Fly](http://bryanapperson.com/blog/make-wordpress-fly-mariadb-setup-ubuntu-14/ 'MariaDB 10.1 Setup for Ubuntu 14.04 – Make WordPress Fly')
Part 3 - Install HHVM, Nginx on Ubuntu 14.04 - Make WordPress Fly Leave your
thoughts in the comments below. Thanks for reading!
