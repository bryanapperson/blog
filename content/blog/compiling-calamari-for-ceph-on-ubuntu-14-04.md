+++
title = "				Compiling Calamari for Ceph on Ubuntu 14.04		"
date = "2014-09-10 10:45:37"
tags = ['calamari', 'ceph', 'development', 'linux-tutorials', 'technology', 'ubuntu-14-04']
+++


				Compiling Calamari for Ceph on Ubuntu 14.04 is a bit involved. Calamari is the enterprise GUI for Ceph storage by Inktank. They recently made it open source and you can find the github <a title="Calamari Github" href="https://github.com/ceph/calamari">here</a>. Prior to the release as open source a few weeks ago, Calamari was an enterprise only product. It really adds enterprise ease of management to Ceph storage and makes a valuable asset to any Ceph deployment.
<h2>Preparing Dependencies</h2>
The first step in the process is to install all the dependencies. I find it easier to do builds on a fresh VM. You can get an Ubuntu 14.04 VM <a title="Ubuntu VPS Hosting" href="https://www.bitronictech.net/ubuntu-vps-hosting.php">here</a> if you need one. Otherwise lets move on to installing the dependencies. First we need to add the saltstack PPA.
<pre class="lang:default decode:true">echo deb http://ppa.launchpad.net/saltstack/salt/ubuntu lsb_release -sc main | sudo tee /etc/apt/sources.list.d/saltstack.list</pre>
Then:
<pre class="lang:default decode:true">wget -q -O- "http://keyserver.ubuntu.com:11371/pks/lookup?op=get&amp;search=0x4759FA960E27C0A6" | sudo apt-key add -</pre>
and:
<pre class="">sudo apt-get update</pre>
Now we need to install the saltstack packages:
<pre class="">sudo apt-get install salt-master salt-minion salt-syndic</pre>
You are also going to have to add the PostgreSQL repository. Create and edit the PostgreSQL repository by running the command below:
<pre class="">sudo nano /etc/apt/sources.list.d/pgdg.list</pre>
Add this line to the file:
<pre class="lang:default decode:true">deb http://apt.postgresql.org/pub/repos/apt/ trusty-pgdg main</pre>
Download &amp; import the repository key:
<pre class="">wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -</pre>
Update your system:
<pre class="lang:default decode:true ">sudo apt-get update &amp;&amp; sudo apt-get upgrade</pre>
Now you have all the repositories in place to install the dependencies. Just run this command:
<pre class="lang:default decode:true">apt-get install -y curl build-essential openssl libssl-dev apache2 libapache2-mod-wsgi libcairo2 supervisor python-cairo libpq5 postgresql python-m2crypto python-virtualenv git python-dev swig libzmq-dev g++ postgresql-9.1 postgresql-server-dev-9.1 libcairo2-dev python-pip libpq-dev ruby debhelper python-mock python-configobj cdbs gem ruby1.9.1 ruby1.9.1-dev make devscripts software-properties-common python-support</pre>
This might take a minute or two, so go grab a cup of tea while you wait. After the process completes its time to start compiling the other dependencies. We now need to build and install Node version 0.10.10 for Calamari.
<pre class="lang:default decode:true">cd ~ 
git clone https://github.com/joyent/node.git
cd node
git checkout v0.10.10
./configure
make -j4
make install</pre>
We will also need to build and install NPM.
<pre class="lang:default decode:true">mkdir ~/npm
cd ~/npm
wget –no-check-certificate https://npmjs.org/install.sh
sh install.sh</pre>
Now we will install more dependencies using NPM.
<pre class="lang:default decode:true">npm install -g bower
npm install -g coffee-script
npm install -g grunt-cli
</pre>
The remaining dependencies we can install using Gem.
<pre class="lang:default decode:true  ">gem install compass
gem install sass</pre>
Now you have all the dependencies installed and you are ready to start compiling.
<h2>Building Calamari-Server</h2>
Alright! You made it. It took a while for me to figure out all the dependencies as the documentation out there is very spotty. I hope the section above made it somewhat painless for you. Now it's time to compile the calamari-server package. For that we need to clone the repository.
<pre class="lang:default decode:true">cd ~
git clone https://github.com/ceph/calamari.git
cd calamari</pre>
Before we continue there is one small change that needs to be made, we need to remove the file format, then it is safe to begin the build using dpkg-buildpackage. You can go a glass of water.
<pre class="lang:default decode:true ">cd debian
mv source source.old
cd ..
dpkg-buildpackage</pre>
The .deb will output in the parent directory (~/ in this case).
<h2>Building Calamari-Clients</h2>
Now we can compile calamari-clients. This process is simple since all the dependencies are already installed.
<pre class="lang:default decode:true">cd ~
git clone https://github.com/ceph/calamari-clients.git
cd calamari-clients
make build-real</pre>
This will output a platform agnostic version of the package into the <span class="lang:default decode:true  crayon-inline">~/calamari-clients/dashboard/dist/</span> , <span class="lang:default decode:true  crayon-inline">~/calamari-clients/admin/dist/</span> ,<span class="lang:default decode:true  crayon-inline">~/calamari-clients/manage/dist/</span>  and <span class="lang:default decode:true  crayon-inline ">~/calamari-clients/login/dist/</span>  directories. When you install this, you'll want to copy the dist/ for each of those to the <span class="lang:default decode:true  crayon-inline ">/opt/calamari/webapp/content/dashboard</span>  directories respectively. Example:
<pre class="lang:default decode:true">cp -avr dashboard/dist /opt/calamari/webapp/content/dashboard
cp -avr login/dist /opt/calamari/webapp/content/login
cp -avr manage/dist /opt/calamari/webapp/content/manage
cp -avr admin/dist /opt/calamari/webapp/content/admin</pre>
There is going to be a separate article for installing Calamari on Ubuntu 14.04. However this part wasn't too clear in the documentation so I figure I'd specify it here.
<h2>Building Diamond (Calamari Branch)</h2>
Next we are going to clone and compile the Calamari branch of Diamond. Diamond helps provide IOPS and other data to your Calamari Interface, compilation is simple.
<pre class="lang:default decode:true ">cd ~
git clone https://github.com/ceph/Diamond.git
cd Diamond
git checkout calamari
dpkg-buildpackage</pre>
Now you'll have a .deb of diamond in the parent directory (~/).
<h2>Conclusion</h2>
Now you have all the software you need to deploy Calamari on Ubuntu 14.04 to manage your Ceph cluster in a fancy GUI. In the next section I will give sources if you weren't able to compile successfully. I will update a link here when the next article is complete. Thanks for reading, leave your thoughts in the comments below.		