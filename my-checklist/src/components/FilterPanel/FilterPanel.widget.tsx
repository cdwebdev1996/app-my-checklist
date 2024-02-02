import * as React from 'react';
import { AddCircle, RestartAlt } from '@mui/icons-material';
import { 
  Button,
  Card,
  Checkbox,
  Divider,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
  Skeleton,
  Typography,
  TextField,
  OutlinedInput,
  IconButton,
} from '@mui/material';
import { Box, Stack } from '@mui/system';
import { AppContext } from '../../context';
import { ActionTypes, ChecklistItem } from '../../types';
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

export const FilterPanel: React.FC = () => {

  const { cachedData, checklistData, isLoading, responseErrorCodes, setCachedData, setIsFiltering, setChecklistDialog } = React.useContext(AppContext);
  const [ tagCollection, setTagCollection ] = React.useState<Array<string>>([]);
  const [ selectedTags, setSelectedTags ] = React.useState<Array<string>>([]);
  const [ textSearch, setTextSearch] = React.useState<string>('');
  const [ cachedFilterData, setCachedFilterData ] = React.useState<ChecklistItem[]>(cachedData);

  const dataContainsSelectedTag = (list: string[], tag: string) => {
    return list.filter(t => tag.includes(t)).length;
  }

  const captureDataAfterInitialFilter = () => {
    // this will capture the most recent data after the first filter
    setCachedFilterData(cachedData);
  }

  const filterChecklistDataByTag = (event: SelectChangeEvent<typeof selectedTags>) => {
    const value = event.target.value as string[];
    setSelectedTags(event.target.value as string[]);
    
    // SEARCH BY TEXT: NAME and REMARKS
    // if: tag has value, search for tag and search text
    // eslse: search by search text only

    if(!value.length) {
      setCachedData(cachedFilterData);
    }
  
    const filteredData = 
        textSearch
          ? value.length
            ? cachedData.filter((data) => {
                return dataContainsSelectedTag(value, data.tags as string);
              })
            : cachedFilterData.length
              ? cachedFilterData
              : checklistData.filter(data =>
                  data.name.toLowerCase().includes(textSearch.toLocaleLowerCase()) ||
                  data.remarks?.toLowerCase().includes(textSearch.toLowerCase())
                )
          : value.length
            ? checklistData.filter((data) => {
                return dataContainsSelectedTag(value, data.tags as string);
              }) 
            : checklistData;
    
    if (value.length || textSearch) {
      setIsFiltering(true);
      setCachedData(filteredData);
    } else {
      setIsFiltering(false);
    }
  }

  const filterChecklistDataByTextSearch = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = event.target.value;
    setTextSearch(value);
    
    // SEARCH BY TEXT: NAME and REMARKS
    // if: tag has value, search for tag and search text
    // eslse: search by search text only
    
    if(!value) {
      setCachedData(cachedFilterData);
    }

    const filteredData = 
        selectedTags.length
          ? value
            ? cachedData.filter(data => data.name.toLowerCase().includes(value.toLocaleLowerCase()) || data.remarks?.toLowerCase().includes(value.toLowerCase()))
            : cachedFilterData.length ? cachedFilterData : checklistData.filter((data) => {
                return dataContainsSelectedTag(selectedTags, data.tags as string);
              })
          : value 
            ? checklistData.filter(data => data.name.toLowerCase().includes(value.toLocaleLowerCase()) || data.remarks?.toLowerCase().includes(value.toLowerCase()))
            : checklistData;

    if (value || selectedTags.length) {
      setIsFiltering(true);
      setCachedData(filteredData);
    } else {
      setIsFiltering(false);
    }
  }

  const handleAddChecklistItem = () => {
    setChecklistDialog({isOpen: true, actionType: ActionTypes.ADD, checklistItem: null, checklistLength: checklistData.length});
  }

  const resetFilter = () => {
    setCachedData(checklistData);
    setCachedFilterData([]);
    setTextSearch('');
    setSelectedTags([]);
    setIsFiltering(false);
  }

  React.useEffect(() => {
    const unFilteredTags = checklistData.map(data => data.tags).join(',').split(',');
    const filteredTags = unFilteredTags.filter((data, index) => unFilteredTags.indexOf(data) === index);
    setTagCollection(filteredTags);
  }, [checklistData]);

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
              <TextField
                id="outlined-basic"
                label="Keywords (for Name and Remarks)"
                variant="outlined"
                size='small'
                fullWidth
                onChange={filterChecklistDataByTextSearch}
                value={textSearch}
                onBlur={captureDataAfterInitialFilter}
              />
            </FormControl>
            <FormControl size="small" sx={{ width: '30%', margin: '0px 3px' }}>
              <InputLabel id="demo-select-small-label">Tags</InputLabel>
              <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                multiple
                value={selectedTags}
                onChange={filterChecklistDataByTag}
                input={<OutlinedInput label="Tag" />}
                renderValue={(selected) => selected.join(', ')}
                MenuProps={MenuProps}
                onClose={captureDataAfterInitialFilter}
              >
                {tagCollection.map((tag) => (
                  tag && (
                    <MenuItem key={tag} value={tag}>
                      <Checkbox checked={selectedTags.indexOf(tag) > -1} />
                      <ListItemText primary={tag} />
                    </MenuItem>
                  )
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{margin: '0px 3px'}}>
              <IconButton aria-label="delete" size="medium" sx={{border: "solid 1px #CACFD2", borderRadius: '4px', height: '40px'}} onClick={resetFilter}>
                <RestartAlt fontSize="inherit" />
              </IconButton>
            </FormControl>
          </Box>
        </Card>
      </div>
      {!responseErrorCodes && (
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
      )}
    </React.Fragment>
  )
}