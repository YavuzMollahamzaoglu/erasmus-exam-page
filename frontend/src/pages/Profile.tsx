import React, { useEffect, useState, useRef } from 'react';
import setMetaTags from '../utils/seo';
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

  // Popup dialog for invalid image uploads
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [imageDialogMessage, setImageDialogMessage] = useState('');

  const fetchProfile = async () => {
    try {
  const res = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/me`, {
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    setError('');
    const raw = e.target.files[0];
    // Basic validation
    if (!raw.type.startsWith('image/')) {
      setError('Lütfen bir resim dosyası seçin.');
      // Show guidance popup
      setImageDialogMessage('Geçersiz dosya türü. Lütfen JPG veya PNG formatında bir profil fotoğrafı yükleyin.');
      setImageDialogOpen(true);
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }
    if (raw.size > 10 * 1024 * 1024) { // 10MB
      setError('Resim boyutu çok büyük (maks. 10MB).');
      setImageDialogMessage('Yüklemeye çalıştığınız görsel 10MB sınırını aşıyor. Lütfen dosya boyutunu küçültüp tekrar deneyin.');
      setImageDialogOpen(true);
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Load dimensions for further validation
    const readImageDims = (file: File): Promise<{ w: number; h: number }> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          const w = img.naturalWidth || img.width;
          const h = img.naturalHeight || img.height;
          if (!w || !h) return reject(new Error('Görsel okunamadı'));
          resolve({ w, h });
        };
        img.onerror = () => reject(new Error('Görsel yüklenemedi'));
        img.src = URL.createObjectURL(file);
      });
    };

    try {
      const { w, h } = await readImageDims(raw);
      const shortSide = Math.min(w, h);
      const longSide = Math.max(w, h);
      const aspect = longSide / (shortSide || 1);

      // Block too small or extreme aspect-ratio images and guide user
      if (shortSide < 512) {
        const msg = `Görsel çözünürlüğü çok düşük (${w}x${h}). En az 512x512 piksel veya daha büyük bir görsel yükleyin.`;
        setError(msg);
        setImageDialogMessage(msg + '\n\nİpucu: Kare (1:1) oranlı ve en az 512x512 piksel bir fotoğraf kullanın. Çok küçük görseller kalite kaybına neden olur.');
        setImageDialogOpen(true);
        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }
      if (aspect > 3) {
        const msg = `Görsel en-boy oranı çok uç (${w}x${h}). Aşırı uzun veya panoramik görseller kabul edilmez.`;
        setError(msg);
        setImageDialogMessage(msg + '\n\nİpucu: Kare (1:1) oranına yakın bir fotoğraf tercih edin. Gerekirse kırpıp tekrar yükleyin.');
        setImageDialogOpen(true);
        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }
    } catch (dimErr: any) {
      // If we cannot read dimensions, show guidance and stop
      const msg = dimErr?.message || 'Görsel okunamadı, lütfen farklı bir dosya deneyin.';
      setError(msg);
      setImageDialogMessage(msg + '\n\nDesteklenen formatlar: JPG, PNG.');
      setImageDialogOpen(true);
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Helper: crop center-square and resize to 512x512
    const toSquareBlob = (file: File, target = 512): Promise<Blob> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          try {
            const w = img.naturalWidth || img.width;
            const h = img.naturalHeight || img.height;
            if (!w || !h) throw new Error('Görsel okunamadı');
            const side = Math.min(w, h);
            const sx = (w - side) / 2;
            const sy = (h - side) / 2;
            const canvas = document.createElement('canvas');
            canvas.width = target;
            canvas.height = target;
            const ctx = canvas.getContext('2d');
            if (!ctx) throw new Error('Canvas desteklenmiyor');
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, sx, sy, side, side, 0, 0, target, target);
            canvas.toBlob((blob) => {
              if (!blob) return reject(new Error('Resim dönüştürülemedi'));
              resolve(blob);
            }, 'image/jpeg', 0.9);
          } catch (er) {
            reject(er);
          }
        };
        img.onerror = () => reject(new Error('Görsel yüklenemedi'));
        const url = URL.createObjectURL(file);
        img.src = url;
      });
    };

    try {
      const squareBlob = await toSquareBlob(raw, 512);
      const formData = new FormData();
      const filename = (raw.name?.replace(/\.[^.]+$/, '') || 'avatar') + '-square.jpg';
      formData.append('photo', squareBlob, filename);

  const res = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/upload-profile-photo`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      } as any);
      let data: any = null;
      try { data = await res.json(); } catch {}
      if (res.ok) {
        // Wait for backend to save, then fetch updated profile
        setTimeout(fetchProfile, 500);
      } else {
        setError((data && (data.error || data.message)) || 'Upload failed');
      }
    } catch (er: any) {
      setError(er?.message || 'Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

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

  const photoUrl = profile.profilePhoto ? `${process.env.REACT_APP_API_URL}${profile.profilePhoto}?t=${Date.now()}` : undefined;
  const joinedDate = profile.createdAt ? new Date(profile.createdAt).toLocaleDateString('tr-TR') : '-';

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
                sx={{ 
                  width: 96, 
                  height: 96, 
                  minWidth: 96,
                  minHeight: 96,
                  maxWidth: 96,
                  maxHeight: 96,
          borderRadius: '50%',
          aspectRatio: '1 / 1',
                  display: 'block',
                  overflow: 'hidden',
                  flexShrink: 0,
                  flexGrow: 0,
                  flexBasis: '96px',
                  lineHeight: '96px',
                  bgcolor: '#26c6da', 
                  cursor: 'pointer', 
                  mx: 'auto', 
                  boxShadow: 2, 
                  border: '3px solid #fff',
                  // Keep inside image always covering and not stretching the avatar size
                  '& .MuiAvatar-img': { objectFit: 'cover', width: '100%', height: '100%', borderRadius: '50%', display: 'block' }
                }}
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

          {/* Image requirements / guidance dialog */}
          <Dialog open={imageDialogOpen} onClose={() => setImageDialogOpen(false)} maxWidth="xs" fullWidth>
            <DialogTitle>Uygun Olmayan Görsel</DialogTitle>
            <DialogContent>
              <Typography sx={{ whiteSpace: 'pre-wrap' }} gutterBottom>
                {imageDialogMessage}
              </Typography>
              <Typography variant="subtitle2" sx={{ mt: 1, mb: 0.5 }}>
                Önerilen Profil Fotoğrafı Özellikleri
              </Typography>
              <ul style={{ marginTop: 0 }}>
                <li>Kare (1:1) oranı</li>
                <li>En az 512x512 piksel</li>
                <li>JPG veya PNG formatı</li>
                <li>Maksimum boyut 10MB</li>
              </ul>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setImageDialogOpen(false)} autoFocus>
                Tamam
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Paper>
    </Box>
  );
};

export default Profile;
