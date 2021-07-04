# t o u c h t y p i e

[![github-actions](https://github.com/touchtypie/touchtypie/workflows/ci-master-pr/badge.svg)](https://github.com/touchtypie/touchtypie/actions)
[![github-release](https://img.shields.io/github/v/release/touchtypie/touchtypie?style=flat-square)](https://github.com/touchtypie/touchtypie/releases/)

A touch-typing trainer.

https://play.touchtypie.com/

![touchtypie](assets/images/logo/logo-v1.0-blue.svg)

## Philosophy

Touch-typing enables one to be in flow while interfacing with a computer.

In contrast to reading alone, typing while reading engages the visual, linguistic, and especially motor (coordinative, tactile) faculties, which enhances understanding and memory.

## Development

It started out simple, but grew just enough to require a custom frontend framework. Most parts of are is still in pure HTML, CSS, JS.

## Practice resources

Here are some resources (libraries, collections, and books) you may like to use for practice:

- Official: https://touchtypie.github.io/touchtypie-libraries/

## FAQ - Practice

### Keyboard navigation?

Use the `ESC` key to navigate between `Home` and `Environment` (i.e. settings).

In `Environment`:

- Use the `TAB` key to navigate between settings.

- Use `ARROW` keys to navigate between dropdown entries.

- Use `ENTER` or `SPACE` keys to select or toggle settings.

### Q: What are the red boxes in the Trainer's speech?

The red boxes in the Trainer's speech are indications of errors present in the Student response.

### Q: How to practice on my own texts?

Ensure each text you want to practice is available as a URL.

In `touchtypie`, go to `Environment`, and click `+` beside `BOOKS`, paste a URL and hit enter. Do this for each URL you want to practice.

To save your practice environment, see [this answer](#q-how-to-save-the-practice-session).

Note: You may like to use the official practice resources for practice, see [here](#practice-resources).

### Q: How to save the practice session?

To save the practice session, go to `Environment`, and under `FAVORITE` click:

-  `L` button to favorite the current Library with your custom settings
-  `C` button to favorite the current Collection with your custom settings
-  `B` button to favorite the current Book with your custom settings

A `touchtypie` URL is saved to your clipboard. You may now bookmark, save, or share that `touchtypie` URL to practice anytime you want.

### Q: How to practice on my own URL?

See [this answer](#q-how-to-practice-on-my-own-texts).

### Q: I get a red exclamation mark when I add a URL.

Check that the URL is valid. Invalid URLs cannot be fetched.

If the URL is indeed valid, the failure to fetch the URL is because that website is protecting that resource from being shared. See [this answer](#q-why-cant-i-use-any-url-as-a-book-ie-practice-text). You may try another URL.

### Q: Why can't I use any URL as a book (i.e. practice text)?

The browser is subject to a policy called [Cross-Origin Resource Sharing (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) which limits the browser from consuming resources from a website other than the current website (i.e. `touchtypie`).

In order for the browser to consume resources of another website, that website's server must return a HTTP header `access-control-allow-origin: *`. However we have no control over that website's server.

Hence, the solution is to host our library, collection and book file(s) ourselves. This can easily be done by using [Github Pages](https://pages.github.com/) as discussed in [this answer](#q-how-to-create-a-custom-library-collection-or-book), or uploading to your own web server.

Alternatively, another solution is to use a proxy server which fetches the content of that page directly, and returns the content with a HTTP header `access-control-allow-origin: *`. This can be done by using [Cloudflare Workers](https://developers.cloudflare.com/workers/examples/cors-header-proxy).

### Q: How to practice on custom book(s)?

See [this answer](#q-how-to-practice-on-my-own-texts).

### Q: How to practice on custom collection(s)?

Ensure each collection you want to practice is available as a URL.

In `touchtypie`, go to `Environment`, and click `+` beside `COLLECTIONS`, paste a collection URL and hit enter. Do this for each collection you want to practice.

To save your practice environment, see [this answer](#q-how-to-save-the-practice-session).

### Q: How to practice on custom library(s)?

Ensure each collection you want to practice is available as a URL.

In `touchtypie`, go to `Environment`, and click `+` beside `LIBRARIES`, paste a library URL and hit enter. Do this for each library you want to practice.

To save your practice environment, see [this answer](#q-how-to-save-the-practice-session).

## FAQ - Environment

### Q: What is libraries?

All of the available libraries for practice. Use the `+` to add a custom library.

### Q: What is collections?

All of the available collections for practice. Use the `+` to add a custom collection.

### Q: What is books?

All of the available books for practice. Use the `+` to add a custom book.

### Q: What is playmode?

The playmode defines how the next book will be retrieved. Much like how a next song is played in a media player.

There are 4 playmodes:

- `shuffleglobal` - Shuffle across libraries.
- `shuffle` - Shuffle within a collection.
- `repeat` - Cycle within a collection.
- `repeatone` - Repeat the current book.

The default playmode is `shuffleglobal`.

### Q: What is meditation?

As its name implies, meditation declutters the `touchtypie` user interface to help the Student reach a state of meditation - a state of singularity of the Mind on the book.

### Q: What is perfection?

As its name implies, perfection enforces that the Student response (what is typed) must match the Trainer's speech (what is shown) for progress to be made in a book training session.

When perfection is turned on, the book training session starts from scratch. In perfection, errors continue to be tracked in statistics.

### Q: What is jumble?

As its name implies, jumble simply jumbles the **words** present in a book.

### Q: What is scramble?

As its name implies, scramble simply scrambles the **characters** present in a book.

### Q: What is statistics?

As its name implies, statistics simply shows statistics summaries on the `Home` scene.

Even when statistics is turned off, it continues being collected. Statistics are collated into a virtue at the end of each training session.

### Q: What is ambience?

As its name implies, ambience is the background of the training setting.

### Q: What is virtue?

As its name implies, virtue is the measure of a Student's performance for a particular training session.

A global virtue is a measure of a Student's overall performance across all training sessions.

### Q: What is favorite?

As its name implies, a favorite is a touchtypie URL that is copied to your clipboard containing your training settings, which you may save, bookmark, or share with others to practice on one particular book or books.

## FAQ - Terminology

### Q: What is a book?

A book is simply a URL. The content of the book is the content at the URL.

### Q: What is a collection?

A collection is a list of book URLs.

### Q: What is a library?

A library is a list of collection URLs.

### Q: Who is the Trainer?

The Trainer is the `touchtypie` who prepares training sessions for you.

### Q: What is the Trainer's speech?

The Trainer's speech is the text displayed for you to read and type.

### Q: Who is the Student?

The Student is the player of `touchtypie` who is you.

### Q: What is the Student's response?

The Student's response is the text you typed.

### Q: What is Home?

`Home` is the main scene of `touchtypie` where the Trainer and Student are.

### Q: What is Environment?

`Environment` is the settings scene of `touchtypie`.

## FAQ - Advanced

### Q: How to practice on custom book(s)?

Supply `GET` query parameter `book_ids=<URL>` (URL-encoding is not required) when accessing touchtypie. For example:

```
https://play.touchtypie.com?book_ids=https://touchtypie.github.io/touchtypie-libraries/books/keyboard-qwerty-letters.txt
```

To practice on multiple books, use multiple `GET` query parameter `book_ids=<URL>` separated by `&`. For example:

```
https://play.touchtypie.com?book_ids=https://touchtypie.github.io/touchtypie-libraries/books/keyboard-qwerty-letters.txt&book_ids=https://touchtypie.github.io/touchtypie-libraries/books/keyboard-qwerty-numbers.txt
```

### Q: How to practice on custom collection(s)?

To practice on one collection, use `GET` query parameter `book_collection_ids=<URL>` (URL-encoding is not required) when accessing touchtypie. For example:

```
https://play.touchtypie.com?book_collection_ids=https://touchtypie.github.io/touchtypie-libraries/collections/keyboard-qwerty.txt
```

To practice on multiple collections, use multiple `GET` query parameter `book_collection_ids=<URL>` separated by `&`. For example:

```
https://play.touchtypie.com?book_collection_ids=https://touchtypie.github.io/touchtypie-libraries/collections/keyboard-qwerty.txt&book_collection_ids=https://touchtypie.github.io/touchtypie-libraries/collections/plants.txt
```

### Q: How to practice on custom library(s)?

To practice on one library, use `GET` query parameter `book_library_ids=<URL>` (URL-encoding is not required) when accessing touchtypie. For example:

```
https://play.touchtypie.com?book_library_ids=https://touchtypie.github.io/touchtypie-libraries/libraries/daily.txt
```

To practice multiple libraries, use multiple `GET` query parameter `book_library_ids=<URL>` separated by `&`. For example:

```
https://play.touchtypie.com?book_library_ids=https://touchtypie.github.io/touchtypie-libraries/libraries/daily.txt&book_library_ids=https://touchtypie.github.io/touchtypie-libraries/libraries/nature.txt
```

### Q: How to create a custom library, collection, or book?

Simply put, a library, a collection, or a book is a `.txt` file, available as a URL.

- Library contains collection URL(s), one entry per line.
- Collection contains book URL(s), one entry per line.
- Book contains text

An easy way to host library, collection, and book files is to use [Github Pages](https://pages.github.com/), by:

1. Creating a new repository
2. Enabling Github Pages in repository settings on the `master` or `gh-pages` branch
3. Committing library, collection and book files to the repository's `master` or `gh-pages` branch
4. Each file will be available as `https://yourname.github.io/your-repository/<file.txt>`, where `<file.txt>` is the name of the committed file.

Once your library URL is up, in `touchtypie`, go to `Environment`, click `+` beside libraries dropdown box, and paste the URL of the library and press enter. The library will be retreived and the practice will start. You may also share the library with others to practice on.

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

See this library in the official [`touchtypie-libraries` repository](https://github.com/touchtypie/touchtypie-libraries).

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

See this library in the official [`touchtypie-libraries` repository](https://github.com/touchtypie/touchtypie-libraries).

### Q: Can it be easier to create a library?

It is part of the roadmap to support fetching of `.json` files as libraries. This will eliminate the need for creating multiple `.txt` files for libraries, collections, and books.
