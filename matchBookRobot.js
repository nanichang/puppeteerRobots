/**
 * created by Nanichang Katzing on 16-03-2018
*/
//=============================================================================
'use strict';
// if (process.env.NODE_ENV != 'production') {
// 	require('dotenv').config();
// }
//=============================================================================
// dependencies
const puppeteer = require('puppeteer');

// module variables
const
	EVENT_URL = 'https://matchbook.com/events/horse-racing/ante-post/Aintree/689278031830013/grand-national-ante-post',
	SELECTIONS_CONTAINER_SELECTOR = '#app-next > div > div.mb-app__containerChildren > div > div > div.mb-event__markets.mb-event__markets--standalone > div:nth-child(1)',
	MATCHED_AMOUNT_SELECTOR = '.mb-event-header__volume > span:nth-child(2)';

async function run() {
	// instantiate browser
	const browser = await puppeteer.launch({
		headless: false,
		timeout: 180000
	});
	console.log('browser launched');
	// create blank page
	const page = await browser.newPage();
	console.log('new page created');

	// set viewport to 1366*768
	await page.setViewport({ width: 1366, height: 768 });
	console.log('viewport set');
	// set the user agent
	await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko)');
	console.log('user agent set');

	await page.goto(EVENT_URL, {
		waitUntil: 'networkidle2',
		timeout: 380000
	});

	console.log('started site url');
	await page.waitFor(30 * 1000);

	console.log('waited for 30*1000');

	await page.waitForSelector(SELECTIONS_CONTAINER_SELECTOR, {
		timeout: 380000
	});
	console.log('waited for selection', SELECTIONS_CONTAINER_SELECTOR);

	// allow 'page' instance to output any calls to browser log to process obj
	page.on('console', data => console.log(data.text()));
	// bind to races container and listen for updates to , bets etc

	await page.$eval(SELECTIONS_CONTAINER_SELECTOR,
		(target, MATCHED_AMOUNT_SELECTOR) => {
			// target.addEventListener('DOMSubtreeModified', function (e) {
				console.log('====================================');
				console.log('selector analysed', SELECTIONS_CONTAINER_SELECTOR);
				console.log('====================================');
				if (e.target.parentElement.children[0].className == 'mb-runner') {
					let betType, odds, liquidity, SELECTION;

					SELECTION = e.target.parentElement.children[0].children[0].children[1].children[0].children[1].innerText;

					console.log('Hello');

					console.log('nani', e.target.parentElement.parentElement.className)

					if ((e.target.parentElement.children[0].children[1].children[0].className == 'mb-price__odds') && (e.target.parentElement.parentElement.className == 'mb-price mb-price--back  mb-price--level0')) {
						betType = 'b0';
						console.log('B0');
						odds = e.target.textContent;
						console.log(e.target.parentElement.children[0].children[1].children[0].className)
						liquidity = e.target.parentElement.children[0].innerText;
						console.log(liquidity)
					} else if ((e.target.parentElement.className == 'mb-price__odds') && (e.target.parentElement.parentElement.className == 'mb-price mb-price--lay  mb-price--level0')) {
						betType = 'l0';
						odds = e.target.textContent;
						console.log(odds)
						liquidity = e.target.parentElement.children[0].innerText;
						console.log(liquidity)
					} else if ((e.target.parentElement.className == 'mb-price__odds') && (e.target.parentElement.parentElement.className == 'mb-price mb-price--back  mb-price--level0')) {
						betType = 'b1';
						odds = e.target.textContent;
						console.log(odds)
						liquidity = e.target.parentElement.children[0].innerText;
						console.log(liquidity)
					} else if ((e.target.parentElement.className == 'mb-price__odds') && (e.target.parentElement.parentElement.className == 'mb-price mb-price--lay  mb-price--level0')) {
						betType = 'l1';
						odds = e.target.textContent;
						console.log(odds)
						liquidity = e.target.parentElement.children[0].innerText;
						console.log(liquidity)
					} if ((e.target.parentElement.className == 'mb-price__odds') && (e.target.parentElement.parentElement.className == 'mb-price mb-price--back  mb-price--level0')) {
						betType = 'b2';
						odds = e.target.textContent;
						console.log(odds)
						liquidity = e.target.parentElement.children[0].innerText;
						console.log(liquidity)
					} else if ((e.target.parentElement.className == 'mb-price__odds') && (e.target.parentElement.parentElement.className == 'mb-price mb-price--lay  mb-price--level0')) {
						betType = 'l2';
						odds = e.target.textContent;
						console.log(odds)
						liquidity = e.target.parentElement.children[0].innerText;
						console.log(liquidity)
					} else if ((e.target.parentElement.className == 'mb-price__amount') && (e.target.parentElement.parentElement.className == 'mb-price mb-price--back  mb-price--level0')) {
						betType = 'b0';
						odds = e.target.textContent;
						console.log(odds)
						liquidity = e.target.parentElement.children[0].innerText;
						console.log(liquidity)
					} else if ((e.target.parentElement.className == 'mb-price__amount') && (e.target.parentElement.parentElement.className == 'mb-price mb-price--lay  mb-price--level0')) {
						betType = 'l0';
						odds = e.target.textContent;
						console.log(odds)
						liquidity = e.target.parentElement.children[0].innerText;
						console.log(liquidity)
					} else if ((e.target.parentElement.className == 'mb-price__amount') && (e.target.parentElement.parentElement.className == 'mb-price mb-price--back  mb-price--level0')) {
						betType = 'b1';
						odds = e.target.textContent;
						console.log(odds)
						liquidity = e.target.parentElement.children[0].innerText;
						console.log(liquidity)
					} else if ((e.target.parentElement.className == 'mb-price__amount') && (e.target.parentElement.parentElement.className == 'mb-price mb-price--lay  mb-price--level0')) {
						betType = 'l1';
						odds = e.target.textContent;
						console.log(odds)
						liquidity = e.target.parentElement.children[0].innerText;
						console.log(liquidity)
					} else if ((e.target.parentElement.className == 'mb-price__amount') && (e.target.parentElement.parentElement.className == 'mb-price mb-price--back  mb-price--level0')) {
						betType = 'b2';
						odds = e.target.textContent;
						console.log(odds)
						liquidity = e.target.parentElement.children[0].innerText;
						console.log(liquidity)
					} else if ((e.target.parentElement.className == 'mb-price__amount') && (e.target.parentElement.parentElement.className == 'mb-price mb-price--lay  mb-price--level0')) {
						betType = 'l2';
						odds = e.target.textContent;
						console.log(odds)
						liquidity = e.target.parentElement.children[0].innerText;
						console.log(liquidity)
					}

					if (!!betType && !!odds && !!liquidity && !!SELECTION) {
						let timestamp = new Date();
						timestamp = timestamp.toISOString();
						let matchedAmount = document.querySelector(MATCHED_AMOUNT_SELECTOR).innerText;
						matchedAmount = Number(matchedAmount.replace(/\D/g, ''));
						const data = {
							betType,
							matchedAmount,
							timestamp,
							odds: Number(odds),
							liquidity: Number(liquidity.slice(1)),
							selection: SELECTION
						};
						const output = JSON.stringify(data);
						console.log(output);
					}
				}
			// });

		}, MATCHED_AMOUNT_SELECTOR);
}

// execute scraper
run()
	.catch(err => console.error(err));
//=============================================================================