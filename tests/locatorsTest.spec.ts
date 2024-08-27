import {test,expect} from '@playwright/test'

test.beforeEach(async({page}) => {
await page.goto("http://localhost:4200/")
page.getByText('Forms').click
page.getByText('Form Layouts').click
})

test('Locator Syntax Rules',async ({page}) => {
//By tag name
page.locator('input').click

//By ID
page.locator('#inputEmail1')

//By class value
page.locator('.shape-rectangle')

//By Attribute
page.locator('[placeholder="Email"]')

//By class value(full)
page.locator('[class="input-full-width size-medium status-basic shape-rectangle nb-transition"]')

//By combine different selectors
page.locator('input[placeholder="Email"]')

//By xpath (Not recommended)
page.locator('//*[@id="inputEmail"]')

//by partial text
page.locator(':text(Using)')

//by exact match
page.locator(':text-is(Using the Grid)')

})

test('User facing locators',async ({page}) => {

  await page.getByRole('button', {name: "Sign in"}).first().click()
  await page.getByLabel('Email').first().click()
  await page.getByPlaceholder('Jane Doe').click()
  await page.getByText('').click()
  await page.getByTestId('Sign In').click()
  await page.getByTitle('').click

})

test('Child elements', async({page}) => {
  await page.locator('nb-card nb-radio :text-is("Option 1")').click()
  await page.locator('nb-card').locator('nb-radio').locator(':text-is("Option 1")').click()

  await page.locator('nb-card').getByRole('button',{name: "Sign in"}).first().click()

  page.locator('nb-card').nth(3).getByRole('button').click
})

test('Locating parent elements', async({page}) =>{
  await page.locator('nb-card', {hasText: "Using the Grid"}).getByRole('textbox', {name: "Email"}).click()

  await page.locator('nb-card', {has: page.locator('#inputEmail')}).getByRole('textbox', {name: "Email"}).click()


})

test('Reuse the locators', async({page}) =>{

  const basicForm=page.locator('nb-card').filter({hasText: "Basic form"})
  const emailField=basicForm.getByRole('textbox',{name: "Email"})

  await emailField.fill('test@test.com')
  await basicForm.getByRole('textbox',{name: "Password"}).fill('Welcome')
  await basicForm.locator('nb-checkbox').click()
  await basicForm.locator('button').click()

  await expect(emailField).toHaveValue('test@test.com')
})

test('Extracting values', async({page}) =>{

  //single test value
   const basicForm = page.locator('nb-card').filter({hasText: "Basic form"})
   const buttonText = await basicForm.locator('button').textContent()
   expect(buttonText).toEqual("Submit")

   //all text values
   const allRadioButtonLabels = await page.locator('nb-radio').allTextContents()
   expect(allRadioButtonLabels).toContain('Option 1')

   //input value
   const emailField = basicForm.getByRole('textbox',{name: "Email"})
   await emailField.fill('test@test.com')
   const emailValue = await emailField.inputValue()

   const placeholdervalue = await emailField.getAttribute('placeholder')
   expect(placeholdervalue).toEqual('Email')



})

test('Assertions', async({page}) =>{
  const basicFormButton = page.locator('nb-card').filter({hasText: "Basic form"}).locator('Button')
  //General assertion
  const text = await basicFormButton.textContent()
  expect(text).toEqual('Submit')

  //Locator assertion
  await expect(basicFormButton).toHaveText('Submit')

  //Soft assertion
  await expect.soft(basicFormButton).toHaveText('Submit5')
  await basicFormButton.click()

})


