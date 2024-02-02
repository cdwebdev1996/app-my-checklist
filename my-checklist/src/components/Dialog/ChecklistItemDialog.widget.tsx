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
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { Box, Stack } from '@mui/system';
import {
  APIs,
  ActionTypes,
  Colors,
  FeedbackStatus,
} from '../../types';
import { callAPI } from '../../utils';
import './ChecklistItemDialog.css';
import { AppContext } from '../../context';

export const defaultColor = '#95A5A6';
export const colorPool = [
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

export const CheckListItemDialog: React.FC = () => {
  const {
    checklistDialog,
    getAllChecklist,
    setChecklistDialog,
    showFeedbackMessage,
  } = React.useContext(AppContext);
  
  const descriptionElementRef = React.useRef<HTMLElement>(null);
  const { isOpen, actionType } = checklistDialog;
  const [checklistItemName, setChecklistItemName] = React.useState<string>('');
  const [checklistItemRemarks, setChecklistItemRemarks] = React.useState<string | null>('');
  const [checklistItemTags, setChecklistItemTags] = React.useState<string | null>('');
  const [checklistBgColor, setChecklistBgColor] = React.useState<Colors>(defaultColor);
  const [isDialogErr, setIsDialogErr] = React.useState<boolean>(false);
  const [inputTag, setInputTag] = React.useState<string>('');

  const renderDialogTitle = () => {
    switch(actionType) {
      case ActionTypes.ADD:
        return 'Create Checklist Item';
      case ActionTypes.EDIT:
        return 'Update Checklist Item';
      case ActionTypes.DELETE:
        return 'Confirm Delete Action';
      default:
        return null;
    }
  }

  const clearValues = () => {
    setChecklistItemName('');
    setChecklistItemRemarks('');
    setChecklistItemTags('');
    setInputTag('');
    setChecklistBgColor(defaultColor);
    setIsDialogErr(false);
  }

  const handleClose = () => {
    setChecklistDialog({isOpen: false, actionType: null, checklistItem: null, checklistLength: 0});
  }

  const handleCallback = () => {
    getAllChecklist();
    handleClose();
    showFeedbackMessage(actionType, FeedbackStatus.SUCCESS);
  }
  
  const handleSubmit = () => {
    // CALL UPDATE API HERE
    const selectedItem = checklistDialog.checklistItem;
    const payload = {
      ...(checklistDialog.actionType === ActionTypes.EDIT || checklistDialog.actionType === ActionTypes.DELETE) && {id: selectedItem?.id},
      ...(checklistDialog.actionType === ActionTypes.ADD) && {priority: checklistDialog.checklistLength},
      ...(checklistItemName !== selectedItem?.name) && {name: checklistItemName},
      ...(checklistItemRemarks !== selectedItem?.remarks) && {remarks: checklistItemRemarks},
      ...(checklistBgColor !== selectedItem?.backgroundColor) && {backgroundColor: checklistBgColor},
      ...(checklistItemTags !== selectedItem?.tags) && {tags: checklistItemTags},
    };

    if (checklistDialog.actionType === ActionTypes.ADD) {
      callAPI({
        apiEndpoint: APIs.ADD, 
        loader: null, 
        onSuccess: null,
        onError: showFeedbackMessage,
        callBack: handleCallback,
        payload,
      });
    } else if (checklistDialog.actionType === ActionTypes.EDIT) {
      if (payload.name || payload.remarks || payload.backgroundColor || payload.tags) {
        callAPI({
          apiEndpoint: APIs.UPDATE, 
          loader: null, 
          onSuccess: null,
          onError: showFeedbackMessage,
          callBack: handleCallback,
          payload,
        });
      } else {
        setIsDialogErr(true);
      }
    } else if (checklistDialog.actionType === ActionTypes.DELETE) {
      callAPI({
        apiEndpoint: APIs.DELETE, 
        loader: null, 
        onSuccess: null,
        onError: showFeedbackMessage,
        callBack: handleCallback,
        payload: {id: selectedItem?.id},
      });
    }
  }

  const handleDialogBackdropClick: DialogProps["onClose"] = (event, reason) => {
    // PREVENTS DIALOG FROM CLOSING UPON CLICKING ON THE BACKDROP AREA
    if (reason && reason === "backdropClick") 
      return;
    handleClose();
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
        setChecklistItemTags(tags?.concat(`,${inputTag.toLowerCase()}`));
      } else {
        setChecklistItemTags(inputTag.toLowerCase())
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
        {isDialogErr && (
          <div className='container-dialog-err'>
            <div className='txt-dialog-err'>
              <Typography variant='body1'>No updates committed</Typography>
            </div>
            <div className='btn-dialog-err-close'>
              <IconButton onClick={() => setIsDialogErr(false)}>
                <Close sx={{ color: '#fff' }}/>
              </IconButton>
            </div>
          </div>
        )}
        <div className='container-miu-dialog-content'>
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
                      {colorPool.map((color: string, index: number) => {
                          return (
                            <MenuItem 
                              defaultChecked={checklistBgColor as Colors === color} 
                              value={color} 
                              key={`${index}-${color}`} 
                              sx={{ display: 'block', '&.MuiMenuItem-root.Mui-selected': {
                                background: '#141414',
                              }}}
                            >
                              <div className='container-menu-item-color-picker'>
                                <div className='div-menu-item-color-picker' style={{ background: color, width: '100%', color}}>-</div>
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
                helperText={`Press 'enter' or click the 'add tag' button to add a new tag`}
                fullWidth
              />
            </div>
            <div className='btn-checklist-tag-add'>
              <Button size="medium" variant='contained' onClick={addTag}>Add tag</Button>
            </div>
          </div>
          {checklistItemTags ? (
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
          ) : (
            <div>
              <div className='container-checklist-tag-list'>
                <div className='container-checklist-tag-list-box tag-caption-centered '>
                  <Typography variant='caption'>No tag added</Typography>
                </div>
              </div>
            </div>
          )}
        </div>
      </React.Fragment>
    )
  }

  const _renderDeleteConfirmationContent = () => {
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

  const renderDialogContent = () => {
    if (actionType === ActionTypes.DELETE) {
      return _renderDeleteConfirmationContent();
    } else {
      return (
        <React.Fragment>
          <DialogContent dividers sx={{padding: 0}}>
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

    if (checklistDialog.actionType === ActionTypes.ADD) {
      clearValues();
    }

    if(checklistDialog.actionType === ActionTypes.EDIT && checklistDialog.checklistItem) {
      setChecklistItemName(checklistDialog.checklistItem.name);
      setChecklistItemRemarks(checklistDialog.checklistItem.remarks);
      setChecklistItemTags(checklistDialog.checklistItem.tags);
      setChecklistBgColor(checklistDialog.checklistItem.backgroundColor as Colors);
    }

    return () => {
      clearValues();
    }
    
  }, [isOpen, checklistDialog.actionType, checklistDialog.checklistItem]);

  return (
    <React.Fragment>
      <Dialog
        open={isOpen}
        onClose={handleDialogBackdropClick}
        scroll={'paper'}
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
            {actionType === ActionTypes.DELETE ? 'Confirm' : 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  )
}