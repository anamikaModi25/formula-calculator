import { createSlice } from '@reduxjs/toolkit';

import { RootState } from '../../services/store';

type SliceState = {
  formulas: { formula: string; latexFormula: string }[];
};

const initialState: SliceState = {
  formulas: [],
};

const slice = createSlice({
  name: 'formula',
  initialState,
  reducers: {
    updateFormula: (state, { payload }) => {
      state.formulas = [...state.formulas, payload];
    },
  },
});

export const { updateFormula } = slice.actions;

export default slice.reducer;

export const selectFormulas = (state: RootState) => state.formulas;
