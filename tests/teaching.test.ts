import {test} from 'node:test';
import assert from 'node:assert/strict';
import {lesson,teachingReducer as reduce,initialTeachingState as initial} from '../shared/teaching';

test('lesson completion stops playback and practice cannot accidentally restart it',()=>{
  let state=reduce(initial,{type:'play'});
  for(const _scene of lesson.scenes)state=reduce(state,{type:'next'});
  assert.equal(state.stage,'practice');assert.equal(state.playing,false);
  assert.equal(reduce(state,{type:'play'}).playing,false);
  assert.deepEqual(reduce(state,{type:'scene',index:99}),state);
  assert.equal(reduce(state,{type:'scene',index:0}).stage,'lesson');
});
test('feedback gates revision and preserves student writing while revisiting a chapter',()=>{
  let state=reduce(initial,{type:'write',field:'initial',text:'Compare alternatives.'});
  state=reduce(state,{type:'choose',id:'counterexample'});assert.equal(state.stage,'practice');
  assert.deepEqual(reduce(state,{type:'choose',id:'invented'}),state);
  state=reduce(state,{type:'choose',id:'comparison'});assert.equal(state.stage,'reflection');
  state=reduce(state,{type:'write',field:'revision',text:'Which policy works better, and under what conditions?'});
  state=reduce(state,{type:'scene',index:1});
  assert.equal(state.initial,'Compare alternatives.');assert.ok(state.revision.includes('conditions'));
});
