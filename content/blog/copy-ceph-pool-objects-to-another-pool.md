+++
title = "Copy Ceph Pool Objects to Another Pool"
date = "2015-11-17 23:06:18"
keywords = ['ceph', 'development', 'linux-tutorials', 'python', 'rados']
tags = ['ceph', 'development', 'linux-tutorials', 'python', 'rados']
+++

Sometimes it is necessary to copy Ceph pool objects from one Ceph pool to another - such as when changing CRUSH/erasure rule sets on an expanding cluster. There is a built-in command in RADOS for doing this. However the command in question, rados cppool , has some limitations. It only seems to work with replicated target pools. Thus it cannot copy Ceph pool objects from a erasure pool to a replicated pool, or between erasure pools. So to offer a utility for copying the contents of an erasure coded pool to another erasure pool, this evening I wrote up a function in my [python-rados-utils](https://github.com/bryanapperson/python-rados-utils) repository. To use the python-rados-utils package, you first have to build and install it. At this point the repository only works with RHEL/CentOS/Fedora due to the RPM based build system. You can however look through the code for usage on other platforms. It's pretty easy to get python-rados-utils up and running. Building from python-rados-utils from source:

```python
git clone git@github.com:bryanapperson/python-rados-utils.git
cd python-rados-utils
rpmbuild -ba python-rados-utils.spec
```

Installing python-rados-utils: The rpm from the build we just did will be output in `~/rpmbuild/RPMS/noarch/`. Install the rpm using: `rpm -Uvh <path-to-rpm>` Once the python-rados-utils package is installed, using it to copy all objects from one Ceph pool to another is very straight-forward. In your favorite text editor, open up a file `called copy_objects.py` . In this file place:

```python
# Optionally you can pass in the keyring and ceph.conf
# locations as strings.
thiscluster = common_utils.Cluster()
# Replace these empty stings with your source and target pool names
source = ''
target = ''
thiscluster.copy_pool(source, target)
```

NOTE: Updated versions of the above snippet can be found [here](https://github.com/bryanapperson/python-rados-utils/blob/master/examples/copy_pool.py). This script is single threaded at the moment and synchronous. I may add asynchronous and multi-threading functionalities to speed up Ceph pool copy in the near future. This code comes with no warranty of any kind and the code is licensed under GPLv2. Test in your own environment, but for me this worked well to copy all objects in one pool to another. Please leave your thoughts in the comments below and commit back any cool stuff to the python-rados-utils repository.