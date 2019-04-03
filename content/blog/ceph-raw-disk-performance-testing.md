+++
title = "				Ceph Raw Disk Performance Testing		"
date = "2015-08-25 20:19:44"
type = "post"
tags = ['ceph', 'disk-testing', 'io', 'journal', 'linux-tutorials', 'osd']
+++


				Ceph raw disk performance testing is something you should not overlook when architecting a ceph cluster. When choosing media for use as a journal or OSD in a Ceph cluster, determining the raw IO characteristics of the disk when used in the same way ceph will use the disk is of tantamount importance before tens, hundreds or thousands of disks are purchased. The point of this article is to briefly discuss how ceph handles IO. One important point is to estimate the deviation caused by ceph between RAW IOs from disk and ceph IOs.
<h2>TESTING &amp; GRAPHING WITH FIO</h2>
For this article I assume you are aware of <a href="https://github.com/axboe/fio">FIO</a>. You will need FIO and GNUPlot installed to run these tests. I have developed an automation tool in my spare time for writing these tests. You can find it here: <a href="https://github.com/bitronictech/ceph-disk-test">Ceph-Disk-Test</a>

RBD can best be simulated by using a block size of 4M in your testing. However it is pertinent to test with smaller IOs like 64k or 4k for worst case. Below is an example test run with a Samsung Extreme USB stick to demonstrate how the results look using this automation.

The automation produces a nice graphs like this:

<a href="http://bryanapperson.com/wp-content/uploads/2015/08/150825-1901-osd-4m-samsung-iops.png"><img class="alignnone size-full wp-image-738" src="http://bryanapperson.com/wp-content/uploads/2015/08/150825-1901-osd-4m-samsung-iops.png" alt="Ceph Raw Disk Performance Testing OSD IOPS 4M" width="1920" height="1080" /></a> <a href="http://bryanapperson.com/wp-content/uploads/2015/08/150825-1901-osd-4m-samsung-clat.png"><img class="alignnone size-full wp-image-739" src="http://bryanapperson.com/wp-content/uploads/2015/08/150825-1901-osd-4m-samsung-clat.png" alt="Ceph Raw Disk Performance Testing OSD clat 4M" width="1920" height="1080" /></a> <a href="http://bryanapperson.com/wp-content/uploads/2015/08/150825-1901-osd-4m-samsung-lat.png"><img class="alignnone size-full wp-image-740" src="http://bryanapperson.com/wp-content/uploads/2015/08/150825-1901-osd-4m-samsung-lat.png" alt="Ceph Raw Disk Performance Testing OSD lat 4M" width="1920" height="1080" /></a> <a href="http://bryanapperson.com/wp-content/uploads/2015/08/150825-1901-osd-4m-samsung-slat.png"><img class="alignnone size-full wp-image-741" src="http://bryanapperson.com/wp-content/uploads/2015/08/150825-1901-osd-4m-samsung-slat.png" alt="Ceph Raw Disk Performance Testing OSD slat 4M" width="1920" height="1080" /></a> <a href="http://bryanapperson.com/wp-content/uploads/2015/08/150825-1901-osd-4m-samsung-bw.png"><img class="alignnone size-full wp-image-742" src="http://bryanapperson.com/wp-content/uploads/2015/08/150825-1901-osd-4m-samsung-bw.png" alt="Ceph Raw Disk Performance Testing OSD BW 4M" width="1920" height="1080" /></a>

<a href="https://drive.google.com/file/d/0B_jveeQ1rgGPT1o3ZXE0VUU4MHM">Example test run raw data from a Samsung Extreme USB stick</a>
<h2>Journal IO</h2>
Journal IO in Ceph uses O_DIRECT and D_SYNC flags. Journals write with an IO Depth of 1 (1 IO at a time). However if you colocate multiple journals you should increase your IO depth to the number of journals you plan to colocate on the drive. Here is an example FIO test for testing journal performance on a disk:
<pre class="lang:default decode:true" title="Journal Test Example">[global]
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
write_iolog=/tmp/tmp.QpdVIjrlnI/150825-1653-rand-write-journal-4m-intel-dc3700-d1</pre>
&nbsp;
<h2>OSD IO</h2>
OSDs use buffered IO and thus you need to run performance tests of a size and duration that is greater then the amount of RAM in the test machine. Here is an example test file for an OSD:
<pre class="lang:default decode:true" title="OSD Fio Test Example">[global]
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
write_iolog=/tmp/tmp.IF0gdpokNE/150825-1218-rand-read-osd-4m-intel-dc3700</pre>
<h3>References</h3>
Research material used to structure these ceph raw disk performance tests:

Journal Testing:

<a class="external-link" href="http://www.sebastien-han.fr/blog/2014/10/10/ceph-how-to-test-if-your-ssd-is-suitable-as-a-journal-device/" rel="nofollow">http://www.sebastien-han.fr/blog/2014/10/10/ceph-how-to-test-if-your-ssd-is-suitable-as-a-journal-device/</a>

OSD Testing:

<a class="external-link" href="http://ceph.com/planet/quick-analysis-of-the-ceph-io-layer/" rel="nofollow">http://ceph.com/planet/quick-analysis-of-the-ceph-io-layer/</a>

FIO Howto:

<a class="external-link" href="http://www.bluestop.org/fio/HOWTO.txt" rel="nofollow">http://www.bluestop.org/fio/HOWTO.txt</a>

Ceph IO, The Bad:

<a class="external-link" href="http://www.sebastien-han.fr/blog/2014/02/17/ceph-io-patterns-the-bad/" rel="nofollow">http://www.sebastien-han.fr/blog/2014/02/17/ceph-io-patterns-the-bad/</a>		