import { Builder, By, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import fs from 'fs';


describe('Visual Testing Saucedemo', function() {
    let driver;
    this.timeout(30000);


    before(async () => {
        let options = new chrome.Options();
        //options.addArguments('--headless');
        options.addArguments('--headed');
        driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
    });

    after(async () => {
        await driver.quit();
    });

    it('Take screenshot of inventory page', async () => {
        await driver.get('https://www.saucedemo.com');
    let inputUsername =   await driver.findElement({ css: '[data-test="username"]' });
    let inputPassword =   await driver.findElement({ css: '[data-test="password"]' });
    let buttonLogin   =    await driver.findElement({ css: '[data-test="login-button"]' });
    await inputUsername.sendKeys('standard_user');
    await inputPassword.sendKeys('secret_sauce');
    
    
    // screenshot button login, sebelum diklik tombol login
    let ss_buttonlogin = await buttonLogin.takeScreenshot();
    fs.writeFileSync("buttonLogin_screenshot.png", Buffer.from(ss_buttonlogin, "base64"));
        
    //klik login
    await buttonLogin.click();


    //screenshot inventory product
    let ss_product = await driver.takeScreenshot();
    fs.writeFileSync("inventory_page.png", Buffer.from(ss_product, "base64"));


     // tunggu sampai tombol cart muncul
    let cartButton = await driver.wait(
        until.elementLocated(By.css('.shopping_cart_link')),
        5000
        );

     // pastikan tombol cart terlihat
     await driver.wait(until.elementIsVisible(cartButton), 5000);

    //screenshot cart icon
    let ss_cart = await cartButton.takeScreenshot();
    fs.writeFileSync("cart.png", Buffer.from(ss_cart, "base64"));


    });
});
