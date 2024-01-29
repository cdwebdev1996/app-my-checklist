import * as React from 'react';
import { AddCircle, Search } from '@mui/icons-material';
import { 
  Button,
  Card,
  Checkbox,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
  Skeleton,
  Typography,
  TextField,
  OutlinedInput,
} from '@mui/material';
import { Box, Stack } from '@mui/system';
import { CheckListDialogActionEnum, ChecklistDialogState, ChecklistItem } from '../../types';
import './FilterPanel.css';


const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  //STATIC DATA
  const names: Array<string> = [
    'Oliver Hansen',
    'Van Henry',
    'April Tucker',
    'Ralph Hubbard',
    'Omar Alexander',
    'Carlos Abbott',
    'Miriam Wagner',
    'Bradley Wilkerson',
    'Virginia Andrews',
    'Kelly Snyder',
  ];

interface FilterPanelComponentInterface {
  checklistData: Array<ChecklistItem>;
  checklistDialogState: ChecklistDialogState;
  isLoading: boolean;
}

export const FilterPanel: React.FC<FilterPanelComponentInterface> = ({ checklistData, checklistDialogState, isLoading }) => {

  const { checklistDialog, setChecklistDialog } = checklistDialogState;
  const [personName, setPersonName] = React.useState<string[]>([]);

  const handleChange = (event: SelectChangeEvent<typeof personName>) => {
    // HANDLES MULTIPLE TAGS SELECTION ACTION FROM THE FILTER CRITERIA PANEL
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const handleAddChecklistItem = () => {
    setChecklistDialog({isOpen: true, actionType: CheckListDialogActionEnum.ADD, checklistItem: null, checklistLength: checklistData.length});
  }

  return (
    <React.Fragment>
      <div className='container-filter-panel'>
        <Card variant="outlined" sx={{ width: '100%' }}>
          <Box sx={{ p: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" component="div">Filter Criteria Panel</Typography>
            </Stack>
          </Box>
          <Divider />
          <Box sx={{ p: 2, display: 'flex', alignItems: 'center'}}>
            <FormControl size="small" sx={{ width: '70%', margin: '0px 3px' }}>
              <TextField id="outlined-basic" label="Search by text" variant="outlined" size='small' fullWidth  />
            </FormControl>
            <FormControl size="small" sx={{ width: '30%', margin: '0px 3px' }}>
              <InputLabel id="demo-select-small-label">Tags</InputLabel>
              <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                multiple
                value={personName}
                onChange={handleChange}
                input={<OutlinedInput label="Tag" />}
                renderValue={(selected) => selected.join(', ')}
                MenuProps={MenuProps}
              >
                {names.map((name) => (
                  <MenuItem key={name} value={name}>
                    <Checkbox checked={personName.indexOf(name) > -1} />
                    <ListItemText primary={name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{margin: '0px 3px'}}>
            <IconButton aria-label="delete" size="medium" sx={{border: "solid 1px #CACFD2", borderRadius: '4px', height: '40px'}}>
              <Search fontSize="inherit" />
            </IconButton>
            </FormControl>
          </Box>
        </Card>
      </div>
      <div className="container-checklist-action-overview">
        <div className='txt-checklist-count'>
          {isLoading ? (
            <Skeleton variant="rectangular" width={175} height={32} />
          ) : <Typography variant='h6'>{`Today's tasks: (${checklistData.length || 0})`}</Typography>}
        </div>
        <div className='btn-checklist-add'>
          <Button component="label" size='small' variant="contained" startIcon={<AddCircle />} onClick={handleAddChecklistItem}>
            Add item
          </Button>
        </div>
      </div>
    </React.Fragment>
  )
}