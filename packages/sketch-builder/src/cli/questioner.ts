import inquirer from 'inquirer';
import inquirerFuzzyPath from 'inquirer-fuzzy-path';
import { Subject } from 'rxjs';

import { questions } from './questions';

interface Answer {
  name: string;
  answer: any;
}

export async function questioner(): Promise<{[key: string]: any}> {
  const prompt$ = new Subject<{}>();

  const answers: { [key: string]: any } = {};

  // register the fuzzy path module
  inquirer.registerPrompt('fuzzyPath', inquirerFuzzyPath);
  inquirer.prompt(prompt$).ui.process.subscribe((data: Answer) => {
    answers[data.name] = data.answer;

    switch (data.name) {
      case 'hasConfigFile':
        data.answer === false ? prompt$.next(questions.url) : prompt$.next(questions.config);
        break;
      case 'url':
        prompt$.next(questions.outFile);
        break;
      case 'outFile':
        prompt$.next(questions.saveConfig);
        break;
      default:
        prompt$.complete();
    }
  });

  // initial question for a config file
  prompt$.next(questions.hasConfigFile);

  await prompt$.toPromise();
  return answers;
}
