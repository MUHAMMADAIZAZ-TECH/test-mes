import React, { useEffect, useState } from "react";
import {
  Grid,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
} from "@mui/material";
import {
  CustomOutlinedInput,
  CustomInputLabel,
  CustomAutoComplete,
  Accordion,
  ActionButtons,
} from "../../../../components";
import {
  fetchData,
  createProduct,
  updateProduct,
  initProduct,
  initialErrors,
  fetchClients,
  fetchProductCategories,
  fetchSections,
  fetchProdDoc,
} from "./Apis";
import { useOutletContext, useNavigate, useParams } from "react-router-dom";
import { validateRequiredFields } from "../../../../utils/validation";
import AttachDocument from "./AttachDocument";

const ProductForm = ({ label }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [, handleSnackbarOpen, setConfig, Config] = useOutletContext();
  const { loading } = Config;
  const [clients, setClients] = useState([]);
  const [sections, setSections] = useState([]);
  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState(initProduct);
  const [documents, setDocuments] = useState([]);
  // const [errors, setErrors] = useState(initialErrors);

  async function fetchForDropDown() {
    await fetchClients(setClients, handleSnackbarOpen);
    await fetchProductCategories(setCategories, handleSnackbarOpen);
    await fetchSections(setSections, handleSnackbarOpen);
  }

  const onSubmit = () => {
    const errors = validateRequiredFields(product, [
      "prodcode",
      "prodshtname",
      "prodlngname",
      "description",
      "prodcatecode",
      "storagecon",
      "registrationno",
      "unit",
      "sectionCode",
      "batchsize",
      "prodcatedesc",
      "sectionDesc",
    ]);
    let body = {
      body: {
        ...product,
        sectionCode: product.section.sectionCode,
      },
      handleSnackbarOpen,
      navigate,
    };
    if (product.productpk) {
      updateProduct(body,setConfig);
    } else {
      createProduct(body,setConfig);
    }
  };
  const handleRadioChange = (event) => {
    const value = event.target.value;
    setProduct({
      ...product,
      status: value === "active" ? "Y" : "N",
    });
  };

  const handleCheckboxChange = (event) => {
    setProduct({
      ...product,
      [event.target.name]: event.target.checked === true ? "Y" : "N",
    });
  };
  const handleClientChange = (event) => {
    const selectedValue = event.target.value;
    const selectedClient = clients.find(
      (item) => selectedValue === item.custID
    );
    setProduct({
      ...product,
      defaultClient: selectedValue,
    });
  };
  const handleCategoryChange = (event) => {
    const selectedValue = event.target.value;
    const selectedProductCategory = categories?.find(
      (item) => selectedValue === item.prodcatecode
    );
    setProduct({
      ...product,
      prodcatecode: selectedValue,
      prodcatedesc: selectedProductCategory.prodcatedesc,
    });
  };
  const handleSectionChange = (event) => {
    const selectedValue = event.target.value;
    const selectedSection = sections.find(
      (item) => selectedValue === item.sectionCode
    );
    setProduct({
      ...product,
      section: selectedSection,
    });
  };
  useEffect(() => {
    if (id) {
      fetchData(id, setProduct, setConfig, handleSnackbarOpen, 'Product')
      fetchProdDoc(id, setDocuments);
    }
  }, [id]);
  useEffect(() => {
    fetchForDropDown();
  }, []);
  const handlePrint = () => {
    let printContents = document.getElementById('printproduct').innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    window.location.reload();
  }
  return (
    <div id="printproduct">
      <Grid container padding={2}>
        <Grid item xs={12}>
          <Grid display="flex" alignItems="center" container spacing={2}>
            <Grid item xs={2}>
              <CustomInputLabel required label="Product/Ingredient Code" />
            </Grid>
            <Grid item xs={2}>
              <CustomOutlinedInput
                value={product.prodcode}
                disabled={label.startsWith("Edit")}
                onChange={(e) => {
                  setProduct({
                    ...product,
                    prodcode: e.target.value,
                  });
                }}
                width="100%"
              />
            </Grid>
            <Grid item xs={8} />
            <Grid item xs={2}>
              <CustomInputLabel required label="Short Name" />
            </Grid>
            <Grid item xs={4} display={"flex"} alignItems={"center"}>
              <CustomOutlinedInput
                value={product.prodshtname}
                onChange={(e) =>
                  setProduct({ ...product, prodshtname: e.target.value })
                }
                width={"90%"}
              />
            </Grid>
            <Grid item xs={2.5}>
              <FormControl>
                <FormLabel>Status</FormLabel>
                <RadioGroup
                  row
                  value={product.status === "Y" ? "active" : "inactive"}
                  onChange={handleRadioChange}
                >
                  <FormControlLabel
                    value="active"
                    control={<Radio />}
                    label="Active"
                  />
                  <FormControlLabel
                    value="inactive"
                    control={<Radio />}
                    label="Inactive"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={2.5}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={product.partialPh === "Y" ? true : false}
                    onChange={handleCheckboxChange}
                    name="partialPh"
                  />
                }
                label="Start execuetion with partial pharmacy weighing"
              />
            </Grid>
            <Grid item xs={2}>
              <CustomInputLabel required label="Long Name" />
            </Grid>
            <Grid item xs={10}>
              <CustomOutlinedInput
                value={product.prodlngname}
                onChange={(e) =>
                  setProduct({ ...product, prodlngname: e.target.value })
                }
                width={"100%"}
              />
            </Grid>
            <Grid item xs={2}>
              <CustomInputLabel required label="Description" />
            </Grid>
            <Grid item xs={10}>
              <CustomOutlinedInput
                value={product.description}
                onChange={(e) =>
                  setProduct({ ...product, description: e.target.value })
                }
                multiline
                minRows={3}
                width={"100%"}
              />
            </Grid>
            <Grid item xs={2}>
              <CustomInputLabel required label="Category Code" />
            </Grid>
            <Grid item xs={4}>
              <FormControl sx={{ width: "90%", marginRight: "8px" }}>
                <Select
                  value={product.prodcatecode}
                  onChange={handleCategoryChange}
                  variant="outlined"
                  size="small"
                >
                  {categories?.map((item) => (
                    <MenuItem key={item.prodcatecode} value={item.prodcatecode}>
                      {`${item.prodcatecode} - ${item.prodcatedesc}`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={2} />
            <Grid item xs={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={product.uoPE === "Y" ? true : false}
                    onChange={handleCheckboxChange}
                    name="uoPE"
                  />
                }
                label="Enable unit operations parallel execuetion"
              />
            </Grid>
            <Grid item xs={2}>
              <CustomInputLabel required label="Storage Condition" />
            </Grid>
            <Grid item xs={4}>
              <CustomOutlinedInput
                value={product.storagecon}
                onChange={(e) =>
                  setProduct({ ...product, storagecon: e.target.value })
                }
                width={"90%"}
              />
            </Grid>
            <Grid item xs={2}>
              <CustomInputLabel required label="Registration No." />
            </Grid>
            <Grid item xs={4}>
              <CustomOutlinedInput
                value={product.registrationno}
                onChange={(e) =>
                  setProduct({ ...product, registrationno: e.target.value })
                }
                width={"100%"}
              />
            </Grid>
            <Grid item xs={2}>
              <CustomInputLabel required label="Measurement Unit" />
            </Grid>
            <Grid item xs={4}>
              <CustomOutlinedInput
                value={product.unit}
                onChange={(e) => setProduct({ ...product, unit: e.target.value })}
                width={"90%"}
              />
            </Grid>
            <Grid
              item
              xs={2}
              display={"flex"}
              alignItems={"center"}
              justifyContent={"space-between"}
            >
              <CustomInputLabel label="Controlled Substance" />
              <Checkbox
                checked={product.controlSubstance === "Y" ? true : false}
                onChange={handleCheckboxChange}
                name="controlSubstance"
              />
            </Grid>
            <Grid item xs={4}>
              <CustomOutlinedInput
                value={product.controlSubDesc}
                onChange={(e) =>
                  setProduct({ ...product, controlSubDesc: e.target.value })
                }
                disabled={product.controlSubstance === "Y" ? false : true}
                width={"100%"}
              />
            </Grid>
            <Grid item xs={2}>
              <CustomInputLabel required label="Section Code" />
            </Grid>
            <Grid item xs={4}>
              <FormControl sx={{ width: "90%", marginRight: "8px" }}>
                <Select
                  value={product?.section?.sectionCode}
                  onChange={handleSectionChange}
                  variant="outlined"
                  size="small"
                >
                  {sections?.map((item) => (
                    <MenuItem key={item.sectionCode} value={item.sectionCode}>
                      {`${item.sectionCode} - ${item.sectionDesc}`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={2}>
              <CustomInputLabel required label="Default Client" />
            </Grid>
            <Grid item xs={4}>
              <CustomAutoComplete
                options={clients.map((opt) => {
                  opt.label = `${opt.custID} - ${opt.custName}`;
                  return opt;
                })}
                onChange={(value) => {
                  setProduct((prevState) => {
                    return {
                      ...prevState,
                      custCode: value.custID,
                    };
                  });
                }}
                value={product.custCode}
                width={"100%"}
                disabled={product?.section?.clientInfoReqd !== "Y"}
              />
            </Grid>

            <Grid item xs={2}>
              <CustomInputLabel required label="Expiry Months" />
            </Grid>
            <Grid item xs={4}>
              <CustomOutlinedInput
                width={"90%"}
                value={product.expiryMonth}
                onChange={(e) =>
                  setProduct({ ...product, expiryMonth: e.target.value })
                }
                disabled={product?.section?.expiryDateReqd !== "Y"}
              />
            </Grid>
            <Grid item xs={6} />
            <Grid item xs={2}>
              <CustomInputLabel label="Comments" />
            </Grid>
            <Grid item xs={10}>
              <CustomOutlinedInput
                value={product.prodComments}
                onChange={(e) =>
                  setProduct({ ...product, prodComments: e.target.value })
                }
                width={"100%"}
                multiline
                minRows={3}
              />
            </Grid>
            <Grid item xs={2}>
              <CustomInputLabel label="Attachments" />
            </Grid>
            <Grid item xs={10}>
              <Accordion
                title="Documents"
                childComponent={
                  <AttachDocument
                    product={product}
                    documents={documents}
                    setDocuments={setDocuments}
                    handleSnackbarOpen={handleSnackbarOpen}
                  />
                }
              />
            </Grid>
            <div className="buttons">
              <ActionButtons
                loading={loading}
                handlePrint={handlePrint}
                onClose={() =>  navigate(-1)}
                onSubmit={onSubmit}
                action={label.startsWith("Edit") || false}
              />
            </div>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default ProductForm;
