+++
date = "2021-03-18 22:14:00"
datepublished = "2021-03-18 22:14:00"
title = "A Gradual Journey to Typed Python"
description = "Python as a gradually typed language yeilds higher development velocity and reduced maintenance."
keywords = ['python', 'types', "programming", "development", "typed", "dynamic", "static", "gradual"]
tags = ["order", "mathematics", "python"]
share_img = "/blog/gradually-typed-python/images/gradually-typed-python.jpg"
images = [
  "/blog/gradually-typed-python/images/gradually-typed-python.jpg"
]

[[resources]]
  src = "**gradually-typed-python.jpg"
  name = "header"
  title = "Gradually typed Python is a balanced weapon for rapid development."
  [resources.params.meta]
    description = "A beautiful specimen of the Amethystine python, the longest snake in Australia."
    sameAs = "https://unsplash.com/photos/-6f9-eAybjA" # also updates caption
    license = "https://unsplash.com/license" # attribution not required
    creator = "David Clode"
    contentLocation = "Hartley's Crocodile Adventures, Wangetti, Australia"
    keywords = ["Euclid", "Geometry"]
+++

Python is much loved by developers for its ease of development, its low time 
to minimum viable product and, some might say, its dynamic typing. I've been 
using dynamically typed Python for the better part of a decade now, for those 
same reasons. Dynamically typed Python is rapid to develop in, features 
amorphous blobs of data and works great for writing code quickly.

Gradual typing and static analysis split the difference between the reduced 
velocity of a strongly typed language and the likewise reduced velocity 
of maintaining code where the input and output data types are unclear. 
Gradually typed Python makes reasoning about larger, and older, codebases 
easier. When I started using types in Python, I was just sprinkling in type 
annotations here and there.  The 
[Python type hinting](https://docs.python.org/3/library/typing.html) 
system can do much more.

## Static Analysis of Gradually Typed Python

Formatting tools like [Black](https://black.readthedocs.io/en/stable/)
and [isort](https://pycqa.github.io/isort/), along with static analysis tools 
like [Flake8](https://flake8.pycqa.org/en/latest/) are great for keeping 
python code consistent in form and free of unused variables. But Python type 
hinting can do more. [Mypy](https://mypy.readthedocs.io/en/stable/) provides 
many of the compile time checks you'd get in a strongly typed, compiled 
language like Rust, which are useful when developing and add no overhead at 
runtime.

## Command Line Interfaces via Typed Python

[Click](https://click.palletsprojects.com/en/7.x/) is one of my favorite 
command line interface libraries. Recently I stumbled upon 
[Typer](https://typer.tiangolo.com/), Typer is an abstraction on top of Click 
which uses type annotations and doctrings to generate beautiful command line 
interfaces with much less boilerplate code. Using Typer, a command line 
interface is 
[easy to build in just a few lines](https://typer.tiangolo.com/#an-example-with-two-subcommands).

## De/Serialization and Validation with Types

[Pydantic](https://pydantic-docs.helpmanual.io/), especially when combined
with mypy is a sure fire way to get lightning fast data models with low 
cost of development, and lower probability of bugs for serialization, 
deserizaliztion, and by nature, data validation.

## Conclusion

Using the type hinting system has made my code better, made me a better 
developer, and allowed the sort of semantics used in languages like Rust 
in Python. I think it can do the same for the reader, and is definitely 
worth using. I hope to put out some more blogs in the near future on my 
Python toolbox and maybe even a sample app putting it all together.
