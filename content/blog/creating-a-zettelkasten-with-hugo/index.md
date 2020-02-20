+++
date = "2020-02-18 1:42:00"
datepublished = "2020-02-18 01:40:00"
title = "Creating a Zettelkasten with Hugo"
description = "Why you need a Zettelkasten, what a Zettelkasten is, and how to create a portable Zettelkasten using hugo and git. Based on the ideas of Niklas Luhmann and Umberto Eco."
keywords = ['Umberto Eco', 'Niklas Luhmann', 'zettel', 'zettelkasten', 'second brain', 'git', 'hugo']
tags = ["mind", "relation", "zettelkasten", "information", "order", "chaos"]
toc = true

[[resources]]
  src = "**zettelkasten-index-cards.jpg"
  name = "header"
  title = "A digital Zettelkasten using hugo."
  [resources.params.meta]
    description = "Light trails depicting speed"
    creator = "Maksym Kaharlytskyi"
    sameAs = "https://unsplash.com/photos/Q9y3LRuuxmg" # also updates caption
    license = "https://unsplash.com/license" # attribution not required
    contentLocation = "Ottawa, Canada"
    keywords = ["filing cabinet", "index cards"]
+++

## Why do I need a Zettelkasten?

The idea of a _Zettelkasten_ struck me in a chat recently. I have been keeping
physical journals, using a modified form of bullet journalling, for a while;
I had been keeping less structured notes before that, and ruminating on
how to digitize them. After learning about the concept of _Zettelkasten_, it
seemed like the solution; and that led me down the rabbit hole of investigation.
Because of that investigation, I am now building a _Zettlekasten_ for myself.
The idea of a way to grok all notes for eternity is an obvious boon to any 
knowledge worker. This system has less obvious, and much greater benefits beyond 
just digitizing notes.

## What is a Zettelkasten?

The _Zettelkasten_ is a concept, essentially, of a graph of data 
interconnected by metadata, links and taxonomies. It was originally
laid out by a German sociologist: {{< blockquote
  citelink="https://luhmann.surge.sh/communicating-with-slip-boxes"
  cite="Communicating With Slip Boxes, by Niklas Luhmann" text="If you wish to educate a partner in communication, it will be good to provide him with independence from the beginning. A slip box, which has been made according to the suggestions just given can exhibit great independence."/>}}

It was also explored in this physical format by Umberto Eco (1977) in 
_How to Write a Thesis_. This format involved drawers full of annotated
index cards.

This loosely organized graph allows a Cartesian explosion of complexity.
The core idea of the system is a second brain, one mirroring the
structure of the human mind. This organic structure is how _zufall_, or
randomness, eventually emerges, resulting in serendipitous discovery.
The weighting of links produces more prominent and less prominent regions,
much like search engine rankings. This starts to sound an awful lot like a
preeminent description of the internet and search engines. There is, however,
 another aspect to consider:

{{< blockquote
  citelink="https://luhmann.surge.sh/communicating-with-slip-boxes" cite="Niklas Luhmann, Communicating With Slip Boxes" text="Without variation in the given material of ideas, there are no possibilities of examining and selecting novelties. The real problem thus becomes therefore one of producing accidents with sufficiently enhanced probabilities for selection."/>}}

The distillation of broader research into notes with metadata allows
for your own personal internet, with a less hierarchical structure than say,
a wiki. The balance between order and chaos is essential, Luhmann purports, 
to the extract synthesis of new ideas from a body of notes.

## What Makes a Zettelkasten?

#### Zettels

A _zettel_ is a set of data, along with related attachments and metadata.
Every _zettel_, or note, is a node in the graph that becomes the _Zettelkasten_.

##### Arbitrary Internal Branching

Any _zettel_ must have the ability to branch and be a parent of other _zettels_

##### Possibility of Linking

Any _zettel_ must be able to link to any other _zettel_.

#### Index, or Register of Taxonomies and Tags

For the _zettels_ to be useful in the concept of the _Zettelkasten_,
there must be an index or register that is searchable.

#### Inflow

There must be a source of content. For me that is my paper notes and digital
notes. Those notes must be collected; then they must be processed into _zettels_
with metadata, and links to other _zettels_.

#### Outflow

The _Zettelkasten_ is accessed via the register to search for ideas while
writing or producing other outputs. Optionally there is a feedback into the
inflow during this process.

## How Can We Make a Digital Zettelkasten?

### Thoughts on Design

The physical design of the system as proposed by Luhmann is outdated. Physical
space was a concern, but in the context of cheap hard drive space it is not.
The issue ordering also becomes irrelevant. Though, the question of a flat 
structure to prevent usage bias, or obsession over categorization and order,
has it's merit. So digital is definitely the way to go.

That leads to the question of how best to do it. There are ready made solutions
out there like {{<external href="https://zettelkasten.de/the-archive/" text="The Archive"/>}},
and that may be the solution for most. It does seem however to duplicate extant
functionalities in hypertext and web browsers. All we really need is URIs,
metadata, and a search system for that metadata to create a functioning
_Zettelkasten_.

### Enter: A Hugo Based Zettelkasten

In [From WordPress to Hugo](/blog/from-wordpress-to-hugo/), I migrated my 
blog to Hugo. This proved to be the extant solution I was looking for. 
I thought about an optimal design for a Zettelkasten; one that would 
be portable, open source, and stand the test of time. A solution that 
could check the boxes of arbitrary metadata, linking and search of those 
things. Hugo, with its use of markdown, standard URIs and static page 
generation is a great solution.

I stumbled upon the {{<external href="https://after-dark.habd.as/" 
text="After Dark theme for hugo, by Josh Habdas"/>}}.
It already had many of the features I needed, such as search, citations,
and rich linking between pages, or _zettels_ implemented. So I switched my blog over
to the aforementioned theme. I then created a private `git submodule`
repository, and put that in the `content/zettelkasten` folder of my hugo
setup. Voila, a public blog with a private _Zettelkasten_.

The only caveat on the theme is that it uses {{<external href="https://fusejs.io/" text="Fuse.js"/>}}
for search. I am not sure if it is the implementation in the theme, or the nature
of the fuzzy search, but it isn't always the best at finding things. I am 
considering tweaking the implementation or switching it out for 
{{<external href="https://lunrjs.com/" text="Lunr" />}}, but those are future
problems.

When the CI pipeline runs to build the blog, does not have permissions to pull
the _Zettelkasten_, which is secured by private key. But when I run a local
development server, I have both my _Zettelkasten_ and my blog, an outflow,
searchable at my fingertips.

#### What about portability?

Here is the cool part, Hugo can run on android. So with git, I can just
clone my blog on my phone and run a local web server. More to follow on that
in another blog post.

### What's Next?

I still have to approach getting all of my notes into _zettels_.
Maybe I'll have more to say after that. I'll also likely add a technical step by step for setting up a _Zettelkasten_ using Hugo and the After Dark theme, as time permits. Leave your thoughts in the comments below.
