+++
title = "Mounting RBD at Boot Under CentOS 7"
description = "A quick and dirty guide on how to mount a ceph RBD at boot under CentOS 7"
date = "2020-02-18 00:17:32"
publishdate = "2015-04-08 10:05:45"
tags = ['centos', 'ceph', 'rbd', 'rhel', 'systemd']
+++

This tutorial covers mounting an RBD image at boot under CentOS 7. Make sure to
unmount the RBD you want to have mount at boot before following this tutorial.
This tutorial requires a CentOS 7 client with a client or admin keyring from
Ceph, and a working Ceph cluster. This tutorial also assumes you have already
created the RBD image you want to be mounted at boot. Let's begin!

## Assumptions

This tutorial assumes the node you are implementing this on has connectivity to
a working ceph cluster and also assumes that kernel module RBD is enabled. For
the purposes of this tutorial I will place variables, the values specified here:

```bash
export poolname = your_pools_name
export rbdimage = the_name_of_your_rbd_image
export mountpoint = place_to_mount_the rbd
```

## Create A systemd service to map and mount automatically on boot / demand

You will want to automatically load the kernel module, map the appropriate rbd
storage to a local device and mount the ceph image. Here is a simple script for
mounting and un-mounting RBD images create one at
/usr/bin/mount-rbd-$poolname-$rbdimage for each of your RBD images:

```bash
#!/bin/bash
# Image mount/unmount and pool are passed from the systems service as arguments
# Determine if we are mounting or unmounting
if [ "$1" == "m" ]; then
   modprobe rbd
   rbd map --pool $poolname $rbdimage --id admin --keyring /etc/ceph/ceph.client.admin.keyring
   mkdir -p $mountpoint
   mount /dev/rbd/$poolname/$rbdimage $mountpoint
fi
if [ "$1" == "u" ]; then
   umount $mountpoint
   rbd unmap /dev/rbd/$poolname/$rbdimage
fi
```

Create a new systemd service unit
(/etc/systemd/system/mount-rbd-$poolname-$rbdimage.service) for each of your
remote rbd images:

```ini
[Unit]
Description=RADOS block device mapping for $rbdimage in pool $poolname"
Conflicts=shutdown.target
Wants=network-online.target
After=NetworkManager-wait-online.service
[Service]
Type=oneshot
RemainAfterExit=yes
ExecStart=/usr/bin/mount-rbd-$poolname-$rbdimage m
ExecStop=/usr/bin/mount-rbd-$poolname-$rbdimage u
[Install]
WantedBy=multi-user.target
```

Make sure your target RBD is unmounted. Start the service and check whether
/dev/rbd0 is created or not:

`systemctl start mount-rbd-$poolname-$rbdimage`

## Mounting an RBD at Boot Under CentOS 7 is Easy!

If everything seems to be fine, enable the service to start on boot:

`systemctl enable mount-rbd-$poolname-$rbdimage`

You now have a working RBD mount at boot time! I wil be following this up with a
complete tutorial on the entire process of creating an RBD at some point in the
future. Leave your thoughts in the comments below.
