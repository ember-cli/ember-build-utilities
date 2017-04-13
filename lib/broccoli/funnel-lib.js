import Funnel from 'broccoli-funnel';
import findLib from './funnel-lib';

export default function funnelLib(name) {
  let libPath, options;
  if (arguments.length > 2) {
    libPath = arguments[1];
    options = arguments[2];
  } else {
    options = arguments[1];
  }

  return new Funnel(findLib(name, libPath), options);
}
