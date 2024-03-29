import * as React from 'react';
import { ExpandMore, Edit, Delete } from '@mui/icons-material';
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Button,
  Chip,
  IconButton,
  Typography
} from '@mui/material';
import { Box, Stack } from '@mui/system';
import { ChecklistItem, ActionTypes } from '../../types';
import './Checklist.css';
import { AppContext } from '../../context';


export const Checklist: React.FC = () => {
  const { cachedData, checklistData, isFiltering, setChecklistDialog } = React.useContext(AppContext);
  const [expandedChecklistItem, setExpandedChecklistItem] = React.useState<number>(-1);
  const dataSource = isFiltering ? cachedData : checklistData;
  const handleToggleExpandedItem = (index: number) => {
    // THIS LIMITS ACCORDIONS TO HAVE ONE EXPANDED ELEMENT AT A TIME 
    index === expandedChecklistItem
      ? setExpandedChecklistItem(-1)
      : setExpandedChecklistItem(index)
  }

  const handleEditChecklistMenuItem = (event: React.SyntheticEvent<Element | Event>, checklistItem: ChecklistItem) => {
    // OPENS CHECKLIST DIALOG (UPDATE)
    event.stopPropagation();
    setChecklistDialog({isOpen: true, actionType: ActionTypes.EDIT, checklistItem, checklistLength: checklistData.length});
  }

  const handleDeleteChecklistMenuItem = (event: React.SyntheticEvent<Element | Event>, checklistItem: ChecklistItem) => {
    // OPENS CHECKLIST DIALOG (CONFIRMATION FOR DELETION)
    event.stopPropagation();
    setChecklistDialog({isOpen: true, actionType: ActionTypes.DELETE, checklistItem, checklistLength: checklistData.length});
  }
  
  return (
    <div className='container-app-checklist'>
      {dataSource.map((checklist, i) => {
        return (
          <Accordion
            expanded={i === expandedChecklistItem}
            key={i}
            onClick={() => handleToggleExpandedItem(i)}
          >
            <AccordionSummary
              expandIcon={<ExpandMore />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              {/* IN-LINE CSS REQUIRED FOR DYNAMIC BACKGROUND COLOR RENDERING */}
              <div className='div-avatar-component' style={{ background: checklist.backgroundColor}}></div>
              <Typography variant='h6' sx={{ lineHeight: 2 }}>{checklist.name}</Typography>
              {expandedChecklistItem === i  ? null : (
                (
                  <Box sx={{ position: 'absolute', right: 48 }}>
                    <IconButton onClick={(event) => handleEditChecklistMenuItem(event, checklist)}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={(event) => handleDeleteChecklistMenuItem(event, checklist)}>
                      <Delete />
                    </IconButton>
                  </Box>
                )
              )}
            </AccordionSummary>
            <AccordionDetails sx={{ padding: '8px 80px 16px' }}>
              {checklist.remarks}
              <Stack direction="row" spacing={1} sx={{ marginTop: '24px' }}>
                {checklist?.tags?.length ? checklist.tags?.split(',').map((tag: string, index: number) => {
                  return (
                    <Chip key={index} label={tag} color="primary" sx={{ margin: '0px 3px'}} />
                  )
                }) : null}
              </Stack>
            </AccordionDetails>
            <AccordionActions sx={{background: "#33485D"}}>
              <Button variant='contained' sx={{ background: '#19C0A4' }} onClick={(event) => handleEditChecklistMenuItem(event, checklist)}>UPDATE</Button>
              <Button variant='contained' sx={{ background: '#D37D7D' }} onClick={(event) => handleDeleteChecklistMenuItem(event, checklist)}>DELETE</Button>
            </AccordionActions>
          </Accordion>
        );
      })}
    </div>
  );
}