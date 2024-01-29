import * as React from 'react';
import { ExpandMore } from '@mui/icons-material';
import { Accordion, AccordionSummary, Skeleton } from '@mui/material';
import { Stack } from '@mui/system';


export const ChecklistSkeleton: React.FC = () => {
  return (
    <div>
      {[0, 1, 2].map((skeleton, index) => {
        return (
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMore />}
              aria-controls="panel1-content-skeleton"
              id="panel1-header-skeleton"
            >
              <Stack direction='row' spacing={3}>
                <Skeleton variant="rectangular" width={40} height={40} />
                <Skeleton variant="rectangular" width={450} height={40} />
              </Stack>
            </AccordionSummary>
          </Accordion>
        );
      })}
    </div>
  )
}