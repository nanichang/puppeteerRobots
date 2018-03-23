/**
 * created by Nanichang on 21 - 03 - 2018
*/
//=============================================================================

// dependencies
const P = require('puppeteer');

// module variables
const
    EVENT_URL = 'https://www.betfair.com/exchange/plus/horse-racing/market/1.141634613?nodeId=28645600.0739',
    SELECTIONS_CONTAINER_SELECTOR = 'div.main-mv-runners-list-wrapper',
    MATCHED_AMOUNT_SELECTOR = '#main-wrapper > div > div.scrollable-panes-height-taker > div > div.page-content.nested-scrollable-pane-parent > div > div.bf-col-xxl-17-24.bf-col-xl-16-24.bf-col-lg-16-24.bf-col-md-15-24.bf-col-sm-14-24.bf-col-14-24.center-column.bfMarketSettingsSpace.bf-module-loading.nested-scrollable-pane-parent > div.scrollable-panes-height-taker.height-taker-helper > div > div.bf-row.main-mv-container > div > bf-main-market > bf-main-marketview > div > div.mv-sticky-header > bf-marketview-header-wrapper > div > div > mv-header > div > div > div.mv-secondary-section > div > div > span.total-matched';

async function bot() {
    // instantiate browser
    const browser = await P.launch({
        headless: true
    });
    // create blank page
    const page = await browser.newPage();
    // set viewport to 1366*768
    await page.setViewport({ width: 1366, height: 768 });
    // set the user agent
    await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko)');
    // navigate to batfair homepage
    await page.goto(EVENT_URL, {
        waitUntil: 'networkidle2',
        timeout: 100000
    });
    // await page.waitFor(30000)

    // ensure race container selector available
    // console.log(`${SELECTIONS_CONTAINER_SELECTOR}`);
    let selection_container = await page.waitForSelector(SELECTIONS_CONTAINER_SELECTOR, {
        timeout: 180000
    });
    console.log(selection_container);
    if (!selection_container) {
        return console.error(`Failure: The value after evaluating '${SELECTIONS_CONTAINER_SELECTOR}' could not be verified`);
    } else {

        // Message passing back to Parent Process
        page.on('console', data => {
            if (data.type == 'error') {
                // passing failure messages
                console.error(data.text())
            }
            else {
                // passing success message
                console.log(data.text())
            }
        })

        // page.on('console', data => console.log(data.text()));

        //console.log('SELECTIONS_CONTAINER_SELECTOR found, continuing...');


        await page.$eval(SELECTIONS_CONTAINER_SELECTOR,
            (target, MATCHED_AMOUNT_SELECTOR) => {

                let matched_amount = document.querySelector(MATCHED_AMOUNT_SELECTOR)
                // a check for match amount
                if (!matched_amount) {
                    return console.error()
                    failure.push({
                        identifier: "DOM nav for MAtched Amount",
                        Matched_Amount: `The Selector '${MATCHED_AMOUNT_SELECTOR}' could not be verifed`

                    })
                }
                // //Matched amount check
                // if (!matched_amount) console.error(`Failure: The Selector '${MATCHED_AMOUNT_SELECTOR}' could not be verifed`);
                // Grabbing first row
                let firstRow = target.children[1].children[0].children[0].children[0].children[1].children[0].children[0];
                // console.log(firstRow)
                let sizeCount = Array.from(firstRow.querySelectorAll('.bet-button-size'));
                // console.log(sizeCount)
                let priceCount = Array.from(firstRow.querySelectorAll('.bet-button-price'));

                let liquidity = [];
                let odds = [];
                let failure = [];

                // Adding a click listener on table
                target.addEventListener("click", async function (e) {

                    //          // check for most common element of back and lay as source of event
                    // if(e.target.parentElement.parentElement.parentElement.parentElement.className == 'runner-line') {

                    let betType,
                        amount,
                        odd,
                        SELECTION;


                    // check the validity of this selector or runner
                    SELECTION = e.target.parentElement.parentElement.parentElement.parentElement.children[0].children[1].children[1].children[0].children[0].children[0].children[2].children[0].innerText.split('\n')[0];
                    // a check for Selection
                    if (!SELECTION) {
                        return failure.push({
                            identifier: "DOM nav for Selection",
                            SELECTION: "'e.target.parentElement.parentElement.parentElement.parentElement.children[0].children[1].children[1].children[0].children[0].children[0].children[2].children[0].innerText.split('\n')[0]'"

                        })
                    }

                    if ((e.target.className == 'bet-button-price') && (e.target.parentElement.parentElement.parentElement.className == 'bet-buttons back-cell last-back-cell')) {
                        betType = 'b0';
                        // back
                        if (e.target.innerText) { odd = e.target.innerText; } else {
                            failure.push({
                                betType: 'b0',
                                identifier: "DOM nav for (e.target.className == 'bet-button-price') && (e.target.parentElement.parentElement.parentElement.className == 'bet-buttons back-cell last-back-cell')",
                                odd: "e.target.innerText"
                            })
                        };
                        if (e.target.parentElement.parentElement.children[0].children[1].innerText) { amount = e.target.parentElement.parentElement.children[0].children[1].innerText; } else {
                            failure.push({
                                betType: 'b0',
                                identifier: "DOM nav for (e.target.className == 'bet-button-price') && (e.target.parentElement.parentElement.parentElement.className == 'bet-buttons back-cell last-back-cell')",
                                amount: "e.target.parentElement.parentElement.children[0].children[1].innerText"
                            })
                        }

                    }
                    else if ((e.target.className == 'bet-button-price') && (e.target.parentElement.parentElement.parentElement.className == 'bet-buttons lay-cell first-lay-cell')) {
                        betType = 'l0';
                        // lay
                        if (e.target.innerText) { odd = e.target.innerText; } else {
                            failure.push({
                                betType: 'l0',
                                identifier: "DOM nav for (e.target.className == 'bet-button-price') && (e.target.parentElement.parentElement.parentElement.className == 'bet-buttons lay-cell first-lay-cell')",
                                odd: "e.target.innerText"
                            })
                        };
                        if (e.target.parentElement.parentElement.children[0].children[1].innerText) { amount = e.target.parentElement.parentElement.children[0].children[1].innerText; } else {
                            failure.push({
                                betType: 'l0',
                                identifier: "DOM nav for (e.target.className == 'bet-button-price') && (e.target.parentElement.parentElement.parentElement.className == 'bet-buttons lay-cell first-lay-cell')",
                                amount: "e.target.parentElement.parentElement.children[0].children[1].innerText"
                            })
                        }
                    }
                    else if ((e.target.className == 'bet-button-price') && (e.target.parentElement.parentElement.parentElement.nextElementSibling.className == 'bet-buttons back-cell last-back-cell')) {
                        betType = 'b1';
                        // back
                        if (e.target.innerText) { odd = e.target.innerText; } else {
                            failure.push({
                                betType: 'b1',
                                identifier: "DOM nav for (e.target.className == 'bet-button-price') && (e.target.parentElement.parentElement.parentElement.className == 'bet-buttons back-cell last-back-cell')",
                                odd: "e.target.innerText"
                            })
                        };
                        if (e.target.parentElement.parentElement.children[0].children[1].innerText) { amount = e.target.parentElement.parentElement.children[0].children[1].innerText; } else {
                            failure.push({
                                betType: 'b1',
                                identifier: "DOM nav for (e.target.className == 'bet-button-price') && (e.target.parentElement.parentElement.parentElement.className == 'bet-buttons back-cell last-back-cell')",
                                amount: "e.target.parentElement.parentElement.children[0].children[1].innerText"
                            })
                        }
                    }
                    else if ((e.target.className == 'bet-button-price') && (e.target.parentElement.parentElement.parentElement.nextElementSibling.className == 'bet-buttons lay-cell first-lay-cell')) {
                        betType = 'l1';
                        // lay
                        if (e.target.innerText) { odd = e.target.innerText; } else {
                            failure.push({
                                betType: 'l1',
                                identifier: "DOM nav for (e.target.className == 'bet-button-price') && (e.target.parentElement.parentElement.parentElement.className == 'bet-buttons lay-cell first-lay-cell')",
                                odd: "e.target.innerText"
                            })
                        };
                        if (e.target.parentElement.parentElement.children[0].children[1].innerText) { amount = e.target.parentElement.parentElement.children[0].children[1].innerText; } else {
                            failure.push({
                                betType: 'l1',
                                identifier: "DOM nav for (e.target.className == 'bet-button-price') && (e.target.parentElement.parentElement.parentElement.className == 'bet-buttons lay-cell first-lay-cell')",
                                amount: "e.target.parentElement.parentElement.children[0].children[1].innerText"
                            })
                        }
                    }
                    else if ((e.target.className == 'bet-button-price') && (e.target.parentElement.parentElement.parentElement.nextElementSibling.nextElementSibling.className == 'bet-buttons back-cell last-back-cell')) {
                        betType = 'b2';
                        // back
                        if (e.target.innerText) { odd = e.target.innerText; } else {
                            failure.push({
                                betType: 'b2',
                                identifier: "DOM nav for (e.target.className == 'bet-button-price') && (e.target.parentElement.parentElement.parentElement.className == 'bet-buttons back-cell last-back-cell')",
                                odd: "e.target.innerText"
                            })
                        };
                        if (e.target.parentElement.parentElement.children[0].children[1].innerText) { amount = e.target.parentElement.parentElement.children[0].children[1].innerText; } else {
                            failure.push({
                                betType: 'b2',
                                identifier: "DOM nav for (e.target.className == 'bet-button-price') && (e.target.parentElement.parentElement.parentElement.className == 'bet-buttons back-cell last-back-cell')",
                                amount: "e.target.parentElement.parentElement.children[0].children[1].innerText"
                            })
                        }
                    }
                    else if ((e.target.className == 'bet-button-price') && (e.target.parentElement.parentElement.parentElement.nextElementSibling.nextElementSibling.className == 'bet-buttons lay-cell first-lay-cell')) {
                        betType = 'l2';
                        // lay
                        if (e.target.innerText) { odd = e.target.innerText; } else {
                            failure.push({
                                betType: 'l2',
                                identifier: "DOM nav for (e.target.className == 'bet-button-price') && (e.target.parentElement.parentElement.parentElement.className == 'bet-buttons lay-cell first-lay-cell')",
                                odd: "e.target.innerText"
                            })
                        };
                        if (e.target.parentElement.parentElement.children[0].children[1].innerText) { amount = e.target.parentElement.parentElement.children[0].children[1].innerText; } else {
                            failure.push({
                                betType: 'l2',
                                identifier: "DOM nav for (e.target.className == 'bet-button-price') && (e.target.parentElement.parentElement.parentElement.className == 'bet-buttons lay-cell first-lay-cell')",
                                amount: "e.target.parentElement.parentElement.children[0].children[1].innerText"
                            })
                        }
                    }
                    else if ((e.target.className == 'bet-button-size') && (e.target.parentElement.parentElement.parentElement.className == 'bet-buttons back-cell last-back-cell')) {
                        betType = 'b0';
                        // back size
                        if (e.target.innerText) { odd = e.target.innerText; } else {
                            failure.push({
                                betType: 'b0',
                                identifier: "DOM nav for (e.target.className == 'bet-button-size') && (e.target.parentElement.parentElement.parentElement.className == 'bet-buttons back-cell last-back-cell')",
                                odd: "e.target.innerText"
                            })
                        };
                        if (e.target.parentElement.parentElement.children[0].children[1].innerText) { amount = e.target.parentElement.parentElement.children[0].children[1].innerText; } else {
                            failure.push({
                                betType: 'b0',
                                identifier: "DOM nav for (e.target.className == 'bet-button-size') && (e.target.parentElement.parentElement.parentElement.className == 'bet-buttons back-cell last-back-cell')",
                                amount: "e.target.parentElement.parentElement.children[0].children[1].innerText"
                            })
                        }
                    }
                    else if ((e.target.className == 'bet-button-size') && (e.target.parentElement.parentElement.parentElement.className == 'bet-buttons lay-cell first-lay-cell')) {
                        betType = 'l0';
                        // lay size
                        if (e.target.innerText) { odd = e.target.innerText; } else {
                            failure.push({
                                betType: 'l0',
                                identifier: "DOM nav for (e.target.className == 'bet-button-size') && (e.target.parentElement.parentElement.parentElement.className == 'bet-buttons lay-cell first-lay-cell')",
                                odd: "e.target.innerText"
                            })
                        };
                        if (e.target.parentElement.parentElement.children[0].children[1].innerText) { amount = e.target.parentElement.parentElement.children[0].children[1].innerText; } else {
                            failure.push({
                                betType: 'l0',
                                identifier: "DOM nav for (e.target.className == 'bet-button-size') && (e.target.parentElement.parentElement.parentElement.className == 'bet-buttons lay-cell first-lay-cell')",
                                amount: "e.target.parentElement.parentElement.children[0].children[1].innerText"
                            })
                        }
                    }
                    else if ((e.target.className == 'bet-button-size') && (e.target.parentElement.parentElement.parentElement.nextElementSibling.className == 'bet-buttons back-cell last-back-cell')) {
                        betType = 'b1';
                        // back size
                        if (e.target.innerText) { odd = e.target.innerText; } else {
                            failure.push({
                                betType: 'b1',
                                identifier: "DOM nav for (e.target.className == 'bet-button-size') && (e.target.parentElement.parentElement.parentElement.className == 'bet-buttons back-cell last-back-cell')",
                                odd: "e.target.innerText"
                            })
                        };
                        if (e.target.parentElement.parentElement.children[0].children[1].innerText) { amount = e.target.parentElement.parentElement.children[0].children[1].innerText; } else {
                            failure.push({
                                betType: 'b1',
                                identifier: "DOM nav for (e.target.className == 'bet-button-size') && (e.target.parentElement.parentElement.parentElement.className == 'bet-buttons back-cell last-back-cell')",
                                amount: "e.target.parentElement.parentElement.children[0].children[1].innerText"
                            })
                        }
                    }
                    else if ((e.target.className == 'bet-button-size') && (e.target.parentElement.parentElement.parentElement.nextElementSibling.className == 'bet-buttons lay-cell first-lay-cell')) {
                        betType = 'l1';
                        // lay size
                        if (e.target.innerText) { odd = e.target.innerText; } else {
                            failure.push({
                                betType: 'l1',
                                identifier: "DOM nav for (e.target.className == 'bet-button-size') && (e.target.parentElement.parentElement.parentElement.className == 'bet-buttons lay-cell first-lay-cell')",
                                odd: "e.target.innerText"
                            })
                        };
                        if (e.target.parentElement.parentElement.children[0].children[1].innerText) { amount = e.target.parentElement.parentElement.children[0].children[1].innerText; } else {
                            failure.push({
                                betType: 'l1',
                                identifier: "DOM nav for (e.target.className == 'bet-button-size') && (e.target.parentElement.parentElement.parentElement.className == 'bet-buttons lay-cell first-lay-cell')",
                                amount: "e.target.parentElement.parentElement.children[0].children[1].innerText"
                            })
                        }
                    }
                    else if ((e.target.className == 'bet-button-size') && (e.target.parentElement.parentElement.parentElement.nextElementSibling.nextElementSibling.className == 'bet-buttons back-cell last-back-cell')) {
                        betType = 'b2';
                        // back size
                        if (e.target.innerText) { odd = e.target.innerText; } else {
                            failure.push({
                                betType: 'b2',
                                identifier: "DOM nav for (e.target.className == 'bet-button-size') && (e.target.parentElement.parentElement.parentElement.className == 'bet-buttons back-cell last-back-cell')",
                                odd: "e.target.innerText"
                            })
                        };
                        if (e.target.parentElement.parentElement.children[0].children[1].innerText) { amount = e.target.parentElement.parentElement.children[0].children[1].innerText; } else {
                            failure.push({
                                betType: 'b2',
                                identifier: "DOM nav for (e.target.className == 'bet-button-size') && (e.target.parentElement.parentElement.parentElement.className == 'bet-buttons back-cell last-back-cell')",
                                amount: "e.target.parentElement.parentElement.children[0].children[1].innerText"
                            })
                        }
                    }
                    else if ((e.target.className == 'bet-button-size') && (e.target.parentElement.parentElement.parentElement.nextElementSibling.nextElementSibling.className == 'bet-buttons lay-cell first-lay-cell')) {
                        betType = 'l2';
                        // lay size
                        if (e.target.innerText) { odd = e.target.innerText; } else {
                            failure.push({
                                betType: 'l2',
                                identifier: "DOM nav for (e.target.className == 'bet-button-size') && (e.target.parentElement.parentElement.parentElement.className == 'bet-buttons lay-cell first-lay-cell')",
                                odd: "e.target.innerText"
                            })
                        };
                        if (e.target.parentElement.parentElement.children[0].children[1].innerText) { amount = e.target.parentElement.parentElement.children[0].children[1].innerText; } else {
                            failure.push({
                                betType: 'l2',
                                identifier: "DOM nav for (e.target.className == 'bet-button-size') && (e.target.parentElement.parentElement.parentElement.className == 'bet-buttons lay-cell first-lay-cell')",
                                amount: "e.target.parentElement.parentElement.children[0].children[1].innerText"
                            })
                        }
                    }

                    // }else{

                    // }

                }, true);
                // Synchronous click of all Odds  
                sizeCount.forEach((a) => {
                    a.click()
                });
                // Synchronous click of all Liquidity  
                priceCount.forEach((b) => {
                    b.click()
                });

                // If failure array length is empty fire success
                if (failure.length < 1) {
                    console.log('Success: All Selectors and Relationships are verified')
                } else {
                    console.error(failure)
                }

            }, MATCHED_AMOUNT_SELECTOR);
    }

    process.exit(0)
    // end of bot() 

}

// execute scraper
bot()
    .catch(err => console.error(err));
//=============================================================================