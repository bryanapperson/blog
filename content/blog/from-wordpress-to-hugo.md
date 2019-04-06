+++
date = "2019-04-03"
title = "From WordPress to Hugo"
description = "Why and how this blog is moving from WordPress to hugo and github pages."
keywords = "hugo, wordpress, migrate"
tags = [
    "hugo",
    "static blog",
    "go",
    "wordpress",
]
categories = [
    "Development"
]
series = ["Hugo"]

+++

{{< figure src="/images/hugo-logo-wide.svg" caption="Hugo static blogs are awesome" >}}

## Migrating to Hugo

It is 2019, enter the brave new world of serverless computing and static blogging. After years of using WordPress, and a few years without any updates this blog is in need of a refresh. When I originally created this blog I had servers (a whole web hosting company in fact). Now I just want to be able to create content and have a lightning fast website that is easy to maintain.

Earlier today I was doing some research, came across Hugo and decided to rebuild this blog using it and host it using github pages, at least initially. This site will likely be a work in progress for some time, however at least the text of the old content is migrated now. As I do this migration I will put out a series of articles on the how and the why of the migration.

## Why Hugo and the Coder theme?

Hugo is lightning fast at rendering pages and simple to use, plus the workflow with github pages is straightforward. The coder theme was chosed for now because I like the aesthetics.

## Migrating from Wordpress

I wanted a pretty fresh start, so I just used WordPress to export XML and then found a script [here](https://gist.github.com/mtik00/75c8f555b49365395e32). Then I modified it for python 3 as follows:

```python
#!/usr/bin/env python3
"""
This script is used to convert a WordPress XML dump to Hugo-formatted posts.
NOTE: The WP post data is kept as-is (probably HTML).  It is not converted to
Markdown.  This is to reduce the amount of "fixing" one has to do after the
data is converted (e.g. line endings, links, etc).  This is generally not an
issue since Markdown allows HTML.
The post Metadata is converted to TOML.
The posts are written as: <year>/<title>.md
    where <year> is the year the post was written, and <title> is the WP title
    with all non-word characters replaced with "-", and converted to lower case.
"""

# Imports ######################################################################
import os
import re
import maya
import time
import calendar
import xml.etree.ElementTree as ET
from distutils.version import LooseVersion

# Metadata #####################################################################
__author__ = "Timothy McFadden"
__creationDate__ = "07/24/2015"
__license__ = "MIT"
__version__ = "1.0.0dev"

# Globals ######################################################################
DEBUG = False
KNOWN_WP_VERSION = LooseVersion("4.2")


def hugo_format(data):
    result = ["+++"]
    for heading in ["title", "date", "type"]:
        result.append('%s = "%s"' % (heading, data[heading]))

    result.append("tags = %s" % str(data["tags"]))
    result.append("+++")
    result.append("")
    result.append(data["body"])

    return "\n".join(result)


def wp_version_check(channel):
    match = re.search("\?v=([\d\.]+)", channel.find("generator").text)
    if not match:
        print("WARNING: Could not find WP version in your XML.")
        print("...This script may not work")
        raw_input("...press Enter to continue: ")
    else:
        wp_version = LooseVersion(match.group(1))
        if wp_version < KNOWN_WP_VERSION:
            print("WARNING: WP version in your XML (%s) is less than known good version (%s)!" % (wp_version, KNOWN_WP_VERSION))
            print("...This script may not work")
            raw_input("...press Enter to continue: ")


def convert_wp_xml(xml_path):
    tree = ET.parse(xml_path)

    # FYI: xml.etree doesn't support reading the namespaces, and I don't feel
    # like requiring lxml.
    nsmap = {
        "excerpt": "http://wordpress.org/export/1.2/excerpt/",
        "content": "http://purl.org/rss/1.0/modules/content/",
        "wfw": "http://wellformedweb.org/CommentAPI/",
        "dc": "http://purl.org/dc/elements/1.1/",
        "wp": "http://wordpress.org/export/1.2/",
    }

    channel = tree.find("channel")
    wp_version_check(channel)

    for item in channel.findall("item"):
        data = {
            "tags": [],
            "title": (item.find("title").text).strip('\n'),
            "date": None,
            "body": None,
            "fpath": None,
            "type": "post"
        }

        scraped_time = item.find("pubDate").text
        datetime = maya.parse(scraped_time).datetime(to_timezone='US/Eastern', naive=True)
        data["date"] = datetime
        data["tags"] = [x.attrib["nicename"] for x in item.findall("category")]
        data["body"] = item.find("content:encoded", nsmap).text

        fname = re.sub("\W+", "-", data["title"])
        fname = re.sub("(-+)$", "", fname)
        fname = fname[1:]
        data["fname"] = "{}.md".format(fname.lower())
        data["fdir"] = os.path.abspath(os.path.join(".", str(datetime.year)))
        data["fpath"] = os.path.join(data["fdir"], data["fname"])

        hugo_text = hugo_format(data)

        if not os.path.isdir(data["fdir"]):
            os.makedirs(data["fdir"])

        with open(data["fpath"], "wb") as fh:
            fh.write(hugo_text.encode('UTF-8'))

        print("Created: {}/{}".format(datetime.year, data["fname"]))


if __name__ == '__main__':
    import sys

    if len(sys.argv) == 1:
        print("Usage:  python wp_to_hugo.py <wordpress XML file>")
        sys.exit(1)

    convert_wp_xml(sys.argv[1])
```

I ~~still need to manually sift through and fix images and curate the older posts~~ have now updated all of the older posts.

## Github Pages

I chose github pages because I already have a github account and the workflow seemed good. Plus there is an easy way I ~~plan to automate publishing master using travis-ci in the near future~~ have automated publishing. I followed the [Hugo docs](https://gohugo.io/hosting-and-deployment/hosting-on-github/#deployment-of-project-pages-from-your-gh-pages-branch), using the gh-pages branch based workflow. The repo for this blog now lives [here](https://github.com/bryanapperson/blog).

## Travis CI

I adapted this [guide on Travis CI and Hugo](https://axdlog.com/2018/using-hugo-and-travis-ci-to-deploy-blog-to-github-pages-automatically/) to automate the build and publish of my blog to github pages. It is pretty straightforward and I highly recommend it.

Here is the .travis.yml that I ended up with after optimizing a bit for faster builds of Hugo:

```yaml
# Credit to:
#https://axdlog.com/2018/using-hugo-and-travis-ci-to-deploy-blog-to-github-pages-automatically/                                                                     
# https://docs.travis-ci.com/user/deployment/pages/
# https://docs.travis-ci.com/user/reference/xenial/
# https://docs.travis-ci.com/user/languages/go/
# https://docs.travis-ci.com/user/customizing-the-build/

cache:
  directories:
    - $HOME/.cache/go-build
    - $HOME/gopath/pkg/mod

dist: xenial

language: go

go:
    - 1.12.x

# Only clone the most recent commit.
git:
  depth: 1

# before_install
# install - install any dependencies required
install:
    - go get github.com/gohugoio/hugo

before_script:
    - rm -rf public 2> /dev/null

# script - run the build script
script:
    - hugo

deploy:
  provider: pages
  skip-cleanup: true
  github-token: $GITHUB_TOKEN  # Set in travis-ci.org dashboard, marked secure
  email: $GITHUB_EMAIL
  name: $GITHUB_USERNAME
  verbose: true
  local-dir: public
  fqdn: bryanapperson.com
  on:
    branch: master  # branch contains Hugo generator code
```
## Conclusion

Overall the initial learning curve, setup, customization and migration took about 8 hours. I would say that is pretty good. There will definitely be more posts to follow on my journey with blogging using Hugo.
