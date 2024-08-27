import { Page,expect } from "@playwright/test";
import { HelperBase } from "./helperBase";

export class DatePickerPage extends HelperBase {
    readonly page: Page

    constructor(page: Page){
      super(page)
    }

    async selectCommonDatePickerDateFromToDay(numberOfDaysFromToday: number){
      await this.page.getByText('Datepicker').click()
      const calenderInputField = this.page.getByPlaceholder('Form Picker')
      await  calenderInputField.click()
      const dateToAssert = await this.selectDateInTheCalender(numberOfDaysFromToday)
      await expect(calenderInputField).toHaveValue(dateToAssert)


    }

    async selectDatepickerWithRangeFromToday(startDayFromToday: number, endDayFromToday: number){
      const calenderInputField = this.page.getByPlaceholder('Range Picker')
      await  calenderInputField.click()
      const dateToAssertStart = await this.selectDateInTheCalender(startDayFromToday)
       const dateToAssertEnd = await this.selectDateInTheCalender(endDayFromToday)
       const dateToAssert = `${dateToAssertStart} - ${dateToAssertEnd}`
      await expect(calenderInputField).toHaveValue(dateToAssert)


    }


private async selectDateInTheCalender(numberOfDaysFromToday: number){
  let date = new Date()
      date.setDate(date.getDate() + numberOfDaysFromToday)
      const expectDate = date.getDate().toString()
      const expectedMonthShot = date.toLocaleString('En-US', {month: 'short'})
      const expectedMonthLong = date.toLocaleString('En-US', {month: 'long'})
      const expectedYear = date.getFullYear()
      const dateToAssert = `${expectedMonthShot} ${expectDate}, ${expectedYear}`

      let calenderMonthAndYear = await this.page.locator('nb-calendar-view-mode').textContent()
      const expectedMonthAndYear = ` ${expectedMonthLong} ${expectedYear} `
      while(!calenderMonthAndYear.includes(expectedMonthAndYear)){
         await this.page.locator('nb-calender-pageable-navigation [data-name="chevron-right"]').click()
         calenderMonthAndYear = await this.page.locator('nb-calender-view-mode').textContent()
     }

      await this.page.locator('.day-cell.ng-star-inserted').getByText(expectDate, {exact: true}).click()
      return dateToAssert
    }

}
