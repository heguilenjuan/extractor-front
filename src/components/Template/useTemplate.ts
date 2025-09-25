// useTemplateSteps.ts
import { useState } from 'react';
export type Step = 'draw' | 'define';

export function useTemplateSteps() {
  const [step, setStep] = useState<Step>('draw');
  const [templateName, setTemplateName] = useState<string>('');
  const goDefine = () => setStep('define');
  const goDraw = () => setStep('draw');
  return { step, goDefine, goDraw, templateName, setTemplateName };
}
