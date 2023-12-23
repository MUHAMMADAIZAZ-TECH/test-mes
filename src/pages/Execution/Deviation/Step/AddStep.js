import {
  Box, Grid, IconButton, Paper, Stack, Table,
  TableBody, TableCell, TableContainer, TableHead, TableRow,
  useMediaQuery, useTheme
} from '@mui/material'
import React, { useState } from 'react'
import { AutoComplete, InputField, ActionButtons, Accordion, CustomButton, CustomInput } from '../../../../components'
import { Add, Close, Delete, Search } from '@mui/icons-material'

const AddStep = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [prodVar, setProdVar] = useState({
    rawData: [...Row],
    variables: [],
    prodCode: "",
    tempCode: "",
    stepCategory: "",
    tenantId: "",
  });
  return (
    <Paper sx={{ flexGrow: 1, paddingX: 3, paddingTop: 2, paddingBottom: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6} lg={4}>
          <AutoComplete width={'100%'} label="Refrence No" options={[]}
            value={''}
            inputValue={''}
            placeholder="search..."
            error={false}
            required={true}
          />
        </Grid>
      </Grid>
      <Grid container spacing={2} mt={2}>
        <Grid item xs={12} md={6} lg={4}>
          <AutoComplete width={'100%'} label="Product" options={[]}
            value={''}
            inputValue={''}
            placeholder="search..."
            error={false}
            required={true}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <AutoComplete width={'100%'} label="Section" options={[]}
            value={''}
            inputValue={''}
            placeholder="search..."
            error={false}
            required={true}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <AutoComplete width={'100%'} label="Batch No" options={[]}
            value={''}
            inputValue={''}
            placeholder="search..."
            error={false}
            required={true}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <AutoComplete width={'100%'} label="Stage" options={[]}
            value={''}
            inputValue={''}
            placeholder="search..."
            error={false}
            required={true}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <AutoComplete width={'100%'} label="Unit Operation" options={[]}
            value={''}
            inputValue={''}
            placeholder="search..."
            error={false}
            required={true}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <AutoComplete width={'100%'} label="Step Category" options={[]}
            value={''}
            inputValue={''}
            placeholder="search..."
            error={false}
            required={true}
          />
        </Grid>
        <Grid item xs={12} md={8} lg={6}>
          <AutoComplete width={'100%'} label="Step" options={[]}
            value={''}
            inputValue={''}
            placeholder="search..."
            error={false}
            required={true}
          />
        </Grid>
        <Grid item xs={12} md={4} lg={3}>
          <InputField fullWidth label="Step Sequence"
            value={''}
            placeholder="search..."
            error={false}
            required={true}
          />
        </Grid>
        <Grid item xs={12} md={12} lg={3}>
          <Box display='flex' justifyContent='flex-end'>
            <Stack spacing={1} direction="row" >
              <CustomButton
                backgroundColor="#28B463"
                variant="contained"
                startIcon={<Search />}
              >
                Search
              </CustomButton>
              <CustomButton
                backgroundColor="#E74C3C"
                variant="contained"
                startIcon={<Close />}
              >
                Close
              </CustomButton>
            </Stack>
          </Box>
        </Grid>
      </Grid>
      <Grid container spacing={2} mt={5}>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <InputField fullWidth multiline rows={3} label={'Description'} sx={{ margin: 0.5 }} />
        </Grid>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <InputField fullWidth multiline rows={3} label={'Details'} sx={{ margin: 0.5 }} />
        </Grid>
      </Grid>
      <Grid container spacing={2} mt={3}>
        <Grid item xs={12}>
          <Box>
            <Accordion
              title="Assign Variable Values"
              childComponent={
                <TableContainer sx={{ width: "100%" }} component={Paper}>
                  <Table>
                    <TableHead sx={{ backgroundColor: "#e0e0e0" }}>
                      <TableRow>
                        <TableCell>Variable</TableCell>
                        <TableCell>Value</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {prodVar.rawData.map((row) => (
                        <TableRow key={row.name}>
                          {tableHeaderRawData.map(
                            (column) =>
                              column.field !== "testDataValue" && (
                                <TableCell
                                  key={column.id}
                                  component="th"
                                  scope="row"
                                  width={isSmallScreen ? '100%' : '70%'}
                                >
                                  {row[column.field]}
                                </TableCell>
                              )
                          )}
                          <TableCell width={isSmallScreen ? '100%' : '30%'}>
                            <CustomInput width={"100%"} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              }
            />
            <Accordion
              title="Assign Raw Data Values"
              childComponent={
                <TableContainer sx={{ width: "100%" }} component={Paper}>
                  <Table>
                    <TableHead sx={{ backgroundColor: "#e0e0e0" }}>
                      <TableRow>
                        <TableCell>Raw Data</TableCell>
                        <TableCell>Values</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {prodVar.rawData.map((row) => (
                        <TableRow key={row.name}>
                          {tableHeaderRawData.map(
                            (column) =>
                              column.field !== "testDataValue" && (
                                <TableCell
                                  key={column.id}
                                  component="th"
                                  scope="row"
                                  width={'70%'}
                                >
                                  {row[column.field]}
                                </TableCell>
                              )
                          )}
                          <TableCell width={'30%'}>
                            <CustomInput width={"100%"} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              }
            />
            <Accordion
              title="Validation"
              childComponent={
                <Box style={{ overflowX: 'auto' }} component={Paper}>
                  <TableContainer sx={{ width: isSmallScreen ? 350 : '100%' }}>
                    <Table>
                      <TableHead sx={{ backgroundColor: "#e0e0e0" }}>
                        <TableRow>
                          {column3.map((column) =>
                            column.field !== "testDataValue" && (
                              <TableCell key={column.id}>
                                {column.label}
                              </TableCell>
                            )
                          )}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {Row3.map((row) => (
                          <TableRow key={row.name}>
                            {column3.map((column) =>
                              column.field !== "testDataValue" && (
                                <TableCell key={column.id} component="th" scope="row">
                                  {row[column.field]}
                                </TableCell>
                              )
                            )}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              }
            />
            <Accordion
              title="Assign Equipment Types"
              childComponent={
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6} lg={4}>
                    <AutoComplete width={'100%'} label="Equipment Types" options={[]}
                      value={''}
                      inputValue={''}
                      placeholder="search..."
                      error={false}
                      required={true}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <InputField fullWidth label="Minimum No"
                      value={''}
                      placeholder="search..."
                      error={false}
                      required={true}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <CustomButton startIcon={<Add />}>Add</CustomButton>
                  </Grid>
                  <Grid item xs={12}>
                    <TableContainer sx={{ width: "100%" }} component={Paper}>
                      <Table>
                        <TableHead sx={{ backgroundColor: "#e0e0e0" }}>
                          <TableRow>
                            {column2.map(
                              (column) =>
                                column.field !== "testDataValue" && (
                                  <TableCell key={column.id}>
                                    {column.label}
                                  </TableCell>
                                )
                            )}
                            <TableCell>Minimum No</TableCell>
                            <TableCell>Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {Row2.map((row) => (
                            <TableRow key={row.name}>
                              {column2.map(
                                (column) =>
                                  column.field !== "testDataValue" && (
                                    <TableCell
                                      key={column.id}
                                      component="th"
                                      scope="row"
                                    >
                                      {row[column.field]}
                                    </TableCell>
                                  )
                              )}
                              <TableCell>
                                <CustomInput width={"100%"} value={'500'} />
                              </TableCell>
                              <TableCell>
                                <IconButton
                                  size="small"
                                >
                                  <Delete fontSize="small" />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                </Grid>
              }
            />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <ActionButtons
            loading={false}
            onClose={() => console.log('Console')}
            onSubmit={() => console.log('Console')}
          />
        </Grid>
      </Grid>
    </Paper>
  )
}

const tableHeaderRawData = [
  { id: "variable", label: "Variable", field: "variable" },
];
const Row = [
  { variable: "Custom Variable" },
];
const column2 = [
  { id: "equiptype", label: "Equipment Type", field: "equiptype" },
];
const Row2 = [
  { equiptype: "Equipment Type-E-323" },
];
const column3 = [
  { id: "ruleno", label: "Rule No", field: "ruleno" },
  { id: "formula", label: "Formula", field: "formula" },
  { id: "operator", label: "Operator", field: "operator" },
  { id: "val1", label: "Value 1", field: "val1" },
  { id: "val2", label: "Value 2", field: "val2" },
  { id: "Action", label: "Action", field: "Action" },
];
const Row3 = [
  {
    ruleno: "rule-323",
    formula: "rule-323",
    operator: "rule-323",
    val1: "rule-323",
    val2: "rule-323",
  },
];
export default AddStep;