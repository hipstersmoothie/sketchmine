import { main as AMP } from './angular-meta-parser/main';

export default async function main() {
  const meta = await AMP(
    'src/angular-meta-parser/_tmp',
    'src/lib',
    'meta-information.json',
    'index.ts',
    true,
  );
}

main()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
