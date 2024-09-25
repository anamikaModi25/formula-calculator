/* eslint-disable no-useless-escape */
/* eslint-disable @typescript-eslint/no-explicit-any */
const mathFunctions: any = {
  sin: Math.sin,
  cos: Math.cos,
  tan: Math.tan,
  log: Math.log,
  sqrt: Math.sqrt,
};

const operations = [
  {
    regex: /(-?\d+(\.\d+)?)(\^)(-?\d+(\.\d+)?)/,
    operation: (a: any, b: any) => Math.pow(a, b),
  },
  {
    regex: /(-?\d+(\.\d+)?)(\/)(-?\d+(\.\d+)?)/,
    operation: (a: any, b: any) => a / b,
  },
  {
    regex: /(-?\d+(\.\d+)?)(\*)(-?\d+(\.\d+)?)/,
    operation: (a: any, b: any) => a * b,
  },
  {
    regex: /(-?\d+(\.\d+)?)(\+)(-?\d+(\.\d+)?)/,
    operation: (a: any, b: any) => a + b,
  },
  {
    regex: /(-?\d+(\.\d+)?)(\-)(-?\d+(\.\d+)?)/,
    operation: (a: any, b: any) => a - b,
  },
];

export const extractVariables = (formula: string) => {
  const variablePattern = /[a-zA-Z_]\w*/g;
  const detectedVariables = Array.from(new Set(formula.match(variablePattern) || []));
  return detectedVariables.filter((v) => !mathFunctions[v]);
};

export const convertToLatex = (formula: string) => {
  const latex = formula
    .replace(/\*/g, '&#215;')
    .replace(/\^(.)/g, '<sup>$1</sup>')
    .replace(/\\sin/g, 'sin')
    .replace(/\\cos/g, 'cos')
    .replace(/\\tan/g, 'tan')
    .replace(/\\log/g, 'log');
  return latex;
};

export const executeFormula = (expr: string | number) => {
  Object.keys(mathFunctions).forEach((fn) => {
    expr = (expr as string).replace(
      new RegExp(`${fn}\\(([^()]+)\\)`, 'g'),
      (_, param) => {
        const evaluatedParam = executeFormula(param);
        return mathFunctions[fn](evaluatedParam);
      }
    );
  });

  while ((expr as string).includes('(')) {
    expr = (expr as string).replace(/\(([^()]+)\)/g, (_, innerExpr) =>
      String(executeFormula(innerExpr) || '')
    );
    break;
  }

  for (const { regex, operation } of operations) {
    while (regex.test(expr as string)) {
      expr = (expr as string).replace(regex, (_, a, __, ___, b) =>
        operation(parseFloat(a), parseFloat(b))
      );
    }
  }

  return parseFloat(expr as string);
};
