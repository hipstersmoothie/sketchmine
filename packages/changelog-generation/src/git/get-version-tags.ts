import { executeCommand as exec } from '@sketchmine/node-helpers';

export async function getVersionTags(): Promise<string[]> {
  const tagString = await exec('git tag --list');
  return tagString.split('\n')
    .filter((tag: string) => tag.startsWith('v')); // tag has to start with a v for version
}
