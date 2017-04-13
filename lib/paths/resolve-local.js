import { join } from 'path';
export default function _resolveLocal(root, to) {
  if (to[0] === '/') {
    return to;
  }

  return join(root, to);
}
