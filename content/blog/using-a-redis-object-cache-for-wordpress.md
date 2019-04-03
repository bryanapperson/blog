+++
title = "				Using a Redis Object Cache for WordPress		"
date = "2015-02-27 06:05:41"
type = "post"
tags = ['hhvm', 'linux-tutorials', 'object-cache', 'redis', 'wordpress']
+++


				Using a Redis object cache for WordPress is a great way to make your WordPress website faster, especially if you've already gone through the "<a title="Making WordPress Fly" href="http://bryanapperson.com/blog/intro-hhvm-mariadb-nginx-wordpress/">Making WordPress Fly</a>" series of tutorials (noted that one commenter there actually mentioned Redis). You'll need an Ubuntu 14.04 VPS with WordPress already setup on it. You can get an Ubuntu VM <a title="Ubuntu VPS Hosting" href="https://www.bitronictech.net/ubuntu-vps-hosting.php">here</a> if you don't have one. You don't have to use the aforementioned HHVM setup for this tutorial. However, using both HHVM and Redis object caching will give you the fastest load times. I will be releasing another article in the near future about improving HHVM stability for production deployments by using a PHP-FPM failover and an upstart script which does automatic respawning after a crash, something HHVM does not do by default on Ubuntu. Back to Redis - Redis is possibly the best way at present to implement the WordPress object cache. For a long time I have been a proponent of either APC or Memcached in combination W3 Total Cache for the object cache in WP.
<h2>Why Use a Redis Object Cache for WordPress?</h2>
During a recent server setup for a new website (<a title="My French City" href="http://myfrenchcity.com/">My French City</a>) I came across an issue. Caching using APC or Memcached helped with front end speed, but the admin area was painfully slow. This site was a multisite install with domain mapping and hundreds of plugins. There were simply too many queries going on in the backend for it to be snappy. After some searching I discovered that implementing <a title="Redis" href="http://redis.io/">Redis</a> to back the WordPress object cache was a great way to improve backend speed. After implementation it turned out it did a better job on the frontend then W3TC and Memcached, which was a pleasant surprise. HHVM does a great job of speeding up PHP and MariaDB 10.1 is also fast. But on a heavy site like this with lots of plugins, database queries are still the issue. Redis is an elegant NoSQL datastore solution to this problem.

A Redis object cache can be implemented in just a few commands on Ubuntu 14.04. Assuming you already have a working WordPress install (LAMP, LEMP , etc.) the process of getting redis working with WordPress is easy. First connect you your instance via SSH. Once connected:
<pre class="lang:default decode:true  " title="Install Redis Server">sudo apt-get update
sudo apt-get install redis-server php5-redis</pre>
Now Redis is installed. To configure a Redis object cache for WordPress there are a few small changes we need to make. Open up /etc/redis/redis.conf then add these two lines at the bottom:
<pre class="lang:default decode:true ">maxmemory 1024mb
maxmemory-policy allkeys-lru</pre>
Now you'll need to make some changes to WordPress. You'll need to grab <a title="object-cache.php" href="https://raw.githubusercontent.com/ericmann/Redis-Object-Cache/master/object-cache.php">this file</a>. Written by <a title="Eric Mann" href="https://github.com/ericmann/">Eric Mann</a> this file will allow WordPress to use a Redis object cache for awesome speed improvements. Once you've downloaded that file, make sure you disable W3TC object and database cache if you are using either. Now that Redis is running (and PHP knows how to connect to it), it’s time to tell WordPress to use our Redis object cache. You need to open wp-config.php and let WordPress know what host and port Redis runs on, and add a salt to keys. Add these lines:
<pre class="lang:default decode:true  " title="Add this to wp-config.php">define( 'WP_CACHE_KEY_SALT', 'mydomain_' );
$redis_server = array( 'host' =&gt; '127.0.0.1', 'port' =&gt; 6379, );</pre>
Then place the file in you downloaded above in webroot/wp-content/object-cache.php, where webroot is the directory your website files are located within. Once this is done make sure the redis-server is running using <span class="lang:default decode:true  crayon-inline ">sudo service redis-server status</span> . Now you WordPress site is using a Redis object cache. You should notice significant speed gains once you click through a few pages and the cache is populated with queries. If you want to view the Redis console to see what kind of data is being stored run this command: <span class="lang:default decode:true  crayon-inline ">sudo redis-cli monitor</span> . That will show you a verbose look at what is going on in your Redis cache.

Unfortunately I do not have a control before and after for the speed difference. However here is a Pingdom load test of a page on this website:

[caption id="attachment_660" align="aligncenter" width="975"]<a href="http://bryanapperson.com/wp-content/uploads/2015/02/pingdom-redis.png"><img class="wp-image-660 size-large" src="http://bryanapperson.com/wp-content/uploads/2015/02/pingdom-redis-1024x576.png" alt="Redis object cache for WordPress" width="975" height="548" /></a> Redis object cache for WordPress[/caption]

I will be writing more about this in the future. Please leave your thoughts or any contributions in the comments below. At that time I may include more detailed information on the performance gains achieved using Redis object cache with WordPress.

Now for a little fun:

https://www.youtube.com/watch?v=qpK0WAuyOl4		