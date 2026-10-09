import test from 'node:test';
import assert from 'node:assert/strict';
import {tutorRoute} from '../server/tutor';
import worker from '../server/worker';
import {lesson} from '../shared/teaching';
import {originalMap} from '../shared/tutor';
const input={lessonId:lesson.id,lessonVersion:lesson.version,chapter:0,question:'What if it applies only during class?',map:originalMap,history:[]};
const env={LOCAL_DEV:'true',DEEPSEEK_API_KEY:'test-only-not-real',DEEPSEEK_MODEL:'test-model'};
const req=(data:unknown=input)=>new Request('http://localhost:8787/api/tutor',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
test('tutor requires configured credentials and local-only access before calling provider',async()=>{
  const never=async()=>{throw Error('Provider must not be called');};
  assert.equal((await tutorRoute(req(),{LOCAL_DEV:'true'},never)).status,503);
  assert.equal((await tutorRoute(new Request('https://example.com/api/tutor'),env,never)).status,403);
  assert.equal((await tutorRoute(req({...input,question:'x'.repeat(1201)}),env,never)).status,400);
  const cross=new Request('http://localhost:8787/api/tutor',{method:'POST',headers:{'Content-Type':'application/json',Origin:'https://attacker.test'},body:JSON.stringify(input)});
  assert.equal((await worker.fetch(cross,{...env} as any)).status,403);
});
test('tutor sends bounded lesson context and accepts only structured map data',async()=>{
  const reply={explanation:'A classroom-only rule changes the policy scope.',map:{...originalMap,conclusion:'Restrict phones during class.'},focus:'conclusion',followUp:'Which remaining assumption would you challenge?'};
  const mock:typeof fetch=async(url,options)=>{
    assert.equal(url,'https://api.deepseek.com/chat/completions');
    const body=JSON.parse(String(options?.body));assert.equal(body.model,'test-model');assert.equal(body.max_tokens,1600);
    assert.equal(JSON.parse(body.messages[1].content).question,input.question);
    return Response.json({choices:[{message:{content:JSON.stringify(reply)}}]});
  };
  const result=await tutorRoute(req(),env,mock);assert.equal(result.status,200);assert.deepEqual((await result.json() as any).reply,reply);
  const bad:typeof fetch=async()=>Response.json({choices:[{message:{content:JSON.stringify({...reply,focus:'invented',code:'run-me'})}}]});
  assert.equal((await tutorRoute(req(),env,bad)).status,502);
  const unavailable:typeof fetch=async()=>new Response('private provider error',{status:401});
  const failure=await tutorRoute(req(),env,unavailable);assert.equal(failure.status,502);assert.ok(!(await failure.text()).includes('private provider error'));
  assert.equal((await tutorRoute(req(),env,async()=>{throw Error('secret connection data')})).status,504);
});
