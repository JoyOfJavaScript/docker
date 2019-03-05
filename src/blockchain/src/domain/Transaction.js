import { Failure, Success } from '../lib/fp/data/validation'
import HasHash from './shared/HasHash'
import HasSignature from './shared/HasSignature'
import HasValidation from './shared/HasValidation'

/**
 * A transaction holds information (keys) identifying who is making the payment
 * or relinquishing an asset, the monetary value being transacted and to whom is sent to.
 * Ownership of an asset (like money) is transfered via transactions.
 */
export default class Transaction {
  timestamp = Date.now()
  nonce = 0
  id

  constructor (sender, recipient, funds, description = 'Generic') {
    this.sender = sender
    this.recipient = recipient
    this.funds = funds
    this.description = description
    this.id = this.calculateHash()
  }

  /**
   * Gets the numerical amount of the funds
   * @return {Number} Amount number
   */
  amount () {
    return this.funds.amount
  }

  /**
   * Gets the currency
   * @return {String} Currency string
   */
  currency () {
    return this.funds.currency
  }

  /**
   * Displays a friendly description of this transaction for reporting purposes
   * @return {String} A friendly string representation
   */
  displayTransaction () {
    return `Transaction ${this.description} from ${this.sender} to ${
      this.recipient
    } for ${this.funds.toString()}`
  }

  isValid () {
    const isDataValid = this.id !== undefined
    const isSignatureValid = this.verifySignature()
    if (isDataValid && isSignatureValid) {
      return Success(true)
    } else {
      return isDataValid
        ? Failure([
          `Failed transaction signature check for transaction: ${this.id}`
        ])
        : Failure([`Invalid transaction: ${this.sender}`])
    }
  }
  /**
   * Returns a minimal JSON represetation of this object
   * @return {Object} JSON object
   */
  toJSON () {
    return {
      from: this.sender,
      to: this.recipient,
      id: this.id
    }
  }

  get [Symbol.for('version')] () {
    return '1.0'
  }

  [Symbol.iterator] () {
    return {
      next: () => ({ done: true })
    }
  }
}

Object.assign(
  Transaction.prototype,
  HasHash(['timestamp', 'sender', 'recipient', 'funds']),
  HasSignature(['sender', 'recipient', 'funds']),
  HasValidation()
)

// https://medium.com/programmers-blockchain/creating-your-first-blockchain-with-java-part-2-transactions-2cdac335e0ce
// https://nodejs.org/api/crypto.html#crypto_class_sign
