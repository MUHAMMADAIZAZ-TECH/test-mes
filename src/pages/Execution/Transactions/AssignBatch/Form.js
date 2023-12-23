import { Grid, Paper } from '@mui/material'
import React, { useEffect, useState } from 'react'
import {
  SelectBox, AutoComplete, InputField,
  CustomCheckbox, CustomDatePicker, ActionButtons
} from '../../../../components';
import {
  fetchAssignBatchToProduct, initialState, fetchBatchTypes,
  fetchClients, UpdateAssignBatch, AddAssignBatch, fetchProductDetails
} from './Apis'
import ProductForm from '../../ProductForm';
import { useSelector } from 'react-redux';
import {
  fetchProductBatches, fetchTemplateDetails
} from '../Apis';
import { useSearchParams, useNavigate } from 'react-router-dom';
const AssignBatch = ({ label }) => {
  const navigate = useNavigate();
  const EditMode = label.startsWith("Edit") || false
  const [config, setconfig] = useState({ loading: false, Found: false })
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
  const [productBatches, setproductBatches] = useState([]);
  const [Clients, setClients] = useState([])
  const [Batchtypes, setBatchtypes] = useState([])

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
    setState((prev) => ({
      ...prev,
      products: ProductMpr,
      product: product || null,
      sectionCode,
      tempCode
    }));
    fetchProductDetails(product, setState)
    fetchProductBatches('AssignBatchToProduct', setproductBatches, prodcode);
    fetchTemplateDetails(product, setState);
  };
  const handleInput = (e) => {
    const { name, value, checked } = e.target;
    if (name === 'tempCode') {
      setState((prev) => ({ ...prev, [name]: value || '', thYield: "", custID: "" }))
      fetchProductDetails({ ...state, tempCode: value }, setState)
    }
    if (name === 'thYield' || name === 'custID') {
      setState((prev) => ({ ...prev, [name]: value || '' }))
    }
    if (name === 'executionType') {
      setState((prev) => ({
        ...prev,
        RequestBody: {
          ...prev.RequestBody,
          [name]: checked === true ? 'V' : 'A'
        }
      }))
    }
    else {
      setState((prev) => ({
        ...prev,
        RequestBody: {
          ...prev.RequestBody,
          [name]: value || ''
        }
      }))
    }
  }
  const onInputChange = (value) => {
    setState((prev) => ({ ...prev, batchNo: value }));
}
  const handleSearch = (e) => {
    if (state.batchNo && state.prodcode && state.sectionCode) {
      fetchAssignBatchToProduct(state, setState, setconfig)
    }
  };
  const handleReset = () => {
    // setconfig((prev) => ({ ...prev, Found: false }))
    // setState(initialState)
    navigate(-1);
  }
  const handleSave = () => {
    const Body = {
      ...state.RequestBody,
      "sectioncode": state.sectionCode,
      "productCode": state.prodcode,
      "batchNo": state.batchNo,
      "template": state.tempCode,
      "customerID": state.custID,
      "thYield": state.thYield,
      "tenantId": "1038",
    }
    if (state.RequestBody.assignbatchproductpk) {
      UpdateAssignBatch(Body)
    }
    else {
      AddAssignBatch(Body)
    }
  }
  useEffect(() => {
    fetchBatchTypes(setBatchtypes)
    fetchClients(setClients)
    if (EditMode) {
      handleSearch()
    }
  }, [])
  const batchDisable = state.RequestBody.executionType === 'A' && EditMode

  return (
    <Paper sx={{ flexGrow: 1, paddingX: 3, paddingTop: 2, paddingBottom: 3 }}>
      <Grid container spacing={2}>
        <ProductForm
          handleInput={handleInputProduct}
          productBatches={productBatches}
          onInputChange={onInputChange}
          products={ProductMpr || []}
          state={state}
          EditMode={EditMode}
          setState={setState}
          config={config}
          freeSolo
        />
      </Grid>
      <Grid container spacing={2} mt={5}>
        <Grid item xs={12} md={6} lg={4}>
          <AutoComplete
            width={'100%'}
            label="Template"
            getOptionLabel={(op) => `${op.tempCode} | ${op.tempDesc}`}
            name='tempCode'
            disabled={state.RequestBody.executionType === "A" || batchDisable}
            value={state.tempCode}
            options={ProductMpr}
            placeholder="search..."
            onChange={handleInput}
            error={false}
            required={true}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <InputField
            fullWidth
            disabled
            label='Theoretical Yield'
            name='thYield'
            onChange={handleInput}
            value={state.thYield}
            size='small'
            required
          />
        </Grid>
        <Grid item xs={12} md={6} lg={5}>
          <CustomCheckbox
            disabled={batchDisable || EditMode}
            checked={state?.RequestBody?.executionType === 'V' ? true : false}
            name="executionType"
            label="Use for Template validation / testing"
            onChange={handleInput}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <AutoComplete
            width={'100%'}
            label="Client"
            name='custID'
            disabled
            getOptionLabel={(opt) => `${opt.custID} | ${opt.custName}`}
            options={Clients || []}
            value={state.custID}
            onChange={handleInput}
            placeholder="search..."
            error={false}
            required={true}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <CustomDatePicker
            width="100%"
            label="Issuance Date"
            value={state.RequestBody.initiateDate}
            error={false} // true or false
            required
            disabled
            name='initiateDate'
            onChange={handleInput}
            size="small"
            helperText="Please select a date"
          />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <SelectBox
            required
            sx={{ width: '100%' }}
            value={state.RequestBody.batchType}
            handleChange={handleInput}
            disabled={batchDisable}
            label="Batch Type"
            name='batchType'
            property='batchTypeCode'
            options={Batchtypes || []}
          />
        </Grid>
        <Grid item xs={12}>
          <InputField
            multiline
            rows={2}
            fullWidth
            onChange={handleInput}
            label='Comments'
            name='comments'
            disabled={batchDisable}
            value={state.RequestBody.comments}
            size='small' />
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <ActionButtons
          loading={config.loading}
          onSubmit={!batchDisable ? handleSave : false}
          onClose={handleReset}
          action={EditMode}
          Found={config.Found}
        />
      </Grid>
    </Paper>
  )
}

export default AssignBatch