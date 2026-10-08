// Structural scaffolding only. These are prompts that teach PF form — never
// pre-written arguments or evidence, per the content & integrity policy.

import { type CaseDoc, newId } from './caseDoc'

export function starterCase(): CaseDoc {
  const now = new Date().toISOString()
  return {
    id: newId(),
    title: 'New case (guided template)',
    resolution: '',
    side: 'PRO',
    createdAt: now,
    updatedAt: now,
    framework:
      'Tell the judge how to evaluate the round. What is the standard — cost-benefit, ' +
      'net well-being, rights protection? Why is it the right lens for this resolution?',
    definitions: [
      {
        term: '',
        definition: 'Define any term the round will turn on, and cite where the definition comes from.',
      },
    ],
    contentions: [
      {
        id: newId(),
        title: '',
        claim: 'State the argument in one sentence a judge could write on their flow.',
        blocks: [
          {
            id: newId(),
            type: 'warrant',
            text:
              'Explain WHY the claim is true. Walk through the mechanism step by step — ' +
              'what causes what, and why that link holds.',
          },
          {
            id: newId(),
            type: 'evidence',
            text: 'Paste the card, stat, or quote that supports the warrant above.',
            citation: 'Author, date, outlet',
          },
          {
            id: newId(),
            type: 'warrant',
            text:
              'A contention can carry more than one warrant. Add a second, independent ' +
              'reason the claim holds, so losing one does not lose the contention.',
          },
          {
            id: newId(),
            type: 'impact',
            text:
              'Say why it matters and how it weighs — scale, probability, timeframe, ' +
              'and why it outweighs what the other side will claim.',
          },
        ],
      },
      {
        id: newId(),
        title: '',
        claim: '',
        blocks: [
          { id: newId(), type: 'warrant', text: '' },
          { id: newId(), type: 'impact', text: '' },
        ],
      },
    ],
    settings: { targetWordCount: 750, tone: 'analytical' },
  }
}
