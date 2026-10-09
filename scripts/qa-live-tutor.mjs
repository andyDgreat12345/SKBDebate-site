import {chromium} from '/opt/codex/runtimes/cua/lib/node_modules/playwright/index.mjs';
import assert from 'node:assert/strict';
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
try{
  const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const map={observation:'Some students check phones during independent work.',assumption:'A classroom rule must address distractions during lessons.',conclusion:'Restrict phone use during class only.'};
  let fail=false,posts=0;
  await page.route('**/api/tutor',async route=>{if(route.request().method()==='GET')return route.fulfill({json:{available:true}});posts++;const body=route.request().postDataJSON();assert.ok(body.question);if(posts===2)assert.equal(body.history.length,2);return fail?route.fulfill({status:502,json:{error:'Simulated provider failure'}}):route.fulfill({json:{reply:{explanation:'SIMULATED TEST RESPONSE: the scope is narrower.',map,focus:'conclusion',followUp:'What comparison would justify this rule?'},elapsedMs:100}});});
  await page.goto('http://127.0.0.1:5173/lab.html');
  await page.getByRole('button',{name:'Play lesson',exact:true}).click();
  await page.getByLabel('Your question or correction').fill('What if it applies only in class?');
  await page.getByRole('button',{name:'Ask tutor',exact:true}).click();
  await page.getByText('SIMULATED TEST RESPONSE: the scope is narrower.',{exact:true}).waitFor();
  assert.ok((await page.locator('.argument-node.focused').textContent()).includes('during class only'));
  await page.getByRole('button',{name:'Play lesson',exact:true}).waitFor();
  fail=true;await page.getByLabel('Your question or correction').fill('Can you explain the assumption?');await page.getByRole('button',{name:'Ask tutor',exact:true}).click();
  await page.getByRole('alert').filter({hasText:'Simulated provider failure'}).waitFor();
  assert.equal(await page.getByLabel('Your question or correction').inputValue(),'Can you explain the assumption?');
  assert.ok((await page.locator('.argument-node.focused').textContent()).includes('during class only'));
  await page.getByRole('button',{name:'Replay chapter'}).click();assert.ok((await page.locator('.argument-chain').textContent()).includes('throughout the school day'));
  await page.setViewportSize({width:390,height:844});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await page.unroute('**/api/tutor');await page.route('**/api/tutor',route=>route.fulfill({json:{available:false,reason:'No model configured'}}));await page.reload();
  await page.getByLabel('Your question or correction').fill('A question');assert.equal(await page.getByRole('button',{name:'Ask tutor',exact:true}).isDisabled(),true);
  assert.deepEqual(errors,[]);console.log('PASS (mock provider only): contextual requests, live map, pause, follow-up history, error recovery, authored reset, mobile, unavailable state.');
}finally{await browser.close();}
