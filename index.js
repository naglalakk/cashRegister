/**
 * Design a cash register drawer function checkCashRegister()
 * that accepts purchase price as the first argument(price),
 * payment as the second argument(cash),
 * and cash -in -drawer(cid) as the third argument.
 * The checkCashRegister() function should always return an object
 * with a status key and a change key.
 *
 * Return {status: "INSUFFICIENT_FUNDS", change: []} if cash-in-drawer is less than the change due, or if you cannot return the exact change. 
 * Return {status: "CLOSED", change: [...]} with cash-in-drawer as the value for the key change if it is equal to the change due. 
 * Otherwise, return {status: "OPEN", change: [...]}, with the change due in coins and bills, 
 * sorted in highest to lowest order, as the value of the change key.
 * */

import {Decimal} from 'decimal.js'

const CURRENCY_UNITS = [
  ['PENNY', 0.01],
  ['NICKEL', 0.05],
  ['DIME', 0.1],
  ['QUARTER', 0.25],
  ['ONE', 1],
  ['FIVE', 5],
  ['TEN', 10],
  ['TWENTY', 20],
  ['ONE HUNDRED', 100]
]

export function checkCashRegister(price, cash, cid) {
  var changeDue = Decimal.sub(cash, price)
  var returnCID = []
  const units = CURRENCY_UNITS.reverse()
  for(var i = 0; i < units.length; i++) {
    let unit = units[i][0]
    let rate = units[i][1]
    let amount = 0
    if(changeDue > 0) {
      // For each rate, check if the division of 
      // change / unit rate is divisible at least one time
      // if not we disregard the unit rate
      // e.g. 0.4 / 0.1 = 4
      // we can use a unit of a rate 0.1 x 4 times
      amount = Math.floor(Decimal.div(changeDue, rate))
      if(amount > 0) {
        // Find the corresponding cid rate
        const hit = cid.filter(a => a[0] === unit)
        if(hit.length) {
          // cidAmount is the amount of a particular
          // unit from the input cid e.g. ['Dime', 3.1]
          const cidAmount = hit[0][1]
          // Rate amount is the amount of units
          // we're subtracting e.g.
          // if we take 4 Dimes, the rate amount is
          // 4 * 0.1 = 0.4
          const rateAmount  = Decimal.mul(amount, rate)
          // Flag to check if cid has enough
          // reserves for a particular unit
          // For example, if we are taking 4 DIMES
          // with cid = ['DIME', 3.1] we're checking
          // if 0.4 < 3.1, which is true
          // If for some reason we need to take
          // 32 Dimes we would have 3.2 < 3.1 = false
          const cidFinalAmount = Decimal.mul(cidAmount, rate)
          const hasReserves = rateAmount < cidFinalAmount
          if(hasReserves) {
            changeDue = Decimal.sub(changeDue, rateAmount)
          } else {
            changeDue = Decimal.sub(changeDue, cidFinalAmount)
          }
        }
      } 
    }
    returnCID.push([unit, amount])
  }
  if(changeDue != 0) {
    return { status: 'INSUFFICIENT_FUNDS', change: [] }
  } else if(JSON.stringify(returnCID) === JSON.stringify(cid.reverse())) {
    return { status: 'CLOSED', change: cid }
  } else {
    return { status: 'OPEN', change: returnCID }
  }
}
