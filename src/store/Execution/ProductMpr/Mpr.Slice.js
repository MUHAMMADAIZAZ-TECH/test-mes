import { createSlice } from '@reduxjs/toolkit';
import { ProductMPR ,EquipmentList} from './Mpr.Apis';

const initialState = {
  loading: false,
  ProductMpr: [],
  Equipments:[],
  error: false,
  success: false,
};
const ProductMPRSlice = createSlice({
  name: 'ProductMPR',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(ProductMPR.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(ProductMPR.fulfilled, (state, action) => {
        state.loading = false;
        state.ProductMpr = action.payload;
      })
      .addCase(ProductMPR.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
      builder
      .addCase(EquipmentList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(EquipmentList.fulfilled, (state, action) => {
        state.loading = false;
        state.Equipments = action.payload;
      })
      .addCase(EquipmentList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default ProductMPRSlice.reducer;
