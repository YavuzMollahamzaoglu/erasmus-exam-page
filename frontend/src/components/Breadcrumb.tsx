import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

interface BreadcrumbItem {
  label: string;
  href?: string; // undefined for current page
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <Box
      component="nav"
      aria-label="Breadcrumb"
      sx={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        fontSize: '0.875rem',
        color: 'text.secondary',
        mb: 2,
        gap: 0.5
      }}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            {item.href ? (
              <Link
                to={item.href}
                style={{
                  color: 'inherit',
                  textDecoration: 'none',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#00b894')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'inherit')}
              >
                {item.label}
              </Link>
            ) : (
              <Typography
                component="span"
                sx={{
                  fontSize: 'inherit',
                  fontWeight: isLast ? 600 : 400,
                  color: isLast ? 'text.primary' : 'inherit'
                }}
                aria-current={isLast ? 'page' : undefined}
              >
                {item.label}
              </Typography>
            )}
            {!isLast && (
              <NavigateNextIcon sx={{ fontSize: '1rem', color: 'text.disabled' }} />
            )}
          </React.Fragment>
        );
      })}
    </Box>
  );
};

export default Breadcrumb;
