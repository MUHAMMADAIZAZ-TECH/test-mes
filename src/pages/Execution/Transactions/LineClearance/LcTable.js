import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { styled } from "@mui/system";
import CustomTableMultipleRow from '../../../../components/Table/MultileRowTable';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { IconButton } from '@mui/material';

const CustomTableCell = styled(TableCell)({
    lineHeight: 1,
    padding: 12,
    cursor: "pointer",
});
function Row(props) {
    const { row, TestHeader, selectedRows, setSelectedRows, column ,defaultOpen} = props;
    const [open, setOpen] = React.useState(defaultOpen);
    return (
        <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell width={5}>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    </IconButton>
                </TableCell>
                {column.map((col) => <TableCell> {row[col.id]}</TableCell>)}
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                                Tests
                            </Typography>
                            <CustomTableMultipleRow
                                data={row.lstLCTests || []}
                                tableHeader={TestHeader || []}
                                selectedRows={selectedRows}
                                setSelectedRows={setSelectedRows}
                            />
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

Row.propTypes = {
    row: PropTypes.shape({
        calories: PropTypes.number.isRequired,
        carbs: PropTypes.number.isRequired,
        fat: PropTypes.number.isRequired,
        history: PropTypes.arrayOf(
            PropTypes.shape({
                amount: PropTypes.number.isRequired,
                customerId: PropTypes.string.isRequired,
                date: PropTypes.string.isRequired,
            }),
        ).isRequired,
        name: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        protein: PropTypes.number.isRequired,
    }).isRequired,
};

export default function CollapsibleTable({
    rows,
    showCheckBox,
    tableHeader,
    TestHeader,
    selectedRows,
    setSelectedRows,
    defaultOpen
}) {
    return (
        <TableContainer component={Paper}>
            <Table aria-label="collapsible table">
                <TableHead sx={{ backgroundColor: "#e0e0e0" }}>
                    <TableRow>
                        {showCheckBox && <CustomTableCell />}
                        <TableCell></TableCell>
                        {tableHeader.map((column) => (
                            <CustomTableCell key={column.id}>
                                {column.label}
                            </CustomTableCell>
                        ))}
                        <CustomTableCell />
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <Row
                            key={row.lccode}
                            row={row}
                            TestHeader={TestHeader}
                            selectedRows={selectedRows}
                            setSelectedRows={setSelectedRows}
                            column={tableHeader}
                            defaultOpen={defaultOpen}
                        />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
