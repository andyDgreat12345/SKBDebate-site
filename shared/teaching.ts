// Authored demonstration content, not researched evidence or a live AI response.
export const lesson = {
  id: 'challenge-the-link', version: 1,
  title: 'Challenge the link, not just the example.',
  objective: 'Identify an unstated assumption and write a rebuttal that addresses it.',
  nodes: [
    {id:'observation', label:'Observation', text:'Some students check phones during independent work.'},
    {id:'assumption', label:'Unstated assumption', text:'A school-wide restriction would reduce distraction more effectively than narrower classroom rules.'},
    {id:'conclusion', label:'Policy conclusion', text:'The school should restrict phone use throughout the school day.'},
  ],
  scenes: [
    {title:'Hear the argument', focus:'observation', seconds:12, transcript:'Consider this fictional classroom argument. Some students check phones during independent work. Therefore, the school should restrict phone use throughout the school day. The observation is an example, not research evidence.'},
    {title:'Reveal the missing step', focus:'assumption', seconds:14, transcript:'The observation alone does not establish the policy conclusion. One unstated assumption is that a school-wide restriction would work better than narrower classroom rules. Other questions include enforcement, access, and trade-offs.'},
    {title:'Aim the rebuttal', focus:'conclusion', seconds:14, transcript:'Saying that one student uses a phone responsibly does not refute a claim about some students. A more direct response asks why this broad policy is preferable to a narrower alternative. You can challenge that comparison without denying the observation.'},
  ],
  questions: [
    {id:'example', label:'Why isn’t one counterexample enough?', answer:'The observation says “some students,” not “every student.” One responsible user can coexist with some distracted users. That example may matter to costs or exceptions, but it does not by itself defeat the observation.', focus:'observation'},
    {id:'assumption', label:'Could the assumption be different?', answer:'Yes. An argument map is an interpretation. This lesson selects one comparative assumption. A speaker might also rely on assumptions about enforcement or the value of attention. Ask them to clarify before assigning a position.', focus:'assumption'},
    {id:'evidence', label:'What evidence would help?', answer:'Look for evidence comparing broad restrictions with narrower alternatives in relevant settings, including benefits and costs. This demonstration supplies no studies and makes no claim that either policy is proven.', focus:'conclusion'},
  ],
  choices: [
    {id:'counterexample', label:'“My friend uses a phone responsibly.”', feedback:'This raises a possible exception, but does not directly challenge whether the broad restriction beats narrower rules. Try the option that compares policies.', advances:false},
    {id:'comparison', label:'“Why would an all-day restriction work better than classroom rules?”', feedback:'This targets the missing policy comparison. It requests justification; it does not prove the restriction is wrong.', advances:true},
    {id:'denial', label:'“No student is ever distracted by a phone.”', feedback:'This disputes the observation with an unsupported absolute claim. A stronger response can accept the observation while questioning the conclusion.', advances:false},
  ],
} as const;

export type TeachingState = {scene:number; playing:boolean; stage:'lesson'|'practice'|'reflection'; choice:string|null; initial:string; revision:string};
export const initialTeachingState:TeachingState = {scene:0,playing:false,stage:'lesson',choice:null,initial:'',revision:''};
export type TeachingAction = {type:'play'|'pause'|'next'|'practice'|'reset'}|{type:'scene';index:number}|{type:'choose';id:string}|{type:'write';field:'initial'|'revision';text:string};
export function teachingReducer(state:TeachingState, action:TeachingAction):TeachingState {
  switch(action.type){
    case 'play': return state.stage==='lesson'?{...state,playing:true}:state;
    case 'pause': return {...state,playing:false};
    case 'scene': return Number.isInteger(action.index)&&action.index>=0&&action.index<lesson.scenes.length?{...state,scene:action.index,playing:false,stage:'lesson'}:state;
    case 'next': return state.scene<lesson.scenes.length-1?{...state,scene:state.scene+1}:{...state,playing:false,stage:'practice'};
    case 'practice': return {...state,playing:false,stage:'practice'};
    case 'choose': {const choice=lesson.choices.find(c=>c.id===action.id);return choice?{...state,choice:choice.id,stage:choice.advances?'reflection':'practice',playing:false}:state;}
    case 'write': return {...state,[action.field]:action.text.slice(0,5000)};
    case 'reset': return {...initialTeachingState};
  }
}
