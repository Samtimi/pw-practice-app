import {test} from '@playwright/test'

test.beforeEach(async ({page}) => {
await page.goto('http://localhost:4200')
})


 test.describe('suit', () =>{
  test.beforeEach(async ({page}) => {
    await page.goto('http://localhost:4200')
     page.getByText('Forms').click

    })

    test('the first test', async ({page}) => {
     page.getByText('Form Layouts').click

    })

    test('Navigate to Date picker page', async ({page}) => {
      page.getByText('Datepicker').click

     })


 })

 test.describe('suit', () =>{
  test.beforeEach(async ({page}) => {
    await page.goto('http://localhost:4200')
     page.getByText('Charts').click

    })

    test('the first test1', async ({page}) => {
     page.getByText('Form Layouts').click

    })
    test('Navigate to Date picker page1', async ({page}) => {
      page.getByText('Datepicker').click

     })


 })

