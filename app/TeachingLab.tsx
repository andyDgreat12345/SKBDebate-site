import React,{useEffect,useReducer,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {lesson,teachingReducer,initialTeachingState} from '../shared/teaching';
import './teaching-lab.css';

function TeachingLab(){
  const [state,dispatch]=useReducer(teachingReducer,initialTeachingState);
  const [help,setHelp]=useState<string|null>(null);
  const [selected,setSelected]=useState<string|null>(null);
  const [narration,setNarration]=useState(false);
  const [voiceError,setVoiceError]=useState('');
  const scene=lesson.scenes[state.scene];
  const question=lesson.questions.find(q=>q.id===help);
  const focus=selected||question?.focus||scene.focus;
  const speechAvailable=typeof window.speechSynthesis!=='undefined';
  useEffect(()=>{
    if(!state.playing)return;
    if(narration&&speechAvailable){
      const utterance=new SpeechSynthesisUtterance(scene.transcript);
      utterance.rate=0.95;
      utterance.onend=()=>dispatch({type:'next'});
      utterance.onerror=()=>{setVoiceError('Narration is unavailable. Read the transcript or switch off narration to play the scenes.');dispatch({type:'pause'});};
      window.speechSynthesis.speak(utterance);
      return()=>{utterance.onend=null;utterance.onerror=null;window.speechSynthesis.cancel();};
    }
    const timer=window.setTimeout(()=>dispatch({type:'next'}),scene.seconds*1000);
    return()=>window.clearTimeout(timer);
  },[state.playing,state.scene,narration,speechAvailable,scene]);
  useEffect(()=>{const pause=()=>{if(document.hidden)dispatch({type:'pause'});};document.addEventListener('visibilitychange',pause);return()=>document.removeEventListener('visibilitychange',pause);},[]);
  function go(index:number){setHelp(null);setSelected(null);dispatch({type:'scene',index});}
  function download(){const data={lessonId:lesson.id,lessonVersion:lesson.version,exportedAt:new Date().toISOString(),initial:state.initial,revision:state.revision,choice:state.choice,feedbackType:'prepared',assessment:'Not scored or certified'};const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='skb-rebuttal-reflection.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
  return <main className="lab"><header><a href="/">SKB / DEBATE</a><span>TEACHING LAB · EXPERIMENT 01</span></header>
    <div className="lab-intro"><p className="kicker">REASONING → REBUTTAL</p><h1>{lesson.title}</h1><p>{lesson.objective}</p><p className="disclosure">Animated lesson prototype · AI-authored, awaiting educator review · Prepared coaching, not live AI</p></div>
    <div className="lab-layout"><section className="lesson-surface" aria-label="Interactive lesson">
      <nav className="scene-nav" aria-label="Lesson chapters">{lesson.scenes.map((s,i)=><button key={s.title} aria-current={state.scene===i?'step':undefined} onClick={()=>go(i)}><span>0{i+1}</span>{s.title}</button>)}</nav>
      <div className="diagram"><div className="diagram-heading"><span>ARGUMENT MAP</span><span>Fictional example · Select a card to inspect</span></div><div className="argument-chain">{lesson.nodes.map((node,i)=><React.Fragment key={node.id}>{i>0&&<div className="connector" aria-hidden="true">↓<small>{i===1?'needs justification':'supports only if justified'}</small></div>}<button className={'argument-node '+(focus===node.id?'focused':'')} aria-pressed={focus===node.id} onClick={()=>{dispatch({type:'pause'});setSelected(node.id);}}><span>{node.label}</span><strong>{node.text}</strong></button></React.Fragment>)}</div><p className="map-caption">One interpretation of the argument. The missing step is open to challenge.</p></div>
      <div className="player"><button className="primary" onClick={()=>{setHelp(null);setSelected(null);dispatch({type:state.playing?'pause':'play'});}} disabled={state.stage!=='lesson'}>{state.playing?'Pause lesson':'Play lesson'}</button><button onClick={()=>go(state.scene)}>Replay chapter</button><button onClick={()=>{setSelected(null);setHelp(null);dispatch({type:'next'});}} disabled={state.stage!=='lesson'}>Next</button><span>{state.scene+1} / {lesson.scenes.length}</span></div>
      <label className="narration"><input type="checkbox" checked={narration} disabled={!speechAvailable} onChange={e=>{dispatch({type:'pause'});setNarration(e.target.checked);setVoiceError('');}}/>Optional device narration{!speechAvailable&&' (unavailable in this browser)'}</label><p className="small-note">Narration uses your browser’s voice service. Pausing restarts the current chapter on play.</p>{voiceError&&<p role="status">{voiceError}</p>}
      <div className="transcript"><p className="kicker">{scene.title} · TRANSCRIPT</p><p>{scene.transcript}</p></div>
    </section><aside className="coach"><p className="kicker">PAUSE & EXAMINE</p><h2>Follow the reasoning.</h2><p>Choose a question to pause the lesson and examine the relevant part of the map.</p>{lesson.questions.map(q=><button className="question" aria-expanded={help===q.id} key={q.id} onClick={()=>{dispatch({type:'pause'});setSelected(null);setHelp(q.id);}}>{q.label}<span>↗</span></button>)}<div className="coach-answer" role="status">{question?<><strong>Prepared explanation</strong><p>{question.answer}</p><button onClick={()=>{setHelp(null);setSelected(null);dispatch({type:'play'});}} disabled={state.stage!=='lesson'}>Return to lesson</button></>:<p>No open-ended AI tutor is connected. These explanations are part of the lesson design.</p>}</div><button className="practice-link" onClick={()=>dispatch({type:'practice'})}>Try the rebuttal exercise ↓</button></aside></div>
    <section className="exercise" aria-labelledby="exercise-title"><p className="kicker">APPLY → REVISE</p><h2 id="exercise-title">What would you challenge?</h2><p>Your writing stays in this tab until you download it. Reloading clears it.</p><label>Your first response<textarea maxLength={5000} value={state.initial} onChange={e=>dispatch({type:'write',field:'initial',text:e.target.value})} placeholder="Write one or two sentences before checking the examples."/></label><fieldset><legend>Which response most directly challenges the policy comparison?</legend>{lesson.choices.map(c=><button className={'choice '+(state.choice===c.id?'chosen':'')} aria-pressed={state.choice===c.id} key={c.id} onClick={()=>dispatch({type:'choose',id:c.id})}>{c.label}</button>)}</fieldset><p className="feedback" role="status">{lesson.choices.find(c=>c.id===state.choice)?.feedback}</p>{state.stage==='reflection'&&<div className="revision"><label>Your revised response<textarea maxLength={5000} value={state.revision} onChange={e=>dispatch({type:'write',field:'revision',text:e.target.value})} placeholder="Address the missing comparison. What would you need to know?"/></label><p>Self-check: Did you identify a specific assumption? Avoid inventing evidence? Explain what would change your view?</p></div>}<button className="primary" disabled={!state.initial.trim()&&!state.revision.trim()} onClick={download}>Download reflection</button><span className="small-note">No score, account, or cloud save in this experiment.</span></section>
    <footer>SKB Teaching Lab · Designed to test one teaching experience before expanding.</footer></main>;
}
createRoot(document.getElementById('root')!).render(<TeachingLab/>);
