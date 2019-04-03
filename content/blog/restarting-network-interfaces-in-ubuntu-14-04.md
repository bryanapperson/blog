+++
title = "				Restarting Network Interfaces In Ubuntu 14.04		"
date = "2015-04-14 22:46:09"
tags = ['linux-tutorials', 'networking', 'ubuntu', 'ubuntu-14-04']
+++

    			Restarting network interfaces in Ubuntu 14.04 is not as easy as it should be. Due to a "<a title="Really, a feature?" href="https://bugs.launchpad.net/ubuntu/+source/ifupdown/+bug/1301015">feature</a>" in Ubuntu 14.04, <span class="lang:default decode:true  crayon-inline ">service network restart</span>  no longer works to restart network interfaces. To restart network interfaces one by one you can use <span class="lang:default decode:true  crayon-inline ">sudo ifconfig interfacename down &amp;&amp; sudo ifconfig interfacename up</span> . But what if you wanted to restart all interfaces at once without banging off multiple commands?

Look no further:

<pre class="lang:sh decode:true" title="Restart Ubuntu 14.04 Network Interfaces">for i in $(ifconfig -a | sed 's/[ \t].*//;/^\(lo\|\)$/d');do sudo ifconfig $i down &amp;&amp; sudo ifconfig $i up;done</pre>

To get fancier you can even make this into a script (place it in ~/bin):

<pre class="lang:sh decode:true">mkdir ~/bin
vi ~/bin/restart_network.sh</pre>

Then in vi (or your favorite editor) paste this:

<pre class="lang:sh decode:true" title="Script to restart networks in Ubuntu 14.04">#!/bin/bash

for i in $(ifconfig -a | sed 's/[ \t].*//;/^\(lo\|\)$/d');do sudo ifconfig $i down &amp;&amp; sudo ifconfig $i up;done</pre>

Then:

<pre class="lang:sh decode:true">chmod 755 ~/bin/restart_network.sh</pre>

Or, if you want to alleviate this "feature" entirely, check out my buddy <a title="Matt Ahrenstein" href="https://www.ahrenstein.com/about-matthew/">Matt Ahrenstein</a>'s <a title="Make network scripts work as expected in Ubuntu 14.04" href="https://github.com/ahrenstein/ChefCookbook-ubuntu-netfix">Chef Recipe for this</a>. It's a bit more involved, but restored network scripts to expected functionality in an elegant way.
