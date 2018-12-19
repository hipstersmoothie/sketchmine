import { executeCommand as exec } from '@sketchmine/node-helpers';

export async function getVersionTags(latest: string | null = null): Promise<string[]> {
  const tagString = await exec('git tag --list');

  return tagString.split('\n')
  .filter((tag: string) => {
    // tag has to start with a v for version
    if (tag.startsWith('v') && !latest || tag >= latest) {
      // if no latest is provided return all
      // or if tag is greater than the latest tag
      return true;
    }
    return false;
  });
}
