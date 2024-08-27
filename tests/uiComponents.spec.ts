import {test, expect} from '@playwright/test'
import { clear } from 'console'
import { using } from 'rxjs'

test.beforeEach(async({page}) => {
    await page.goto('http://localhost:4200/')

})

test.describe('Form layouts page', ()  => {
  test.describe.configure({retries: 2})

  test.beforeEach(async({page}) => {
    await page.getByText('Forms').click()
    await page.getByText('Form Layouts').click()

  })

  test('input fields', async({page}) =>{
   const usingTheGridEmailInput=page.locator('nb-cards', {hasText:'Using the Grid'}).getByRole('textbox', {name: "Email"})
   await usingTheGridEmailInput.fill('gurava.samtimi@gmail.com')
   usingTheGridEmailInput.clear
   await usingTheGridEmailInput.pressSequentially('gurava.samtimi@gmail.com', {delay: 500})

   //generic assertion
   const inputValue = await usingTheGridEmailInput.inputValue()
   expect(inputValue).toEqual('gurava.samtimi@gmail.com')

   //locator assertion
   await expect(usingTheGridEmailInput).toHaveValue('gurava.samtimi@gmail@gmail.com')
  })

  test('Radio buttons', async({page}) => {
    const usingTheGridForm=page.locator('nb-cards', {hasText:'Using the Grid'})

    await usingTheGridForm.getByRole('radio', {name: "Option 1"}).check({force:true})
    const radiostatus=usingTheGridForm.getByRole('radio', {name: "Option 1"}).isChecked()
    expect(radiostatus).toBeTruthy()
    await expect(usingTheGridForm.getByRole('radio', {name: "Option 1"})).toBeChecked()

    await usingTheGridForm.getByRole('radio', {name: "Option 2"}).check({force:true})
    expect(usingTheGridForm.getByRole('radio', { name: "Option 1" })).toBeFalsy()
    expect(usingTheGridForm.getByRole('radio', { name: "Option 2" })).toBeTruthy()
  })

})

test('Checkboxes', async({page}) =>{
   page.getByText("Modal & Overlays").click()
   page.getByText('Toastr').click()

   await page.getByRole('checkbox', {name: "Hide on click"}).check({force: true})

   const allboxes=page.getByRole('checkbox')
   for(const box of await allboxes.all())
   {
        await box.uncheck({force: true})
        expect(await box.uncheck()).toBeFalsy()

   }

})

test('Lists and Dropdowns',async({page}) =>{
   const dropDownMenu = page.locator('ngx-header nb-select')
   await dropDownMenu.click()
   page.getByRole('list') //When the list has a UL tag
   page.getByRole('listitem') //When the list has LI tag

   const optionList = page.locator('nb-option-list nb-option')
   await expect(optionList).toHaveText(["Light", "Dark", "Cosmic", "Corporate"])
   await optionList.filter({hasText: "Cosmic"}).click()

   const header = page.locator('nb-layout-header')
   await expect(header).toHaveCSS('background-color', 'rgb(50, 50, 89)')

   const colors = {
         "Light": "rgb(255, 255, 255)",
         "Dark": "rgb(34, 43, 69)",
         "Cosmic": "rgb(50, 50, 89)",
         "Corporate": "rgb(255, 255, 255)"


   }
//await dropDownMenu.click()
for(const color in colors)
{
  await dropDownMenu.click()
  await optionList.filter({hasText: color}).click()
  await expect(header).toHaveCSS('background-color', colors[color])
  if(color != "Corporate")
  dropDownMenu.click
}

})

test('Tooltip', async({page}) => {
   await page.getByText('Modal & Overlays').click()
   await page.getByText('Tooltip').click()

   const toolTipCard = page.locator('nb-card', {hasText: "Tooltip Placements"})
   await toolTipCard.getByRole('button', {name: "Top"}).hover()

   page.getByRole('tooltip') //if yu have a role tooltip created
   const tooltip = await page.locator('nb-tooltip').textContent()
   expect(tooltip).toEqual('This is a tooltip')

})

test('dialogbox', async({page}) => {
  await page.getByText('Tables & Data').click()
  await page.getByText('Smart Table').click()

  page.on('dialog', dialog => {
      expect(dialog.message()).toEqual('Are you sure you want to delete?')
      dialog.accept()
      //dialog.dismiss()
  })
await page.getByRole('table').locator('tr', {hasText: 'mdo@gmail.com'}).locator('.nb-trash').click()
await expect(page.locator('table tr').first()).not.toHaveText('mdo@gmail.com')

})

test('web tables', async({page}) => {
  await page.getByText('Tables & Data').click()
  await page.getByText('Smart Table').click()

  //1. get the row by any test in this row
  const targetRow = page.getByRole('row',{name: "twitter@outlook.com"})
  await targetRow.locator('.nb-edit').click()
  await page.locator('input-editor').getByPlaceholder('Age').clear()
  await page.locator('input-editor').getByPlaceholder('Age').fill('35')

  //2. get the row based on the value in the specific column
  await page.locator('.ng2-smart-pagination-nav').getByText('2').click()
  const targetRowById = page.getByRole('row',{name: "11"}).filter({has: page.locator('td').nth(1).getByText('11')})
  await targetRowById.locator('.nb-edit').click()
  await page.locator('input-editor').getByPlaceholder('E-mail').clear()
  await page.locator('input-editor').getByPlaceholder('E-mail').fill('test@test.com')
  await page.locator('.nb-checkmark').click()
  await expect(targetRowById.locator('td').nth(5)).toHaveText('test@test.com')

  //3. test filter of the table
  const ages=["20", "30", "40", "200"]

  for(let age of ages){
    await page.locator('input-filter').getByPlaceholder('Age').clear
    await page.locator('input-filter').getByPlaceholder('Age').fill(age)
    await page.waitForTimeout(500)
    const ageRows=page.locator('tbody tr')

    for(let row of await ageRows.all()){
      const cellValue = await row.locator('td').last().textContent()

      if(age == "200"){
        expect(await page.locator('table').textContent()).toContain('No data found')
      }else{
        expect(cellValue).toEqual(age)
      }
    }

  }
})

test('Datepicker', async({page}) =>{
  await page.getByText('Forms').click()
  await page.getByText('Datepicker').click()

  const calenderInputField = page.getByPlaceholder('Form Picker')
  await  calenderInputField.click()
  await page.locator('[class="day-cell ng-star-inserted"]').getByText('1', {exact: true}).click()
  await expect(calenderInputField).toHaveValue('Aug 1, 2024')

})

test('Dynamic date picker', async({page}) => {
  await page.getByText('Forms').click()
  await page.getByText('Datepicker').click()

  const calenderInputField = page.getByPlaceholder('Form Picker')
  await  calenderInputField.click()

  let date = new Date()
  date.setDate(date.getDate() + 7)
  const expectDate = date.getDate().toString()
  const expectedMonthShot = date.toLocaleString('En-US', {month: 'short'})
  const expectedMonthLong = date.toLocaleString('En-US', {month: 'long'})
  const expectedYear = date.getFullYear()
  const dateToAssert = `${expectedMonthShot} ${expectDate}, ${expectedYear}`

  let calenderMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
  const expectedMonthAndYear = ` ${expectedMonthLong} ${expectedYear} `
  while(!calenderMonthAndYear.includes(expectedMonthAndYear)){
      await page.locator('nb-calender-pageable-navigation [data-name="chevron-right"]').click()
      calenderMonthAndYear = await page.locator('nb-calender-view-mode').textContent()
  }

  await page.locator('[class="day-cell ng-star-inserted"]').getByText(expectDate, {exact: true}).click()
  await expect(calenderInputField).toHaveValue(dateToAssert)
})

test('slider', async({page}) =>{
  //update attribute
  // const tempGuage = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger circle')
  // await tempGuage.evaluate( node =>{
  //   node.setAttribute('cx', '232.630')
  //   node.setAttribute('cy', '232.630')
  // })
  // await tempGuage.click()


  //Mouse movement
  const tempBox = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger circle')
  await tempBox.scrollIntoViewIfNeeded()

  const box = await tempBox.boundingBox()
  const x = box.x + box.width / 2
  const y = box.y + box.height / 2

  await page.mouse.move(x,y)
  await page.mouse.down()
  await page.mouse.move(x +100, y)
  await page.mouse.move(x +100,y +100)
  await page.mouse.up()

  await expect(tempBox).toContainText('30')

})

