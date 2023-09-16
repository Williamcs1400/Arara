import React, {useEffect, useState} from "react";
import Box from '@mui/joy/Box';
import Radio from '@mui/joy/Radio';
import RadioGroup from '@mui/joy/RadioGroup';
import Sheet from '@mui/joy/Sheet';
import {radioButtonBlue} from "../../../styles/specificStyles/radioButtonStyles";
import CustomSubRadioGroup from "./customSubRadioGroup";

export default function CustomRadioGroup({options, subOptions, setChosen}) {
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
            }
        })
    }

    function returnValue(subSelected){
        setChosen({selected, subSelected})
    }


    return (
        <Box style={{marginLeft: 2}}>
            <RadioGroup
                aria-labelledby="storage-label"
                size="md"
                sx={{gap: 1.5}}
            >
                {newOptions.map((value, index) => (
                    <div>
                    <Sheet
                        key={value}
                        style={{marginTop: 1}}
                        sx={{
                            p: 1.5,
                            borderRadius: 'md',
                            backgroundColor: 'transparent',
                            width: 'fit-content',
                            minWidth: 160,
                        }}
                    >
                        <Radio
                            label={value}
                            overlay
                            disableIcon
                            value={value}
                            style={{color: '#fff'}}
                            sx={radioButtonBlue}
                            onChange={(e) => { getIndex(e.target.value) }}
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
                                                // && to increase the specificity to win the base :hover styles
                                                borderColor: theme.vars.palette.primary[500],
                                            },
                                        }),
                                    }),
                                }),
                            }}
                        />
                    </Sheet>
                        { (selected !== -1 && selected === index) && <CustomSubRadioGroup options={subOptions[index]} setChosen={returnValue}/>}
                    </div>
                ))}
            </RadioGroup>
        </Box>
    );
}