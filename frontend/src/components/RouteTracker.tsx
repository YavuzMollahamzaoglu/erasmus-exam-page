import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const PATH_LABELS: Record<string, string> = {
  '/': 'Ana Sayfa',
  '/questions': 'Klasik Sorular',
  '/categories': 'Kategoriler',
  '/rankings': 'Sıralamalar',
  '/words': 'Kelimeler',
  '/history': 'Geçmiş',
  '/about': 'Hakkında',
};

function labelFor(pathname: string) {
  if (PATH_LABELS[pathname]) return PATH_LABELS[pathname];
  if (pathname.startsWith('/exam/')) return 'Sınav';
  return 'Sayfa';
}

export default function RouteTracker() {
  const location = useLocation();
  useEffect(() => {
    // Record last path when route changes
    const prev = sessionStorage.getItem('currentPath') || '';
    if (prev) sessionStorage.setItem('lastPath', prev);
    sessionStorage.setItem('currentPath', location.pathname);
    sessionStorage.setItem('currentLabel', labelFor(location.pathname));
  }, [location.pathname]);
  return null;
}
