# touhidurabir.github.io

Source for my portfolio site, live at **[touhidurabir.github.io](https://touhidurabir.github.io)**.

[Read the CV online](https://touhidurabir.github.io/cv.html) &middot; [Download the CV as PDF](https://touhidurabir.github.io/files/resume.pdf)

---

## About me

I am Touhidur Rahman, a senior full-stack engineer based in Dhaka, Bangladesh, working mostly in Laravel, PHP and Vue. I have been writing software professionally since 2011 and leading engineering teams since 2017. Most of the work is backend: architecture, APIs, database design, testing, deployment, and the production support that follows.

**Open Journal Systems, at the Public Knowledge Project (Simon Fraser University).**
I am a core backend developer on OJS. It runs 58,000+ journals across 156 countries. I am among the top 10 all-time contributors to both [pkp/ojs](https://github.com/pkp/ojs/graphs/contributors?all=1) and [pkp/pkp-lib](https://github.com/pkp/pkp-lib/graphs/contributors?all=1), with 1,000+ merged commits across the PKP repositories.

**Dentall Manager.**
Lead architect and developer of a multi-tenant SaaS ERP used by 50+ dental and medical clinics in the Netherlands, built and run with a team of eight engineers.

**Laravel packages.**
15 published on [Packagist](https://packagist.org/packages/touhidurabir/), installed around 195,000 times between them. [laravel-stub-generator](https://packagist.org/packages/touhidurabir/laravel-stub-generator) accounts for about 175,000 of those. [laravel-model-sanitize](https://packagist.org/packages/touhidurabir/laravel-model-sanitize) was featured on [Laravel News](https://laravel-news.com/laravel-model-sanitize).

Certified Laravel Developer since April 2022. Open to remote roles worldwide, and to the right on-site role abroad with visa sponsorship. Full-time or contract.

## Find me

| | |
| --- | --- |
| Portfolio | [touhidurabir.github.io](https://touhidurabir.github.io) |
| CV | [read online](https://touhidurabir.github.io/cv.html) &middot; [download PDF](https://touhidurabir.github.io/files/resume.pdf) |
| GitHub | [@touhidurabir](https://github.com/touhidurabir) |
| Packagist | [touhidurabir](https://packagist.org/packages/touhidurabir/) |
| LinkedIn | [in/touhidur](https://www.linkedin.com/in/touhidur) |
| Email | abircse06@gmail.com |

## About this repo

A static site on GitHub Pages with no build step. `.nojekyll` is present, so what is committed is what is served.

```
index.html       portfolio
cv.html          the CV as a crawlable HTML page
404.html         standalone, deliberately loads no shared CSS or JS
css/site.css     design tokens and every shared component
css/cv.css       CV layout and print rules, loaded after site.css
js/site.js       nav, theme toggle, reveals, counters, project filter
llms.txt         a plain-text summary for AI crawlers
```

No framework, no bundler, no package manager, no dependencies. One stylesheet, one script of about 150 lines of vanilla JavaScript. Dark by default, with a light theme that follows the system preference until you override it. `cv.html` prints cleanly to A4 through a `@media print` block.

To run it locally, serve the directory with anything at all:

```sh
python3 -m http.server 8000
```

## Reuse

The markup and CSS are here to read and learn from. The written content, the CV and the images are mine, so please do not republish them as your own.
