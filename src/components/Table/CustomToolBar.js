import {
    GridToolbarContainer,
    GridToolbarExportContainer,
    GridCsvExportMenuItem,
    GridToolbarColumnsButton,
    GridToolbarFilterButton,
    GridToolbarDensitySelector,
} from '@mui/x-data-grid';
import { MenuItem } from '@mui/material';
import { CustomButton } from '../Buttons/Buttons';
import { Add } from '@mui/icons-material';


function CustomToolbar(props) {
    return (
        <GridToolbarContainer {...props}>
            <GridToolbarColumnsButton />
            <GridToolbarFilterButton />
            <GridToolbarDensitySelector />
            {!props.hideexport && <>
                <CustomExportButton exportToPDF={props.exportToPDF} />
                {props.handleClick &&
                    <CustomButton color="primary" startIcon={<Add />} onClick={props.handleClick}>
                        {props.BtnText?props.BtnText:'Add New'}
                    </CustomButton>}</>}
        </GridToolbarContainer>
    );
}
function PDFExportMenuItem(props) {
    const { hideMenu, exportToPDF } = props;
    const OnClick = async () => {
        await exportToPDF()
        hideMenu?.();
    }
    return (<MenuItem onClick={OnClick}>Export as PDF</MenuItem>);
}
function CustomExportButton(props) {
    const { exportToPDF } = props;
    return (
        <GridToolbarExportContainer {...props}>
            <GridCsvExportMenuItem />
            {exportToPDF && <PDFExportMenuItem exportToPDF={exportToPDF} />}
        </GridToolbarExportContainer>
    );
}
export default CustomToolbar;