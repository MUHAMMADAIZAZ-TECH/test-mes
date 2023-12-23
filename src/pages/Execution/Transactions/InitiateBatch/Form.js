import { Grid, Paper } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { InputField, ActionButtons } from '../../../../components'
import { AddInitiateBatch, fetchInitiateBatch, initialState, UpdateInitiateBatch } from './Apis'
import ProductForm from '../../ProductForm';
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { fetchProductBatches ,fetchAssignBatchToProduct} from '../Apis';
import { DateTime } from 'luxon'

const InitiatBatchForm = ({ label }) => {
  const navigate = useNavigate();
  const EditMode = label.startsWith("Edit") || false
  const [config, setconfig] = useState({ loading: false, Found: false })
  const [productBatches, setproductBatches] = useState([]);
  const [searchparams, setSearchParams] = useSearchParams();
  const [state, setState] = useState({
    ...initialState,
    sectionCode: searchparams.get('sec') || "",
    prodcode: searchparams.get('prod') || "",
    batchNo: searchparams.get('bat') || "",
    tempCode: searchparams.get('tem') || "",
  })
  const { ProductMpr } = useSelector((state) => {
    return {
      ProductMpr: state.Mpr.ProductMpr
    };
  });
  const handleInputProduct = (e, object) => {
    const { name, value } = e.target;
    const updates = { [name]: value || '' };

    if (name === 'prodcode' && value) {
      productSelection(value, object);
    }
    setState((prev) => ({ ...prev, ...updates, }));
  };
  const productSelection = (prodcode, product) => {
    const { sectionCode, tempCode } = product || {};
    setState((prev) => ({ ...prev, sectionCode, tempCode }));
    fetchProductBatches('AssignBatchToProduct', setproductBatches, prodcode);
  };
  const handleSearch = () => {
    if (state.batchNo && state.prodcode && state.sectionCode) {
      fetchInitiateBatch(state, setState, setconfig)
    }
  };
  const handleInput = (e) => {
    setState((prev) => ({
      ...prev,
      RequestBody: {
        ...prev.RequestBody,
        [e.target.name]: e.target.value || ''
      }
    }))
  }
  const handleSave = () => {
    if (state.batchNo && state.prodcode && state.sectionCode) {
      const Body = {
        ...state.RequestBody,
        "sectioncode": state.sectionCode || "",
        "productCode": state.prodcode || "",
        "batchNo": state.batchNo || "",
        "templateCode": state.tempCode || "",
        "eSignStatus": "",
        "mfgDate": DateTime.now()
      }
      if (state.RequestBody.batchinitiationpk) {
        UpdateInitiateBatch(Body)
      }
      else {
        AddInitiateBatch(Body)
      }
    }
  };
  const handleReset = () => {
    // setconfig((prev) => ({ ...prev, Found: false }))
    // setState(initialState)
    navigate(-1);
  }
  useEffect(() => {
    if (EditMode) {
      fetchAssignBatchToProduct(state,state.batchNo,setState)
      handleSearch()
    }
  }, [])

  return (
    <Paper sx={{ flexGrow: 1, paddingX: 3, paddingTop: 2, paddingBottom: 3 }}>
      <Grid container spacing={2}>
        <ProductForm
          handleInput={handleInputProduct}
          productBatches={productBatches}
          products={ProductMpr || []}
          state={state}
          EditMode={EditMode}
          setState={setState}
          config={config}
        />
      </Grid>
      <Grid container spacing={2} mt={5}>
        <Grid item xs={12}>
          <InputField
            multiline
            rows={5}
            fullWidth
            label='Comments'
            onChange={handleInput}
            name='comments'
            value={state.RequestBody.comments}
            size='small' />
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <ActionButtons
          loading={config.loading}
          onSubmit={handleSave}
          onClose={handleReset}
          Found={config.Found}
          action={EditMode}
        />
      </Grid>
    </Paper>
  )
}

export default InitiatBatchForm