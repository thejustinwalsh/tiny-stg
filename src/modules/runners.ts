import { Runner } from './types';
import * as patterns from './patterns';

import default_pattern from './pattern/default';
import directional_pattern from './pattern/directional';

const runners: Record<string, Runner> = {
  [patterns.DEFAULT]: default_pattern,
  [patterns.DIRECTIONAL]: directional_pattern,
};
export default runners;
