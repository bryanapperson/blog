+++
title = "				Installing WordPress with Nginx on Ubuntu 14.04		"
date = "2014-09-10 00:16:31"
type = "post"
tags = ['install', 'linux-tutorials', 'nginx', 'ubuntu', 'ubuntu-14-04', 'wordpress']
+++


				Installing WordPress with Nginx on Ubuntu 14.04 is a fairly straightforward task. In this tutorial we will do over how to do it. This tutorial assumes you have completed the <a title="Getting Started with an Ubuntu VPS" href="http://bryanapperson.com/blog/getting-started-ubuntu-vps-running-14-04/" target="_blank">Getting Started with an Ubuntu VPS</a>&nbsp;guide&nbsp;and have an Ubuntu 14.04 VPS (if not you can get one <a title="Ubuntu VPS Hosting" href="https://www.bitronictech.net/ubuntu-vps-hosting.php" target="_blank">here</a> for $5). It also assumes that you already have a LEMP stack setup (Linux, Nginx, MySQL, etcetera) or you are following the&nbsp;<a title="Making WordPress Fly" href="http://bryanapperson.com/blog/intro-hhvm-mariadb-nginx-wordpress/" target="_blank">Making WordPress Fly</a>&nbsp;guide. This tutorial assumes the use of Nginx as the web server, Fastcgi or <a title="HHVM" href="http://hhvm.com/" target="_blank">HHVM</a> for PHP and either MariaDB or MySQL &nbsp;for your MySQL server.

The first step in this tutorial is to connect to your virtual machine via SSH. This tutorial assumes that you are using Linux as your operating system and have SSH installed. If you do not you can use a tool like <a title="Putty SSH" href="http://www.chiark.greenend.org.uk/~sgtatham/putty/" target="_blank">Putty</a> for SSH. In Linux you just need to run the following command:
<pre class="lang:default decode:true " title="Connect to your VM using SSH">ssh -p port user@you.rip.add.res</pre>
After connecting to your instance via SSH it is time to begin the process of installing WordPress to work with Nginx. All of our tutorials for Nginx assume a "web root" of&nbsp;<span class="lang:default decode:true  crayon-inline">/var/www/html</span>, make sure that your Nginx configuration points there and that the directory exists. If the directory does not exist create it using&nbsp;<span class="lang:default decode:true  crayon-inline ">mkdir</span>&nbsp;and <span class="lang:default decode:true  crayon-inline ">chown</span>&nbsp;&nbsp;it to <span class="lang:default decode:true  crayon-inline">www-data</span>&nbsp;.
<pre class="lang:default decode:true " title="Setup Web Root">sudo mkdir /var/www/
sudo mkdir /var/www/html/
sudo chown -R www-data:www-data /var/www/html/</pre>
<h2>Creating a Database and User</h2>
After you have confirmed that Nginx is using <span class="lang:default decode:true  crayon-inline ">/var/www/html/</span>&nbsp;as your web root or setup another of your choice, it's time to&nbsp;create a database for WordPress. Please make sure you have already setup MySQL or <a title="Setup MariaDB" href="http://bryanapperson.com/blog/make-wordpress-fly-mariadb-setup-ubuntu-14/" target="_blank">MariaDB</a> prior to this step. Setting up the database is easy.&nbsp;Start&nbsp;by logging into an interactive session with the&nbsp;MySQL administrative account.
<pre class="lang:default decode:true ">mysql -u root -p</pre>
You will be prompted for the root password you setup during MySQL installation. Enter it and proceed to the interactive prompt. Next we are going to create a database for WordPress to use and store information in. The name of the database does not matter, but it should be memorable so that you can distinguish it as you add additional databases later on. To do this simply run this command:
<pre class="lang:default decode:true " title="Create a Database for WordPress">CREATE DATABASE wordpress;</pre>
Note the semi-colon (;) that ends the MySQL statement. Every&nbsp;MySQL statement must end with one, so check that if you are running into issues. Now that you have created a database, we need to create a user. You are going to use the same interactive interface you are in now to create a user. Use this command:
<pre class="">CREATE USER wordpressuser@localhost IDENTIFIED BY 'password';</pre>
Make sure you replace 'password' with the database password you want to use and 'wordpressuser' with the name of the database user you want to create. After that is done you need to assign that user privileges to use the database we just created. Use this command:
<pre class="">GRANT ALL PRIVILEGES ON wordpress.* TO wordpressuser@localhost;</pre>
Make sure you replace the database name and username with the ones you created.&nbsp;Everything should now be configured correctly. We need to flush the privileges (save them to disk)&nbsp;so that our current instance of MySQL knows about the privilege changes we have made:
<pre><code>FLUSH PRIVILEGES;</code></pre>
Now you can exit MySQL:
<pre class="lang:default decode:true ">exit</pre>
At this point you are back at the shell command prompt and ready to continue.
<h2>Installing WordPress with Nginx on Ubuntu 14.04</h2>
The next step is to download the latest version of WordPress to the server. It is available on their website. We are going to use the&nbsp;<span class="lang:default decode:true  crayon-inline ">wget</span>&nbsp;&nbsp;command to copy it to our home directory.

WordPress always keeps the latest stable version at the place we will use in this command.
<pre class="lang:default decode:true " title="Use wget to Download WordPress">cd ~
wget http://wordpress.org/latest.tar.gz</pre>
The&nbsp;files which compose WordPress were downloaded&nbsp;as a compressed archive stored in a file called <code>latest.tar.gz</code>. We can extract the contents by typing:
<pre><code>tar xzvf latest.tar.gz</code></pre>
This will extract a directory called <span class="lang:default decode:true  crayon-inline ">wordpress</span>&nbsp;&nbsp;containing all the files we need to set up WordPress. First however make sure that&nbsp;<span class="lang:default decode:true  crayon-inline ">php5-gd</span>&nbsp;&nbsp;and <span class="lang:default decode:true  crayon-inline ">libssh2-php </span>&nbsp;are installed. If they are not, run the command below. This will make sure you can work with images and install modules/plugins over SSH.
<pre><code>sudo apt-get update
sudo apt-get install php5-gd libssh2-php</code></pre>
<h2>Configuring WordPress with Nginx on Ubuntu 14.04</h2>
Now we are ready to configure WordPress and move it&nbsp;into the web root. Let's move into the directory that we extracted WordPress&nbsp;to in the last section:
<pre><code>cd ~/wordpress</code></pre>
Now we want to copy the sample configuration to take the place of the non-existent main configuration.
<pre class="lang:default decode:true ">cp wp-config-sample.php wp-config.php</pre>
Next we need to make 3 small changes to <span class="lang:default decode:true  crayon-inline ">wp-config.php</span>&nbsp;&nbsp;using <span class="lang:default decode:true  crayon-inline ">nano</span>&nbsp;&nbsp;or your text editor of choice.
<pre class="lang:default decode:true ">nano wp-config.php</pre>
The file is suitable for launching WordPress; it is just lacking the information to connect to the database we created a few minutes ago. The parameters we need to set are <span class="lang:default decode:true  crayon-inline ">DB_NAME</span>&nbsp;, <span class="lang:default decode:true  crayon-inline ">DB_USER</span>&nbsp;, and&nbsp;<span class="lang:default decode:true  crayon-inline ">DB_PASSWORD</span>&nbsp;.

After you make the changes to that section of the file it should look something like this:
<pre class="lang:default decode:true ">.....

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('DB_NAME', 'wordpress');

/** MySQL database username */
define('DB_USER', 'wordpressuser');

/** MySQL database password */
define('DB_PASSWORD', 'password');

.....</pre>
For now you can ignore the rest of the site. If you are planning on deploying a multisite network add this line:
<pre class="lang:default decode:true ">/* Multisite */
define( 'WP_ALLOW_MULTISITE', true );</pre>
Once you have made these changes you can save and close the file. Now it is time to copy the files to our web root (<span class="lang:default decode:true  crayon-inline ">/var/www/html/</span>&nbsp; in this example). We can copy the files to this place by typing:
<pre><code>sudo rsync -avP ~/wordpress/ /var/www/html/</code></pre>
Now we need to move over to that folder to assign some permissions.
<pre><code>cd /var/www/html/</code></pre>
Then we are going to make sure that Nginx owns these files so that it can manipulate them.
<pre class="lang:default decode:true ">sudo chown -R www-data:www-data /var/www/html/*</pre>
Before we move on, we should create a new directory for user uploads:
<pre class=""><code>mkdir wp-content/uploads</code>
</pre>
The new directory should have group writing set already, but the new directory isn't assigned with <code>www-data</code> group ownership yet. Let's fix that:
<pre><code>sudo chown -R :www-data /var/www/html/wp-content/uploads</code></pre>
Now just make sure that your web server is configured to use /var/www/html/ as the webroot and you can visit yourdomain.com to set your site name and get started. You are also going to want to install Postfix so that WordPress can send emails. We will be writing a tutorial for that in the near future.

Thanks for reading and leave your thoughts in the comments below.		