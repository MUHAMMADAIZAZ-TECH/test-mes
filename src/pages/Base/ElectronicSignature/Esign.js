import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Stack, Grid, Select, MenuItem, FormControl } from "@mui/material";
import api from "../../../api/api";
import {
  CustomAutoComplete,
  CustomButton,
  CustomOutlinedInput,
  CustomInputLabel,
} from "../../../components";

const allowedTypes = ["apply-esign-on-mpr", "remove-esign-from-mpr"];
const ProductLevelCopy = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const [dataFound, setdataFound] = useState(false);
  const [product, setproduct] = useState(initialproduct);
  const [products, setProducts] = useState([
    {
      prodcode: "<string>",
      prodshtname: "<string>",
      prodlngname: "<string>",
    },
  ]);
  const [state, setState] = useState({
    EsignMeaning: 1,
    Remarks: "",
  });
  const fetchProdTemplate = async (prodcode, setstate) => {
    try {
      const { data } = await api.get(`Product/${prodcode}/TempCode`);
      setstate((prevState) => ({
        ...prevState, // Copy previous state
        templates: data, // Update the templates key
      }));
    } catch (error) {
      console.error(error);
    }
  };

  const onSubmit = () => {};

  async function fetchProducts() {
    try {
      const response = await api.get("/Product");
      if (response.data) {
        const data = response.data.map((item) => ({
          prodcode: item.prodcode,
          prodshtname: item.prodshtname,
          sectionCode: item.sectionCode,
        }));
        setProducts(data);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const onProductChange = (value, setstate, state) => {
    const values = value?.split(" | ");
    if (values !== undefined) {
      const productCode = values[0] || "";
      setstate({
        ...state,
        productName: value,
      });
      fetchProdTemplate(productCode, setstate);
    } else {
      setstate(initialproduct);
    }
  };
  const handleProductChange = (event, setstate, state) => {
    const selectedValue = event.target.value;
    const selectetemplate = state.templates.find(
      (item) => selectedValue === item.templateCode
    );
    setstate((prev) => ({
      ...prev,
      tempCode: selectedValue,
      sectionCode: selectetemplate.lstProdTemplate[0].sectionCode,
    }));
  };

  useEffect(() => {
    (async () => {
      await fetchProducts();
    })();
  }, []);
  useEffect(() => {
    setproduct(initialproduct);
    setState({
      EsignMeaning: 1,
      Remarks: "",
    });

    if (!allowedTypes.includes(type)) {
      navigate("/");
      return null;
    }
  }, [type]);
  return (
    <>
      <Box sx={{ paddingX: 3 }}>
        <Box sx={{ flexGrow: 1, marginBottom: 3 }}>
          <Grid display="flex" alignItems="center" container spacing={2}>
            <Grid item xs={6}>
              <Grid display="flex" alignItems="center" container spacing={2}>
                <Grid item xs={4}>
                  <CustomInputLabel required label="Product Code" />
                </Grid>
                <Grid item xs={8}>
                  <CustomAutoComplete
                    options={products.map(
                      (opt) => `${opt.prodcode} | ${opt.prodshtname}`
                    )}
                    onChange={(e) => onProductChange(e, setproduct, product)}
                    value={product.productName}
                    width={"100%"}
                  />
                </Grid>
                <Grid item xs={4}>
                  <CustomInputLabel required label="Template Code" />
                </Grid>
                <Grid item xs={8}>
                  <FormControl sx={{ width: "100%", marginRight: "8px" }}>
                    <Select
                      value={product.tempCode}
                      onChange={(e) =>
                        handleProductChange(e, setproduct, product)
                      }
                      variant="outlined"
                      size="small"
                    >
                      {product?.templates?.map((item) => (
                        <MenuItem
                          key={item.templateCode}
                          value={item.templateCode}
                        >
                          {item.templateCode}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={4}>
                  <CustomInputLabel required label="Section Code" />
                </Grid>
                <Grid item xs={8}>
                  <CustomOutlinedInput
                    value={product.sectionCode}
                    onChange={(e) =>
                      setproduct({
                        ...product,
                        sectionCode: e.target.value,
                      })
                    }
                    disabled
                    sx={{ marginRight: "16px" }}
                    width={"60%"}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={6}></Grid>
          </Grid>
        </Box>
        {dataFound && (
          <Box sx={{ flexGrow: 1, marginBottom: 3 }}>
            <Grid display="flex" alignItems="center" container spacing={2}>
              <Grid item xs={6}>
                <Grid display="flex" alignItems="center" container spacing={2}>
                  <Grid item xs={4}>
                    <CustomInputLabel required label="Esign Meaning" />
                  </Grid>
                  <Grid item xs={8}>
                    <FormControl sx={{ width: "100%", marginRight: "8px" }}>
                      <Select
                        value={state.EsignMeaning}
                        onChange={(e) =>
                          setState({
                            ...state,
                            EsignMeaning: e.target.value,
                          })
                        }
                        variant="outlined"
                        size="small"
                      >
                        <MenuItem value={1}> written by</MenuItem>
                        <MenuItem value={0}> Other</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4}>
                    <CustomInputLabel required label="Remarks" />
                  </Grid>
                  <Grid item xs={8}>
                    <CustomOutlinedInput
                      value={state.Remarks}
                      onChange={(e) =>
                        setState({
                          ...state,
                          Remarks: e.target.value,
                        })
                      }
                      multiline
                      minRows={5}
                      sx={{ marginRight: "16px" }}
                      width={"100%"}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={6}></Grid>
            </Grid>
          </Box>
        )}
        <Box sx={{ marginTop: 3 }}>
          <Stack spacing={1} direction="row" justifyContent={"flex-start"}>
            {!dataFound ? (
              <CustomButton
                backgroundColor="#28B463"
                variant="contained"
                onClick={onSubmit}
              >
                Submit
              </CustomButton>
            ) : (
              <CustomButton
                backgroundColor="#28B463"
                variant="contained"
                onClick={onSubmit}
              >
                {type === "remove" ? "Remove" : "Apply"}
              </CustomButton>
            )}
            <CustomButton backgroundColor="#E74C3C" variant="contained">
              Close
            </CustomButton>
          </Stack>
        </Box>
      </Box>
    </>
  );
};
const initialproduct = {
  productName: "",
  productTemplate: "",
  sectionCode: "",
  templates: [],
  tempCode: "",
};

export default ProductLevelCopy;
