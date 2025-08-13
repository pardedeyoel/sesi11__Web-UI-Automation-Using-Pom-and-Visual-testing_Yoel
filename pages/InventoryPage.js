import { By } from 'selenium-webdriver';

class InventoryPage {
    static sortDropdown = By.className('product_sort_container');
    
    constructor(driver) {
        this.driver = driver;
    }

    async sortBy(optionText) {
        let dropdown = await this.driver.findElement(InventoryPage.sortDropdown);
        await dropdown.click();
        let option = await this.driver.findElement(By.xpath(`//option[text()="${optionText}"]`));
        await option.click();
    }
}
//module.exports = InventoryPage;
export default InventoryPage; 