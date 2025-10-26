import React, { useEffect, useState, useRef } from 'react';
import setMetaTags from '../utils/seo';
import { Box, Typography, Button, Paper, Avatar, CircularProgress, Dialog, DialogTitle, DialogContent, TextField, DialogActions, ToggleButton, ToggleButtonGroup, IconButton } from '@mui/material';
import { AVATAR_EMOJIS } from '../utils/avatars';

interface Props {
  token: string;
  onAvatarChange?: (avatar: string | undefined) => void;
  onInitialChange?: (initial: string) => void;
}

const Profile: React.FC<Props> = ({ token, onAvatarChange, onInitialChange }) => {
  const [profile, setProfile] = useState<any>(null);
  const [error, setError] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);
  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);
  const [updateDialog, setUpdateDialog] = useState(false);
  const [updateData, setUpdateData] = useState({ name: '', email: '', newPassword: '', currentPassword: '' });
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState('');
  // No file input or image dialog needed

  const fetchProfile = async () => {
    try {
  const res = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/me`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
  const user = data.user || data;
  setProfile(user);
  setAvatar(user.avatar || null);
  if (onAvatarChange) onAvatarChange(user.avatar || undefined);
  if (onInitialChange && user.name) onInitialChange(user.name[0]?.toUpperCase() || '?');
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

    // Send only changed fields
    const payload: any = { currentPassword: updateData.currentPassword };
    if (updateData.name && updateData.name.trim() && updateData.name.trim() !== (profile?.name || '')) {
      payload.name = updateData.name.trim();
    }
    if (updateData.email && updateData.email.trim() && updateData.email.trim() !== (profile?.email || '')) {
      payload.email = updateData.email.trim();
    }
    if (updateData.newPassword && updateData.newPassword.trim()) {
      payload.newPassword = updateData.newPassword.trim();
    }
    if (!payload.name && !payload.email && !payload.newPassword) {
      setUpdateError('Değişiklik yok. Lütfen bir alanı güncelleyin.');
      return;
    }

    setUpdateLoading(true);
    setUpdateError('');

    try {
  const res = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/update-profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok) {
        setUpdateDialog(false);
        fetchProfile(); // Refresh profile data
      } else {
        // Prefer explicit message
        if (data?.error) {
          setUpdateError(data.error);
        } else if (Array.isArray(data?.errors) && data.errors.length) {
          // express-validator shape
          setUpdateError(data.errors.map((e: any) => e.msg).join('\n'));
        } else {
          setUpdateError('Güncelleme başarısız');
        }
      }
    } catch (err) {
      setUpdateError('Network error');
    } finally {
      setUpdateLoading(false);
    }
  };

  useEffect(() => {
    setMetaTags({
      title: 'Profilim — Hesabım',
      description: 'Kişisel profil bilgilerinizi görüntüleyin ve güncelleyin. Profil fotoğrafı ve hesap ayarları.',
      keywords: 'profilim, hesap, kullanıcı bilgileri',
      canonical: '/profile',
      ogImage: '/social-preview.svg'
    });
    if (!token) return;
    fetchProfile();
    // eslint-disable-next-line
  }, [token]);



  if (!token) return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#b2dfdb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Typography fontSize={20}>Please login to see your profile.</Typography>
    </Box>
  );
  if (!profile) return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#b2dfdb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <CircularProgress />
    </Box>
  );

  const joinedDate = profile.createdAt ? new Date(profile.createdAt).toLocaleDateString('tr-TR') : '-';
  // Avatar logic: show selected emoji, or fallback to initial
  const getInitial = () => (profile.name && profile.name[0] ? profile.name[0].toUpperCase() : '?');
  const avatarDisplay = avatar || getInitial();

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: '#b2dfdb', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'flex-start', 
      pt: { xs: 8, md: 10 },
      pb: { xs: 12, md: 16 },
      px: 2
    }}>
      <Paper
        elevation={6}
        sx={{
          width: '100%',
          maxWidth: 520,
          mx: 'auto',
          p: 0,
          borderRadius: 4,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
        }}
      >
        {/* Header merged with card */}
        <Box sx={{
          background: 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)',
          color: '#fff',
          p: { xs: 3, md: 4 },
          textAlign: 'center',
          borderTopLeftRadius: 'inherit',
          borderTopRightRadius: 'inherit',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background: 'rgba(255,255,255,0.08)',
            backdropFilter: 'blur(4px)'
          }
        }}>
          <Box sx={{ position: 'relative' }}>
            <Typography variant="h4" fontWeight={800} sx={{ color: '#fff' }}>Profil</Typography>
          </Box>
        </Box>

        {/* Content */}
        <Box sx={{ p: { xs: 3, md: 4 }, textAlign: 'center' }}>
          <Box sx={{ position: 'relative', display: 'inline-block', mx: 'auto', mb: 1 }}>
            <Avatar
              sx={{
                width: 96,
                height: 96,
                minWidth: 96,
                minHeight: 96,
                maxWidth: 96,
                maxHeight: 96,
                borderRadius: '50%',
                aspectRatio: '1 / 1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 48,
                bgcolor: '#26c6da',
                mx: 'auto',
                boxShadow: 2,
                border: '3px solid #fff',
                fontWeight: 700,
                userSelect: 'none',
              }}
            >
              {avatarDisplay}
            </Avatar>
            <Typography fontWeight={600} fontSize={16} mt={1} mb={2}>
              Avatar
            </Typography>
          </Box>
          <Button
            variant="outlined"
            sx={{ mb: 2, borderRadius: 2, fontWeight: 700, color: '#00b894', borderColor: '#00b894', '&:hover': { background: 'rgba(0,184,148,0.08)', borderColor: '#00cec9', color: '#00b894' } }}
            onClick={() => setAvatarDialogOpen(true)}
          >
            Avatarını Değiştir
          </Button>
          <Dialog open={avatarDialogOpen} onClose={() => setAvatarDialogOpen(false)} maxWidth="xs" fullWidth>
            <DialogTitle>Avatar Seç</DialogTitle>
            <DialogContent>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center', mb: 2, mt: 1 }}>
                {AVATAR_EMOJIS.map((emo) => (
                  <ToggleButton
                    key={emo}
                    value={emo}
                    selected={avatar === emo}
                    onClick={() => setAvatar(emo)}
                    sx={{ fontSize: 32, px: 2, py: 1, borderRadius: 2, border: '2px solid #00b894', bgcolor: '#fff', '&.Mui-selected': { bgcolor: '#00b894', color: '#fff' } }}
                  >
                    {emo}
                  </ToggleButton>
                ))}
              </Box>
              <Button
                variant="outlined"
                color="secondary"
                sx={{ mt: 1, mb: 2, borderRadius: 2, fontWeight: 700, color: '#555', borderColor: '#bbb', '&:hover': { background: 'rgba(0,0,0,0.04)', borderColor: '#00b894', color: '#00b894' } }}
                onClick={() => setAvatar(null)}
              >
                Sadece Baş Harfini Göster
              </Button>
              <Button
                variant="contained"
                sx={{ mb: 1, borderRadius: 2, background: 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)', '&:hover': { background: 'linear-gradient(135deg, #00a085 0%, #00b8b3 100%)' } }}
                onClick={async () => {
                  setError('');
                  try {
                    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/update-profile`, {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                      body: JSON.stringify({ avatar }),
                    });
                    if (res.ok) { fetchProfile(); setAvatarDialogOpen(false); if (onAvatarChange) onAvatarChange(avatar || undefined); }
                    else setError('Avatar güncellenemedi');
                  } catch {
                    setError('Avatar güncellenemedi');
                  }
                }}
                disabled={avatar === profile.avatar}
              >
                Kaydet
              </Button>
            </DialogContent>
          </Dialog>
          {/* Name under avatar, thicker */}
          <Typography sx={{ fontWeight: 900, fontSize: { xs: '1.4rem', md: '1.6rem' }, mb: 0.5 }}>
            {profile.name || '-'}
          </Typography>
          <Typography fontSize={18} color="#333" mb={1}>
            {profile.email || '-'}
          </Typography>
          <Typography fontSize={16} color="#555" mb={3}>
            Katılım Tarihi: {joinedDate}
          </Typography>
          <Button 
            variant="contained"
            onClick={openUpdateDialog}
            sx={{ 
              borderRadius: 2, 
              px: 4, 
              mb: 2,
              textTransform: 'none',
              background: 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)',
              '&:hover': { background: 'linear-gradient(135deg, #00a085 0%, #00b8b3 100%)' }
            }}
          >
            Profili Yenile
          </Button>
          <Box sx={{ mt: 2 }}>
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


        </Box>
      </Paper>
    </Box>
  );
};

export default Profile;
