import {chromium} from '/opt/codex/runtimes/cua/lib/node_modules/playwright/index.mjs';
import assert from 'node:assert/strict';
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/api/tutor',r=>r.fulfill({json:{available:false,reason:'Test: no provider'}}));
 await page.goto('http://127.0.0.1:5173/lab.html');
 assert.equal(await page.getByRole('button',{name:'Record first attempt & start'}).isDisabled(),true);
 await page.getByLabel('Your starting response').fill('Students who choose the group may already be more motivated.');
 await page.getByRole('button',{name:'Record first attempt & start'}).click();
 await page.getByRole('button',{name:'Play lesson',exact:true}).click();
 await page.getByRole('button',{name:'Learn',exact:true}).click();
 assert.equal(await page.getByLabel('Your starting response').getAttribute('readonly'),'');
 await page.getByRole('button',{name:'Continue to lesson'}).click();
 await page.getByRole('button',{name:'Play lesson',exact:true}).waitFor();
 await page.getByLabel('Your first response').fill('Compare the policy with classroom rules.');
 await page.getByRole('button',{name:'“Why would an all-day restriction work better than classroom rules?”',exact:true}).click();
 await page.getByLabel('Your revised response').fill('What evidence compares the two policies?');
 await page.getByRole('button',{name:'Try the transfer exercise →'}).click();
 assert.equal(await page.getByRole('heading',{name:'Review your reasoning'}).count(),0);
 await page.getByLabel('Your response to the new argument').fill('Health may affect who cycles. Compare changes over time.');
 await page.getByRole('button',{name:'Record attempt & review'}).click();
 await page.getByLabel('I describe the argument fairly before objecting.').check();
 await page.getByLabel('What changed in your approach?').fill('I ask about alternative causes.');
 const pending=page.waitForEvent('download');await page.getByRole('button',{name:'Download learning record'}).click();
 const file=await pending;const stream=await file.createReadStream();let raw='';for await(const chunk of stream)raw+=chunk;
 const data=JSON.parse(raw);assert.ok(data.journey.baselineSubmitted);assert.ok(data.journey.transferSubmitted);assert.equal(data.journey.checks.length,1);assert.ok(data.journey.prompts.transfer);assert.ok(data.revision.includes('evidence'));
 await page.setViewportSize({width:390,height:844});
 for(const name of ['Learn','Lesson','My Progress']){await page.getByRole('button',{name,exact:true}).click();assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));}
 await page.getByRole('button',{name:'Learn',exact:true}).click();await page.screenshot({path:'/workspace/scratch/journey-mobile.png',fullPage:true});
 await page.setViewportSize({width:1440,height:1000});await page.screenshot({path:'/workspace/scratch/journey-desktop.png',fullPage:true});
 await page.reload();assert.equal(await page.getByLabel('Your starting response').inputValue(),'');assert.deepEqual(errors,[]);
 console.log('PASS: baseline lock, navigation pauses, writing retained, independent transfer, self-review, complete export, mobile layouts, reload disclosure.');
}finally{await browser.close();}
