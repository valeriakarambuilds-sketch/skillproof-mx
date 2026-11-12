import { describe, expect, it } from 'vitest';
import { calculateScenario, DEFAULTS, parseScenarios, serializeScenarios, toDraft, validateInputs, valueComparison } from './pricing';
describe('per-vacancy pricing',()=>{
 it('calculates default gross and delivery contribution separately',()=>{
  expect(calculateScenario(DEFAULTS)).toMatchObject({buyers:10,vacancies:10,monthly:1800,annualized:21600,unitCost:160,variableCost:1600,contribution:200,afterFixed:200});
 });
 it('does not turn an occasional purchase into a monthly renewal',()=>{
  expect(calculateScenario({...DEFAULTS,frequency:.25}).monthly).toBe(450);
 });
 it.each(['employers','conversion','price'] as const)('supports zero %s without NaN margin',key=>{
  const r=calculateScenario({...DEFAULTS,[key]:0});expect(r.monthly).toBe(0);expect(r.margin).toBeNull();
 });
 it('keeps real negative contribution visible',()=>expect(calculateScenario({...DEFAULTS,humanMinutes:60}).contribution).toBe(-1300));
 it.each(['', ' ', '-1', 'Infinity', 'NaN', '101'])('rejects invalid conversion %s',conversion=>expect(validateInputs({...toDraft(DEFAULTS),conversion}).inputs).toBeNull());
 it('accepts 100% and rejects fractional company counts',()=>{
  expect(calculateScenario({...DEFAULTS,conversion:100}).buyers).toBe(100);
  expect(validateInputs({...DEFAULTS,employers:1.5}).inputs).toBeNull();
 });
 it('does not conflate benefit-price and total-cost ratios',()=>{
  const r=valueComparison();expect(r.benefitPrice).toBe(10);expect(r.costRatio).toBeCloseTo(2.173913);expect(r.netSaving).toBe(1620);
 });
});
describe('untrusted local storage',()=>{
 const item={id:'example-1',createdAt:'2026-11-12T12:00:00.000Z',inputs:DEFAULTS};
 it('roundtrips only bounded numeric scenarios',()=>expect(parseScenarios(serializeScenarios([item]))).toEqual([item]));
 it.each(['{','[]','{"version":2,"items":[]}','{"version":1,"items":[{}]}'])('rejects corrupt data',raw=>expect(()=>parseScenarios(raw)).toThrow());
 it('rejects corrupted prices and excessive snapshots',()=>{
  expect(()=>serializeScenarios([{...item,inputs:{...DEFAULTS,price:-1}}])).toThrow();
  expect(()=>serializeScenarios(Array.from({length:11},(_,i)=>({...item,id:`id-${i}`})))).toThrow();
 });
 it('rejects duplicate ids and strips unknown fields',()=>{
  expect(()=>serializeScenarios([item,item])).toThrow();
  expect(parseScenarios(JSON.stringify({version:1,items:[{...item,name:'not retained'}]}))[0]).not.toHaveProperty('name');
 });
});
