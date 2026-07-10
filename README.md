# Qadamha (قدم‌ها) — Every attempt was a step

**Qadamha** ("Steps" in Dari) is an open archive of Afghan startups, apps,
websites, and projects that stopped, paused, or were never completed.

It records the idea, the founders, the team, the effort — and why it had to
stop. It exists to tell the next generation: *even through war and hardship,
we kept trying. We did what we could. Keep going — until we finally make it.*

A project that stops is not a failure. It is a step. The next person starts
further ahead because of it.

**قدم‌ها** بایگانی باز استارتاپ‌ها و پروژه‌های افغانستان است که متوقف شدند یا
ناتمام ماندند — به پاس آن همه تلاش، و با این پیام به نسل بعد: ادامه بدهید.

**قدم‌ها** د افغانستان د هغو سټارټ اپونو او پروژو پرانیستی ارشیف دی چې ودرېدل
یا نیمګړي پاتې شول — د هڅو د درناوي لپاره، او راتلونکي نسل ته دا پیغام: مخکې
لاړ شئ.

## The site

- **Three languages:** English, Dari (دری), and Pashto (پښتو), with full RTL support.
- **Stories as files:** every story is a Markdown file in
  [`src/content/ideas/`](src/content/ideas/) — no database, no accounts.
  The git history is part of the archive.
- **Explore:** filterable story index, a year-by-year timeline, related
  stories, and share cards generated at build time.
- **Fast and light:** fully static HTML, self-hosted fonts — built for slow
  connections.

## Add a story

Everyone is invited — founders, team members, friends, journalists.

1. Fork this repository.
2. Copy [`src/content/ideas/_template.md`](src/content/ideas/_template.md)
   into `src/content/ideas/en/`, `fa/`, or `ps/` and name it after the
   project (e.g. `my-startup.md`). Use the **same file name** in each language
   so translations link automatically.
3. Fill in the details, write the story, set `draft: false`.
4. Open a pull request. CI validates the format automatically.

Not comfortable with GitHub? [Open a story form](../../issues/new/choose) and
write everything in your own words — a maintainer will do the rest.

See [CONTRIBUTING.md](CONTRIBUTING.md) for details (English, Dari, Pashto).

## Develop

```sh
npm install
npm run dev      # local dev server
npm test         # unit tests
npm run build    # production build (validates all story files)
```

Built with [Astro](https://astro.build). Deployed to Cloudflare Pages on every
merge to `main` — in the Cloudflare dashboard, connect the GitHub repository
with build command `npm run build` and output directory `dist`.

Site-wide constants (production URL, GitHub repo links) live in
[`src/config.ts`](src/config.ts) and [`astro.config.mjs`](astro.config.mjs).

## License

- Code: [MIT](LICENSE)
- Story content: [CC BY-SA 4.0](LICENSE-content.md) — this history stays free, forever.
