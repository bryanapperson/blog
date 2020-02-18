+++
title = "Installing WordPress with Nginx on Ubuntu 14.04"
date = "2020-02-17 23:10:08"
description = "How to install WordPress on Ubuntu 14.04 with an nginx webserever."
publishdate = "2014-09-10 00:16:31"
tags = [
  'nginx', 'ubuntu', 'wordpress'
  ]
series = ['WordPress HHVM']
prev = '/blog/mariadb-10-1-setup-for-ubuntu-14-04-make-wordpress-fly/'
next = '/blog/configure-nginx-hhvm-for-wp-making-wordpress-fly/'

+++

Installing WordPress with Nginx on Ubuntu 14.04 is a fairly straightforward
task. In this tutorial we will do over how to do it. This tutorial assumes you
have completed the
[Getting Started with an Ubuntu VPS](/blog/getting-started-with-an-ubuntu-vps-running-14-04/) guide and
have an Ubuntu 14.04 VPS (if not you can get one {{< external href="https://vultr.com" text="at vultr"/>}}). It also assumes that you already have a LEMP stack setup (Linux,
Nginx, MySQL, etcetera) or you are following
the [WordPress HHVM](/series/wordpress-hhvm/) guide.
This tutorial assumes the use of Nginx as the web server, Fastcgi or
[HHVM](http://hhvm.com/ 'HHVM') for PHP and either MariaDB or MySQL  for your
MySQL server. The first step in this tutorial is to connect to your virtual
machine via SSH. This tutorial assumes that you are using Linux as your
operating system and have SSH installed. If you do not you can use a tool like
[Putty](http://www.chiark.greenend.org.uk/~sgtatham/putty/ 'Putty SSH') for SSH.
In Linux you just need to run the following command:

```
ssh -p port user@you.rip.add.res
```

After connecting to your instance via SSH it is time to begin the process of
installing WordPress to work with Nginx. All of our tutorials for Nginx assume a
"web root" of /var/www/html, make sure that your Nginx configuration points
there and that the directory exists. If the directory does not exist create it
using mkdir and chown  it to www-data .

```
sudo mkdir /var/www/
sudo mkdir /var/www/html/
sudo chown -R www-data:www-data /var/www/html/
```

## Creating a Database and User

After you have confirmed that Nginx is using /var/www/html/ as your web root or
setup another of your choice, it's time to create a database for WordPress.
Please make sure you have already setup MySQL or
[MariaDB](/blog/mariadb-10-1-setup-for-ubuntu-14-04-make-wordpress-fly/)
prior to this step. Setting up the database is easy. Start by logging into an
interactive session with the MySQL administrative account.

```
mysql -u root -p
```

You will be prompted for the root password you setup during MySQL installation.
Enter it and proceed to the interactive prompt. Next we are going to create a
database for WordPress to use and store information in. The name of the database
does not matter, but it should be memorable so that you can distinguish it as
you add additional databases later on. To do this simply run this command:

```
CREATE DATABASE wordpress;
```

Note the semi-colon (;) that ends the MySQL statement. Every MySQL statement
must end with one, so check that if you are running into issues. Now that you
have created a database, we need to create a user. You are going to use the same
interactive interface you are in now to create a user. Use this command:

```
CREATE USER wordpressuser@localhost IDENTIFIED BY 'password';
```

Make sure you replace 'password' with the database password you want to use and
'wordpressuser' with the name of the database user you want to create. After
that is done you need to assign that user privileges to use the database we just
created. Use this command:

```
GRANT ALL PRIVILEGES ON wordpress.\* TO wordpressuser@localhost;
```

Make sure you replace the database name and username with the ones you
created. Everything should now be configured correctly. We need to flush the
privileges (save them to disk) so that our current instance of MySQL knows about
the privilege changes we have made:

```
FLUSH PRIVILEGES;
```

Now you can exit MySQL:

`exit`

At this point you are back at the shell command prompt and ready to continue.

## Installing WordPress with Nginx on Ubuntu 14.04

The next step is to download the latest version of WordPress to the server. It
is available on their website. We are going to use the wget  command to copy it
to our home directory. WordPress always keeps the latest stable version at the
place we will use in this command.

```
cd ~
wget http://wordpress.org/latest.tar.gz
```

The files which compose WordPress were downloaded as a compressed archive stored
in a file called `latest.tar.gz`. We can extract the contents by typing:

```
tar xzvf latest.tar.gz
```

This will extract a directory called wordpress  containing all the files we need
to set up WordPress. First however make sure that php5-gd  and libssh2-php  are
installed. If they are not, run the command below. This will make sure you can
work with images and install modules/plugins over SSH.

```
sudo apt-get update
sudo apt-get install php5-gd libssh2-php
```

## Configuring WordPress with Nginx on Ubuntu 14.04

Now we are ready to configure WordPress and move it into the web root. Let's
move into the directory that we extracted WordPress to in the last section:

```
cd ~/wordpress
```

Now we want to copy the sample configuration to take the place of the
non-existent main configuration.

`cp wp-config-sample.php wp-config.php`

Next we need to make 3 small changes to wp-config.php  using nano  or your text
editor of choice.

`nano wp-config.php`

The file is suitable for launching WordPress; it is just lacking the information
to connect to the database we created a few minutes ago. The parameters we need
to set are DB_NAME , DB_USER , and DB_PASSWORD . After you make the changes to
that section of the file it should look something like this:

```
// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('DB_NAME', 'wordpress');

/** MySQL database username */
define('DB_USER', 'wordpressuser');

/** MySQL database password */
define('DB_PASSWORD', 'password');
```

For now you can ignore the rest of the site. If you are planning on deploying a
multisite network add this line:

/\* Multisite \*/ define( 'WP_ALLOW_MULTISITE', true );

Once you have made these changes you can save and close the file. Now it is time
to copy the files to our web root (/var/www/html/  in this example). We can copy
the files to this place by typing:

```
sudo rsync -avP ~/wordpress/ /var/www/html/
```

Now we need to move over to that folder to assign some permissions.

```
cd /var/www/html/
```

Then we are going to make sure that Nginx owns these files so that it can
manipulate them.

sudo chown -R www-data:www-data /var/www/html/\*

Before we move on, we should create a new directory for user uploads:

```
mkdir wp-content/uploads
```

The new directory should have group writing set already, but the new directory
isn't assigned with `www-data` group ownership yet. Let's fix that:

```
sudo chown -R :www-data /var/www/html/wp-content/uploads
```

Now just make sure that your web server is configured to use /var/www/html/ as
the webroot and you can visit yourdomain.com to set your site name and get
started. You are also going to want to install Postfix so that WordPress can
send emails. We will be writing a tutorial for that in the near future. Thanks
for reading and leave your thoughts in the comments below.
