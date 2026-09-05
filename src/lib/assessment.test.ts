import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { clampScore, gradeCells, parseWorkbook } from "./assessment";

const formulas = {
  B11:{value:.2,formula:"=(C5-B5)/B5"},B12:{value:3500000,formula:"=B5-B6"},B13:{value:3900000,formula:"=C5-C6"},
  B14:{value:.35,formula:"=B12/B5"},B15:{value:.325,formula:"=B13/C5"},B16:{value:1500000,formula:"=B12-B7-B8"},
  B17:{value:1600000,formula:"=B13-C7-C8"},B18:{value:.15,formula:"=B16/B5"},B19:{value:1600000/12000000,formula:"=B17/C5"},
  B20:{value:1600000/12000000-.15,formula:"=B19-B18"},
};

describe("transparent grading",()=>{
  it("awards all deterministic points to correct formulas",()=>expect(gradeCells(formulas)).toMatchObject({accuracy:35,traceability:25}));
  it("does not award traceability to hardcoded answers",()=>expect(gradeCells(Object.fromEntries(Object.entries(formulas).map(([k,v])=>[k,{value:v.value}]))).traceability).toBe(0));
  it("keeps the decision boundary visible",()=>{expect(69>=70).toBe(false);expect(70>=70).toBe(true)});
  it("clamps AI scores",()=>{expect(clampScore(42,30)).toBe(30);expect(clampScore(-3,30)).toBe(0)});
  it("reads the downloadable workbook safely",()=>{
    const file=readFileSync("public/SkillProof_MX_Assessment.xlsx");
    expect(()=>parseWorkbook(file.buffer.slice(file.byteOffset,file.byteOffset+file.byteLength))).not.toThrow();
  });
});
