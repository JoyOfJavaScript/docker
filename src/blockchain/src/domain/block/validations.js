import { curry } from '../../lib/fp/combinators'

export const checkLength = curry((len, { hash }) => () => hash.length === len)
export const checkNoTampering = b => b.hash === b.calculateHash()
export const checkDifficulty = curry(
  (difficulty, { hash }) =>
    hash.substring(0, difficulty) === '0'.repeat(difficulty)
)
export const checkLinkage = curry((p, b) => b.previousHash === p.hash)
export const checkTimestamps = curry((p, b) => b.timestamp >= p.timestamp)
