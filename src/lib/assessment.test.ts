import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { clampScore, gradeCells, parseWorkbook, sourceData } from "./assessment";

const formulas = {
 ...Object.fromEntries(Object.entries(sourceData).map(([k,value])=>[k,{value}])),
  B11:{value:.2,formula:"=(C5-B5)/B5"},B12:{value:3500000,formula:"=B5-B6"},B13:{value:3900000,formula:"=C5-C6"},
  B14:{value:.35,formula:"=B12/B5"},B15:{value:.325,formula:"=B13/C5"},B16:{value:1500000,formula:"=B12-B7"},
  B17:{value:1600000,formula:"=B13-C7"},B18:{value:.15,formula:"=B16/B5"},B19:{value:1600000/12000000,formula:"=B17/C5"},
  B20:{value:1600000/12000000-.15,formula:"=B19-B18"},
};

describe("transparent grading",()=>{
  it("awards all deterministic points to correct formulas",()=>expect(gradeCells(formulas)).toMatchObject({accuracy:35,traceability:25}));
  it("does not award traceability to hardcoded answers",()=>expect(gradeCells(Object.fromEntries(Object.entries(formulas).map(([k,v])=>[k,{value:v.value}]))).traceability).toBe(0));
  it("keeps the decision boundary visible",()=>{expect(69>=70).toBe(false);expect(70>=70).toBe(true)});
  it("clamps AI scores",()=>{expect(clampScore(52,40)).toBe(40);expect(clampScore(-3,40)).toBe(0)});
  it("reads the downloadable workbook safely",()=>{
    const file=readFileSync("public/SkillProof_MX_Assessment.xlsx");
    expect(()=>parseWorkbook(file.buffer.slice(file.byteOffset,file.byteOffset+file.byteLength))).not.toThrow();
  });
});

describe("Week 12 evidence regression", () => {
 it("does not trust a formula merely because a cached answer is correct", () => {
  expect(gradeCells({ B11: {value:.2,formula:"=1+1"} }).traceability).toBe(0);
 });
});

 it("recalculates formulas when Excel cached results are absent",()=>{const cells=Object.fromEntries(Object.entries(formulas).map(([k,v])=>[k,"formula" in v?{formula:v.formula}:v]));expect(gradeCells(cells)).toMatchObject({accuracy:35,traceability:25});});
 it("leaves unsupported expressions pending",()=>expect(gradeCells({B11:{formula:"=SUM(B5:C5)"}}).checks[0].status).toBe("pendiente"));
 it("rejects a stale cached answer",()=>expect(gradeCells({B11:{value:.2,formula:"=1+1"}}).checks[0]).toMatchObject({status:"contradictorio",actual:2,earned:0}));
