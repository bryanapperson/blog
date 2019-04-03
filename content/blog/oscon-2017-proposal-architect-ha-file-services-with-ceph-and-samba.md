+++
title = "				OSCON 2017 Proposal: Architect HA File Services With Ceph and Samba		"
date = "2016-10-26 00:43:53"
type = "post"
tags = ['ceph', 'development', 'file-services', 'high-availibility', 'linux-tutorials', 'oscon', 'samba']
+++


				Would you like to learn how industry leaders architect highly available file services solutions using open source software such as Ceph, Samba and CTDB? This proposed&nbsp;presentation at <a href="http://conferences.oreilly.com/oscon/oscon-tx">OSCON 2017</a> will offer practical architecture and how to knowledge for participants. From load balancing to fail-over, this proposed session&nbsp;will outline how to deploy and scale high performance Samba shares backed by <a href="http://ceph.com/ceph-storage/">Ceph</a> RBD and the <a href="https://en.wikipedia.org/wiki/GFS2">GFS2</a> clustered filesystem. Attendees will gain insight on best practices, common pitfalls and deployment methods. The source code used in this presentation will be&nbsp;available to everyone&nbsp;on&nbsp;<a href="https://github.com/bryanapperson">Github</a> in the spirit of open source.

[embed]https://youtu.be/POhnALKhycU[/embed]

<h2>How to Architect HA&nbsp;File Services With Ceph and Samba</h2>
Architecture of HA File Services using open source software can yield powerful solutions at scale with a lower cost of entry then "big iron" storage clusters. Using Linux, Ceph RBD, GFS2, Samba, CTDB and Pacemaker it is possible to build robust "active/active" file services which&nbsp;can interface with Linux, Unix, Mac and Windows clients.&nbsp;Using this mature open source software stack provides a powerful and stable solution. This presentation will teach developers, engineers and administrators how to leverage this or similar architectures to drive mission critical file services needs.
<h3>Background on this File Services Architecture</h3>
As a Storage Integration Engineer at <a href="https://www.concurrent.com/storage/aquari-storage/">Concurrent</a> on the <a href="http://www.aquaristorage.com/">Aquari storage</a> team, there was a necessity to explore&nbsp;HA file services solutions. Building a solid "active/active" HA solution for file services was&nbsp;challenging. There were&nbsp;many way to reach a solution to this problem, but nowhere was&nbsp;an end to end architecture available. So, with this in mind, research began in earnest on the topic of a solid HA file services stack.
<h3>Approach for development</h3>
There were a plethora of possibilities for creating an architecture. CephFS, GFS2 and OCFS2 were some of the possible cluster filesystem options to stand behind Samba and CTDB. The team considered options&nbsp;such as Pacemaker&nbsp;for resource management and&nbsp;Corosync&nbsp;for clustering. The "ask"&nbsp;was to support HA Samba backed by a Ceph cluster, in a short time, using open source technology. This architecture was a proof of concept developed towards that end.
<h3>WhIch ARCHITECTURE proved&nbsp;Itself the most "Battle ready"?</h3>
During the presentation&nbsp;participants will explore reasoning on using Linux, Ceph RBD, GFS2, Samba, CTDB, Pacemaker, Corosync and this stack's&nbsp;viability. A comparison of the available options was an essential part of finding a&nbsp;workable&nbsp;solution. Considerations in choosing this architecture and what the future may hold for HA File Services are also within the scope of this session.
<h3>How Open Source Saved Development Time and Added Business Value</h3>
This session is about how open source software saved development time and reduced the time to market for a highly available file services solution. Using open source software to build a viable HA Samba platform was a time saver in many ways. Developers, engineers and administrators&nbsp;will learn how their teams can benefit from this stack of powerful open source software.
<h2>Who is this presentation targeted at?</h2>
Storage Architects, Storage Developers, Storage Engineers, DevOps Engineers, Linux System Administrators and anybody interested in highly available file service built with open source software.
<h2>What will the Proposed Presentation Cover?</h2>
The attendees will gain an understanding of the following presentation topics in some level of detail:

- HA File Services
- Samba
- GFS2
- Pacemaker
<h2>What skills are prerequisite to best enjoy the presentation?</h2>
Attendees' knowledge of Linux command line is essential. Familiarity with Vagrant and Samba, while optional will enrich participation in the "how-to".
<h2>What will attendees For The&nbsp;tutorial part of the presentation?</h2>
Attendees need a&nbsp;Github&nbsp;account to clone the source code. A computer with Linux, Mac or Windows will also be valuable&nbsp;to actively participate in the tutorial.
<h2>See you in Austin (Possibly)!</h2>
Leave your thoughts in the comments below and I look forward to speaking on this topic in Austin at OSCON 2017!		