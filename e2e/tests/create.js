import assert from 'assert';
import { By, until } from 'selenium-webdriver';
import driver from '../chromeDriver';
import createPageFactory from '../pages/CreatePage';
import deletePageFactory from '../pages/DeletePage';
import showPageFactory from '../pages/ShowPage';

describe('Create Page', () => {
    const CreatePage = createPageFactory('http://localhost:8083/#posts/create')(driver);
    const DeletePage = deletePageFactory('http://localhost:8083/#posts/14/delete')(driver);
    const ShowPage = showPageFactory('http://localhost:8083/#posts/14/show')(driver);

    beforeEach(async () => await CreatePage.navigate());
    async function deleteNewPost(){
        await DeletePage.navigate();
        await DeletePage.delete();
    }

    it('should put the current date in the field by default', async () => {
        await CreatePage.navigate();
        const currentDate = new Date();
        const currentDateString = currentDate.toISOString().slice(0,10);
        assert.equal(await CreatePage.getInputValue('input','published_at'), currentDateString);
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
        await deleteNewPost();
    });

    it('should give good title to show page', async() => {
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
        await CreatePage.setValues(values);
        await CreatePage.submit();
        await ShowPage.navigate();
        assert.equal(await ShowPage.getValue('title'), 'Test title'); 
        await deleteNewPost();
    });

    it('should not accept creation without required fields', async() => {
        const values = [
            {
                type: 'textarea',
                name: 'teaser',
                value: 'Test teaser',
            }
        ];
        await CreatePage.setValues(values);
        assert.equal(await CreatePage.getInputValue('textarea', 'teaser'), 'Test teaser');
    });
});
