import { Builder, By, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import LoginPage from '../pages/LoginPage.js';
import InventoryPage from '../pages/InventoryPage.js';

describe('Saucedemo POM Automation', function() {
    let driver;
    this.timeout(60000);

    before(async () => {
        let options = new chrome.Options();
        //options.addArguments('--headless');
        options.addArguments('--headed');
        driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
    });

    after(async () => {
        await driver.quit();
    });

    it('Sorting product name A-Z', async () => {
        let loginPage = new LoginPage(driver);
        await loginPage.open();
        await loginPage.login('standard_user', 'secret_sauce');
        await loginPage.verifyLogin();

        let inventoryPage = new InventoryPage(driver);
        await inventoryPage.sortBy('Name (A to Z)');
    });
});
