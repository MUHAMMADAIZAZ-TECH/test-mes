import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  FormControlLabel,
  Checkbox,
  FormControl,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import {
  CustomOutlinedInput, CustomInputLabel,
  CustomAutoComplete, ActionButtons
} from "../../../../components";
import api from "../../../../api/api";
import { useOutletContext } from "react-router-dom";

const ProductLevelCopy = () => {
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState(initialproduct);
  const [Errors, setErrors] = useState(InitialErrors);
  const [products, setProducts] = useState([
    {
      prodcode: "<string>",
      prodshtname: "<string>",
      prodlngname: "<string>",
      prodcatecode: "<string>",
      tenantId: "<string>",
    },
  ]);
  const [templates, settemplates] = useState([]);
  const [,handleSnackbarOpen] = useOutletContext();
  const fetchProdTemplate = async (prodcode) => {
    try {
      const { data } = await api.get(`Product/${prodcode}/TempCode`);
      settemplates(data);
    } catch (error) {
      handleSnackbarOpen('error', 'An error occured while fetching templates')
      console.error(error);
    }
  };

  const onSubmit = () => {
    const newErrors = {
      ...Errors,
      productCodeTo: state.productCodeTo === "" ? "Product Code is required" : "",
      tempCodeTo: state.tempCodeTo === "" ? "Template Code is required" : "",
      sectionCodeTo: state.sectionCodeTo === "" ? "Section Code is required" : "",
      productCodeFr: state.productCodeFr === "" ? "Product Code is required" : "",
      tempCodeFr: state.tempCodeFr === "" ? "Template Code is required" : "",
      sectionCodeFr: state.sectionCodeFr === "" ? "Section Code is required" : "",
    };
    setErrors(newErrors);
    if (Object.values(newErrors).every((error) => error === "")) {
      CreateCopy(state)
    }
  };

  async function fetchProducts() {
    try {
      const response = await api.get("/Product");
      if (response.data) {
        const data = response.data.map((item) => ({
          prodcode: item.prodcode,
          prodshtname: item.prodshtname,
          sectionCode: item.section.sectionCode,
        }));
        setProducts(data);
      }
    } catch (error) {
      handleSnackbarOpen('error', 'An error occured while fetching products')
      console.error(error);
    }
  }

  const onProductChange = (productCode, key) => {
    if (productCode) {
      const product = products.find((item) => productCode === item.prodcode);
      setState((prev) => ({
        ...prev,
        [key]: productCode,
        [key === 'productCodeTo' ? 'sectionCodeTo' : 'sectionCodeFr']: product.sectionCode
      }));
      setErrors((prev) => ({
        ...prev, [key]: '',
        [key === 'productCodeTo' ? 'sectionCodeTo' : 'sectionCodeFr']: ""
      }));
      fetchProdTemplate(productCode);
    } else {
      setState(initialproduct);
    }
  };
  const handleState = (e) => {
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
    setState((prev) => ({ ...prev, [e.target.name]: e.target.checked ?? e.target.value }));
  }

  const onCancel = () => {
    setState(initialproduct)
    setLoading(false);
  };
  const CreateCopy = async (body) => {
    setLoading(true)
    try {
      const response = await api.post(`ProductLevelCopy`, body);
      setLoading(false)
      handleSnackbarOpen('success', 'Successfully copied!')
    } catch (error) {
      setLoading(false)
      handleSnackbarOpen('error', 'An error occured while creating copy')
      console.error(error);
    }
  };
  useEffect(() => {
    (async () => {
      await fetchProducts();
    })();
  }, []);
  return (
    <>
      <Box sx={{ paddingX: 3 }}>
        <Box sx={{ flexGrow: 1, marginBottom: 3 }}>
          <Grid display="flex" alignItems="center" container spacing={2}>
            <Grid item xs={6}>
              <CustomInputLabel label="Target" sx={{ color: "Blue" }} />
              <Grid display="flex" alignItems="center" container spacing={2}>
                <Grid item xs={4}>
                  <CustomInputLabel required label="Product Code" />
                </Grid>
                <Grid item xs={8}>
                  <CustomAutoComplete
                    options={products.map((opt) => opt.prodcode)}
                    onChange={(value) => onProductChange(value, 'productCodeTo')}
                    value={state.productCodeTo}
                    width={"100%"}
                    error={Errors.productCodeTo !== ''}
                    helperText={Errors.productCodeTo !== '' && Errors.productCodeTo}
                  />
                </Grid>
                <Grid item xs={4}>
                  <CustomInputLabel required label="Template Code" />
                </Grid>
                <Grid item xs={8}>
                  <FormControl
                    sx={{ width: "100%", marginRight: "8px" }}
                    error={Errors.tempCodeTo !== ''}
                  >
                    <Select
                      value={state.tempCodeTo}
                      onChange={(e) => handleState(e, 'sectionCodeTo')}
                      variant="outlined"
                      size="small"
                      name="tempCodeTo"
                    >
                      {templates?.map((item) => (
                        <MenuItem
                          key={item.templateCode}
                          value={item.templateCode}
                        >
                          {item.templateCode}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>{Errors.tempCodeTo !== '' && Errors.tempCodeTo}</FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={4}>
                  <CustomInputLabel required label="Section Code" />
                </Grid>
                <Grid item xs={8}>
                  <CustomOutlinedInput
                    value={state.sectionCodeTo}
                    disabled
                    sx={{ marginRight: "16px" }}
                    width={"40%"}
                    error={Errors.sectionCodeTo !== ''}
                    helperText={Errors.sectionCodeTo !== '' && Errors.sectionCodeTo}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={6}>
              <CustomInputLabel label="Source" sx={{ color: "Blue" }} />
              <Grid display="flex" alignItems="center" container spacing={2}>
                <Grid item xs={4}>
                  <CustomInputLabel required label="Product Code" />
                </Grid>
                <Grid item xs={8}>
                  <CustomAutoComplete
                    options={products.map((opt) => opt.prodcode)}
                    onChange={(value) => onProductChange(value, 'productCodeFr')}
                    value={state.productCodeFr}
                    width={"100%"}
                    error={Errors.productCodeFr !== ''}
                    helperText={Errors.productCodeFr !== '' && Errors.productCodeFr}
                  />
                </Grid>
                <Grid item xs={4}>
                  <CustomInputLabel required label="Template Code" />
                </Grid>
                <Grid item xs={8}>
                  <FormControl sx={{ width: "100%", marginRight: "8px" }}
                    error={Errors.tempCodeFr !== ''}>
                    <Select
                      value={state.tempCodeFr}
                      onChange={(e) => handleState(e, 'sectionCodeFr')}
                      variant="outlined"
                      size="small"
                      name="tempCodeFr"
                    >
                      {templates?.map((item) => (
                        <MenuItem
                          key={item.templateCode}
                          value={item.templateCode}
                        >
                          {item.templateCode}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>{Errors.tempCodeFr !== '' && Errors.tempCodeFr}</FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={4}>
                  <CustomInputLabel required label="Section Code" />
                </Grid>
                <Grid item xs={8}>
                  <CustomOutlinedInput
                    value={state.sectionCodeFr}
                    disabled
                    sx={{ marginRight: "16px" }}
                    width={"40%"}
                    error={Errors.sectionCodeFr !== ''}
                    helperText={Errors.sectionCodeFr !== '' && Errors.sectionCodeFr}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
        <Box sx={{ flexGrow: 1, marginTop: 3 }}>
          <CustomInputLabel
            label="Apply Formating"
            sx={{ color: "Blue" }}
          />
          <Grid display="flex" alignItems="center" container spacing={2}>
            <Grid item xs={6} >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={state.mastFormFlag}
                    onChange={handleState}
                    name="mastFormFlag"
                  />
                }
                label="Master formula"
              />
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={state.ingAdjFlag}
                    onChange={handleState}
                    name="ingAdjFlag"
                  />
                }
                label="Ingredient Adjustment"
              />
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={state.areaTypeFlag}
                    onChange={handleState}
                    name="areaTypeFlag"
                  />
                }
                label="Area Type With Unit Operation"
              />
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={state.safetyInsFlag}
                    onChange={handleState}
                    name="safetyInsFlag"
                  />
                }
                label="Safety Instruction on Unit Operation"
              />
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={state.eqpTypeFlag}
                    onChange={handleState}
                    name="eqpTypeFlag"
                  />
                }
                label="Equipment Type"
              />
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={state.variableFlag}
                    onChange={handleState}
                    name="variableFlag"
                  />
                }
                label="Variables"
              />
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={state.validationFlag}
                    onChange={handleState}
                    name="validationFlag"
                  />
                }
                label="Validation"
              />
            </Grid>
          </Grid>
        </Box>
        <ActionButtons
          loading={loading}
          onSubmit={onSubmit}
          onClose={onCancel}
        />
      </Box>
    </>
  );
};
const initialproduct = {
  productCodeTo: "",
  tempCodeTo: "",
  sectionCodeTo: "",
  productCodeFr: "",
  tempCodeFr: "",
  sectionCodeFr: "",
  mastFormFlag: false,
  ingAdjFlag: false,
  areaTypeFlag: false,
  safetyInsFlag: false,
  eqpTypeFlag: false,
  variableFlag: false,
  validationFlag: false,
  tenantId: "1038"
};
const InitialErrors = {
  productCodeTo: "",
  tempCodeTo: "",
  sectionCodeTo: "",
  productCodeFr: "",
  tempCodeFr: "",
  sectionCodeFr: "",
}
export default ProductLevelCopy;
