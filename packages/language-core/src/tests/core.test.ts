import { test, describe } from 'node:test';
import assert from 'node:assert';
import { runNplang, translateSource, parseProgram } from '../index.js';

describe('NP-LANG Core Engine Tests', () => {
  test('Equivalence: Concise, Natural English, and Yoruba execute identically', () => {
    const conciseCode = `
      let score = 10
      score = score + 5
      show score
    `;

    const naturalEnCode = `
      I have a number called score. It is 10.
      Add 5 to score.
      Show score.
    `;

    const yorubaCode = `
      Jẹ ki score jẹ 10.
      Fi 5 kún score.
      Fi score hàn.
    `;

    const spanishCode = `
      Tengo un número llamado score. Es 10.
      Sumar 5 a score.
      Mostrar score.
    `;

    const resConcise = runNplang(conciseCode);
    const resEn = runNplang(naturalEnCode);
    const resYo = runNplang(yorubaCode);
    const resEs = runNplang(spanishCode);

    assert.strictEqual(resConcise.success, true);
    assert.strictEqual(resEn.success, true);
    assert.strictEqual(resYo.success, true);
    assert.strictEqual(resEs.success, true);

    assert.deepStrictEqual(resConcise.output, ['15']);
    assert.deepStrictEqual(resEn.output, ['15']);
    assert.deepStrictEqual(resYo.output, ['15']);
    assert.deepStrictEqual(resEs.output, ['15']);

    assert.strictEqual(resConcise.variables.score, 15);
    assert.strictEqual(resEn.variables.score, 15);
    assert.strictEqual(resYo.variables.score, 15);
    assert.strictEqual(resEs.variables.score, 15);
  });

  test('Conditional execution across styles', () => {
    const testCases = [
      'let score = 20\nif score > 10: show "Winner"',
      'I have a number called score. It is 20.\nIf score is greater than 10, show "Winner".',
      'Tengo un número llamado score. Es 20.\nSi score es mayor que 10, mostrar "Winner".',
      'Jẹ ki score jẹ 20.\nBí score bá ju 10 lọ, fi "Winner" hàn.',
    ];

    for (const code of testCases) {
      const res = runNplang(code);
      assert.strictEqual(res.success, true);
      assert.deepStrictEqual(res.output, ['Winner']);
    }
  });

  test('Repetition loop execution', () => {
    const conciseRepeat = `
      repeat 3: show "Hello"
    `;
    const naturalRepeat = `
      Do this 3 times: show "Hello".
    `;

    const res1 = runNplang(conciseRepeat);
    const res2 = runNplang(naturalRepeat);

    assert.strictEqual(res1.success, true);
    assert.strictEqual(res2.success, true);
    assert.deepStrictEqual(res1.output, ['Hello', 'Hello', 'Hello']);
    assert.deepStrictEqual(res2.output, ['Hello', 'Hello', 'Hello']);
  });

  test('Semantic diagnostics: undeclared variable produces friendly error', () => {
    const invalidCode = `show unknownVar`;
    const res = runNplang(invalidCode);

    assert.strictEqual(res.success, false);
    assert.strictEqual(res.errors.length > 0, true);
    assert.match(res.errors[0].message, /Variable 'unknownVar' has not been created yet/);
    assert.ok(res.errors[0].suggestion);
  });

  test('Semantic diagnostics: division by zero is caught', () => {
    const divByZero = `
      let x = 10
      let y = x / 0
    `;
    const res = runNplang(divByZero);
    assert.strictEqual(res.success, false);
    assert.match(res.errors[0].message, /Cannot divide by zero/);
  });

  test('Bidirectional translation', () => {
    const naturalEn = `I have a number called score. It is 10.\nAdd 5 to score.\nShow score.`;
    const concise = translateSource(naturalEn, 'concise');
    assert.match(concise, /let score = 10/);
    assert.match(concise, /score = score \+ 5/);
    assert.match(concise, /show score/);

    const spanish = translateSource(concise, 'natural-es');
    assert.match(spanish, /Tengo un número/);
    assert.match(spanish, /Sumar 5 a score/);
    assert.match(spanish, /Mostrar score/);

    const yoruba = translateSource(concise, 'natural-yo');
    assert.match(yoruba, /Mo ní nọ́mbà/);
    assert.match(yoruba, /Fi 5 kún score/);
    assert.match(yoruba, /Fi score hàn/);

    const aiAst = translateSource(concise, 'ai-ast');
    const parsedAst = JSON.parse(aiAst);
    assert.strictEqual(parsedAst.type, 'Program');
    assert.strictEqual(parsedAst.body.length, 3);
  });
});
