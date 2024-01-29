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
  TextField,
  Typography
} from '@mui/material';
import { ChecklistDialogState, ChecklistItem, CheckListDialogActionEnum, CheckListDialogActionType, Status, StatusEnum } from '../../types';
import { ColorPicker, Colors } from '../';
import { Stack } from '@mui/system';

interface ChecklistDialogComponentInterface {
  checklistDialogState: ChecklistDialogState;
  isLoading: boolean;
  showFeedbackMessage: (
    action: CheckListDialogActionType | null,
    status: Status,
  ) => void;
}

export const CheckListItemDialog: React.FC<ChecklistDialogComponentInterface> = ({ checklistDialogState, isLoading, showFeedbackMessage }) => {

  const { checklistDialog, setChecklistDialog } = checklistDialogState;
  const [scroll, setScroll] = React.useState<DialogProps['scroll']>('paper');
  const descriptionElementRef = React.useRef<HTMLElement>(null);
  // const [tags, setTags] = React.useState<string>('due-date,payment,bills');
  const { isOpen, actionType } = checklistDialog;
  
  // const checklistItem: ChecklistItem | null = checklistDialog.checklistItem;
  const [newChecklistItem, setNewChecklistItem] = React.useState<ChecklistItem | null>(null);
  const [checklistItemName, setChecklistItemName] = React.useState<string | null>('');
  const [checklistItemRemarks, setChecklistItemRemarks] = React.useState<string | null>('');
  const [checklistItemTags, setChecklistItemTags] = React.useState<string | null>('');
  const [inputTag, setInputTag] = React.useState<string>('');
  const [checklistBgColor, setChecklistBgColor] = React.useState<Colors | null>(null);

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
    setChecklistDialog({isOpen: false, actionType: null, checklistItem: null});
  }

  const handleSubmit = () => {
    // CALL UPDATE API HERE
    handleClose();
    //IF Successs
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
            <Typography variant='body1'>Are you sure you want to delete this item?</Typography>
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

  const colorPickerComponentProps = {
    hex: checklistBgColor || checklistDialog.checklistItem?.backgroundColor as Colors,
    actionType: checklistDialog.actionType as CheckListDialogActionEnum,
  };

  const _renderUpdateContent = () => {
    return (
      <React.Fragment>
        <div>
          <div style={{ marginBottom: '12px', display: 'flex' }}>
            <div style={{ flex: 1, padding: '0px 4px' }}>
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
            <div style={{ flex: 1, padding: '0px 4px'}}>
              <ColorPicker {...colorPickerComponentProps} />
            </div>
          </div>
          <div style={{ marginBottom: '12px', padding: '0px 4px' }}>
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
          <div style={{ display: 'flex', marginBottom: '12px', }}>
            <div style={{ flex: 4, padding: '0px 4px' }}>
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
            <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', padding: '0px 4px',}}>
              <Button size="medium" variant='contained' onClick={addTag}>Add tag</Button>
            </div>
          </div>
          {checklistItemTags && (
            <div style={{ display: 'flex', marginBottom: '12px', padding: '0px 4px'}}>
              <div style={{flex: 1, border: 'solid 1px #CACFD2', borderRadius: '4px', padding: '8px'}}>
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
          <DialogContent dividers={scroll === 'paper'}>
            <DialogContentText
              id="scroll-dialog-description"
              ref={descriptionElementRef}
              tabIndex={-1}
            >
              {_renderUpdateContent()}
            </DialogContentText>
          </DialogContent>
        </React.Fragment>
      );
    }
    return null;
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
      setChecklistBgColor(null);
    }

    if(checklistDialog.actionType === CheckListDialogActionEnum.EDIT && checklistDialog.checklistItem) {
      //ASSSIGN VALUES ON RENDER FOR UPDATING
      setNewChecklistItem(checklistDialog.checklistItem);
      setChecklistItemName(checklistDialog.checklistItem.name);
      setChecklistItemRemarks(checklistDialog.checklistItem.remarks);
      setChecklistItemTags(checklistDialog.checklistItem.tags);
      setChecklistBgColor(checklistDialog.checklistItem.backgroundColor as Colors);
    }
  }, [isOpen]);

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