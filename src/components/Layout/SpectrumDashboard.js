import React from "react";
import { CssBaseline, Box, Container, Grid } from "@mui/material";
import { CustomAppBar, CustomDrawerHeader, MediaCard } from "../index";
import mpis from '../../utils/Images/mpis.png'
import { useNavigate } from "react-router-dom";
const SpectrumDashboard = () => {
    const navigate = useNavigate()
    return (
        <Box sx={{ display: "flex" }}>
            <CssBaseline />
            <CustomAppBar />
            <Box
                component="nav"
                aria-label="mailbox folders"
            >
            </Box>
            <Container
                component="main"
                // maxWidth='auto'
                sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${370}px)` } }}
            >
                <CustomDrawerHeader />
                <Box sx={{ paddingX: 3,paddingY:3 }}>
                    <Box sx={{ flexGrow: 1, marginBottom: 3 }}>
                        <Grid display="flex" container spacing={5}>
                            <Grid item lg={4} md={6} sm={6} xs={12}>
                                <MediaCard
                                    title="Base"
                                    image={mpis}
                                    description="In this module user can setup different parameters regarding Section, Area, Equipment, Batch Type, Product Category Product & you can also setup the tests and their related methods, master formula, ingredient adjustment, manufacturing template etc., & you can also setup all the tests and their related methods, etc. the information entered in the base module is used by other processes of the system."
                                    onClick={() => navigate('/base')}
                                />
                            </Grid>
                            <Grid item lg={4} md={6} sm={6} xs={12}>
                                <MediaCard
                                    title="Execution"
                                    image={mpis}
                                    description="MPiS Execution module is the application of parameters defined in Base Module. 
                                    In this module the user may access menus including: Transactions, Deviation, Listing, Reports, and Inquiry. This provides the ability to make different batches with the help of the MPR defined in the Base Module and attaches relevant information with the product batch to be manufactured."
                                    onClick={() => navigate('/execution')}
                               />
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default SpectrumDashboard;
