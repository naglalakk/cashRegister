import test from 'ava';
import {checkCashRegister} from './index.js';

test('checkCashRegister - OPEN', t => {
  const expectedCID = [
    [ 'ONE HUNDRED', 0 ],
    [ 'TWENTY', 0 ],
    [ 'TEN', 0 ],
    [ 'FIVE', 0 ],
    [ 'ONE', 0 ],
    [ 'QUARTER', 1 ],
    [ 'DIME', 1 ],
    [ 'NICKEL', 1 ],
    [ 'PENNY', 0 ]
  ]
  const expectedObject = { status: 'OPEN', change: expectedCID }
	const result = checkCashRegister(19.6, 20, [
    ["PENNY", 1.01],
    ["NICKEL", 2.05],
    ["DIME", 3.1],
    ["QUARTER", 4.25],
    ["ONE", 90],
    ["FIVE", 55],
    ["TEN", 20],
    ["TWENTY", 60],
    ["ONE HUNDRED", 100]
  ]);
  t.deepEqual(expectedObject, result);
});
test('checkCashRegister - INSUFFICIENT FUNDS', t => {
  const expectedCID = []
  const expectedObject = { status: 'INSUFFICIENT_FUNDS', change: expectedCID }
	const result = checkCashRegister(100, 150, [
    ["PENNY", 0],
    ["NICKEL", 0],
    ["DIME", 0],
    ["QUARTER", 0],
    ["ONE", 0],
    ["FIVE", 0],
    ["TEN", 0],
    ["TWENTY", 0],
    ["ONE HUNDRED", 1]
  ]);
  t.deepEqual(expectedObject, result);
});
test('checkCashRegister - CLOSED', t => {
  const expectedCID = [
    ["PENNY", 0],
    ["NICKEL", 0],
    ["DIME", 0],
    ["QUARTER", 0],
    ["ONE", 0],
    ["FIVE", 0],
    ["TEN", 1],
    ["TWENTY", 2],
    ["ONE HUNDRED", 0]
  ]
	const result = checkCashRegister(100, 150, expectedCID);
  const expectedObject = { status: 'CLOSED', change: expectedCID }
  t.deepEqual(expectedObject, result);
});
