import React, { useEffect, useState } from "react";
import {
    Grid, Radio,
    FormControlLabel, Select, Checkbox, MenuItem,
    FormHelperText, FormControl, RadioGroup
} from "@mui/material";
import {
    CustomOutlinedInput, CustomTable, CustomInputLabel,
    CustomButton, ActionButtons, CustomAutoComplete
} from "../../../../components";
import {
    updateProdTemplate, initProdTemplate,
    initialErrors, fetchProdTemplate, fetchProducts,
    validate, tableHeaderProdTemplate, fetchTemplates, AddProdTemplate, deleteProdTemplate
} from './Apis';
import { useOutletContext, useNavigate, useParams } from "react-router-dom";

const AssignForm = ({ label }) => {
    const EditMode = label.startsWith("Edit") || false;
    const navigate = useNavigate();
    const { id } = useParams();
    const [handleAction, handleSnackbarOpen] = useOutletContext();
    const [loading, setloading] = useState(false);
    const [Action, setAction] = useState(false);
    const [Templates, setTemplates] = useState([]);
    const [currentTemplate, setCurrentTemplate] = useState({
        "eSignStatus": "string",
        "comments": "",
        "tenantId": "1038",
        "lstProdTemplate": []
    }); // selected template
    const [prodTemplate, setProdTemplate] = useState(initProdTemplate);
    const [products, setProducts] = useState([
        {
            prodcode: "<string>",
            prodshtname: "<string>",
            prodlngname: "<string>",
            prodcatecode: "<string>",
            registrationno: "<string>",
            batchsize: "<string>",
            status: "<string>",
            storagecon: "<string>",
            unit: "<string>",
            description: "<string>",
            controlSubstance: "<string>",
            controlSubDesc: "<string>",
            prodComments: "<string>",
            partialPh: "<string>",
            uoPE: "<string>",
            template: "<string>",
            sectionCode: "<string>",
            sectionDesc: "<string>",
            tenantId: "<string>",
        },
    ]);
    const [errors, setErrors] = useState(initialErrors);
    const onSubmit = () => {
        let body = { body: { ...currentTemplate }, handleSnackbarOpen, navigate }
        if (currentTemplate?.producttemplatepk) {
            updateProdTemplate(body, setloading)
        }
        else {
            AddProdTemplate(body, setloading)
        }
    };
    const handleCheckboxChange = (event) => {
        setProdTemplate({
            ...prodTemplate,
            [event.target.name]: event.target.checked === true ? "Y" : "N",
        });
    };

    const handleRadioChange = (event) => {
        setErrors((prev) => ({ ...prev, statusError: "" }))
        const value = event.target.value;
        setProdTemplate({
            ...prodTemplate,
            status: value === "active" ? "Y" : "N",
        });
    };
    const handleProductChange = (event) => {
        setErrors((prev) => ({ ...prev, proCodeError: "", secCodeError: "" }))
        const selectedValue = event.target.value;
        const selectedProduct = products.find(
            (item) => selectedValue === item.prodcode
        );
        setProdTemplate({
            ...prodTemplate,
            productCode: selectedValue,
            productDesc: selectedProduct.productDesc,
            sectionCode: selectedProduct.sectionCode,
            sectionDesc: selectedProduct.sectionDesc,
        });
    };

    function onAdd() {
        const prev = currentTemplate?.lstProdTemplate ? currentTemplate?.lstProdTemplate : [];
        const newErrors = validate(prodTemplate, errors)
        setErrors(newErrors);
        if (Object.values(newErrors).every((error) => error === "")) {
            setCurrentTemplate((currentTemplate) => ({
                ...currentTemplate,
                lstProdTemplate: [...prev, prodTemplate],
            }));
        }

    }
    const onSearch = () => {
        if (currentTemplate?.templateCode) {
            fetchProdTemplate(currentTemplate.templateCode, setCurrentTemplate, handleSnackbarOpen)
        }
        else {
            handleSnackbarOpen('error', 'Please select template')
        }
    }

    function onEdit(data, index) {
        setAction(true)
        setProdTemplate({ ...data, index });
    }
    function removeProductFromTemplate(data) {
        setCurrentTemplate((currentTemplate) => ({
            ...currentTemplate,
            lstProdTemplate: currentTemplate?.lstProdTemplate.filter(
                (object) => object !== data
            ),
        }));
    }
    function onUpdate() {
        if (Action) {
            const newErrors = validate(prodTemplate, errors)
            setErrors(newErrors);
            const updatedList = [...currentTemplate?.lstProdTemplate]
            updatedList[prodTemplate.index] = prodTemplate;
            if (Object.values(newErrors).every((error) => error === "")) {
                setCurrentTemplate((prev) => ({ ...prev, lstProdTemplate: updatedList }))
                setAction(false)
                setProdTemplate(initProdTemplate);
            }
        }
    }
    useEffect(() => {
        if (id) {
            fetchProdTemplate(id, setCurrentTemplate, handleSnackbarOpen,EditMode)
        }
    }, [id])
    useEffect(() => {
        (async () => {
            await fetchProducts(setProducts, handleSnackbarOpen);
        })();
        if (EditMode === false) {
            fetchTemplates(setTemplates, handleSnackbarOpen)
        }
    }, []);
    const handlePrint = () => {
        let printContents = document.getElementById('printproducts').innerHTML;
        document.body.innerHTML = printContents;
        window.print();
        window.location.reload();
    }

    return (
        <Grid container padding={2}>
            <Grid item xs={12}>
                <Grid display="flex" alignItems="center" container spacing={2}>
                    <Grid item xs={2}>
                        <CustomInputLabel required label="Template Code" />
                    </Grid>
                    <Grid item xs={10}>
                        {EditMode ?
                            <CustomOutlinedInput
                                value={currentTemplate?.templateCode}
                                onChange={(e) => {
                                    setCurrentTemplate({ ...currentTemplate, templateCode: e.target.value })
                                    setErrors((prev) => ({ ...prev, temCodeError: '' }))
                                }}
                                width="20%"
                                disabled={label.startsWith("Edit")}
                                error={errors.temCodeError !== ''}
                                helperText={errors.temCodeError !== '' && errors.temCodeError}
                            /> :
                            <CustomAutoComplete
                                value={currentTemplate?.templateCode}
                                options={Templates.map((item) => (item.tempCode)) || []}
                                onChange={(value) => {
                                    setCurrentTemplate({ ...currentTemplate, templateCode: value })
                                    setErrors((prev) => ({ ...prev, temCodeError: '' }))
                                    fetchProdTemplate(value, setCurrentTemplate, handleSnackbarOpen)
                                }}
                                width="20%"
                                error={errors.temCodeError !== ''}
                                helperText={errors.temCodeError !== '' && errors.temCodeError}
                            />
                        }
                    </Grid>
                    <Grid item xs={2}>
                        <CustomInputLabel required label="Product" />
                    </Grid>
                    <Grid item xs={4}>
                        <FormControl sx={{ width: "70%", marginRight: "8px" }} error={errors.proCodeError !== ''}>
                            <Select
                                value={prodTemplate.productCode}
                                onChange={handleProductChange}
                                variant="outlined"
                                size="small"
                            >
                                {products.map((item) => (
                                    <MenuItem key={item.prodcode} value={item.prodcode}>
                                        {item.productDesc}
                                    </MenuItem>
                                ))}
                            </Select>
                            <FormHelperText>{errors.proCodeError !== '' && errors.proCodeError}</FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid item xs={2}>
                        <CustomInputLabel required label="Section Code" />
                    </Grid>
                    <Grid item xs={4} display={"flex"} alignItems={"center"}>
                        <CustomOutlinedInput
                            value={prodTemplate.sectionCode}
                            onChange={(e) => {
                                setProdTemplate({
                                    ...prodTemplate,
                                    sectionDesc: e.target.value,
                                })
                                setErrors((prev) => ({ ...prev, secCodeError: "" }))
                            }}
                            disabled
                            sx={{ marginRight: "16px" }}
                            width={"40%"}
                            error={errors.secCodeError !== ''}
                            helperText={errors.secCodeError !== '' && errors.secCodeError}
                        />
                        <CustomInputLabel label={prodTemplate.sectionDesc} />
                    </Grid>
                    <Grid item xs={2}>
                        <CustomInputLabel required label="Batch Size" />
                    </Grid>
                    <Grid item xs={10} display={"flex"}>
                        <CustomOutlinedInput
                            value={prodTemplate.batchSize}
                            type={'number'}
                            onChange={(e) => {
                                setProdTemplate({
                                    ...prodTemplate,
                                    batchSize: e.target.value,
                                })
                                setErrors((prev) => ({ ...prev, batchSizeError: "" }))
                            }}
                            width={"15%"}
                            sx={{ marginRight: "16px" }}
                            error={errors.batchSizeError !== ''}
                            helperText={errors.batchSizeError !== '' && errors.batchSizeError}
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={
                                        prodTemplate.changeBatchSizeOnExe === "Y"
                                            ? true
                                            : false
                                    }
                                    onChange={handleCheckboxChange}
                                    name="changeBatchSizeOnExe"
                                />
                            }
                            label="Batch size can be change at Batch initiation"
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <CustomInputLabel required label="Unit" />
                    </Grid>
                    <Grid item xs={10}>
                        <CustomOutlinedInput
                            value={prodTemplate.batchUnit}
                            onChange={(e) => {
                                setProdTemplate({
                                    ...prodTemplate,
                                    batchUnit: e.target.value,
                                })
                                setErrors((prev) => ({ ...prev, unitError: "" }))
                            }}
                            width={"15%"}
                            error={errors.unitError !== ''}
                            helperText={errors.unitError !== '' && errors.unitError}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <CustomInputLabel required label="Control No." />
                    </Grid>
                    <Grid item xs={10}>
                        <CustomOutlinedInput
                            value={prodTemplate.controlNo}
                            onChange={(e) => {
                                setProdTemplate({
                                    ...prodTemplate,
                                    controlNo: e.target.value,
                                })
                                setErrors((prev) => ({ ...prev, contNoError: "" }))
                            }}
                            width={"15%"}
                            error={errors.contNoError !== ''}
                            helperText={errors.contNoError !== '' && errors.contNoError}
                        />
                    </Grid>

                    <Grid item xs={2}>
                        <CustomInputLabel required label="Status" />
                    </Grid>
                    <Grid item xs={10}>
                        <FormControl sx={{ marginRight: "100px" }} error={errors.statusError !== ''}>
                            <RadioGroup
                                value={
                                    prodTemplate.status === "Y" ? "active" : "inactive"
                                }
                                onChange={handleRadioChange}
                                row
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
                            <FormHelperText>{errors.statusError !== '' && errors.statusError}</FormHelperText>
                        </FormControl>
                        <CustomButton
                            backgroundColor="#3498DB"
                            variant="contained"
                            onClick={!Action ? onAdd : onUpdate}
                        >
                            Add
                        </CustomButton>
                    </Grid>
                    <Grid item xs={12}>
                        <div id="printproducts">
                            <CustomTable
                                data={currentTemplate?.lstProdTemplate}
                                tableHeader={tableHeaderProdTemplate}
                                showCheckBox={false}
                                showDeleteButton={true}
                                onDelete={removeProductFromTemplate}
                                onUpdate={onEdit}
                                showUpdateButton={true}
                                containerStyles={{ maxHeight: "400px", overflowY: "auto" }}
                            />
                        </div>
                    </Grid>
                </Grid>
                <div className="buttons">
                    <ActionButtons
                        loading={loading}
                        handlePrint={handlePrint}
                        onSubmit={onSubmit}
                        onClose={() => navigate(-1)}
                        action={EditMode}
                        onDelete={() => {
                            handleAction("Are you sure you want to Delete", () =>
                                deleteProdTemplate(id, handleSnackbarOpen, setloading)
                            );
                        }}
                    />
                </div>
            </Grid>
        </Grid>
    );
};


export default AssignForm;
