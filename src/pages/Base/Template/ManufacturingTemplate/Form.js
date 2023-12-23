import React, { useEffect, useState } from "react";
import {
    Grid, Box, MenuItem, Menu, Typography
} from "@mui/material";
import {
    CustomOutlinedInput, CustomInputLabel, CustomButton,
    TreeView, CustomModal, 
} from "../../../../components";
import { Add } from '@mui/icons-material';
import {
    updateTemplate, fetchData, isObjectNotEmpty,
} from './Apis';
import AddToTermplateSection from "./AddToTermplateSection";
import SelectedStageView from "./SelectedStageView";
import { useOutletContext, useNavigate, useParams } from "react-router-dom";

const ManFacForm = ({ label }) => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [, handleSnackbarOpen, setConfig, Config] = useOutletContext();
    const { loading } = Config;
    const [template, setTemplate] = useState({});
    const [openModal, setOpenModal] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [addToTemplate, setAddToTemplate] = useState("");
    const [addToLevel, setAddToLevel] = useState({});
    const [level, setLevel] = useState("stage");
    const handleOpenModal = () => {
        setOpenModal(true);
    };
    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const onSelectLevel = (val) => {
        if (val) {
            setAddToLevel(val);
            if (val.stageLevel && val.unitOperationLevel && val.stepLevel) {
                setLevel("disableAll");
                return;
            }
            if (!val.stageLevel && !val.unitOperationLevel && !val.stepLevel) {
                setLevel("stage");
                return;
            }
            if (val.stageLevel && !val.unitOperationLevel && !val.stepLevel) {
                setLevel("unitOp");
                return;
            }
            if (val.stageLevel && val.unitOperationLevel && !val.stepLevel) {
                setLevel("step");
                return;
            }
        } else {
            setAddToLevel({});
        }
    };

    const handleMenu = (val) => {
        handleMenuClose();
        setAddToTemplate(val);
        handleOpenModal();
    };

    const onAddLevel = async (addedLevel) => {
        let updatedTemplate;
        if (isObjectNotEmpty(addedLevel)) {
            if (addToTemplate === "stage") {
                updatedTemplate = {
                    ...template,
                    stage: [...template.stage, addedLevel],
                };
                setTemplate(updatedTemplate);
            }
            if (addToTemplate === "unitOp") {
                updatedTemplate = {
                    ...template,
                    unitOperation: [...template.unitOperation, addedLevel],
                };
                setTemplate(updatedTemplate);
            }
            if (addToTemplate === "step") {
                updatedTemplate = {
                    ...template,
                    step: [...template.step, addedLevel],
                };
                setTemplate(updatedTemplate);
            }
            await updateTemplate({ body: updatedTemplate, handleSnackbarOpen, navigate },setConfig);
        }
    };
    useEffect(() => {
        if (id) {
            fetchData(id, setTemplate, setConfig, handleSnackbarOpen,'Template')
        }
    }, [id])
    return (
        <Grid container padding={2}>
            <Grid item xs={12}>
                <Grid display="flex" alignItems="center" container spacing={2}>
                    <Grid item xs={2}>
                        <CustomInputLabel required label="Template Code" />
                    </Grid>
                    <Grid item xs={10}>
                        <CustomOutlinedInput
                            value={template.tempCode}
                            width="20%"
                            disabled={label.startsWith("Edit")}
                        />
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        display={"flex"}
                        alignItems={"center"}
                        justifyContent={"space-between"}
                        marginTop={3}
                    >
                        <Typography variant="h6">Manufacturing Template</Typography>
                        <CustomButton onClick={handleMenuOpen} startIcon={<Add />}>
                            ADD TO TEMPLATE
                        </CustomButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                        >
                            <MenuItem
                                disabled={
                                    level === "disableAll" || level !== "stage" ? true : false
                                }
                                onClick={() => handleMenu("stage")}
                                value={"stage"}
                            >
                                Stage
                            </MenuItem>
                            <MenuItem
                                disabled={
                                    level === "disableAll" || level !== "unitOp" ? true : false
                                }
                                onClick={() => handleMenu("unitOp")}
                            >
                                Unit Operation
                            </MenuItem>
                            <MenuItem
                                disabled={
                                    level === "disableAll" || level !== "step" ? true : false
                                }
                                onClick={() => handleMenu("step")}
                            >
                                Step
                            </MenuItem>
                        </Menu>
                    </Grid>
                    <Grid item xs={4.5}>
                        {template.stage && (
                            <Box
                                sx={{
                                    borderRadius: 1,
                                    paddingX: 2,
                                    border: "1px solid lightgray",
                                }}
                            >
                                <TreeView data={template} onSelectLevel={onSelectLevel} />
                            </Box>
                        )}
                    </Grid>
                    <Grid item xs={7.5}>
                        {template.stage && (
                            <Box
                                sx={{
                                    borderRadius: 1,
                                    paddingX: 2,
                                    border: "1px solid lightgray",
                                    minHeight: "550px",
                                    maxHeight: "550px",
                                }}
                            >
                                <SelectedStageView selectedValue={addToLevel} />
                            </Box>
                        )}
                    </Grid>
                </Grid>
            </Grid>
            <CustomModal
                open={openModal}
                onClose={handleCloseModal}
                width={"50%"}
                content={
                    <AddToTermplateSection
                        template={template}
                        addToTemplate={addToTemplate}
                        addToLevel={addToLevel}
                        closeModal={handleCloseModal}
                        onAddLevel={onAddLevel}
                    />
                }
            />
        </Grid>
    );
};


export default ManFacForm;
