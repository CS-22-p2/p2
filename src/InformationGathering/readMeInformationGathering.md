#Login Function
We though it was necessary to login, in order to view facebook event pages
However, through practice, this was found to be unncecessary
```js

async function loginFB(){

    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
    });

    let page = await browser.newPage();
    
    await page.goto("https://www.facebook.com/", {
        waitUntil: "networkidle2"
    });

    await page.click('button._42ft._4jy0._9xo7._4jy3._4jy1.selected._51sy');
    await page.type('#email', 'williamscrapius@gmail.com', {delay: 30});
    await page.type('#pass', 'cs23sw202', {delay: 30});
    await page.click('button._42ft._4jy0._6lth._4jy6._4jy1.selected._51sy', {delay: 30});
    await page.waitForNetworkIdle(30);
    return browser;
}

```