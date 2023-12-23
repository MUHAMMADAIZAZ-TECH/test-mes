import React, { useEffect, useState } from "react";
import {
  Box, Grid, MenuItem,
  Select, FormControl, Checkbox, FormControlLabel, FormHelperText,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DateTime } from "luxon";
import api from "../../../../api/api";
import {
  CustomOutlinedInput, CustomTable,
  CustomInputLabel, CustomButton, CustomAutoComplete, ActionButtons
} from "../../../../components";
import { Add } from "@mui/icons-material";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { fetchData, deleteLineClr } from "./Apis";

const initLC = {
  lccode: "",
  lcdesc: "",
  sopno: "",
  status: "",
  comments: "",
  revdate: DateTime.local(),
  lcapp: "",
  lstLCTests: [],
  tenantId: "1038",
};
const initErrors = {
  lccode: "",
  lcdesc: "",
  sopno: "",
  revdate: "",
};
const initTest = {
  testCode: "",
  testDesc: "",
  limitsApp: "N",
  value1: "",
  value2: "",
  operater: "",
  mandatory: "",
};
const CreateLineClearance = ({
  label
}) => {
  const EditMode = label.startsWith("Edit") || false;
  const [lineClr, setLineClr] = useState(initLC);
  const [tests, setTests] = useState([]);
  const [loading, setloading] = useState(false);
  const [test, setTest] = useState(initTest);
  const [errors, setErrors] = useState(initErrors);
  const [handleAction, handleSnackbarOpen, setConfig] = useOutletContext();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    fetchTests();
  }, []);

  useEffect(() => {
    if (id) {
      fetchData(id, setLineClr, setConfig, handleSnackbarOpen, 'LineClearance')
    }
  }, [id]);

  async function fetchTests() {
    try {
      const response = await api.get("/Tests");
      setTests(response.data);
    } catch ({ response }) {
      handleSnackbarOpen('error', 'An error occured while fetching tests')
      console.error(response);
    }
  }

  const handleCheckboxChange = (event) => {
    setLineClr({
      ...lineClr,
      [event.target.name]: event.target.checked === true ? "Y" : "N",
    });
  };
  const handleCheckboxChangeTest = (event) => {
    setTest({
      ...test,
      [event.target.name]: event.target.checked === true ? "Y" : "N",
    });
  };

  const handleSelect = (event) => {
    setTest({
      ...test,
      operater: event.target.value,
    });
  };

  const onAdd = () => {
    const testObj = { ...test };
    if (test.testCode !== '') {
      testObj.testCode = test.testCode.split(' | ')[0] || "";
      testObj.testDesc = test.testCode.split(' | ')[1] || "";
      const arr = [...lineClr.lstLCTests] || [];
      arr.push(testObj);
      setTest(initTest);
      setLineClr({ ...lineClr, lstLCTests: arr });
    }
  };

  const onRemove = (data, index) => {
    const filteredArray = lineClr.lstLCTests.filter((_, key) => key !== index);
    setLineClr({
      ...lineClr,
      lstLCTests: filteredArray,
    });
  };

  const onSave = async () => {
    const newErrors = validate(lineClr, errors)
    setErrors(newErrors);
    if (Object.values(newErrors).every((error) => error === "")) {
      if (lineClr.lstLCTests.length > 0) {
        try {
          if (lineClr.id) {
            setloading(true)
            const response = await api.put(
              `/LineClearance/${lineClr.lccode}`,
              lineClr
            );
            if (response.status === 200) {
              setloading(false)
              handleSnackbarOpen("success", "Updated successfully!");
            }
          } else {
            const response = await api.post("/LineClearance", lineClr);
            if (response.status === 201) {
              setloading(false)
              handleSnackbarOpen("success", "Created successfully!");
            }
          }
        } catch ({ response }) {
          setloading(false)
          handleSnackbarOpen('error', 'An error occured on your request')
          console.error(response);
        }
      }
      else {
        handleSnackbarOpen("error", "Please add test description");
      }
    }

  };
  const onCancel = () => {
    navigate(-1)
  };
  return (
    <>
      <Box sx={{ flexGrow: 1, paddingX: 3 }}>
        <Grid display="flex" alignItems="center" container spacing={2}>
          <Grid item xs={2}>
            <CustomInputLabel required label="Code" />
          </Grid>
          <Grid item xs={10}>
            <CustomOutlinedInput
              value={lineClr.lccode}
              onChange={(e) => {
                setLineClr({
                  ...lineClr,
                  lccode: e.target.value,
                })
                setErrors((prev) => ({ ...prev, lccode: '' }))
              }}
              width={"100%"}
              error={errors.lccode !== ''}
              helperText={errors.lccode !== '' && errors.lccode}
            />
          </Grid>
          <Grid item xs={2}>
            <CustomInputLabel required label="Description" />
          </Grid>
          <Grid item xs={10}>
            <CustomOutlinedInput
              value={lineClr.lcdesc}
              onChange={(e) => {
                setLineClr({
                  ...lineClr,
                  lcdesc: e.target.value,
                })
                setErrors((prev) => ({ ...prev, lcdesc: '' }))
              }}
              width={"100%"}
              error={errors.lcdesc !== ''}
              helperText={errors.lcdesc !== '' && errors.lcdesc}

            />
          </Grid>
          <Grid item xs={2}>
            <CustomInputLabel required label="SOP No" />
          </Grid>
          <Grid item xs={10}>
            <CustomOutlinedInput
              value={lineClr.sopno}
              onChange={(e) => {
                setLineClr({
                  ...lineClr,
                  sopno: e.target.value,
                })
                setErrors((prev) => ({ ...prev, sopno: '' }))
              }}
              width={"100%"}
              error={errors.sopno !== ''}
              helperText={errors.sopno !== '' && errors.sopno}
            />
          </Grid>
          <Grid item xs={2}>
            <CustomInputLabel required label="Revision Date:" />
          </Grid>
          <Grid item xs={10}>
            <FormControl error={errors.revdate !== ''} >
              <DatePicker
                value={DateTime.fromISO(lineClr.revdate)}
                onChange={(newValue) =>
                  setLineClr({
                    ...lineClr,
                    revdate: DateTime.fromISO(newValue),
                  })
                }
              />
              <FormHelperText>{errors.revdate !== '' && errors.revdate}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={2}>
            <CustomInputLabel label="Test" />
          </Grid>
          <Grid item xs={10}>
            <CustomAutoComplete
              value={test.testCode}
              options={tests.map(
                (opt) => `${opt.testcode} | ${opt.testshtdesc}`
              )}
              onChange={(value) => {
                setTest({
                  ...test,
                  testCode: value || "",
                });
              }}
              width={"100%"}
            />
          </Grid>
          <Grid item xs={2} />
          <Grid item xs={2}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={test.limitsApp === "Y" ? true : false}
                  onChange={handleCheckboxChangeTest}
                  name="limitsApp"
                  disabled={test.testCode === ""}
                />
              }
              label="Limits Applicable"
            />
          </Grid>
          {test.limitsApp === "Y" && (
            <>
              <Grid item xs={1} />
              <Grid item xs={1}>
                <CustomInputLabel label="Operator" />
              </Grid>
              <Grid item xs={1}>
                <FormControl sx={{ width: "100%" }}>
                  <Select
                    value={test.operater}
                    onChange={handleSelect}
                    variant="outlined"
                    size="small"
                  >
                    {['=', '>', "<", ">=", 'b/w'].map((item, i) => <MenuItem key={i} value={item}> {item}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={0.5} />
              <Grid item xs={1}>
                <CustomInputLabel
                  label={test.operater !== "b/w" ? "Value" : "Value 1"}
                />
              </Grid>
              <Grid item xs={1}>
                <CustomOutlinedInput
                  value={test.value1}
                  onChange={(e) =>
                    setTest({
                      ...test,
                      value1: e.target.value,
                    })
                  }
                  type={"number"}
                  width={"100%"}
                />
              </Grid>
              <Grid item xs={0.5} />
              {test.operater !== "b/w" && <Grid item xs={2} />}
              {test.operater === "b/w" && (
                <>
                  <Grid item xs={1}>
                    <CustomInputLabel label="value 2" />
                  </Grid>
                  <Grid item xs={1}>
                    <CustomOutlinedInput
                      value={test.value2}
                      onChange={(e) =>
                        setTest({
                          ...test,
                          value2: e.target.value,
                        })
                      }
                      type={"number"}
                      width={"100%"}
                    />
                  </Grid>
                </>
              )}
            </>
          )}
          {test.limitsApp !== "Y" && <Grid item xs={8} />}
          <Grid item xs={2} />
          <Grid item xs={2}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={test.mandatory === "Y" ? true : false}
                  onChange={handleCheckboxChangeTest}
                  name="mandatory"
                  disabled={test.testCode === ""}
                />
              }
              label="Mandatory"
            />
          </Grid>
          <Grid item xs={8}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={lineClr.status === "Y" ? true : false}
                  onChange={handleCheckboxChange}
                  name="status"
                />
              }
              label="Active"
            />
          </Grid>
          <Grid item xs={2}>
            <CustomInputLabel label="Comment" />
          </Grid>
          <Grid item xs={9}>
            <CustomOutlinedInput
              value={lineClr.comments}
              onChange={(e) =>
                setLineClr({
                  ...lineClr,
                  comments: e.target.value,
                })
              }
              width={"100%"}
            />
          </Grid>
          <Grid item xs={1}>
            <CustomButton
              backgroundColor="#3498DB"
              variant="contained"
              onClick={onAdd}
              disabled={test.testCode === ""}
              startIcon={<Add />}
            >
              Add
            </CustomButton>
          </Grid>
          <Grid item xs={12} marginTop={"46px"}>
            <CustomTable
              data={lineClr.lstLCTests}
              tableHeader={tableHeader}
              showCheckBox={false}
              showDeleteButton={true}
              onDelete={onRemove}
            />
          </Grid>
        </Grid>
        <div className="buttons">
              <ActionButtons
                onClose={onCancel}
                onSubmit={onSave}
                loading={loading}
                action={EditMode}
                onDelete={() => {
                  handleAction("Are you sure you want to Delete", () =>
                    deleteLineClr(lineClr, handleSnackbarOpen)
                  );
                }}
              />
            </div>
      </Box>
    </>
  );
};

const tableHeader = [
  { id: "testCode", label: "Test Code", field: "testCode" },
  { id: "testDesc", label: "Test Description", field: "testDesc" },
  { id: "limitsApp", label: "Limit Applicable", field: "limitsApp" },
  { id: "operater", label: "Operator", field: "operater" },
  { id: "value1", label: "Value 1", field: "value1" },
  { id: "value2", label: "Value 2", field: "value2" },
  { id: "mandatory", label: "Mandatory", field: "mandatory" },
];
function validate(state, errors) {
  const newErrors = {
    ...errors,
    lccode: state.lccode === "" ? "Code is required" : "",
    lcdesc: state.lcdesc === "" ? "Description is required" : "",
    sopno: state.sopno === "" ? "Sop No is required" : "",
    revdate: state.revdate === "" ? "Revision date is required" : "",
  };
  return newErrors
}
export default CreateLineClearance;
