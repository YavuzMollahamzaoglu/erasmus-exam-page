import React, { useEffect, useState, useRef } from 'react';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { Box, Typography, Button, Paper, Avatar, CircularProgress, Dialog, DialogTitle, DialogContent, TextField, DialogActions } from '@mui/material';

interface Props {
  token: string;
  onProfilePhotoChange?: (url: string) => void;
}

const Profile: React.FC<Props> = ({ token, onProfilePhotoChange }) => {
  const [profile, setProfile] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [updateDialog, setUpdateDialog] = useState(false);
  const [updateData, setUpdateData] = useState({ name: '', email: '', newPassword: '', currentPassword: '' });
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchProfile = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/auth/me', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      setProfile(data.user || data);
      if (onProfilePhotoChange && (data.user?.profilePhoto || data.profilePhoto)) {
        onProfilePhotoChange(data.user?.profilePhoto || data.profilePhoto);
      }
    } catch {
      setProfile(null);
    }
  };

  const openUpdateDialog = () => {
    setUpdateData({
      name: profile.name || '',
      email: profile.email || '',
      newPassword: '',
      currentPassword: ''
    });
    setUpdateError('');
    setUpdateDialog(true);
  };

  const handleUpdateProfile = async () => {
    if (!updateData.currentPassword) {
      setUpdateError('Mevcut şifrenizi girmelisiniz');
      return;
    }

    setUpdateLoading(true);
    setUpdateError('');

    try {
      const res = await fetch('http://localhost:4000/api/auth/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });

      const data = await res.json();

      if (res.ok) {
        setUpdateDialog(false);
        fetchProfile(); // Refresh profile data
      } else {
        setUpdateError(data.error || 'Güncelleme başarısız');
      }
    } catch (err) {
      setUpdateError('Network error');
    } finally {
      setUpdateLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    fetchProfile();
    // eslint-disable-next-line
  }, [token]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    setError('');
    const formData = new FormData();
    formData.append('photo', e.target.files[0]);
    try {
      const res = await fetch('http://localhost:4000/api/auth/upload-profile-photo', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      } as any);
      const data = await res.json();
      if (res.ok) {
        // Wait for backend to save, then fetch updated profile
        setTimeout(fetchProfile, 500);
      } else {
        setError(data.error || 'Upload failed');
      }
    } catch (err) {
      setError('Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  if (!token) return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#b2ebf2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Typography fontSize={20}>Please login to see your profile.</Typography>
    </Box>
  );
  if (!profile) return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#b2ebf2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <CircularProgress />
    </Box>
  );

  const photoUrl = profile.profilePhoto ? `http://localhost:4000${profile.profilePhoto}?t=${Date.now()}` : undefined;
  const joinedDate = profile.createdAt ? new Date(profile.createdAt).toLocaleDateString('tr-TR') : '-';

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#b2ebf2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper
        elevation={6}
        sx={{
          p: 4,
          borderRadius: 4,
          maxWidth: 340,
          mx: 'auto',
          bgcolor: '#e0f7fa',
          textAlign: 'center',
        }}
      >
        <Box sx={{ position: 'relative', display: 'inline-block', mx: 'auto', mb: 2 }}>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            disabled={uploading}
            style={{ display: 'none' }}
            id="profile-photo-upload"
          />
          <label htmlFor="profile-photo-upload">
            <Avatar
              src={photoUrl}
              sx={{ width: 90, height: 90, bgcolor: '#26c6da', cursor: 'pointer', mx: 'auto', boxShadow: 2 }}
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: 8,
                right: 8,
                bgcolor: 'white',
                borderRadius: '50%',
                p: 0.5,
                boxShadow: 1,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <PhotoCameraIcon fontSize="small" color="primary" />
            </Box>
          </label>
        </Box>
        <Typography variant="h5" fontWeight={700} mb={1}>
          {profile.name || '-'}
        </Typography>
        <Typography fontSize={18} color="#333" mb={1}>
          {profile.email || '-'}
        </Typography>
        <Typography fontSize={16} color="#555" mb={3}>
          Joined: {joinedDate}
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          sx={{ borderRadius: 8, px: 4, mb: 2 }}
          onClick={openUpdateDialog}
        >
          Update Profile
        </Button>
        <Box sx={{ mt: 2 }}>
          {uploading && <span style={{ marginLeft: 8 }}>Yükleniyor...</span>}
          {error && <Typography color="error" fontSize={14} mt={1}>{error}</Typography>}
        </Box>

        {/* Update Profile Dialog */}
        <Dialog open={updateDialog} onClose={() => setUpdateDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Profil Güncelle</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <TextField
                label="Kullanıcı Adı"
                value={updateData.name}
                onChange={(e) => setUpdateData(prev => ({ ...prev, name: e.target.value }))}
                fullWidth
                variant="outlined"
              />
              <TextField
                label="Email"
                type="email"
                value={updateData.email}
                onChange={(e) => setUpdateData(prev => ({ ...prev, email: e.target.value }))}
                fullWidth
                variant="outlined"
              />
              <TextField
                label="Yeni Şifre (isteğe bağlı)"
                type="password"
                value={updateData.newPassword}
                onChange={(e) => setUpdateData(prev => ({ ...prev, newPassword: e.target.value }))}
                fullWidth
                variant="outlined"
                helperText="Şifreyi değiştirmek istemiyorsanız boş bırakın"
              />
              <TextField
                label="Mevcut Şifre"
                type="password"
                value={updateData.currentPassword}
                onChange={(e) => setUpdateData(prev => ({ ...prev, currentPassword: e.target.value }))}
                fullWidth
                variant="outlined"
                required
                helperText="Güvenlik için mevcut şifrenizi girmelisiniz"
              />
              {updateError && (
                <Typography color="error" fontSize={14}>{updateError}</Typography>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setUpdateDialog(false)}>İptal</Button>
            <Button 
              onClick={handleUpdateProfile} 
              variant="contained" 
              disabled={updateLoading}
            >
              {updateLoading ? 'Güncelleniyor...' : 'Güncelle'}
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Box>
  );
};

export default Profile;
