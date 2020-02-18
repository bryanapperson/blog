+++
title = "Ceph Raw Disk Performance Testing"
date = "2020-02-17 23:27:54"
publishdate = "2015-08-25 20:19:44"
tags = ['ceph', 'storage', 'performance', 'osd', 'fio']
+++

Ceph raw disk performance testing is something you should not overlook when
architecting a ceph cluster. When choosing media for use as a journal or OSD in
a Ceph cluster, determining the raw IO characteristics of the disk when used in
the same way ceph will use the disk is of tantamount importance before tens,
hundreds or thousands of disks are purchased. The point of this article is to
briefly discuss how ceph handles IO. One important point is to estimate the
deviation caused by ceph between RAW IOs from disk and ceph IOs.

## TESTING & GRAPHING WITH FIO

For this article I assume you are aware of {{< external href="https://github.com/axboe/fio" text="fio" />}} and feel some degree of comfort uing it. You will need FIO and GNUPlot installed to run these tests. I have developed an
automation tool in my spare time for writing these tests. You can find it
here: {{< external href="https://github.com/bryanapperson/ceph-disk-test" text="ceph-disk-test" />}} RBD can
best be simulated by using a block size of 4M in your testing. However it is
pertinent to test with smaller IOs like 64k or 4k for worst case. Below is an
example test run with a Samsung Extreme USB stick to demonstrate how the results
look using this automation. The automation produces a nice graphs.

## Journal IO

Journal IO in Ceph uses O_DIRECT and D_SYNC flags. Journals write with an IO
Depth of 1 (1 IO at a time). However if you colocate multiple journals you
should increase your IO depth to the number of journals you plan to colocate on
the drive. Here is an example FIO test for testing journal performance on a
disk:

```ini
ioengine=libaio
invalidate=1
ramp_time=5
iodepth=1
runtime=300
time_based
direct=1
sync=1
bs=4m
size=10240m
filename=/tmp/tmp.ohf4hXHp1F/test.file

[seq-write]
stonewall
rw=write
write_bw_log=/tmp/tmp.QpdVIjrlnI/150825-1653-seq-write-journal-4m-intel-dc3700-d1
write_lat_log=/tmp/tmp.QpdVIjrlnI/150825-1653-seq-write-journal-4m-intel-dc3700-d1
write_iops_log=/tmp/tmp.QpdVIjrlnI/150825-1653-seq-write-journal-4m-intel-dc3700-d1
write_iolog=/tmp/tmp.QpdVIjrlnI/150825-1653-seq-write-journal-4m-intel-dc3700-d1

[rand-write]
stonewall
rw=randwrite
write_bw_log=/tmp/tmp.QpdVIjrlnI/150825-1653-rand-write-journal-4m-intel-dc3700-d1
write_lat_log=/tmp/tmp.QpdVIjrlnI/150825-1653-rand-write-journal-4m-intel-dc3700-d1
write_iops_log=/tmp/tmp.QpdVIjrlnI/150825-1653-rand-write-journal-4m-intel-dc3700-d1
write_iolog=/tmp/tmp.QpdVIjrlnI/150825-1653-rand-write-journal-4m-intel-dc3700-d1
```

## OSD IO

OSDs use buffered IO and thus you need to run performance tests of a size and
duration that is greater then the amount of RAM in the test machine. Here is an
example test file for an OSD:

```ini
ioengine=libaio
invalidate=1
ramp_time=5
iodepth=32
runtime=120
time_based
direct=0
bs=4m
size=10240m
filename=/tmp/tmp.taNceuCnCq/test.file

[seq-write]
stonewall
rw=write
write_bw_log=/tmp/tmp.IF0gdpokNE/150825-1218-seq-write-osd-4m-intel-dc3700
write_lat_log=/tmp/tmp.IF0gdpokNE/150825-1218-seq-write-osd-4m-intel-dc3700
write_iops_log=/tmp/tmp.IF0gdpokNE/150825-1218-seq-write-osd-4m-intel-dc3700
write_iolog=/tmp/tmp.IF0gdpokNE/150825-1218-seq-write-osd-4m-intel-dc3700

[rand-write]
stonewall
rw=randwrite
write_bw_log=/tmp/tmp.IF0gdpokNE/150825-1218-rand-write-osd-4m-intel-dc3700
write_lat_log=/tmp/tmp.IF0gdpokNE/150825-1218-rand-write-osd-4m-intel-dc3700
write_iops_log=/tmp/tmp.IF0gdpokNE/150825-1218-rand-write-osd-4m-intel-dc3700
write_iolog=/tmp/tmp.IF0gdpokNE/150825-1218-rand-write-osd-4m-intel-dc3700

[seq-read]
stonewall
rw=read
write_bw_log=/tmp/tmp.IF0gdpokNE/150825-1218-seq-read-osd-4m-intel-dc3700
write_lat_log=/tmp/tmp.IF0gdpokNE/150825-1218-seq-read-osd-4m-intel-dc3700
write_iops_log=/tmp/tmp.IF0gdpokNE/150825-1218-seq-read-osd-4m-intel-dc3700
write_iolog=/tmp/tmp.IF0gdpokNE/150825-1218-seq-read-osd-4m-intel-dc3700

[rand-read]
stonewall
rw=randread
write_bw_log=/tmp/tmp.IF0gdpokNE/150825-1218-rand-read-osd-4m-intel-dc3700
write_lat_log=/tmp/tmp.IF0gdpokNE/150825-1218-rand-read-osd-4m-intel-dc3700
write_iops_log=/tmp/tmp.IF0gdpokNE/150825-1218-rand-read-osd-4m-intel-dc3700
write_iolog=/tmp/tmp.IF0gdpokNE/150825-1218-rand-read-osd-4m-intel-dc3700
```

### References

Research material used to structure these ceph raw disk performance tests:

{{< external href="http://www.sebastien-han.fr/blog/2014/10/10/ceph-how-to-test-if-your-ssd-is-suitable-as-a-journal-device/" text="Journal Testing" />}}
{{< external href="http://ceph.com/planet/quick-analysis-of-the-ceph-io-layer/" text="OSD Testing" />}}
{{< external href="http://www.sebastien-han.fr/blog/2014/02/17/ceph-io-patterns-the-bad/" text="Ceph IO, The Bad" />}}
