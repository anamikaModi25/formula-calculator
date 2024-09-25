/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-useless-escape */
import React, { useEffect, useState } from 'react';

import { Box, Button, Stack, Typography } from '@mui/material';
import { FormProvider, useFieldArray, useForm, useWatch } from 'react-hook-form';
import { useDebounce } from 'use-debounce';

import TextFieldElementComponent from '../TextFieldElement';
import { updateFormula } from './formulaSlice';
import { convertToLatex, executeFormula, extractVariables } from './helper';
import ShowSavedFormula from './ShowSavedFormula';
import { useAppDispatch } from '../../services/store';

const FormulaCalculator = () => {
  const dispatch = useAppDispatch();

  const methods = useForm();
  const { watch, control } = methods;
  const { fields, remove, replace } = useFieldArray({
    control,
    name: 'variable',
  });

  const formula = watch('formula') || '';

  const fieldValue = useWatch({
    name: 'variable',
    control,
  });

  const [fieldValues] = useDebounce(fieldValue, 1000);
  const [debounceFormula] = useDebounce(formula, 1000);

  const [latexFormula, setLatexFormula] = useState('');
  const [result, setResult] = useState<string | number | null>(null);

  useEffect(() => {
    const detectedVars = extractVariables(formula);
    if (detectedVars.length) {
      const fields: any = [];
      const fieldValues = detectedVars.reduce((acc: any, variable: any) => {
        acc = {
          label: variable,
          value: 0,
        };
        fields.push(acc);
        return fields;
      }, {});
      replace(fieldValues);
    } else {
      remove(0);
    }
    setLatexFormula(convertToLatex(formula));
    setResult(null);
  }, [formula, remove, replace]);

  useEffect(() => {
    if (fieldValues?.length === 0) return;

    if (fieldValues) {
      try {
        let formulaWithValues = debounceFormula;
        fieldValues.forEach((field: any) => {
          const sanitizedValue = parseFloat(field.value as string);
          formulaWithValues = formulaWithValues.replace(
            new RegExp(field.label, 'g'),
            String(sanitizedValue)
          );
        });
        const evaluatedResult = executeFormula(formulaWithValues);
        setResult(evaluatedResult);
      } catch {
        setResult('Error in calculation');
      }
    }
  }, [fieldValues, debounceFormula]);

  const saveFormula = () => {
    dispatch(updateFormula({ formula: formula, latexFormula: latexFormula }));
  };

  return (
    <Stack>
      <Typography
        component="h2"
        sx={{
          fontSize: '30px',
          textAlign: 'center',
          padding: '10px',
          borderBottom: '1px solid #1976d21a',
          color: 'navy',
        }}
      >
        Formula Calculator
      </Typography>
      <Stack padding="20px" gap={3}>
        <Stack
          direction="row"
          sx={{
            marginBottom: '20px',
            fontSize: '24px',
            color: 'navy',
            flexWrap: 'wrap',
          }}
          alignItems="center"
          gap={2}
        >
          <Typography sx={{ fontSize: '20px', fontWeight: 'bold' }}>Formula:</Typography>
          <Typography
            className="latex"
            sx={{ fontSize: '24px', fontWeight: '500' }}
            dangerouslySetInnerHTML={{ __html: latexFormula }}
          />
        </Stack>
        <FormProvider {...methods}>
          <Stack direction="row" gap={2} width="100%">
            <TextFieldElementComponent
              label="Enter Formula"
              name="formula"
              placeholder="e.g., sin(a) * b + log(c)"
              fullWidth
            />

            <Button variant="contained" onClick={saveFormula} sx={{ minWidth: '170px' }}>
              Save Formula
            </Button>
          </Stack>
          <Stack direction="row" flexWrap="wrap" gap={2}>
            {fields.map((field: any, index) => (
              <Stack key={field.id} style={{ marginBottom: '10px' }}>
                <TextFieldElementComponent
                  label={`Enter value of ${field.label}`}
                  type="number"
                  name={`variable.${index}.value`}
                  control={control}
                />
              </Stack>
            ))}
          </Stack>
          {(result || result === 0) && (
            <Stack
              direction="row"
              gap={2}
              sx={{ marginTop: '20px', fontSize: '18px', alignItems: 'center' }}
            >
              <strong>Result:</strong>
              <Box
                border="1px solid #d3cece"
                padding="2px 10px"
                sx={{ background: '#bde0ff', minWidth: '200px' }}
              >
                {result}
              </Box>
            </Stack>
          )}
          <ShowSavedFormula />
        </FormProvider>
      </Stack>
    </Stack>
  );
};

export default FormulaCalculator;
