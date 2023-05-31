import assert from 'assert';
import { By, until } from 'selenium-webdriver';
import driver from '../chromeDriver';
import createPageFactory from '../pages/CreatePage';
import deletePageFactory from '../pages/DeletePage';

describe('Create Page', () => {
    const CreatePage = createPageFactory('http://localhost:8083/#posts/create')(driver);
    const DeletePage = deletePageFactory('http://localhost:8083/#posts/14/delete')(driver);

    beforeEach(async () => await CreatePage.navigate());
    afterEach(async () => {
        await DeletePage.navigate();
        await DeletePage.delete();
    });

    it('should redirect to created post', async () => {
        const values = [
            {
                type: 'input',
                name: 'title',
                value: 'Test title',
            },
            {
                type: 'textarea',
                name: 'teaser',
                value: 'Test teaser',
            }
        ];
        await CreatePage.setValues(values, 'Lorem Ipsum');
        await CreatePage.submit();
        assert.equal(await driver.getCurrentUrl(), 'http://localhost:8083/#/posts/14');
    });
});
