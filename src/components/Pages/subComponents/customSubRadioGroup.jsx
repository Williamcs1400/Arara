import React, {useEffect, useState} from "react";
import Box from '@mui/joy/Box';
import Radio from '@mui/joy/Radio';
import RadioGroup from '@mui/joy/RadioGroup';
import Sheet from '@mui/joy/Sheet';
import {radioButtonBlue} from "../../../styles/specificStyles/radioButtonStyles";

export default function CustomSubRadioGroup({options, setChosen}) {
    const [newOptions, setOptions] = useState([]);
    const [selected, setSelected] = useState(-1);

    useEffect(() => {
        if (options) {
            setOptions(options);
        }
    }, [options]);

    function getIndex(aux){
        options.forEach((value, index) => {
            if(value === aux){
                setSelected(index);
                setChosen(index);
            }
        })
    }

    return (
        <Box style={{marginTop: 10, marginLeft: 20}}>
            <RadioGroup
                aria-labelledby="storage-label"
                size="md"
                sx={{gap: 1.5}}
            >
                {newOptions.map((value) => (
                    <Sheet
                        key={value}
                        style={{marginTop: 1}}
                        sx={{
                            p: 1.5,
                            borderRadius: 'md',
                            backgroundColor: 'transparent',
                            width: 'fit-content',
                            minWidth: 180,
                        }}
                    >
                        <Radio
                            label={value}
                            overlay
                            disableIcon
                            value={value}
                            style={{color: '#fff'}}
                            sx={radioButtonBlue}
                            onChange={(e) => {getIndex(e.target.value)}}
                            slotProps={{
                                label: ({ checked }) => ({
                                    sx: {
                                        color: checked ? '#fff' : '#628ab8',
                                    },

                                }),
                                action: ({ checked }) => ({
                                    sx: (theme) => ({
                                        ...(checked && {
                                            '--variant-borderWidth': '2px',
                                            '&&': {
                                                borderColor: theme.vars.palette.primary[500],
                                            },
                                        }),
                                    }),
                                }),
                            }}
                        />
                    </Sheet>
                ))}
            </RadioGroup>
        </Box>
    );
}