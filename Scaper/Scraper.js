const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  //making sure program won't continue if there are any errors
  try{
  	  //ensuring the size of the browser so that it will always look the same
	  const browser = await puppeteer.launch({defaultViewport: {width: 1920, height: 1080}});

	  const page = await browser.newPage();

	  //set the download location
	  await page._client.send('Page.setDownloadBehavior', {behavior: 'allow', downloadPath: `${__dirname}/pdfs`})
	  await page.goto('https://app-dev.condoworks.co');

	  //enter login info and login
	  await page.type('#Email', "coop.test@condoworks.co");
	  await page.type('#Password', "MyTesting711");
	  await page.click('#btnSubmit');

	  //wait for the hamburger menu to appear
	  await page.waitForSelector('.navbar-toggler-icon');
	  try{
	  	//check if its clickable
	  	//it shouldn't be clickable because viewport is a set set but just being safe
	  	await page.click('.navbar-toggler-icon');
	  } catch {/*don't need to do anything if it throws because it just means that the screen is big enough*/}
	  await page.click('.nav-link.dropdown-toggle');
	  await page.click('[href="/invoices/all"]');

	  //on the invoices page
	  await page.waitForSelector('[name="invoices.InvoiceNumber"]');
	  await page.type('[name="invoices.InvoiceNumber"]', '123');
	  //making sure page reloads
	  try{
	  	await page.waitForNavigation({timeout: 500});
	  } catch{}

	  //find the element with the title 123444 (invoice with invoice number 123444)
	  //get the parent of that element and then get the href of the magifying glass element that has the
	  //same parent as the elemnt with title 123444
	  const parent = await page.$eval('[title="123444"]', td => td.parentElement.childNodes[0].childNodes[0].href);
	  await Promise.all([
	  	page.waitForNavigation(),
	  	page.click(`[href="${parent}"]`)
	  ])

	  //download the file
	  page.click('[title="Download file"]')
	  //make sure file is downloaded
	  await page.waitForTimeout(5000);
	  //find the path of the file
	  await fs.realpath(`${__dirname}/pdfs/Invoice file.pdf`, "UTF-8", (err, resolvedPath) => {
	  	if(err){
	  		console.error(err);
	  	} else {
	  		console.log(resolvedPath);
	  	}
	  })
	  await browser.close();
  } catch (e) {
  	console.error(e);
  }
})();