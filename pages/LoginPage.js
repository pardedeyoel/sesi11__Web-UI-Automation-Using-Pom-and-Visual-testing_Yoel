import { By, until } from 'selenium-webdriver';
import assert from 'assert';

class LoginPage {
    static usernameInput = By.xpath('//*[@data-test="username"]');
    static passwordInput = By.xpath('//*[@data-test="password"]');
    static loginButton = By.xpath('//*[@data-test="login-button"]');
    static logoText = By.className('app_logo');

    constructor(driver) {
        this.driver = driver;
    }

    async open() {
        await this.driver.get('https://www.saucedemo.com');
    }

    async login(username, password) {
    let inputUsername =   await this.driver.findElement(LoginPage.usernameInput).sendKeys(username);
    let passwordInput =   await this.driver.findElement(LoginPage.passwordInput).sendKeys(password);
    let loginButton =    await this.driver.findElement(LoginPage.loginButton).click();
    }

    async verifyLogin() {
        let logo = await this.driver.wait(until.elementLocated(LoginPage.logoText), 5000);
        let text = await logo.getText();
        assert.strictEqual(text, 'Swag Labs');
        
    }
}
//module.exports = LoginPage;

export default LoginPage;