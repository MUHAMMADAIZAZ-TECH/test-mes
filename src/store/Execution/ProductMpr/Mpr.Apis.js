import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../api/api';
import Equipements from '../../../pages/Execution/Transactions/AssignEquipment/Equipments.json'
export const ProductMPR = createAsyncThunk('Product/Mpr', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get(`/ProductMPR`);
    return response.data;
  } catch (error) {
    throw rejectWithValue(error);
  }
});

export const EquipmentList = createAsyncThunk('EquipmentList', async (_, { rejectWithValue }) => {
  try {
    // const response = await api.get(`/Equipment`);
    const response = await Equipements;
    return response;
  } catch (error) {
    throw rejectWithValue(error);
  }
});