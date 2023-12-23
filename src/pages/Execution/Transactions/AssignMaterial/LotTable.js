import React from 'react';
import {
  Box, Collapse, IconButton, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Typography,
  Paper, Button
} from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp, Add, Remove } from '@mui/icons-material';
// import CustomTableReorder from './CustomTableReorder';
import CustomTable from '../../../../components/Table/CustomTable';

function Row(props) {
  const { row, onAddLot, onRemoveLot, rowIndex, handleReorder } = props;
  const [open, setOpen] = React.useState(false);

  const handleAddLot = () => {
    onAddLot(row, rowIndex);
  };

  // const handleRemoveLot = (lot, lotIndex) => {
  //   onRemoveLot(row, rowIndex, lot, lotIndex);
  // };
  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell width={5}>
          <IconButton
            aria-label="expand row"
            size="small"
            disabled={row.lotBreakable !=="Y"}
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell>{row.seqNo} </TableCell>
        <TableCell>{row.ingCode}</TableCell>
        <TableCell>{row.ingDesc}</TableCell>
        <TableCell>{row.qtyKg}</TableCell>
        <TableCell>{row.qtyG}</TableCell>
        <TableCell>{row.qtyMg}</TableCell>
        <TableCell>{row.ww}</TableCell>
        <TableCell>{row.thQtyKg}</TableCell>
        <TableCell>{row.thQtyG}</TableCell>
        <TableCell>{row.thQtyMg}</TableCell>
      </TableRow>
      <TableRow >
        <TableCell style={{ paddingBottom: 0, paddingTop: 0, width: '100%' }} colSpan={11}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ width: '100%', padding: 3 }}>
              <Box
                display='flex'
                flexDirection='row'
                justifyContent='space-between'
                width='100%'
                padding={2}
              >
                <Typography variant="h6" gutterBottom component="div">
                  Lot Information
                </Typography>
                <Button
                  startIcon={<Add />}
                  onClick={handleAddLot}
                >
                  Add Lot
                </Button>
              </Box>
              <CustomTable
                tableHeader={LotTableHeader}
                data={row.lot}
                showCheckBox={false}
                // onReorder={handleReorder}
                // showDeleteButton
                // onDelete={handleRemoveLot}
              />
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}
const LotTableHeader = [
  { id: 'lotNo', label: 'Lot No', field: 'lotNo', },
  { id: 'subSeq', label: 'Sub Seq.#', field: 'subSeq', },
  { id: 'thQtyKg', label: 'Th. Qty (kg)', field: 'thQtyKg', },
  { id: 'thQtyG', label: 'Th. Qty (g)', field: 'thQtyG', },
  { id: 'thQtyMg', label: 'Th. Qty (mg)', field: 'thQtyMg', },
  { id: 'comments', label: 'Comments', field: 'comments' },
]
export default function CollapsibleTable({
  data,
  onAddLot,
  onRemoveLot,
  // handleReorder,
  state,
  setState
}) {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead sx={{ backgroundColor: "#e0e0e0" }}>
          <TableRow>
            <TableCell />
            <TableCell>Seq. #</TableCell>
            <TableCell>Code</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Qty Kg</TableCell>
            <TableCell>Qty G</TableCell>
            <TableCell>Qty Mg</TableCell>
            <TableCell>ww</TableCell>
            <TableCell>Th. Qty(KG)</TableCell>
            <TableCell>Th. Qty(G)</TableCell>
            <TableCell>Th. Qty(MG)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map((row, rowIndex) => (
            <Row
              key={row.ingCode}
              rowIndex={rowIndex}
              row={row}
              onAddLot={onAddLot}
              onRemoveLot={onRemoveLot}
              // handleReorder={handleReorder}
              state={state}
              setState={setState}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
