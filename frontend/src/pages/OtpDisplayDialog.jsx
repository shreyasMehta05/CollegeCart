import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  Tooltip
} from '@mui/material';
import { Close, ContentCopy, CheckCircle } from '@mui/icons-material';
import { toast } from 'react-toastify';

const OtpDisplayDialog = ({
  open, 
  onClose, 
  generatedOtp,
  onVerify
}) => {
  const handleCopyOtp = () => {
    navigator.clipboard.writeText(generatedOtp).then(() => {
      toast.success('OTP copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy OTP:', err);
      toast.error('Failed to copy OTP');
    });
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          <Typography 
            variant="h6" 
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              color: 'primary.main'
            }}
          >
            Order Verification OTP
          </Typography>
          <IconButton 
            onClick={onClose} 
            color="error"
            size="small"
          >
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Typography 
          variant="body1" 
          sx={{ 
            mb: 3, 
            textAlign: 'center',
            color: 'text.secondary'
          }}
        >
          Your One-Time Password (OTP) for order verification
        </Typography>
        
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          mb: 3
        }}>
          <Typography 
            variant="h3" 
            sx={{ 
              letterSpacing: '0.2em', 
              fontWeight: 'bold',
              color: 'primary.main',
              mr: 2,
              textAlign: 'center'
            }}
          >
            {generatedOtp}
          </Typography>
          <Tooltip title="Copy OTP">
            <IconButton 
              color="primary" 
              onClick={handleCopyOtp}
              size="large"
            >
              <ContentCopy fontSize="large" />
            </IconButton>
          </Tooltip>
        </Box>

        <Typography 
          variant="body2" 
          sx={{ 
            textAlign: 'center',
            color: 'text.secondary',
            mb: 2
          }}
        >
          Please save this OTP. You will need it to complete your order.
        </Typography>
      </DialogContent>
      
      <DialogActions sx={{ 
        justifyContent: 'center', 
        pb: 3, 
        px: 3 
      }}>
        <Button 
          variant="contained" 
          color="primary"
          startIcon={<CheckCircle />}
          onClick={onVerify}
          fullWidth
          sx={{ 
            py: 1.5, 
            borderRadius: 2 
          }}
        >
          I have saved the OTP
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OtpDisplayDialog;