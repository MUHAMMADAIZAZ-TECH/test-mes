import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import {
  CustomOutlinedInput, CustomInputLabel,
  ActionButtons
} from "../../../../components";
import {
  fetchData, createProductCategory,
  updateProductCategory, initProductCategory, initialErrors
} from './Apis';
import { useOutletContext, useNavigate, useParams } from "react-router-dom";

const ProductForm = ({ label, url }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [, handleSnackbarOpen, setConfig, Config] = useOutletContext();
  const { loading } = Config;
  const [productCategory, setProductCategory] = useState(initProductCategory);
  const [errors, setErrors] = useState(initialErrors);
  const onSubmit = () => {
    const newErrors = {
      ...errors,
      CodeError: productCategory.prodcatecode === "" ? "Code is Required" : "",
      descError: productCategory.prodcatedesc === "" ? "Description is required" : "",
    };
    setErrors(newErrors);
    if (Object.values(newErrors).every((error) => error === "")) {
      let body = { body: productCategory, handleSnackbarOpen, navigate }
      if (productCategory.productcategorypk) {
        updateProductCategory(body,setConfig)
      }
      else {
        createProductCategory(body,setConfig)
      }
    }
  };
  useEffect(() => {
    if (id) {
      fetchData(id, setProductCategory, setConfig, handleSnackbarOpen, 'productCategory')
    }
  }, [id])

  return (
    <Grid container padding={2}>
      <Grid item xs={12} sm={10} md={8} lg={6}>
        <Grid display="flex" alignItems="center" container spacing={2}>
          <Grid item xs={4}>
            <CustomInputLabel required label="Product Category Code" />
          </Grid>
          <Grid item xs={8}>
            <CustomOutlinedInput
              value={productCategory.prodcatecode}
              onChange={(e) => {
                setProductCategory({ ...productCategory, prodcatecode: e.target.value.toUpperCase() })
                setErrors((prev) => ({ ...prev, CodeError: '' }))
              }}
              width="60%"
              disabled={label.startsWith("Edit")}
              error={errors.CodeError !== ''}
              helperText={errors.CodeError !== '' && errors.CodeError}
            />
          </Grid>
          <Grid item xs={4}>
            <CustomInputLabel required label="Product Category Name" />
          </Grid>
          <Grid item xs={8}>
            <CustomOutlinedInput
              value={productCategory.prodcatedesc}
              multiline
              minRows={2}
              onChange={(e) => {
                setProductCategory({ ...productCategory, prodcatedesc: e.target.value, })
                setErrors((prev) => ({ ...prev, descError: '' }))
              }}
              width="100%"
              error={errors.descError !== ''}
              helperText={errors.descError !== '' && errors.descError}
            />
          </Grid>
        </Grid>
        <ActionButtons
          loading={loading}
          onClose={() =>  navigate(-1)}
          onSubmit={onSubmit}
          action={label.startsWith("Edit") || false}
        />
      </Grid>
    </Grid>
  );
};


export default ProductForm;
