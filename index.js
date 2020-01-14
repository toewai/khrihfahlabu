const puppeteer = require('puppeteer');
const fs = require('fs');

function LinkTitle(link,num) {
  return new Promise(async (resolve, reject) => {
    try {
      const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      const page = await browser.newPage();
      await page.goto(
        link + num + '/'
      );
      const PageLink = await page.$$eval('.entry-title', el =>
        el.map(val => {
          return {
            title: val.querySelector('a').innerText,
            Link: val.querySelector('a').getAttribute('href')
          };
        })
      );
      await browser.close();
      resolve(PageLink);
    } catch (error) {
      reject(error);
    }
  });
}

function titleData(url) {
  return new Promise(async (resolve, reject) => {
    try {
      const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      const page = await browser.newPage();
      await page.goto(url);
      const title = await page.$eval('.entry-title', el => el.innerText);
      const content = await page.$eval('.entry-content', el => el.innerText);
      await browser.close();
      resolve({
        id:title.slice(0,title.indexOf(' ')-1),
        title: title,
        content: content,
        link:url
      });
    } catch (error) {
      reject(error);
    }
  });
}

// url = 'https://khrihfahlabu.wordpress.com/category/khrihfa-hla-bu/page/'
url = 'https://khrihfahlabu.wordpress.com/category/chawnghlang-relnak/page/'
for (i = 1; i < 4; i++) {
  LinkTitle(url,i).then(data => {
    data.map(res =>
      titleData(res.Link).then(val => {
        fs.writeFile('data.json', JSON.stringify(val, null, 2)+',\n', { flag: 'a' }, err => {
          if (err) throw err;
        });
      })
    );
  });
}
