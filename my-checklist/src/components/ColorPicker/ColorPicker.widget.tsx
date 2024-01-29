import * as React from 'react';
import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material';
import './ColorPicker.css'
import { CheckListDialogActionEnum } from '../../types';

const colors = [
  '#C0392B',
  '#E74C3C',
  '#9B59B6',
  '#8E44AD',
  '#2980B9',
  '#3498DB',
  '#1ABC9C',
  '#16A085',
  '#27AE60',
  '#2ECC71',
  '#F1C40F',
  '#F39C12',
  '#E67E22',
  '#D35400',
  '#ECF0F1',
  '#BDC3C7',
  '#95A5A6',
  '#7F8C8D',
  '#34495E',
  '#2C3E50',
];

export type Colors = 
  '#C0392B' |
  '#E74C3C' |
  '#9B59B6' |
  '#8E44AD' |
  '#2980B9' |
  '#3498DB' |
  '#1ABC9C' |
  '#16A085' |
  '#27AE60' |
  '#2ECC71' |
  '#F1C40F' |
  '#F39C12' |
  '#E67E22' |
  '#D35400' |
  '#ECF0F1' |
  '#BDC3C7' |
  '#95A5A6' |
  '#7F8C8D' |
  '#34495E' |
  '#2C3E50';

interface ColorPickerComponentInterface {
  actionType: CheckListDialogActionEnum | null;
  hex: Colors | null;
};

const defaultColor = '#95A5A6'; 

export const ColorPicker: React.FC<ColorPickerComponentInterface> = ({ actionType, hex }) => {

  const [color, setColor] = React.useState(defaultColor);

  const handleChange = (event: SelectChangeEvent) => {
    setColor(event.target.value as string as Colors);
  };
  
  React.useEffect(() => {
    actionType === CheckListDialogActionEnum.ADD
      ? setColor(defaultColor)
      : setColor(hex as Colors);
  }, []);

  return (
    <React.Fragment>
      <Box sx={{ minWidth: 120 }}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Color</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={color}
            label="Age"
            onChange={handleChange}
            size='small'
          >
            {colors.map((color, i) => {
                return (
                  <MenuItem value={color}>
                    <div style={{ display: 'flex', flex: 1 }}>
                      <div style={{ width: '100%', height: '20px', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '800'}}>
                        <Typography variant='subtitle2' sx={{color: 'fff', fontWeight: 400}}>{color}</Typography>
                      </div>
                    </div>
                  </MenuItem>
                )
            })}
          </Select>
        </FormControl>
      </Box>
    </React.Fragment>
  )
}