import { Builder } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import fs from 'fs';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import LoginPage from '../pages/LoginPage.js';

describe('Visual Testing', function () {
    this.timeout(30000);
    let driver;

    before(async () => {
        const options = new chrome.Options();
        options.addArguments('--headed');
        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();
    });

    after(async () => {
        await driver.quit();
    });

    it('Login page visual comparison', async () => {
        const loginPage = new LoginPage(driver);

        // buka website & login
        await loginPage.open();
        await loginPage.login('standard_user', 'secret_sauce');
        await loginPage.verifyLogin();

        // ambil screenshot setelah login
        let screenshot = await driver.takeScreenshot();
        fs.writeFileSync('current-login.png', screenshot, 'base64');

        // load baseline & current image
        let baselineImg = PNG.sync.read(fs.readFileSync('baseline.png'));
        let currentImg  = PNG.sync.read(fs.readFileSync('current-login.png'));

        // buat file output diff
        let { width, height } = baselineImg;
        let diff = new PNG({ width, height });

        let pixelDiff = pixelmatch(
            baselineImg.data,
            currentImg.data,
            diff.data,
            width,
            height,
            { threshold: 0.1 }
        );

        fs.writeFileSync('diff-login.png', PNG.sync.write(diff));

        // assert: gambar harus sama persis
        if (pixelDiff > 0) {
            console.log(`Visual difference detected! Pixel diff: ${pixelDiff}`);
        } else {
            console.log("No visual difference found");
        }
    });
});
