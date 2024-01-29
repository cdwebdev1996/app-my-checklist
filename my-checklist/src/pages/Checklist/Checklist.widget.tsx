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
import { ChecklistDialogState, ChecklistItem, CheckListDialogActionEnum } from '../../types';
import './Checklist.css';

interface ChecklistPageInterface {
  checklistDialogState: ChecklistDialogState;
  checklistData: Array<ChecklistItem>;
}

export const Checklist: React.FC<ChecklistPageInterface> = ({ checklistDialogState, checklistData }) => {
  const { checklistDialog, setChecklistDialog } = checklistDialogState;
  const [expandedChecklistItem, setExpandedChecklistItem] = React.useState<number>(-1);
  
  const handleToggleExpandedItem = (index: number) => {
    // THIS LIMITS ACCORDIONS TO HAVE ONE EXPANDED ELEMENT AT A TIME 
    index === expandedChecklistItem
      ? setExpandedChecklistItem(-1)
      : setExpandedChecklistItem(index)
  }

  const handleEditChecklistMenuItem = (event: React.SyntheticEvent<Element | Event>, checklistItem: ChecklistItem) => {
    // OPENS CHECKLIST DIALOG (UPDATE)
    event.stopPropagation();
    setChecklistDialog({isOpen: true, actionType: CheckListDialogActionEnum.EDIT, checklistItem, checklistLength: checklistData.length});
  }

  const handleDeleteChecklistMenuItem = (event: React.SyntheticEvent<Element | Event>) => {
    // OPENS CHECKLIST DIALOG (CONFIRMATION FOR DELETION)
    event.stopPropagation();
    setChecklistDialog({isOpen: true, actionType: CheckListDialogActionEnum.DELETE, checklistItem: null, checklistLength: checklistData.length});
  }
  
  return (
    <div className='container-app-checklist'>
      {checklistData.map((checklist, i) => {
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
                    <IconButton onClick={handleDeleteChecklistMenuItem}>
                      <Delete />
                    </IconButton>
                  </Box>
                )
              )}
            </AccordionSummary>
            <AccordionDetails sx={{ padding: '8px 80px 16px' }}>
              {checklist.remarks}
              <Stack direction="row" spacing={1} sx={{ marginTop: '24px' }}>
                {checklist.tags?.split(',').map((tag, i) => {
                  return (
                    <Chip key={i} label={tag} color="primary" sx={{ margin: '0px 3px'}} />
                  )
                })}
              </Stack>
            </AccordionDetails>
            <AccordionActions sx={{background: "#33485D"}}>
              <Button variant='contained' sx={{ background: '#19C0A4' }} onClick={(event) => handleEditChecklistMenuItem(event, checklist)}>UPDATE</Button>
              <Button variant='contained' sx={{ background: '#D37D7D' }} onClick={handleDeleteChecklistMenuItem}>DELETE</Button>
            </AccordionActions>
          </Accordion>
        );
      })}
    </div>
  );
}