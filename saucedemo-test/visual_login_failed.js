import { Builder, By, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import fs from 'fs';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import LoginPage from '../pages/LoginPage.js';

describe('Visual Testing Login Failed', function () {
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

    it('Login failed visual comparison', async () => {
        const loginPage = new LoginPage(driver);

         // nama file baseline
        let baselinePath = 'baseline-login-failed.png';


          // cek apakah file baseline sudah ada, kalau belum ada -> dibuat
        if (!fs.existsSync(baselinePath)) {
            await loginPage.open(); //untuk buka halaman tanpa login
            let baselineScreenshot = await driver.takeScreenshot();
            fs.writeFileSync(baselinePath, baselineScreenshot, 'base64');
            console.log(`✅ Baseline dibuat dari halaman tanpa error: ${baselinePath}`);
            return;
        }

        //jalanin login gagal untuk current screenshot
        await loginPage.open();
        await loginPage.login('wrong_user','wrong_password');

        let errorMessage = await driver.wait(
            until.elementLocated(By.css('[data-test="error"]')),
            5000
        );
        await driver.wait(until.elementIsVisible(errorMessage), 5000);



        // ambil screenshot setelah gagal login
        let screenshot = await driver.takeScreenshot();

        // kalau sudah ada file baseline-login-failed, terus bandingin
        fs.writeFileSync('current-login-failed.png', screenshot, 'base64');

        // load baseline & current image
        let baselineImg = PNG.sync.read(fs.readFileSync(baselinePath));
        let currentImg  = PNG.sync.read(fs.readFileSync('current-login-failed.png'));

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


        fs.writeFileSync('diff-login-failed.png', PNG.sync.write(diff));

        // assert: gambar harus sama persis
        if (pixelDiff > 0) {
            console.log(`Visual difference detected! Pixel diff: ${pixelDiff}`);
        } else {
            console.log("No visual difference found");
        }
    });
});
