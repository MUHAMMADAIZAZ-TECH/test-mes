import React from "react";
import Grid from "@mui/material/Grid";
import { 
    CustomInputLabel ,
    CustomOutlinedInput,
    CustomButton
} from "../index";

const RangeFilter = ({ handleRange, onApply, onReset, Range }) => {
    return (
        <Grid alignItems="center" container spacing={2} marginBottom={3}>
            {Range && Object.keys(Range).map((item, i) => (
                <Grid display="flex" item xs={5.25}>
                    <Grid item xs={4}>
                        <CustomInputLabel required label={i === 0 ? 'From' : 'To'} />
                    </Grid>
                    <Grid item xs={8}>
                        <CustomOutlinedInput
                            placeholder={`${i === 0 ? 'Min' : 'Max'} Range`}
                            name={i === 0 ? 'min' : 'max'}
                            value={Range[item]}
                            onChange={handleRange}
                            width={"100%"}
                        />
                    </Grid>
                </Grid>
            ))}
            <Grid item xs={1.5}>
                <CustomButton
                    backgroundColor="#3498DB"
                    sx={{ margin: 0.5 }}
                    variant="contained"
                    onClick={() => onApply(Range.min, Range.max)}>
                    Filter
                </CustomButton>
                <CustomButton
                    sx={{ margin: 0.5 }}
                    backgroundColor="#3498DB"
                    variant="contained"
                    onClick={onReset}
                >
                    Reset
                </CustomButton>
            </Grid>
        </Grid>
    );
};

export default RangeFilter;
