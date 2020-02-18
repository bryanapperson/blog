+++
title = "Ceph OSD Performance: Backends and Filesystems"
date = "2016-04-12 04:40:48"
description = "Ceph OSD performance on various filesystems and backends including btrfs."
keywords = ['atlanta', 'bluestore', 'btrfs', 'ceph', 'meetup', 'osd', 'performance', 'technology', 'xfs']
tags = ['atlanta', 'bluestore', 'btrfs', 'ceph', 'meetup', 'osd', 'performance', 'technology', 'xfs']
+++

Ceph OSD performance characteristics are one of the most important
considerations when deploying a RADOS (Replicated Asynchronous Distributed
Object Storage) cluster. [Ceph](http://docs.ceph.com/docs/master/start/intro/)is
an open source project for scale out storage based on the
[CRUSH](http://ceph.com/papers/weil-crush-sc06.pdf) algorithm. An OSD is an
"Object Storage Daemon", which represents a journaling partition and a data
storage partition in the Filestore backend implementation. An OSD is, in a
broader sense where Ceph stores objects which hash to a specific
[placement group](http://docs.ceph.com/docs/master/rados/operations/placement-groups/)
(PG). A placement group is a hash bucket in a general computer science sense.
 This article explores the performance characteristics and features of various
Ceph OSD backends and filesystems. The content of this article was prepared for
and presented at the April 12th, 2016
[Ceph ATL meetup](http://www.meetup.com/Ceph-ATL/).

## Ceph OSD Performance

Optimal Ceph OSD performance can reduce the capital expense and operational
expense of meeting deployment requirements for a Ceph storage cluster. There are
many considerations and best practices when deploying a Ceph/RADOS cluster which
can enhance performance and stability. Many of those, such as kernel
optimizations, network stack optimizations, choice of hardware and Ceph tuning
parameters are outside the scope of this article. For those interested in other
performance enhancement vectors for Ceph deployments, some were covered at the
[Ceph ATL Kick-Off Meetup](http://www.meetup.com/Ceph-ATL/events/225907717/),
and many can be found in the
[Red Hat/Supermicro Ceph reference architecture document](https://www.redhat.com/en/files/resources/en-rhst-cephstorage-supermicro-INC0270868_v2_0715.pdf). However,
perhaps obviously, the interface to backing storage block devices is integral in
determining the performance of a RADOS cluster. The most widely used deployment
is with the OSD filestore backend and the XFS filesystem. There are interesting
developments in Ceph Jewel, namely the bluestore backend which may change that.

## Ceph OSD Backends

As of the Ceph Jewel release there will be multiple backends which can be used
for Ceph OSDs. This article covers filestore, bluestore and memstore.

### Filestore

At present filestore is the de-facto backend for production Ceph clusters. With
the filestore backend, Ceph writes objects as files on top of a POSIX filesystem
such as XFS, BTRFS or EXT4. With the filestore backend a OSD is composed of an
un-formatted
<a href="http://docs.ceph.com/docs/hammer/rados/configuration/journal-ref/">journal</a>
partition and an OSD data partition.

One of the largest drawbacks with the OSD filestore backend is the fact that all
data is written twice, through the journal and then to the backing data
partition. This essentially cuts the write performance of an OSD with co-located
journal and data in twain. This has resulted in many deployments using dedicated
solid state block devices split up into multiple partitions for journals. Many
deployments use a 4:1 or 5:1 ratio for journals to SSD an disk. This requires
the use of additional drive bays and increases the cost to performance ratio
significantly.

Filestore is the only backend bench-marked in this article.

#### Filesystems

The Ceph filestore OSD backend supports XFS, BTRFS and EXT4 filesystems. The
documentation presently recommends XFS for use in production, and BTRFS for
testing and development environments. Below is a comparison of Ceph OSD
performance for these three filesystems. But before going into Ceph OSD
performance, a feature comparison is useful.

##### XFS

[XFS](https://en.wikipedia.org/wiki/XFS) is used at present in many production
Ceph deployments. XFS was developed for Silicon Graphics, and is a mature and
stable filesystem. The filestore/XFS combination is well tested, stable and
great for use today. There are some tuning parameters which can be used during
filesystem creation and mounting as an OSD data partition which can be used to
improve Ceph OSD performance. These parameters are included in the Ceph
configuration on the
[github page](https://github.com/bryanapperson/ceph-osd-backends) for these
tests.

##### BTRFS

[BTRFS](https://btrfs.wiki.kernel.org/index.php/Main_Page) is a
[copy-on-write](http://en.wikipedia.org/wiki/Copy-on-write) filesystem. It
supports file creation timestamps and checksums that verify metadata integrity,
so it can detect bad copies of data and fix them with good copies. BTRFS very
interestingly supports transparent LZO and GZIP compression among and other
features. While the performance of compression on BTRFS will not be covered in
this article, the use in a large scale storage cluster is obvious. The BTRFS
community also aims to provide fsck,
[deduplication](https://btrfs.wiki.kernel.org/index.php/Deduplication), and data
encryption support. BTRFS is not recommended at this time for production use
with Ceph, however according to BTRFS developers, it is no  longer experimental.

##### EXT4

[EXT4](https://ext4.wiki.kernel.org/index.php/Main_Page) is a solid, battle
tested filesystem. However, with a maximum size of 16TB, it is not exactly
future proof (considering that Samsung
[has already released a 16TB drive](https://news.samsung.com/global/samsung-now-introducing-worlds-largest-capacity-15-36tb-ssd-for-enterprise-storage-systems)).
It is production ready for use as a Ceph filestore filesystem.

### Bluestore

\[caption id="attachment_834" align="alignleft"
width="427"\][![Ceph OSD Bluestore](http://bryanapperson.com/wp-content/uploads/2016/04/ceph-osd-bluestore.png)](http://bryanapperson.com/wp-content/uploads/2016/04/ceph-osd-bluestore.png)
Ceph OSD Bluestore Architecture\[/caption\] Bluestore is set to release for
experimental use in Jewel. The benefits of Bluestore are a direct to block OSD,
without filesystem overhead or the need for a "double-write" penalty (associated
with the filestore journal). Bluestore utilizes RocksDB, which stores object
metadata, a write ahead log, Ceph omap data and allocator metadata. Bluestore
can have 2-3 partitions per, one for RocksDB, one for RocksDB WAL and one for
OSD data (un-formatted - direct to block). Due to time constraints on the
presentation, and the lack of a Ceph Jewel build for Fedora 23. I may follow
this up with a comparison of the best performing filestore backend on RHEL7 and
Ceph bluestore. RocksDB and RocksDB WAL can be placed on the same partition. For
the tests below both RocksDB and OSD data were colocated on the same physical
disk for an apples-to-apples comparison with a co-located filestore backend. A
great in depth explanation of the OSD bluestore backend is available
[here](http://www.sebastien-han.fr/blog/2016/03/21/ceph-a-new-store-is-coming/).

### MEMSTORE

Memstore is an available backend for Ceph. However, it should never be used in
production due to the obvious volatility of memory. Steps for enabling memstore
can be found
[here](http://www.sebastien-han.fr/blog/2014/04/03/ceph-memstore-backend/). Due
to the fact that memstore is not a serious backend for production use, no
performance tests were run with it.

## Ceph OSD PERFORMANCE TEST METHOD

This section covers how the performance tests in this article were executed, the
environment and overall method. Since this article is strictly about OSD
backends and filesystems, all tests were executed on a single machine to
eliminate network related variance. Journal partitions (for the filestore
backend) were co-located on the same physical disks as the data partitions.

### ENVIRONMENT

All performance tests in this article were performed using Ceph Hammer. The
specifications for the test machine are as follows:

- CPU: Intel(R) Core(TM) i7-6700K CPU @ 4.00GHz
- RAM: 32GB DDR4 2133 MHz
- OSDs: 5 x  Seagate ST2000DM001 2TB
- OS: Fedora 23
- OS Drive: 2 x Samsung 850 Pro SSD (BTRFS RAID1)

The OSD Performance Test Rig\[/caption\] The test environment was my
personal desktop system. The OSD hard drives are consumer grade Seagate drives.
Block device/drive type has a huge impact on the performance of a Ceph storage
cluster, these 7200 RPM SATA III drives were used for all tests in this article.
To more on how to test the raw performance characteristics of a physical drive
for use as a OSD journal, data or co-located journal/data device see this
[github repo](https://github.com/bryanapperson/ceph-disk-test). This test
cluster was a single monitor, single node "cluster". The SATA controller was
on-board ASM1062 and nothing fancy like an LSI-2308. There was a PCIe "cache
tier" present with 2 M2 form factor SSDs as OSDs, although those were unused in
these tests. The test machine was running kernel 4.3.3-300.

### CONFIGURATIONS

The Ceph configurations filesystem tested are available on
[this github repository](https://github.com/bryanapperson/ceph-osd-backends).
All tests were performed with 3 replica storage pools.

### Tools

The build-in rados bench command was used for all performance metrics in this
article.

### Ceph OSD Performance Test Results

Note: Take the random read speeds with a grain of salt. Even with running echo
3 > /proc/sys/vm/drop_caches in between benchmarks, randomly read objects may
have already been stored in memory.

```bash
*   XFS:
    *   4 MB
        *   Write:
            *   IOPS: 19.17
            *   BW: 76.516 MB/s
            *   Latency: 0.835348s
        *   Read:
            *   IOPS: 118.38
            *   BW: 473.466MB/s
            *   Latency: 0.134731s

*   4 KB
    *   Write:
        *   IOPS: 203.124
        *   BW: 0.790MB/s
        *   Latency: 0.0789896s
    *   Read:
        *   IOPS: 209.33
        *   BW: 0.812MB/s
        *   Latency: 0.076963s
```

### Conclusion

The Filestore/XFS deployment scenario may be the stable way to go for production
Ceph clusters at the present. BTRFS/Filestore may be the most feature rich.
However, with the development of Bluestore this may change in the future.
