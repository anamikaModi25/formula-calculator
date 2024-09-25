/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

import { Button, List, ListItem, Stack, useMediaQuery } from '@mui/material';
import { useFormContext } from 'react-hook-form';

import { selectFormulas } from './formulaSlice';
import { useTypedSelector } from '../../services/store';

const ShowSavedFormula = () => {
  const { formulas: savedFormulas } = useTypedSelector(selectFormulas);
  const matches = useMediaQuery('(min-width:600px)');
  const { setValue } = useFormContext();

  if (savedFormulas.length > 0) {
    return (
      <Stack>
        <h3>Saved Formulas:</h3>
        <List>
          {savedFormulas.map((savedFormula: any, index: number) => (
            <ListItem
              sx={{
                width: matches ? '50%' : '100%',
                justifyContent: 'space-between',
                fontSize: '24px',
                paddingTop: 0,
                paddingBottom: 0,
                borderBottom: '1px solid #e7dbdb',
              }}
              key={`saved-formula-${index}`}
            >
              <p
                className="latex"
                dangerouslySetInnerHTML={{
                  __html: savedFormula.latexFormula,
                }}
              />
              <Button
                variant="outlined"
                onClick={() => setValue('formula', savedFormula.formula)}
              >
                Use
              </Button>
            </ListItem>
          ))}
        </List>
      </Stack>
    );
  } else {
    return null;
  }
};

export default ShowSavedFormula;
