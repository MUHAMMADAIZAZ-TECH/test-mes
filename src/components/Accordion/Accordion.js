import * as React from "react";
import MuiAccordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function Accordion({ title, childComponent,htmlColor,sx }) {
  return (
    <div>
      <MuiAccordion>
        <AccordionSummary
          sx={sx}
          expandIcon={<ExpandMoreIcon htmlColor={htmlColor}/>}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>{title}</Typography>
        </AccordionSummary>
        <AccordionDetails>{childComponent}</AccordionDetails>
      </MuiAccordion>
    </div>
  );
}
