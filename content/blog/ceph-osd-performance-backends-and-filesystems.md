+++
title = "				Ceph OSD Performance: Backends and Filesystems		"
date = "2016-04-12 04:40:48"
tags = ['atlanta', 'bluestore', 'btrfs', 'ceph', 'meetup', 'osd', 'performance', 'technology', 'xfs']
+++

    			Ceph OSD performance characteristics are one of the most important considerations when deploying a RADOS (Replicated Asynchronous Distributed Object Storage) cluster. <a href="http://docs.ceph.com/docs/master/start/intro/">Ceph</a> is an open source project for scale out storage based on the <a href="http://ceph.com/papers/weil-crush-sc06.pdf">CRUSH</a> algorithm. An OSD is an "Object Storage Daemon", which represents a journaling partition and a data storage partition in the Filestore backend implementation. An OSD is, in a broader sense where Ceph stores objects which hash to a specific <a href="http://docs.ceph.com/docs/master/rados/operations/placement-groups/">placement group</a> (PG). A placement group is a hash bucket in a general computer science sense.  This article explores the performance characteristics and features of various Ceph OSD backends and filesystems. The content of this article was prepared for and presented at the April 12th, 2016 <a href="http://www.meetup.com/Ceph-ATL/">Ceph ATL meetup</a>.

<h3>PRESENTATION</h3>
The slides from the April 12th Ceph Atlanta meetup are attached as a PDF:

<a href="http://bryanapperson.com/wp-content/uploads/2016/04/CephATL_April12_meetup.pdf" rel="">Ceph ATL April 12th Meetup Presentation</a>

More on Ceph OSD Performance below!

<h2>Ceph OSD Performance</h2>
Optimal Ceph OSD performance can reduce the capital expense and operational expense of meeting deployment requirements for a Ceph storage cluster. There are many considerations and best practices when deploying a Ceph/RADOS cluster which can enhance performance and stability. Many of those, such as kernel optimizations, network stack optimizations, choice of hardware and Ceph tuning parameters are outside the scope of this article. For those interested in other performance enhancement vectors for Ceph deployments, some were covered at the <a href="http://www.meetup.com/Ceph-ATL/events/225907717/">Ceph ATL Kick-Off Meetup</a>, and many can be found in the <a href="https://www.redhat.com/en/files/resources/en-rhst-cephstorage-supermicro-INC0270868_v2_0715.pdf">Red Hat/Supermicro Ceph reference architecture document</a>. However, perhaps obviously, the interface to backing storage block devices is integral in determining the performance of a RADOS cluster. The most widely used deployment is with the OSD filestore backend and the XFS filesystem. There are interesting developments in Ceph Jewel, namely the bluestore backend which may change that.
<h2>Ceph OSD Backends</h2>
As of the Ceph Jewel release there will be multiple backends which can be used for Ceph OSDs. This article covers filestore, bluestore and memstore.
<h3>Filestore</h3>
[caption id="attachment_814" align="alignright" width="406"]<a href="http://bryanapperson.com/wp-content/uploads/2016/04/ceph-osd-filestore.png" rel="attachment wp-att-814"><img class="wp-image-814" src="http://bryanapperson.com/wp-content/uploads/2016/04/ceph-osd-filestore-1024x545.png" alt="Ceph OSD Filestore" width="406" height="216" /></a> Ceph OSD Filestore Architecture[/caption]

At present filestore is the de-facto backend for production Ceph clusters. With the filestore backend, Ceph writes objects as files on top of a POSIX filesystem such as XFS, BTRFS or EXT4. With the filestore backend a OSD is composed of an un-formatted <a href="http://docs.ceph.com/docs/hammer/rados/configuration/journal-ref/">journal</a> partition and an OSD data partition.

One of the largest drawbacks with the OSD filestore backend is the fact that all data is written twice, through the journal and then to the backing data partition. This essentially cuts the write performance of an OSD with co-located journal and data in twain. This has resulted in many deployments using dedicated solid state block devices split up into multiple partitions for journals. Many deployments use a 4:1 or 5:1 ratio for journals to SSD an disk. This requires the use of additional drive bays and increases the cost to performance ratio significantly.

Filestore is the only backend bench-marked in this article.

<h4>Filesystems</h4>
The Ceph filestore OSD backend supports XFS, BTRFS and EXT4 filesystems. The documentation presently recommends XFS for use in production, and BTRFS for testing and development environments. Below is a comparison of Ceph OSD performance for these three filesystems. But before going into Ceph OSD performance, a feature comparison is useful.
<h5>XFS</h5>
<a href="https://en.wikipedia.org/wiki/XFS">XFS</a> is used at present in many production Ceph deployments. XFS was developed for Silicon Graphics, and is a mature and stable filesystem. The filestore/XFS combination is well tested, stable and great for use today. There are some tuning parameters which can be used during filesystem creation and mounting as an OSD data partition which can be used to improve Ceph OSD performance. These parameters are included in the Ceph configuration on the <a href="https://github.com/bryanapperson/ceph-osd-backends">github page</a> for these tests.
<h5>BTRFS</h5>
<a href="https://btrfs.wiki.kernel.org/index.php/Main_Page">BTRFS</a> is a <a class="reference external" href="http://en.wikipedia.org/wiki/Copy-on-write">copy-on-write</a> filesystem. It supports file creation timestamps and checksums that verify metadata integrity, so it can detect bad copies of data and fix them with good copies. BTRFS very interestingly supports transparent LZO and GZIP compression among and other features. While the performance of compression on BTRFS will not be covered in this article, the use in a large scale storage cluster is obvious. The BTRFS community also aims to provide fsck, <a href="https://btrfs.wiki.kernel.org/index.php/Deduplication">deduplication</a>, and data encryption support. BTRFS is not recommended at this time for production use with Ceph, however according to BTRFS developers, it is no  longer experimental.
<h5>EXT4</h5>
<a href="https://ext4.wiki.kernel.org/index.php/Main_Page">EXT4</a> is a solid, battle tested filesystem. However, with a maximum size of 16TB, it is not exactly future proof (considering that Samsung <a href="https://news.samsung.com/global/samsung-now-introducing-worlds-largest-capacity-15-36tb-ssd-for-enterprise-storage-systems">has already released a 16TB drive</a>). It is production ready for use as a Ceph filestore filesystem.
<h3>Bluestore</h3>
[caption id="attachment_834" align="alignleft" width="427"]<a href="http://bryanapperson.com/wp-content/uploads/2016/04/ceph-osd-bluestore.png" rel="attachment wp-att-834"><img class="wp-image-834 size-full" src="http://bryanapperson.com/wp-content/uploads/2016/04/ceph-osd-bluestore.png" alt="Ceph OSD Bluestore" width="427" height="427" /></a> Ceph OSD Bluestore Architecture[/caption]

Bluestore is set to release for experimental use in Jewel. The benefits of Bluestore are a direct to block OSD, without filesystem overhead or the need for a "double-write" penalty (associated with the filestore journal). Bluestore utilizes RocksDB, which stores object metadata, a write ahead log, Ceph omap data and allocator metadata. Bluestore can have 2-3 partitions per, one for RocksDB, one for RocksDB WAL and one for OSD data (un-formatted - direct to block). Due to time constraints on the presentation, and the lack of a Ceph Jewel build for Fedora 23. I may follow this up with a comparison of the best performing filestore backend on RHEL7 and Ceph bluestore.

RocksDB and RocksDB WAL can be placed on the same partition. For the tests below both RocksDB and OSD data were colocated on the same physical disk for an apples-to-apples comparison with a co-located filestore backend. A great in depth explanation of the OSD bluestore backend is available <a href="http://www.sebastien-han.fr/blog/2016/03/21/ceph-a-new-store-is-coming/">here</a>.

<h3>MEMSTORE</h3>
Memstore is an available backend for Ceph. However, it should never be used in production due to the obvious volatility of memory. Steps for enabling memstore can be found <a href="http://www.sebastien-han.fr/blog/2014/04/03/ceph-memstore-backend/">here</a>. Due to the fact that memstore is not a serious backend for production use, no performance tests were run with it.
<h2>Ceph OSD PERFORMANCE TEST METHOD</h2>
This section covers how the performance tests in this article were executed, the environment and overall method. Since this article is strictly about OSD backends and filesystems, all tests were executed on a single machine to eliminate network related variance. Journal partitions (for the filestore backend) were co-located on the same physical disks as the data partitions.
<h3>ENVIRONMENT</h3>
All performance tests in this article were performed using Ceph Hammer. The specifications for the test machine are as follows:
<ul>
	<li>CPU: Intel(R) Core(TM) i7-6700K CPU @ 4.00GHz</li>
	<li>RAM: 32GB DDR4 2133 MHz</li>
	<li>OSDs: 5 x  Seagate <span id="grpDescrip_22-148-834">ST2000DM001 2TB</span></li>
	<li>OS: Fedora 23</li>
	<li>OS Drive: 2 x Samsung 850 Pro SSD (BTRFS RAID1)</li>
</ul>
[caption id="attachment_821" align="alignleft" width="300"]<a href="http://bryanapperson.com/wp-content/uploads/2016/04/IMG_20151117_185421.jpg" rel="attachment wp-att-821"><img class="wp-image-821 size-medium" src="http://bryanapperson.com/wp-content/uploads/2016/04/IMG_20151117_185421-300x225.jpg" alt="The OSD performance test rig" width="300" height="225" /></a> The OSD Performance Test Rig[/caption]

The test environment was my personal desktop system. The OSD hard drives are consumer grade Seagate drives. Block device/drive type has a huge impact on the performance of a Ceph storage cluster, these 7200 RPM SATA III drives were used for all tests in this article. To more on how to test the raw performance characteristics of a physical drive for use as a OSD journal, data or co-located journal/data device read <a href="http://bryanapperson.com/blog/ceph-raw-disk-performance-testing/">this</a>.

This test cluster was a single monitor, single node "cluster". The SATA controller was on-board ASM1062 and nothing fancy like an LSI-2308. There was a PCIe "cache tier" present with 2 M2 form factor SSDs as OSDs, although those were unused in these tests. The test machine was running kernel 4.3.3-300.

<h3>CONFIGURATIONS</h3>
The Ceph configurations filesystem tested are available on <a href="https://github.com/bryanapperson/ceph-osd-backends">this github repository</a>. All tests were performed with 3 replica storage pools.
<h3>TOOLS</h3>
The build-in <span class="lang:sh decode:true crayon-inline">rados bench</span> command was used for all performance metrics in this article.
<h2>Ceph OSD PErformance Test REsults</h2>
Note: Take the random read speeds with a grain of salt. Even with running <span class="lang:sh decode:true crayon-inline">echo 3 &gt; /proc/sys/vm/drop_caches</span> in between benchmarks, randomly read objects may have already been stored in memory.
<ul>
	<li class="li1"><span class="s2">XFS:</span>
<ul>
	<li class="li1"><span class="s2">4 MB</span>
<ul>
	<li class="li1"><span class="s2">Write:</span>
<ul>
	<li class="li1"><span class="s2">IOPS: 19.17</span></li>
	<li class="li1"><span class="s2">BW: 76.516 MB/s</span></li>
	<li class="li1"><span class="s2">Latency: 0.835348s</span></li>
</ul>
</li>
	<li class="li1"><span class="s2">Read: </span>
<ul>
	<li class="li1"><span class="s2">IOPS: 118.38</span></li>
	<li class="li1"><span class="s2">BW: 473.466MB/s</span></li>
	<li class="li2"><span class="s2">Latency: 0.134731s</span></li>
</ul>
</li>
</ul>
</li>
</ul>
</li>
</ul>
<ul>
<ul>
	<li class="li1"><span class="s2">4 KB</span>
<ul>
	<li class="li1"><span class="s2">Write:</span>
<ul>
	<li class="li1"><span class="s2">IOPS: 203.124</span></li>
	<li class="li1"><span class="s2">BW: 0.790MB/s</span></li>
	<li class="li1"><span class="s2">Latency: 0.0789896s</span></li>
</ul>
</li>
	<li class="li1"><span class="s2">Read: </span>
<ul>
	<li class="li1"><span class="s2">IOPS: 209.33</span></li>
	<li class="li1"><span class="s2">BW: 0.812MB/s</span></li>
	<li class="li2"><span class="s2">Latency: 0.076963s</span></li>
</ul>
</li>
</ul>
</li>
</ul>
</ul>
<h2>Conclusion</h2>
The Filestore/XFS deployment scenario may be the stable way to go for production Ceph clusters at the present. BTRFS/Filestore may be the most feature rich. However, with the development of Bluestore this may change in the future.
