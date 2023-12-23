import React, { useEffect, useState } from "react";
import {
  Grid,
  FormControl,
  MenuItem,
  FormHelperText,
  Select,
} from "@mui/material";
import {
  CustomOutlinedInput,
  CustomInputLabel,
  CustomButton,
  CustomTable, ActionButtons
} from "../../../../components";
import {
  createTest,
  updateTest,
  initTest,
  initialErrors,
  fetchData,
  tableHeaderMethods,
  methodTypes,
  fetchMethods,
  fetchTestCatgs,
  fetchMethodsAll,
} from "./Apis";
import { useOutletContext, useNavigate, useParams } from "react-router-dom";

const TestForm = ({ label }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [testCatgs, setTestCatgs] = useState([]);
  const [methods, setMethods] = useState([]);
  const [, handleSnackbarOpen, setConfig, Config] = useOutletContext();
  const { loading } = Config;
  const [method, setMethod] = useState({
    name: "",
    type: "",
  });
  const [test, setTest] = useState(initTest);
  const [errors, setErrors] = useState(initialErrors);
  const onSubmit = () => {
    const newErrors = {
      ...errors,
      test: test.testcode === "" ? "Test Code is required" : "",
      sdescError:
        test.testshtdesc === "" ? "Short Description is required" : "",
      ldescError:
        test.testlngdesc === "" ? "Short Description is required" : "",
      catError: test.testCate === "" ? "Test Category is required" : "",
    };
    setErrors(newErrors);
    if (Object.values(newErrors).every((error) => error === "")) {
      let body = { body: test, handleSnackbarOpen, navigate };
      if (test.testpk) {
        updateTest(body,setConfig);
      } else {
        createTest(body,setConfig);
      }
    }
  };
  const handleCategoryChange = (event) => {
    setErrors((prev) => ({ ...prev, catError: "" }));
    const selectedValue = event.target.value;
    const selectedTestCatg = testCatgs.find(
      (item) => selectedValue === item.testCate
    );
    setTest({
      ...test,
      testCate: selectedValue,
      cateDesc: selectedTestCatg.cateDesc,
    });
  };

  const handleMethodFilterChange = (event) => {
    const selectedValue = event.target.value;
    setMethod({
      ...method,
      type: selectedValue,
    });
  };

  function addMethod(method) {
    if (
      !test.methods.some(
        (existingMethod) => existingMethod.methodID === method.methodID
      )
    ) {
      setTest((createdTests) => ({
        ...createdTests,
        methods: [...createdTests.methods, method],
      }));
    }
  }

  function removeMethod(method) {
    setTest((createdTests) => ({
      ...createdTests,
      methods: test.methods.filter((obj) => obj.methodID !== method.methodID),
    }));
  }
  async function onFilter() {
    let filteredMethods;
    const Methods = await fetchMethodsAll(handleSnackbarOpen);
    if (method.name !== "") {
      filteredMethods = Methods.filter(
        (item) =>
          item.valueType === method.type || item.methodID === method.name
      );
    } else {
      filteredMethods = Methods.filter(
        (item) => item.valueType === method.type
      );
    }
    setMethods(filteredMethods);
  }
  useEffect(() => {
    fetchTestCatgs(setTestCatgs,handleSnackbarOpen);
    fetchMethods(setMethods,handleSnackbarOpen);
  }, []);
  useEffect(() => {
    if (id) {
      fetchData(id, setTest, setConfig, handleSnackbarOpen, 'Tests');
    }
  }, [id]);
  return (
    <Grid container padding={2}>
      <Grid item xs={12}>
        <Grid display="flex" alignItems="center" container spacing={2}>
          <Grid item xs={2}>
            <CustomInputLabel required label="test Code" />
          </Grid>
          <Grid item xs={10}>
            <CustomOutlinedInput
              value={test.testcode}
              onChange={(e) => {
                setTest({ ...test, testcode: e.target.value.toUpperCase() });
                setErrors((prev) => ({ ...prev, CodeError: "" }));
              }}
              disabled={label.startsWith("Edit")}
              width="15%"
              error={errors.CodeError !== ""}
              helperText={errors.CodeError !== "" && errors.CodeError}
            />
          </Grid>

          <Grid item xs={2}>
            <CustomInputLabel required label="Test Short Description" />
          </Grid>
          <Grid item xs={10}>
            <CustomOutlinedInput
              value={test.testshtdesc}
              onChange={(e) => {
                setTest({
                  ...test,
                  testshtdesc: e.target.value,
                });
                setErrors((prev) => ({ ...prev, sdescError: "" }));
              }}
              error={errors.sdescError !== ""}
              helperText={errors.sdescError !== "" && errors.sdescError}
            />
          </Grid>
          <Grid item xs={2}>
            <CustomInputLabel required label="Test Long Description" />
          </Grid>
          <Grid item xs={10}>
            <CustomOutlinedInput
              value={test.testlngdesc}
              onChange={(e) => {
                setTest({
                  ...test,
                  testlngdesc: e.target.value,
                });
                setErrors((prev) => ({ ...prev, ldescError: "" }));
              }}
              error={errors.ldescError !== ""}
              helperText={errors.ldescError !== "" && errors.ldescError}
            />
          </Grid>

          <Grid item xs={2}>
            <CustomInputLabel required label="Test Category" />
          </Grid>

          <Grid
            item
            xs={10}
            display={"flex"}
            alignItems={"center"}
            flexDirection={"row"}
          >
            <FormControl
              sx={{ width: "15%", marginRight: "8px" }}
              error={errors.catError !== ""}
            >
              <Select
                value={test.testCate}
                onChange={handleCategoryChange}
                variant="outlined"
                size="small"
              >
                {testCatgs?.map((item) => (
                  <MenuItem key={item.testCate} value={item.testCate}>
                    {item.testCate}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>
                {errors.catError !== "" && errors.catError}
              </FormHelperText>
            </FormControl>
            <CustomInputLabel label={test.cateDesc} />
          </Grid>
          <Grid item xs={2} marginTop={5}>
            <CustomInputLabel label="Method" />
          </Grid>
          <Grid item xs={10} marginTop={5}>
            <CustomOutlinedInput
              value={method.name}
              onChange={(e) =>
                setMethod({
                  ...method,
                  name: e.target.value,
                })
              }
              width={"30%"}
            />
          </Grid>

          <Grid item xs={2} marginBottom={5}>
            <CustomInputLabel label="Filter By" />
          </Grid>

          <Grid
            item
            xs={10}
            display={"flex"}
            alignItems={"center"}
            flexDirection={"row"}
            marginBottom={5}
          >
            <FormControl sx={{ width: "15%", marginRight: "12px" }}>
              <Select
                value={method.type}
                onChange={handleMethodFilterChange}
                variant="outlined"
                size="small"
              >
                {methodTypes.map((item) => (
                  <MenuItem key={item.value} value={item.value}>
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <CustomButton
              backgroundColor="#3498DB"
              variant="contained"
              onClick={onFilter}
            >
              Find
            </CustomButton>
          </Grid>
          <Grid item xs={6} alignSelf={"flex-start"}>
            <CustomInputLabel label="Methods" sx={{ marginBottom: "5px" }} />
            <CustomTable
              data={methods}
              tableHeader={tableHeaderMethods}
              showCheckBox={false}
              showAddButton={true}
              onAdd={addMethod}
              containerStyles={{ maxHeight: "400px", overflowY: "auto" }}
            />
          </Grid>
          <Grid item xs={6} alignSelf={"flex-start"}>
            <CustomInputLabel label="Tests" sx={{ marginBottom: "5px" }} />
            <CustomTable
              data={test.methods}
              tableHeader={tableHeaderMethods}
              showCheckBox={false}
              showDeleteButton={true}
              onDelete={removeMethod}
              containerStyles={{ maxHeight: "400px", overflowY: "auto" }}
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

export default TestForm;
