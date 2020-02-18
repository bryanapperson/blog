+++
title = "MariaDB 10.1 Setup for Ubuntu 14.04 - Make WordPress Fly"
date = "2020-02-26 20:35:53"
publishdate = "2014-09-02 04:17:29"
tags = [
'configure', 'development', 'install', 'mariadb', 'secure', 'setup', 'ubuntu-14-04'
]
series = ['WordPress HHVM']
prev = '/blog/hhvm-mariadb-and-nginx-make-wordpress-fly-intro/'
next = '/blog/configure-nginx-hhvm-for-wp-making-wordpress-fly/'
+++

In this tutorial we will cover optimal MariaDB 10.1 setup for Ubuntu 14.04 on a
VM with 2-4GB of RAM. This is part 2 of the "Make WordPress Fly" tutorial. You
can find part 1 [here](/blog/hhvm-mariadb-and-nginx-make-wordpress-fly-intro).
Part 1 covered the benefits of using HHVM, MariaDB, Nginx and Ubuntu 14.04 to
run a WordPress website. In this section we'll be digging in to MariaDB and the
optimal configurations for it. This tutorial assumes you have a VM with at least
512MB of RAM, 1 Xeon Core, 10 GB HDD and Vanilla Ubuntu 14.04 installed and
ideally
[secured](/blog/getting-started-with-an-ubuntu-vps-running-14-04/ 'Getting Started with an Ubuntu VPS Running 14.04').
If you need a VM check out the
[Ubuntu VPS](https://www.bitronictech.net/ubuntu-vps-hosting.php 'Ubuntu
VPS')
from Bitronic Technologies which meet the requirements for this tutorial (only
\$5). So, assuming you have your Ubuntu VPS all setup, we will proceed with the
fairly straightforward process of installing MariaDB on Ubuntu 14.04. We are
specifically going to be deploying MariaDB 10.1 which as discussed in part 1 has
significant performance benefits over even the newest versions on MySQL. First,
connect to your VM via SSH.

`ssh -p port user@you.rip.add.res`

Then we'll add the MariaDB 10.1 repository and install the prerequisites.

```
sudo apt-get install software-properties-common
sudo apt-key adv --recv-keys --keyserver hkp://keyserver.ubuntu.com:80 0xcbcb082a1bb943db
sudo add-apt-repository 'deb http://ftp.osuosl.org/pub/mariadb/repo/10.1/ubuntu trusty main'
```

Once the key is imported and the repository added we will install MariaDB.

```
sudo apt-get update
sudo apt-get install mariadb-server
```

During that process you will be prompted to create a root password for MariaDB.
Make sure that you store it in a safe place. Consider
using [KeePass](http://keepass.info/ 'KeePass') (or a similar utility) for test
passwords, it creates strong passwords you can review later and encrypts them
with a master key. Now that MariaDB is installed we need to make sure it runs on
startup.

```
sudo update-rc.d mysql defaults
```

Then, run the  `sudo mysql_secure_installation`. This will guide you through
some procedures that will remove some defaults which are dangerous to use in a
production environment.

Next we will want to check that everything looks good in the my.cnf file.

```
nano /etc/mysql/my.cnf
```

It looks like this, yours should be similar, it may be a bit different as
MariaDB does some system based configuration on installation.

```ini
socket		= /var/run/mysqld/mysqld.sock
nice		= 0

[mysqld]
#
# * Basic Settings
#
user		= mysql
pid-file	= /var/run/mysqld/mysqld.pid
socket		= /var/run/mysqld/mysqld.sock
port		= 3306
basedir		= /usr
datadir		= /var/lib/mysql
tmpdir		= /tmp
lc_messages_dir	= /usr/share/mysql
lc_messages	= en_US
skip-external-locking
#
# Instead of skip-networking the default is now to listen only on
# localhost which is more compatible and is not less secure.
bind-address		= 127.0.0.1
#
# * Fine Tuning
#
max_connections		= 100
connect_timeout		= 5
wait_timeout		= 600
max_allowed_packet	= 16M
thread_cache_size       = 128
sort_buffer_size	= 4M
bulk_insert_buffer_size	= 16M
tmp_table_size		= 32M
max_heap_table_size	= 32M
#
# * MyISAM
#
# This replaces the startup script and checks MyISAM tables if needed
# the first time they are touched. On error, make copy and try a repair.
myisam_recover          = BACKUP
key_buffer_size		= 128M
#open-files-limit	= 2000
table_open_cache	= 400
myisam_sort_buffer_size	= 512M
concurrent_insert	= 2
read_buffer_size	= 2M
read_rnd_buffer_size	= 1M
#
# * Query Cache Configuration
#
# Cache only tiny result sets, so we can fit more in the query cache.
query_cache_limit		= 128K
query_cache_size		= 64M
# for more write intensive setups, set to DEMAND or OFF
#query_cache_type		= DEMAND
#
# * Logging and Replication
#
# Both location gets rotated by the cronjob.
# Be aware that this log type is a performance killer.
# As of 5.1 you can enable the log at runtime!
#general_log_file        = /var/log/mysql/mysql.log
#general_log             = 1
#
# Error logging goes to syslog due to /etc/mysql/conf.d/mysqld_safe_syslog.cnf.
#
# we do want to know about network errors and such
log_warnings		= 2
#
# Enable the slow query log to see queries with especially long duration
#slow_query_log[={0|1}]
slow_query_log_file	= /var/log/mysql/mariadb-slow.log
long_query_time = 10
#log_slow_rate_limit	= 1000
log_slow_verbosity	= query_plan

#log-queries-not-using-indexes
#log_slow_admin_statements
#
# The following can be used as easy to replay backup logs or for replication.
# note: if you are setting up a replication slave, see README.Debian about
#       other settings you may need to change.
#server-id		= 1
#report_host		= master1
#auto_increment_increment = 2
#auto_increment_offset	= 1
log_bin			= /var/log/mysql/mariadb-bin
log_bin_index		= /var/log/mysql/mariadb-bin.index
# not fab for performance, but safer
#sync_binlog		= 1
expire_logs_days	= 10
max_binlog_size         = 100M
# slaves
#relay_log		= /var/log/mysql/relay-bin
#relay_log_index	= /var/log/mysql/relay-bin.index
#relay_log_info_file	= /var/log/mysql/relay-bin.info
#log_slave_updates
#read_only
#
# If applications support it, this stricter sql_mode prevents some
# mistakes like inserting invalid dates etc.
#sql_mode		= NO_ENGINE_SUBSTITUTION,TRADITIONAL
#
# * InnoDB
#
# InnoDB is enabled by default with a 10MB datafile in /var/lib/mysql/.
# Read the manual for more InnoDB related options. There are many!
default_storage_engine	= InnoDB
# you can't just change log file size, requires special procedure
#innodb_log_file_size	= 50M
innodb_buffer_pool_size	= 256M
innodb_log_buffer_size	= 8M
innodb_file_per_table	= 1
innodb_open_files	= 400
innodb_io_capacity	= 400
innodb_flush_method	= O_DIRECT
#
# * Security Features
#
# Read the manual, too, if you want chroot!
# chroot = /var/lib/mysql/
#
# For generating SSL certificates I recommend the OpenSSL GUI "tinyca".
#
# ssl-ca=/etc/mysql/cacert.pem
# ssl-cert=/etc/mysql/server-cert.pem
# ssl-key=/etc/mysql/server-key.pem



[mysqldump]
quick
quote-names
max_allowed_packet	= 16M

[mysql]
#no-auto-rehash	# faster start of mysql but no tab completition

[isamchk]
key_buffer		= 16M

#
# * IMPORTANT: Additional settings that can override those from this file!
#   The files must end with '.cnf', otherwise they'll be ignored.
#
!includedir /etc/mysql/conf.d/</pre>
```

Performance can be tweaked a bit once we've had the WordPress site up and
running for 24-48 hours by using
[mysqltuner.pl](http://mysqltuner.com/ 'MySQL Tuner'). For good measure restart
the service.

sudo service mysql restart

This concludes part 2 of the guide "MariaDB Setup for Ubuntu 14.04 - Make
WordPress Fly". As the rest of the guide is released links will be posted here
and on all of the articles in the tutorial.
