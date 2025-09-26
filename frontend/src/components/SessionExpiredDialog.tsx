import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from '@mui/material';

type Props = {
  open: boolean;
  onClose: () => void;
  onGoLogin: () => void;
};

const SessionExpiredDialog: React.FC<Props> = ({ open, onClose, onGoLogin }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ p: 0 }}>
        <Box sx={{
          background: 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)',
          color: '#fff',
          px: 3,
          py: 2.5,
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
        }}>
          <Typography variant="h6" fontWeight={800}>Oturum Süresi Doldu</Typography>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <Typography color="text.secondary">
          Oturum süreniz bitmiştir. Güvenliğiniz için çıkış yaptık. Lütfen tekrar giriş yapın.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button variant="outlined" onClick={onClose} sx={{ textTransform: 'none', borderColor: '#00b894', color: '#00695c' }}>Kapat</Button>
        <Button variant="contained" onClick={onGoLogin} sx={{ textTransform: 'none', background: 'linear-gradient(90deg, #00b894 0%, #00cec9 100%)' }}>Giriş Yap</Button>
      </DialogActions>
    </Dialog>
  );
};

export default SessionExpiredDialog;
