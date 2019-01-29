
import { executeCommand } from '@sketchmine/node-helpers';
import { GitUser } from '../interfaces';
import { resolve } from 'path';

export class GitClient {
  cwd: string;
  public currentBranch = 'master';
  private user: GitUser;

  constructor(cwd?: string) {
    const _cwd = cwd || process.cwd();
    this.cwd = resolve(_cwd);
  }

  addCredentials(user: GitUser) {
    if (!user.username || user.username.length < 1) {
      throw Error('Please provide a valid username for the user!');
    }
    if (!user.password || user.password.length < 1) {
      throw Error('Please provide a password for the user!');
    }
    this.user = user;
  }

  async checkoutBranch(name: string, newBranch = false): Promise<void> {
    const flags = [];

    if (newBranch) { flags.push('-b'); }

    await this.exec(`git checkout ${flags.join(' ')} ${name}`);
    console.log(`git checkout ${flags.join(' ')} ${name}`);
    this.currentBranch = name;

    await this.exec('git lfs pull origin');
    console.log('git lfs pull origin');
  }

  async commit(message: string, push = true): Promise<void> {
    await this.exec('git add .'); // Stage all changes
    console.log('git add .');

    await this.exec(`git commit -m "${message}"`);
    console.log(`git commit -m "${message}"`);

    if (push) {
      await this.push();
    }
  }

  async push(): Promise<void> {
    const remote = await this.getAuthenticatedRemote();
    await this.exec(`git push ${remote} HEAD:refs/heads/${this.currentBranch}`);
    console.log(`git push ${remote} HEAD:refs/heads/${this.currentBranch}`)
  }

  private async getAuthenticatedRemote(): Promise<string> {
    const remote = await this.getRemoteUrl();
    if (!this.user) {
      throw Error('Please Provide a user for an authenticated Action!');
    }

    if (!remote) {
      throw Error('Please provide a remote URL');
    }

    const url = new URL(remote);
    return `${url.protocol}//${this.user.username}:${this.user.password}@${url.host}${url.pathname}`;
  }

  private async getRemoteUrl(): Promise<string | undefined> {
    const url = await this.exec('git config --get remote.origin.url');
    return url && url.length ? url : undefined;
  }

  private async exec(command: string) {
    return await executeCommand(command, this.cwd);
  }
}
