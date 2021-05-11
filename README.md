# t o u c h t y p i e

[![github-actions](https://github.com/touchtypie/touchtypie/workflows/ci-master-pr/badge.svg)](https://github.com/touchtypie/touchtypie/actions)
[![github-release](https://img.shields.io/github/v/release/touchtypie/touchtypie?style=flat-square)](https://github.com/touchtypie/touchtypie/releases/)

A touch-typing trainer.

![touchtypie](assets/images/logo/logo-v1.0-blue.svg)

## Philosophy

Touch-typing enables one to be in flow while interfacing with a computer.

In contrast to reading alone, typing while reading engages the visual, linguistic, and especially motor (coordinative, tactile) faculties, which enhances understanding and memory.

## Development

It started out simple, but grew just enough to require a custom frontend framework. Most parts of are is still in pure HTML, CSS, JS.

## FAQ

### Q: How to practise with my own texts?

To practise on your own texts, you need to a custom library.

Simply put, a library, a collection, or a book is a `.txt` file, available as a URL.

- Library contains collection URL(s), one entry per line.
- Collection contains book URL(s), one entry per line.
- Book contains text

An easy way to host library, collection, and book files is to use [Github Pages](https://pages.github.com/), by:

1. Creating a new repository
2. Enabling Github Pages in repository settings on the `master` or `gh-pages` branch
3. Committing library, collection and book files to the repository's `master` or `gh-pages` branch
4. Each file will be available as `https://yourname.github.io/your-repository/<file.txt>`, where `<file.txt>` is the name of the committed file.

Once your library URL is up, in `touchtypie`, click the settings icon, click `+` beside libraries dropdown box, and paste the URL of the library and press enter. The library will be retreived and the practice will start. You may also share the library with others to practise on.

### Basic example

For instance, you want to create a library about nature.

- The library URL will be `https://yourname.github.io/your-repository/nature.txt`.
- A collection URL will be `https://yourname.github.io/your-repository/plants.txt`.
- A book URL will be `https://yourname.github.io/your-repository/apple.txt`.

Content of `https://yourname.github.io/your-repository/nature.txt` library (contains collection URLs, one entry per line).

```
https://yourname.github.io/your-repository/plants.txt
```

Content of collection `https://yourname.github.io/your-repository/plants.txt` (contains book URLs, one entry per line).

```
https://yourname.github.io/your-repository/apple.txt
```

Content of book `https://yourname.github.io/your-repository/apple.txt`:

```
An apple tree grows apple fruits, which are nice to eat.
Apples are said to keep one healthy.
An apple a day keeps the doctor away.
```

### Advanced example

For instance, you want to create a library about animals

- The library URL will be `https://yourname.github.io/your-repository/animals.txt`.
- A collection URL will be `https://yourname.github.io/your-repository/dog.txt`.
- A collection URL will be `https://yourname.github.io/your-repository/cat.txt`.
- A book URL will be `https://yourname.github.io/your-repository/cocker-spaniel.txt`.
- A book URL will be `https://yourname.github.io/your-repository/poodle.txt`.
- A book URL will be `https://yourname.github.io/your-repository/ragdoll.txt`.
- A book URL will be `https://yourname.github.io/your-repository/persian.txt`.


Content of library `https://yourname.github.io/your-repository/animals.txt` (contains collection URLs, one entry per line).

```
https://yourname.github.io/your-repository/dog.txt
https://yourname.github.io/your-repository/cat.txt
```

Content of collection `https://yourname.github.io/your-repository/dog.txt` (contains book URLs, one entry per line).

```
https://yourname.github.io/your-repository/cocker-spaniel.txt
https://yourname.github.io/your-repository/poodle.txt
```

Content of collection `https://yourname.github.io/your-repository/cat.txt` (contains book URLs, one entry per line).

```
https://yourname.github.io/your-repository/ragdoll.txt
https://yourname.github.io/your-repository/persian.txt
```

Content of book `https://yourname.github.io/your-repository/cocker-spaniel.txt`

```
Cocker spaniels are the cutest of all dogs.
They have long droopy ears.
```

Content of book `https://yourname.github.io/your-repository/poodle.txt`

```
Poodles are so cute, they look like plushies.
They have short and curly fur.
```

Content of book `https://yourname.github.io/your-repository/ragdoll.txt`

```
Ragdolls are the cutest all all cats.
Their fluff make them look like plushies.
```

Content of book `https://yourname.github.io/your-repository/persian.txt`

```
Persian are the most exotic of all cats.
They carry thmeselves with class.
```

### Q: Can it be easier to create a library?

It is part of the roadmap to support fetching of `.json` files as libraries. This will eliminate the need for creating multiple `.txt` files for libraries, collections, and books.

### Q: Why can't I use any URL's content as practice?

The browser is subject to a policy called [Cross-Origin Resource Sharing (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) which limits the browser from consuming resources from a website other than the current website (i.e. `touchtypie`).

In order for the browser to consume resources of another website, that website's server must return a HTTP header `access-control-allow-origin *`. However we have no control over that website's server.

Hence, the solution is to host our library, collection and book file(s) ourselves. This can easily be done by using [Github Pages](https://pages.github.com/) as discussed above, or uploading to your own web server.
