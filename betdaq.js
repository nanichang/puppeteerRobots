/**
 * created by Nanichang on 21 - 03 - 2018
*/
//=============================================================================

// dependencies
const P = require('puppeteer');

// module variables
const
    EVENT_URL = 'https://www.betdaq.com/exchange/horse-racing/uk-racing/lingfield-(23rd-march-2018)/13-35-lingfield/4794266',
    SELECTIONS_CONTAINER_SELECTOR = 'table.dataTable.marketViewSelections',
    MATCHED_AMOUNT_SELECTOR = 'span.gep-matchedamount';
FRAME = 'mainFrame';

async function bot() {
    // instantiate browser
    const browser = await P.launch({
        headless: false,
        timeout: 180000
    });
    // create blank page
    const page = await browser.newPage();
    // set viewport to 1366*768
    await page.setViewport({ width: 1366, height: 768 });
    // set the user agent
    await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko)');

    await page.goto(EVENT_URL, {
        waitUntil: 'networkidle2'
    });
    await page.reload({
        waitUntil: 'networkidle2',
        timeout: 180000
    });
    await page.waitFor(30 * 1000);
    // Message passing back to Parent Process
    page.on('console', data => {
        if (data.type == 'error') {
            // passing failure messages
            return console.error(data.text())
        }
        else {
            // passing success message
            return console.log(data.text())
        }
    })
    //Frame instantiation
    const frame = await page.frames().find(f => f.name() === FRAME);

    // iFrame check
    if (!frame) {
        console.error(`Failure: The frame selector '${FRAME}' was not found`);
        return process.exitCode = 1;
    } else {
        let parentContainer = await frame.waitForSelector(SELECTIONS_CONTAINER_SELECTOR, {
            timeout: 180000
        });

        console.log(parentContainer);

        if (!parentContainer) {
            console.error(`Failure: The parent selector '${SELECTIONS_CONTAINER_SELECTOR}' was not found`);
        } else {
            await frame.$eval(SELECTIONS_CONTAINER_SELECTOR,
                async (target, MATCHED_AMOUNT_SELECTOR) => {
                    //Value after evaluating Race container selector check
                    let failure = [];

                    let matched_amount = document.querySelector(MATCHED_AMOUNT_SELECTOR)
                    //Matched amount check
                    if (!matched_amount) {
                        return console.error()
                        failure.push({
                            identifier: "DOM nav for MAtched Amount",
                            Matched_Amount: `The Selector '${MATCHED_AMOUNT_SELECTOR}' could not be verifed`

                        })
                    }
                    // Grabbing first row
                    let firstRow = target.children[1].children[0];
                    //Querying all Odds
                    let priceGroup = await Array.from(firstRow.querySelectorAll('.price'));
                    //Querying all liquidity
                    let stakeGroup = await Array.from(firstRow.querySelectorAll('.stake'));


                    // Adding a click listener on table
                    target.addEventListener("click", async function (e) {
                        // 12 Checks for each click, Each successful click sends its bettype to array above
                        let
                            betType,
                            odds,
                            liquidity,
                            SELECTION;
                        SELECTION = e.target.parentElement.parentElement.parentElement.parentElement.children[0].children[2].children[0].children[0].children[2].children[0].innerText
                        if (!SELECTION) {
                            return failure.push({
                                identifier: "DOM nav for Selection",
                                SELECTION: 'e.target.parentElement.parentElement.parentElement.parentElement.children[0].children[2].children[0].children[0].children[2].children[0].innerText'

                            })
                        }
                        // 12 Checks for each click, Each successful click sends its bettype to array above
                        if ((e.target.className == 'price') && (e.target.parentElement.parentElement.parentElement.className == 'priceBox backCell_0')) {
                            betType = 'b0';
                            if (!!e.target.innerText.className) { odds = e.target.innerText; } else {
                                return failure.push({
                                    betType: 'b0',
                                    identifier: "DOM nav for (e.target.className == 'price') && (e.target.parentElement.parentElement.parentElement.className == 'priceBox backCell_0')",
                                    odds: "e.target.innerText"
                                })
                            };
                            if (!!e.target.parentElement.children[1].innerText) { liquidity = e.target.parentElement.children[1].innerText; } else {
                                return failure.push({
                                    betType: 'b0',
                                    identifier: "DOM nav for (e.target.className == 'price') && (e.target.parentElement.parentElement.parentElement.className == 'priceBox backCell_0')",
                                    liquidity: "e.target.parentElement.children[1].innerText"
                                })
                            }
                        }
                        else if ((e.target.className == 'price') && (e.target.parentElement.parentElement.parentElement.className == 'priceBox layCell_0')) {
                            betType = 'l0';
                            if (!!e.target.innerText) { odds = e.target.innerText; } else {
                                return failure.push({
                                    betType: 'l0',
                                    identifier: "DOM nav for (e.target.className == 'price') && (e.target.parentElement.parentElement.parentElement.className == 'priceBox layCell_0')",
                                    odds: "e.target.innerText"
                                })
                            };
                            if (!!e.target.parentElement.children[1].innerText) { liquidity = e.el.parentElement.children[1].innerText; } else {
                                return failure.push({
                                    betType: 'l0',
                                    identifier: "DOM nav for (e.target.className == 'price') && (e.target.parentElement.parentElement.parentElement.className == 'priceBox layCell_0')",
                                    liquidity: "e.target.parentElement.children[1].innerText"
                                })
                            };
                        }
                        else if ((e.target.className == 'price') && (e.target.parentElement.parentElement.parentElement.className == 'priceBox backCell_1')) {
                            betType = 'b1';
                            if (!!e.target.innerText) { odds = e.target.innerText; } else {
                                return failure.push({
                                    betType: 'b1',
                                    identifier: "DOM nav for (e.target.className == 'price') && (e.target.parentElement.parentElement.parentElement.className == 'priceBox backCell_1')",
                                    odds: "e.target.innerText"
                                })
                            };
                            if (!!e.target.parentElement.children[1].innerText) { liquidity = e.target.parentElement.children[1].innerText; } else {
                                return failure.push({
                                    betType: 'b1',
                                    identifier: "DOM nav for (e.target.className == 'price') && (e.target.parentElement.parentElement.parentElement.className == 'priceBox backCell_1')",
                                    liquidity: "e.target.parentElement.children[1].innerText"
                                })
                            }
                        }
                        else if ((e.target.className == 'price') && (e.target.parentElement.parentElement.parentElement.className == 'priceBox layCell_1')) {
                            betType = 'l1';
                            if (!!e.target.innerText) { odds = e.target.innerText; } else {
                                return failure.push({
                                    betType: 'l1',
                                    identifier: "DOM nav for (e.target.className == 'price') && (e.target.parentElement.parentElement.parentElement.className == 'priceBox layCell_1')",
                                    odds: "e.target.innerText"
                                })
                            };
                            if (!!e.target.parentElement.children[1].innerText) { liquidity = e.el.parentElement.children[1].innerText; } else {
                                return failure.push({
                                    betType: 'l1',
                                    identifier: "DOM nav for (e.target.className == 'price') && (e.target.parentElement.parentElement.parentElement.className == 'priceBox layCell_1')",
                                    liquidity: "e.target.parentElement.children[1].innerText"
                                })
                            };
                        }
                        else if ((e.target.className == 'price') && (e.target.parentElement.parentElement.parentElement.className == 'priceBox backCell_2')) {
                            betType = 'b2';
                            if (!!e.target.innerText) { odds = e.target.innerText; } else {
                                return failure.push({
                                    betType: 'b2',
                                    identifier: "DOM nav for (e.target.className == 'price') && (e.target.parentElement.parentElement.parentElement.className == 'priceBox backCell_2')",
                                    odds: "e.target.innerText"
                                })
                            };
                            if (!!e.target.parentElement.children[1].innerText) { liquidity = e.target.parentElement.children[1].innerText; } else {
                                return failure.push({
                                    betType: 'b2',
                                    identifier: "DOM nav for (e.target.className == 'price') && (e.target.parentElement.parentElement.parentElement.className == 'priceBox backCell_2')",
                                    liquidity: "e.target.parentElement.children[1].innerText"
                                })
                            }
                        }
                        else if ((e.target.className == 'price') && (e.target.parentElement.parentElement.parentElement.className == 'priceBox layCell_2')) {
                            betType = 'l2';
                            if (!!e.target.innerText) { odds = e.target.innerText; } else {
                                return failure.push({
                                    betType: 'l2',
                                    identifier: "DOM nav for (e.target.className == 'price') && (e.target.parentElement.parentElement.parentElement.className == 'priceBox layCell_2')",
                                    odds: "e.target.innerText"
                                })
                            };
                            if (!!e.target.parentElement.children[1].innerText) { liquidity = e.target.parentElement.children[1].innerText; } else {
                                return failure.push({
                                    betType: 'l2',
                                    identifier: "DOM nav for (e.target.className == 'price') && (e.target.parentElement.parentElement.parentElement.className == 'priceBox layCell_2')",
                                    liquidity: "e.target.parentElement.children[1].innerText"
                                })
                            };
                        }
                        else if ((e.target.className == 'stake') && (e.target.parentElement.parentElement.parentElement.className == 'priceBox backCell_0')) {
                            betType = 'b0';
                            if (!!e.target.parentElement.children[0].innerText) { odds = e.target.parentElement.children[0].innerText; } else {
                                return failure.push({
                                    betType: 'b0',
                                    identifier: "DOM nav for (e.target.className == 'stake') && (e.target.parentElement.parentElement.parentElement.className == 'priceBox backCell_0')",
                                    odds: "e.target.parentElement.children[0].innerText"
                                })
                            };
                            if (!!e.target.innerText) { liquidity = e.target.innerText; } else {
                                return failure.push({
                                    betType: 'b0',
                                    identifier: "DOM nav for (e.target.className == 'stake') && (e.target.parentElement.parentElement.parentElement.className == 'priceBox backCell_0')",
                                    liquidity: "e.target.innerText"
                                })
                            }

                        }
                        else if ((e.target.className == 'stake') && (e.target.parentElement.parentElement.parentElement.className == 'priceBox layCell_0')) {
                            betType = 'l0';
                            if (!!e.target.parentElement.children[0].innerText) { odds = e.target.parentElement.children[0].innerText; } else {
                                return failure.push({
                                    betType: 'l0',
                                    identifier: "DOM nav for (e.target.className == 'stake') && (e.target.parentElement.parentElement.parentElement.className == 'priceBox layCell_0')",
                                    odds: "e.target.parentElement.children[0].innerText"
                                })
                            }
                            if (!!e.target.innerText) { liquidity = e.target.innerText; } else {
                                return failure.push({
                                    betType: 'l0',
                                    identifier: "DOM nav for (e.target.className == 'stake') && (e.target.parentElement.parentElement.parentElement.className == 'priceBox layCell_0')",
                                    liquidity: "e.target.innerText"
                                })
                            }

                        }
                        else if ((e.target.className == 'stake') && (e.target.parentElement.parentElement.parentElement.className == 'priceBox backCell_1')) {
                            betType = 'b1';
                            if (!!e.target.parentElement.children[0].innerText) { odds = e.target.parentElement.children[0].innerText; } else {
                                return failure.push({
                                    betType: 'b1',
                                    identifier: "DOM nav for (e.target.className == 'stake') && (e.target.parentElement.parentElement.parentElement.className == 'priceBox backCell_1')",
                                    odds: "e.target.parentElement.children[0].innerText"
                                })
                            };
                            if (!!e.target.innerText) { liquidity = e.target.innerText; } else {
                                return failure.push({
                                    betType: 'b1',
                                    identifier: "DOM nav for (e.target.className == 'stake') && (e.target.parentElement.parentElement.parentElement.className == 'priceBox backCell_1')",
                                    liquidity: "e.target.innerText"
                                })
                            }
                        }
                        else if ((e.target.className == 'stake') && (e.target.parentElement.parentElement.parentElement.className == 'priceBox layCell_1')) {
                            betType = 'l1';
                            if (!!e.target.parentElement.children[0].innerText) { odds = e.target.parentElement.children[0].innerText; } else {
                                return failure.push({
                                    betType: 'l1',
                                    identifier: "DOM nav for (e.target.className == 'stake') && (e.target.parentElement.parentElement.parentElement.className == 'priceBox layCell_1')",
                                    odds: "e.target.parentElement.children[0].innerText"
                                })
                            }
                            if (!!e.target.innerText) { liquidity = e.target.innerText; } else {
                                return failure.push({
                                    betType: 'l1',
                                    identifier: "DOM nav for (e.target.className == 'stake') && (e.target.parentElement.parentElement.parentElement.className == 'priceBox layCell_1')",
                                    liquidity: "e.target.innerText"
                                })
                            }

                        }
                        else if ((e.target.className == 'stake') && (e.target.parentElement.parentElement.parentElement.className == 'priceBox backCell_2')) {
                            betType = 'b2';
                            if (!!e.target.parentElement.children[0].innerText) { odds = e.target.parentElement.children[0].innerText; } else {
                                return failure.push({
                                    betType: 'b2',
                                    identifier: "DOM nav for (e.target.className == 'stake') && (e.target.parentElement.parentElement.parentElement.className == 'priceBox backCell_2')",
                                    odds: "e.target.parentElement.children[0].innerText"
                                })
                            };
                            if (!!e.target.innerText) { liquidity = e.target.innerText; } else {
                                return failure.push({
                                    betType: 'b2',
                                    identifier: "DOM nav for (e.target.className == 'stake') && (e.target.parentElement.parentElement.parentElement.className == 'priceBox backCell_2')",
                                    liquidity: "e.target.innerText"
                                })
                            }
                        }
                        else if ((e.target.className == 'stake') && (e.target.parentElement.parentElement.parentElement.className == 'priceBox layCell_2')) {
                            betType = 'l2';
                            if (!!e.target.parentElement.children[0].innerText) { odds = e.target.parentElement.children[0].innerText; } else {
                                return failure.push({
                                    betType: 'l2',
                                    identifier: "DOM nav for (e.target.className == 'stake') && (e.target.parentElement.parentElement.parentElement.className == 'priceBox layCell_2')",
                                    odds: "e.target.parentElement.children[0].innerText"
                                })
                            }
                            if (!!e.target.innerText) { liquidity = e.target.innerText; } else {
                                return failure.push({
                                    betType: 'l2',
                                    identifier: "DOM nav for (e.target.className == 'stake') && (e.target.parentElement.parentElement.parentElement.className == 'priceBox layCell_2')",
                                    liquidity: "e.target.innerText"
                                })
                            }
                        }
                    }, true);
                    // Synchronous click of all Odds  
                    await priceGroup.forEach((a) => {
                        a.click()
                    });
                    // Synchronous click of all Liquidity  
                    await stakeGroup.forEach((b) => {
                        b.click()
                    });

                    // If failure array length is empty fire success
                    if (failure.length < 1) {
                        console.log('Success: All Selectors and Relationships are verified')
                    } else {
                        console.error(failure)
                    }
                    //end of else for target
                }, MATCHED_AMOUNT_SELECTOR)
        };
        //end of else statement for iframe
    }
    process.exit(0)
    // end of bot()
}

// execute scraper
bot()
    .catch(err => {
        console.error(err);
        return process.exitCode = 1
    });
//=============================================================================