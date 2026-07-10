# Contributing to Qadamha

*[دری](#مشارکت-در-قدمها) · [پښتو](#په-قدمها-کې-ونډه)*

Thank you for helping preserve this history. Every story you add tells the
next generation: we kept trying.

## Add a story

1. **Fork** this repository.
2. **Copy** `src/content/ideas/_template.md` into the language folder you're
   writing in — `en/` (English), `fa/` (Dari), or `ps/` (Pashto) — and name
   the file after the project in lowercase-with-dashes, e.g. `my-startup.md`.
3. **Fill in the frontmatter** (the block between `---` lines). The template
   explains every field. Set `draft: false` when the story is ready.
4. **Write the story** below the frontmatter: the idea, the people, the
   effort, what happened, and what it taught.
5. **Open a pull request.** CI validates the format; a maintainer reviews the
   content with you.

### Writing guidelines

- **Respect first.** Real people lived these stories. Write about them the
  way you would want to be written about.
- **Honesty.** Don't inflate numbers or invent details. "About 40 riders" is
  better than a precise number you don't have.
- **Sources.** Link press articles, archived websites (web.archive.org is
  your friend), or app-store pages where they exist.
- **First-hand accounts.** If it's your own story, say so in the text —
  founder-told stories are the heart of this archive.
- **Living people's privacy.** Only name founders and team members who are
  publicly associated with the project or who consented.

### Translate a story

Stories link across languages by **file name**. To translate
`en/my-startup.md` into Dari, copy it to `fa/my-startup.md` (same name!),
translate the text — including `name`, `tagline`, `city`, and roles — and
open a pull request. Keep enum fields (`sectors`, `status`, `reasons`) in
English; the site translates them automatically.

### Not comfortable with GitHub?

[Open a story form](../../issues/new/choose) and write everything you know in
your own words, in any of the three languages. A maintainer will turn it into
a story file and credit you.

## Code contributions

```sh
npm install
npm run dev    # develop
npm test       # unit tests
npm run build  # full validation — must pass before a PR
```

Keep changes focused; open an issue first for anything large.

## License

By contributing you agree that story content is licensed under
[CC BY-SA 4.0](LICENSE-content.md) and code under [MIT](LICENSE).

---

# مشارکت در قدم‌ها

از این‌که در نگه‌داشت این تاریخ کمک می‌کنید سپاس‌گزاریم. هر داستانی که
می‌افزایید به نسل بعد می‌گوید: ما تلاش را رها نکردیم.

## افزودن یک داستان

۱. مخزن را **فورک** کنید.

۲. فایل `src/content/ideas/_template.md` را در پوشهٔ زبان مورد نظر —
`en/` (انگلیسی)، `fa/` (دری) یا `ps/` (پشتو) — **کاپی** کنید و به نام پروژه
با حروف کوچک و خط تیره نام‌گذاری کنید، مثلاً `my-startup.md`.

۳. **فیلدهای بالای فایل** (میان دو خط `---`) را پر کنید. قالب، هر فیلد را
توضیح می‌دهد. وقتی داستان آماده شد `draft: false` بگذارید.

۴. **داستان را بنویسید:** ایده، آدم‌ها، تلاش، آنچه اتفاق افتاد و آنچه آموخت.

۵. **یک pull request باز کنید.** بررسی‌های خودکار قالب را ارزیابی می‌کنند و
یک نگه‌دارنده محتوا را با شما بازبینی می‌کند.

### رهنمودهای نوشتن

- **اول احترام.** انسان‌های واقعی این داستان‌ها را زندگی کرده‌اند. طوری
  درباره‌شان بنویسید که دوست دارید درباره‌تان بنویسند.
- **صداقت.** ارقام را بزرگ نکنید و جزئیات نسازید.
- **منابع.** در صورت امکان به مقاله‌های خبری، نسخه‌های آرشیوشده
  (web.archive.org) یا صفحه‌های اپ‌استور لینک بدهید.
- **روایت دست اول.** اگر داستان خودتان است، در متن بگویید.
- **حریم خصوصی.** فقط نام کسانی را بیاورید که به‌صورت عمومی با پروژه شناخته
  می‌شوند یا رضایت داده‌اند.

### ترجمهٔ یک داستان

داستان‌ها با **نام فایل** به هم وصل می‌شوند. برای ترجمهٔ
`en/my-startup.md` به دری، آن را به `fa/my-startup.md` (با همان نام!) کاپی
کنید، متن را ترجمه کنید و pull request بفرستید. فیلدهای `sectors`، `status` و
`reasons` را به انگلیسی نگه دارید؛ سایت خودش ترجمه‌شان می‌کند.

### با گیت‌هاب آشنا نیستید؟

[فورم ثبت داستان](../../issues/new/choose) را باز کنید و هر آنچه می‌دانید با
کلمات خودتان بنویسید. یک نگه‌دارنده آن را به صفحهٔ داستان تبدیل می‌کند و نام
شما را ثبت می‌کند.

---

# په قدم‌ها کې ونډه

مننه چې د دې تاریخ په ساتلو کې مرسته کوئ. هره کیسه چې ورزیاتوئ راتلونکي نسل
ته وایي: موږ هڅه پرېنښوده.

## د کیسې ورزیاتول

۱. خزانه (repository) **فورک** کړئ.

۲. د `src/content/ideas/_template.md` فایل د ژبې فولډر ته — `en/`
(انګلیسي)، `fa/` (دري) یا `ps/` (پښتو) — **کاپي** کړئ او د پروژې په نوم یې
په کوچنیو تورو او ډش سره ونوموئ، لکه `my-startup.md`.

۳. **پورتني فیلډونه** (د دوو `---` کرښو تر منځ) ډک کړئ. کله چې کیسه چمتو
شوه `draft: false` کېږدئ.

۴. **کیسه ولیکئ:** نظر، خلک، هڅه، څه وشول او څه یې زده کړل.

۵. **یو pull request پرانیزئ.** اتومات کتنې بڼه ارزوي او یو ساتونکی به
منځپانګه له تاسو سره وګوري.

### د لیکلو لارښوونې

- **لومړی درناوی.** ریښتینو خلکو دا کیسې ژوند کړې دي.
- **رښتینولي.** شمېرې مه لویوئ او جزئیات مه جوړوئ.
- **سرچینې.** د امکان تر حده خبري مقالو، ارشیف شویو پاڼو
  (web.archive.org) یا اپ سټور پاڼو ته لینک ورکړئ.
- **لومړی لاس روایت.** که ستاسو خپله کیسه ده، په متن کې یې ووایاست.
- **محرمیت.** یوازې د هغو کسانو نومونه واخلئ چې په عامه توګه له پروژې سره
  تړلي دي یا رضایت یې ورکړی.

### د کیسې ژباړه

کیسې د **فایل په نوم** سره نښلي. د `en/my-startup.md` د ژباړلو لپاره یې
`ps/my-startup.md` ته (په همغه نوم!) کاپي کړئ، متن وژباړئ او pull request
واستوئ. د `sectors`، `status` او `reasons` فیلډونه په انګلیسي پرېږدئ؛ سایټ یې
پخپله ژباړي.

### له ګیټ هب سره بلد نه یاست؟

[د کیسې فورمه](../../issues/new/choose) پرانیزئ او هر څه چې پوهېږئ په خپلو
خبرو یې ولیکئ. یو ساتونکی به یې د کیسې پاڼې ته واړوي او ستاسو نوم به ثبت کړي.
