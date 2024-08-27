import {test, expect} from '@playwright/test'
import { PageManager } from '../page-objects/pageManager'
import { faker } from '@faker-js/faker'


test.beforeEach(async({page}) => {
  await page.goto('http://localhost:4200/')
})

test('navigate to form page', async({page}) =>{
  const pm = new PageManager(page)
   await pm.navigateTo().formaLayoutsPage()
   await pm.navigateTo().datePickerPage()
   await pm.navigateTo().toastrPage()
   await pm.navigateTo().toolTipPage()
   await pm.navigateTo().smartTablePage()
})

test('parametrized methods', async({page}) =>{
  const pm = new PageManager(page)
  const randomFullName = faker.person.fullName()
  const randomEmail = `${randomFullName.replace(' ','')}${faker.number.int(1000)}@test.com`
  await pm.navigateTo().formaLayoutsPage()
  await pm.onFormLayoutsPage().submitUsingTheGridFormWithCredentialsAndSelectOption('testdt@test.com','Welcome1', 'Option 1')
  await pm.onFormLayoutsPage().sumbitInlineFormWithNameEmailAndCheckbox(randomFullName, randomEmail, true)
  // await pm.navigateTo().datePickerPage()
  // await pm.onDatepickerPage().selectCommonDatePickerDateFromToDay(5)
  // await pm.onDatepickerPage().selectDatepickerWithRangeFromToday(6,10)

})



