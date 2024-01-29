import * as React from 'react';
import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogProps, 
  DialogTitle,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material';
import { Box, Stack } from '@mui/system';
import { ChecklistDialogState, ChecklistItem, CheckListDialogActionEnum, CheckListDialogActionType, Colors, Status, StatusEnum } from '../../types';
import { colors, defaultColor } from '../../utils';
import './ChecklistItemDialog.css';
import { AddChecklistAPI } from '../../middleware';

interface ChecklistDialogComponentInterface {
  checklistDialogState: ChecklistDialogState;
  isLoading: boolean;
  showFeedbackMessage: (
    action: CheckListDialogActionType | null,
    status: Status,
  ) => void;
  getAllChecklist: () => void;
}

export const CheckListItemDialog: React.FC<ChecklistDialogComponentInterface> = ({ checklistDialogState, isLoading, showFeedbackMessage, getAllChecklist }) => {

  const [scroll, setScroll] = React.useState<DialogProps['scroll']>('paper');
  const descriptionElementRef = React.useRef<HTMLElement>(null);
  const { checklistDialog, setChecklistDialog } = checklistDialogState;
  const { isOpen, actionType } = checklistDialog;
  
  const [newChecklistItem, setNewChecklistItem] = React.useState<ChecklistItem | null>(null);
  const [checklistItemName, setChecklistItemName] = React.useState<string>('');
  const [checklistItemRemarks, setChecklistItemRemarks] = React.useState<string | null>('');
  const [checklistItemTags, setChecklistItemTags] = React.useState<string | null>('');
  const [checklistBgColor, setChecklistBgColor] = React.useState<Colors>(defaultColor);
  const [inputTag, setInputTag] = React.useState<string>('');

  const renderDialogTitle = () => {
    switch(actionType) {
      case CheckListDialogActionEnum.ADD:
        return 'Create Checklist Item';
      case CheckListDialogActionEnum.EDIT:
        return 'Update Checklist Item';
      case CheckListDialogActionEnum.DELETE:
        return 'Confirm Delete Action';
      default:
        return null;
    }
  }

  const handleClose = () => {
    setChecklistDialog({isOpen: false, actionType: null, checklistItem: null, checklistLength: 0});
  }

  const handleSubmit = () => {
    // CALL UPDATE API HERE
    if (checklistDialog.actionType === CheckListDialogActionEnum.ADD) {
      const payload: ChecklistItem = {
        priority: checklistDialogState.checklistDialog.checklistLength,
        name: checklistItemName,
        remarks: checklistItemRemarks,
        backgroundColor: checklistBgColor,
        tags: checklistItemTags
      }
      AddChecklistAPI(
        null,
        () => showFeedbackMessage(CheckListDialogActionEnum.ADD, StatusEnum.SUCCESS),
        () => showFeedbackMessage(CheckListDialogActionEnum.ADD, StatusEnum.FAILED),
        () => getAllChecklist(),
        payload,
      );
    }
    //IF Successs
    
    handleClose();
    showFeedbackMessage(checklistDialog.actionType, StatusEnum.SUCCESS);
  }

  const handleDialogBackdropClick: DialogProps["onClose"] = (event, reason) => {
    // PREVENTS DIALOG FROM CLOSING UPON CLICKING ON THE BACKDROP AREA
    if (reason && reason === "backdropClick") 
        return;
        handleClose();
  }

  const renderDeleteConfirmationContent = () => {
    return (
      <React.Fragment>
        <DialogContent>
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
          >
            <Typography variant='body1'>Are you sure you want to delete this checklist item?</Typography>
          </DialogContentText>
        </DialogContent>
      </React.Fragment>
    );
  }

  const removeTag = (tag: string) => {
    const tags = checklistItemTags;
    const tagStringToArray: Array<string> = tags?.split(',') || [];
    setChecklistItemTags(tagStringToArray.filter(item => item !== tag).join(','));
  }

  const addTag= () => {
    var tags = checklistItemTags;
    if (inputTag) {
      if (tags) {
        setChecklistItemTags(tags?.concat(`,${inputTag}`));
      } else {
        setChecklistItemTags(inputTag)
      }
    }
    setInputTag('');
  }

  const handleChange = (event: SelectChangeEvent) => {
    setChecklistBgColor(event.target.value as string as Colors);
  };
  
  const _renderChecklistItemContent = () => {
    return (
      <React.Fragment>
        <div>
          <div className='container-checklist-dialog-row-1'>
            <div className='txt-checklist-name'>
              <TextField 
                id="outlined-basic" 
                label='Name' 
                variant="outlined" 
                size='small' 
                value={checklistItemName}
                onChange={(e) => setChecklistItemName(e.target.value)} 
                fullWidth 
              />
            </div>
            <div className='custom-sel-color-picker'>
              <React.Fragment>
                <Box sx={{ minWidth: 120 }}>
                  <FormControl fullWidth>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={checklistBgColor as Colors}
                      onChange={handleChange}
                      size='small'
                    >
                      {colors.map((color, i) => {
                          return (
                            <MenuItem value={color}>
                              <div className='container-menu-item-color-picker'>
                                {/* IN-LINE CSS REQUIRED FOR DYNAMIC BACKGROUND COLOR RENDERING */}
                                <div className='div-menu-item-color-picker' style={{ background: color }}></div>
                              </div>
                            </MenuItem>
                          )
                      })}
                    </Select>
                  </FormControl>
                </Box>
              </React.Fragment>
            </div>
          </div>
          <div className='container-checklist-dialog-row-2'>
            <TextField
              id="outlined-multiline-static"
              label="Remarks"
              multiline
              rows={4}
              fullWidth
              value={checklistItemRemarks}
              onChange={(e) => setChecklistItemRemarks(e.target.value)}
            />
          </div>
          <div className='container-checklist-dialog-row-3'>
            <div className='txt-checklist-tag'>
              <TextField
                id="outlined-basic"
                label="Tags"
                variant="outlined"
                size='small'
                onChange={e => setInputTag(e.target.value)}
                onKeyDown={e => e.key === 'Enter' ? addTag() : null}
                value={inputTag}
                fullWidth
              />
            </div>
            <div className='btn-checklist-tag-add'>
              <Button size="medium" variant='contained' onClick={addTag}>Add tag</Button>
            </div>
          </div>
          {checklistItemTags && (
            <div className='container-checklist-tag-list'>
              <div className='container-checklist-tag-list-box'>
                <Stack direction="row" spacing={1}>
                  {checklistItemTags.split(',').map((tag, i) => {
                    return (
                      <Chip label={tag} variant="outlined" onDelete={() => removeTag(tag)}/>
                    );
                  })}
                </Stack>
              </div>
            </div>
          )}
        </div>
      </React.Fragment>
    )
  }

  const renderDialogContent = () => {
    if (actionType === CheckListDialogActionEnum.DELETE) {
      return renderDeleteConfirmationContent();
    } else {
      return (
        <React.Fragment>
          <DialogContent dividers>
            <DialogContentText
              id="scroll-dialog-description"
              ref={descriptionElementRef}
              tabIndex={-1}
            >
              {_renderChecklistItemContent()}
            </DialogContentText>
          </DialogContent>
        </React.Fragment>
      );
    }
  }

  React.useEffect(() => {
    if (isOpen) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }

    if (checklistDialog.actionType === CheckListDialogActionEnum.ADD) {
      setNewChecklistItem(null);
      setChecklistItemName('');
      setChecklistItemRemarks('');
      setChecklistItemTags('');
      setChecklistBgColor(defaultColor);
    }

    if(checklistDialog.actionType === CheckListDialogActionEnum.EDIT && checklistDialog.checklistItem) {
      //ASSSIGN VALUES ON RENDER FOR UPDATING
      setNewChecklistItem(checklistDialog.checklistItem);
      setChecklistItemName(checklistDialog.checklistItem.name);
      setChecklistItemRemarks(checklistDialog.checklistItem.remarks);
      setChecklistItemTags(checklistDialog.checklistItem.tags);
      setChecklistBgColor(checklistDialog.checklistItem.backgroundColor as Colors);
    }
  }, [isOpen, checklistDialog.actionType, checklistDialog.checklistItem]);

  return (
    <React.Fragment>
      <Dialog
        open={isOpen}
        onClose={handleDialogBackdropClick}
        scroll={scroll}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        fullWidth
        disableEscapeKeyDown
      >
        <DialogTitle
          id="scroll-dialog-title" 
        >
          {renderDialogTitle()}
        </DialogTitle>
        {renderDialogContent()}
        <DialogActions>
          <Button onClick={handleClose} variant='outlined'>Cancel</Button>
          <Button onClick={handleSubmit} variant='contained'>
            {actionType === CheckListDialogActionEnum.DELETE ? 'Confirm' : 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  )
}