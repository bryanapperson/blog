+++
title = "				Setup OpenVPN on Ubuntu the Easy Way		"
date = "2014-11-29 22:38:20"
type = "post"
tags = ['linux-tutorials', 'openvpn', 'security', 'ssl', 'tunnel', 'ubuntu']
+++


				The best way to setup OpenVPN on Ubuntu, like many other things, is to script it. This way it's easier to create uniform deployment across larger networks. So, this is how you setup OpenVPN on Ubuntu the easy way - this neat little script makes installing OpenVPN on an Ubuntu VPS simple:

Go to your home directory:
<pre class="lang:default decode:true " title="Go to your home directory">cd ~</pre>
Then create a file by running this command:
<pre class="lang:sh decode:true">cat &gt; openvpn.sh
#!/usr/bin/env bash
#

# Functions
ok() {
    echo -e '\e[32m'$1'\e[m';
}

die() {
    echo -e '\e[1;31m'$1'\e[m'; exit 1;
}

# Sanity check
if [[ $(id -g) != "0" ]] ; then
    die "❯❯❯ Script must be run as root."
fi

if [[  ! -e /dev/net/tun ]] ; then
    die "❯❯❯ TUN/TAP device is not available."
fi

dpkg -l openvpn &gt; /dev/null 2&gt;&amp;1
if [[ $? -eq 0 ]]; then
    die "❯❯❯ OpenVPN is already installed."
fi

# Install openvpn
ok "❯❯❯ apt-get update"
apt-get update -q &gt; /dev/null 2&gt;&amp;1
ok "❯❯❯ apt-get install openvpn curl openssl"
apt-get install -qy openvpn curl &gt; /dev/null 2&gt;&amp;1

# IP Address
SERVER_IP=$(curl ipv4.icanhazip.com)
if [[ -z "${SERVER_IP}" ]]; then
    SERVER_IP=$(ip a | awk -F"[ /]+" '/global/ &amp;&amp; !/127.0/ {print $3; exit}')
fi

# Generate CA Config
ok "❯❯❯ Generating CA Config"
openssl dhparam -out /etc/openvpn/dh.pem 2048 &gt; /dev/null 2&gt;&amp;1
openssl genrsa -out /etc/openvpn/ca-key.pem 2048 &gt; /dev/null 2&gt;&amp;1
chmod 600 /etc/openvpn/ca-key.pem
openssl req -new -key /etc/openvpn/ca-key.pem -out /etc/openvpn/ca-csr.pem -subj /CN=OpenVPN-CA/ &gt; /dev/null 2&gt;&amp;1
openssl x509 -req -in /etc/openvpn/ca-csr.pem -out /etc/openvpn/ca.pem -signkey /etc/openvpn/ca-key.pem -days 365 &gt; /dev/null 2&gt;&amp;1
echo 01 &gt; /etc/openvpn/ca.srl

# Generate Server Config
ok "❯❯❯ Generating Server Config"
openssl genrsa -out /etc/openvpn/server-key.pem 2048 &gt; /dev/null 2&gt;&amp;1
chmod 600 /etc/openvpn/server-key.pem
openssl req -new -key /etc/openvpn/server-key.pem -out /etc/openvpn/server-csr.pem -subj /CN=OpenVPN/ &gt; /dev/null 2&gt;&amp;1
openssl x509 -req -in /etc/openvpn/server-csr.pem -out /etc/openvpn/server-cert.pem -CA /etc/openvpn/ca.pem -CAkey /etc/openvpn/ca-key.pem -days 365 &gt; /dev/null 2&gt;&amp;1

cat &gt; /etc/openvpn/udp1194.conf &lt; /dev/null 2&gt;&amp;1
chmod 600 /etc/openvpn/client-key.pem
openssl req -new -key /etc/openvpn/client-key.pem -out /etc/openvpn/client-csr.pem -subj /CN=OpenVPN-Client/ &gt; /dev/null 2&gt;&amp;1
openssl x509 -req -in /etc/openvpn/client-csr.pem -out /etc/openvpn/client-cert.pem -CA /etc/openvpn/ca.pem -CAkey /etc/openvpn/ca-key.pem -days 36525 &gt; /dev/null 2&gt;&amp;1

cat &gt; /etc/openvpn/client.ovpn &lt;
$(cat /etc/openvpn/client-key.pem)


$(cat /etc/openvpn/client-cert.pem)


$(cat /etc/openvpn/ca.pem)

EOF

# Iptables
if [[ ! -f /proc/user_beancounters ]]; then
    N_INT = $(ip a |awk -v sip="$SERVER_IP" '$0 ~ sip { print $7}')
    iptables -t nat -A POSTROUTING -s 10.8.0.0/24 -o $N_INT -j MASQUERADE
else
    iptables -t nat -A POSTROUTING -s 10.8.0.0/24 -j SNAT --to-source $SERVER_IP
fi

iptables-save &gt; /etc/iptables.conf

cat &gt; /etc/network/if-up.d/iptables &lt; /proc/sys/net/ipv4/ip_forward

# Restart Service
ok "❯❯❯ service openvpn restart"
service openvpn restart &gt; /dev/null 2&gt;&amp;1
ok "❯❯❯ Your client config is available at /etc/openvpn/client.ovpn"
ok "❯❯❯ All done!"</pre>
Press CTRL+D to save.

Then:
<pre class="lang:default decode:true" title="Execute the Script">chmod 755 openvpn.sh
./openvpn.sh</pre>
This simple script will got OpenVPN installed and working on your VM or box easily. OpenVPN is a great way to connect to a work network, remain private, and encrypt your endpoint.

It's simple to run:

[caption id="attachment_625" align="alignnone" width="1893"]<a href="http://bryanapperson.com/wp-content/uploads/2014/11/console-install-openvpn-on-ubuntu.png"><img class="size-full wp-image-625" src="http://bryanapperson.com/wp-content/uploads/2014/11/console-install-openvpn-on-ubuntu.png" alt="Installing OpenVPN on Ubuntu" width="1893" height="1010" /></a> Installing OpenVPN on Ubuntu[/caption]

In just a few seconds you are all set, the script will automatically install OpenVPN and all the necessary dependencies, configure, and add a new user. Then just connect via SFTP and download the files to connect. Place them in the OpenVPN config directory on Windows or setup the values to match on a linux desktop.

OpenVPN is a very secure tunnel and I highly recommend it. I get near native speed running OpenVPN on a 512MB RAM Ubuntu 14.04 VM.		