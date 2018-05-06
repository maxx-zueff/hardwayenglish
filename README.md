# HardwayEnglish

Type. Wait. Repeat.

## Description

The project is a collection of English grammar rules. At the beginning of learning only one collection with rules is allowed (Present Simple, for example). In order to unlock more collections, you should make an effort, be patient and go through some hardcore grammar exercises.

At least 3 students are required to start learning the collection. The maximum number of students is five. After the recruitment process of three students, the timer starts, and within 5 minutes more participants are expected to join the learning process.

The basic idea is re-typing sentences in accordance with English grammar rules. It will take a hell of a time but will pay off later with the learning process. Every rule has few examples of the construction of the following rule. You should type this example to pass to the next rule. The more accurately the examples will be repeated, higher will be your score.

When you complete each rule in the collection you should pass the test based on what you have learnt. After completing test you'll be able to get a new collection (but you should go through the test without a single mistake, it is gonna be pretty hardcore). If you, unfortunately, make any mistake, you will be taken back to the beginning of the test (Oops!).

And after five days of passing a collection, you will need to pass the exam. At this point, every opened collection gets locked and you must type examples from you old collections you have passed five days ago! Upon the completion, it opens the locked collections.

## Contributors

I offer you to join the development of non-commercial web-application. The project is currently at the development stage. All you need is JavaScript skills and some motivation.

## <a name="installation"></a>Installation instruction

1. Clone repository
2. `cd hardwayenglish`
3. run `npm install`
4. run `npm run build`

---

## Single Page Application
The relationship between JS modules

Web application builds HTML-page from **layout** and **block**. After any `GET` request, the server is checking **token** in browser **cookie** and returning for the client the rendered HTML-page from one of following templates: `guest.pug`, `member.pug`, `admin.pug`.

```pug
//- layout.pug

doctype html
html

    head
        meta(charset="utf-8")
        meta(name="viewport" content="width=device-width, initial-scale=1")
        title HardwayEnglish
        link(
            rel="shortcut icon"
            href="/favicon.ico"
            type="image/ico"
        )
        block link

    body

        //- NAVIGATION
        header
            block header

        //- VIEW AREA [blocks loading through JavaScript]
        #view

        //- COPYRIGHT
        footer Copyright 2018 - HardwayEnglish licensed under the <a href="https://opensource.org/licenses/mit-license.php">MIT license</a>.


    script(src="/js/main.js")
```

Then browser is launching the `main` js-module and beginning to load the **block** (page content) through `POST` request. When you are surfing the web application by the navigation buttons it's loading a new **block** instead of the old ones.

Thus, the **SPA** is implemented on [VanillaJS](http://vanilla-js.com/).

![Schema](./readme_fig/spa.png)

[1] Initialization. Definition of the URL path

[2] `POST` request through that URL

[3] Returning the HTML block for further processing

[4] Calling the function to remove all listeners

[5] Removing every listener

[6] Implementing the **block** inside the `view` tag

[7] callback on successful execution

[8] Installing new listeners on DOM elements

## DataBase Structure

![Schema](./readme_fig/db.png)

## Routes

See [routes section](./ROUTES.md) to learn more about how they work.

---

## Conclusion
I can't see any easy way of learning English (and any language to be honest). You should repeat rules without forgetting what you have learnt previously, and that can be achieved only through annoying hard work and patience. I want to help you and others, who has hard times learning English.
