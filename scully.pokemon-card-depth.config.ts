import { ScullyConfig } from '@scullyio/scully';

export const config: ScullyConfig = {
  projectRoot: './src',
  projectName: 'pokemon-card-depth',
  distFolder: './dist/pokemon-card-depth', // output directory of your Angular build artifacts
  outDir: './dist/static', // directory for scully build artifacts
  defaultPostRenderers: [],
  routes: {},
};
