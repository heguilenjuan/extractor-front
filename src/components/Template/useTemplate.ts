// useTemplateSteps.ts
import { useState } from 'react';
export type Step = 'draw' | 'define' | 'review'| 'create';

export function useTemplateSteps() {
  const [step, setStep] = useState<Step>('draw');
  const [templateName, setTemplateName] = useState<string>('');
  const goDefine = () => setStep('define');
  const goDraw = () => setStep('draw');
  const goReview = () => setStep('review');
  const goCreate = () => setStep('create');
  
  return { step, goDefine, goDraw, goReview, goCreate, templateName, setTemplateName };
}
