/**
 * created by Nanichang on 16-03- 018
*/
//=============================================================================
'use strict';
if (process.env.NODE_ENV != 'production') {
	require('dotenv').config();
}
//=============================================================================
// dependencies
const puppeteer = require('puppeteer');

// module variables
const
	EVENT_URL = 'https://matchbook.com/events/horse-racing/ireland/limerick/752494909770014/live-betting/14-00-limerick',
	SELECTIONS_CONTAINER_SELECTOR = 'div.mb-market__runners',
	MATCHED_AMOUNT_SELECTOR = '.mb-event-header__volume > span:nth-child(2)';

async function bot() {
	// instantiate browser
	const browser = await puppeteer.launch({
		headless: false
	});
	// create blank page
	const page = await browser.newPage();
	// set viewport to 1366*768
	await page.setViewport({ width: 1366, height: 768 });
	// set the user agent
	await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko)');
	// navigate to EVENT_URL
	console.log('started');
	await page.goto(EVENT_URL, {
		waitUntil: 'networkidle2',
		timeout: 180000
	});
	await page.waitFor(30 * 1000);
	// ensure race container selector available
	await page.waitForSelector(SELECTIONS_CONTAINER_SELECTOR, {
		timeout: 180000
	});
	// allow 'page' instance to output any calls to browser log to process obj
	page.on('console', data => console.log(data.text));
	// bind to races container and listen for updates to , bets etc
	await page.$eval(SELECTIONS_CONTAINER_SELECTOR,
		(target, MATCHED_AMOUNT_SELECTOR) => {
			// listen for raceStart
			const observer = new MutationObserver((mutations) => {
				mutations.forEach(function (ed) {
					const e = {
						mutation: ed,
						el: ed.target,
						value: ed.target.textContent,
						oldValue: ed.oldValue
					};
					const SELECTION = e.el.parentElement.children[0].innerText;
					if (e.el.children.length == 2) {
						num = e.el.className.match(/\d/);
						letter = e.el.className.match(/(back|lay)/)[0][0];
						betType = letter + num;
						odds = e.el.children[0].textContent;
						liquidity = e.el.children[1].textContent;
					} else if (e.el.children.length == 3) {
						num = e.el.className.match(/\d/);
						letter = e.el.className.match(/(back|lay)/)[0][0];
						betType = letter + num;
						odds = e.el.children[1].textContent;
						liquidity = e.el.children[2].textContent;
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
				});
			})
			observer.observe(target, {
				attributes: true,
				childList: true,
				characterData: true,
				characterDataOldValue: true,
				subtree: true
			});
		}, MATCHED_AMOUNT_SELECTOR);
}

// execute scraper
bot()
	.catch(err => console.error(err));
//=============================================================================