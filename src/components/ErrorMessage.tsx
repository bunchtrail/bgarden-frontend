import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { Box, Collapse, IconButton, Paper, Typography } from '@mui/material';
import { keyframes, styled } from '@mui/material/styles';
import React from 'react';

// Типы сообщений
export type ErrorSeverity = 'error' | 'warning' | 'info' | 'success';

export interface ErrorMessageProps {
  message: string | null;
  detail?: string;
  severity?: ErrorSeverity;
  onClose?: () => void;
  variant?: 'standard' | 'banner' | 'toast';
  actionText?: string;
  onAction?: () => void;
}

// Дополнительные пропсы для стилизованных компонентов
interface StyledProps {
  severity?: ErrorSeverity;
}

// Анимация появления
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Стилизованный компонент в стиле Apple
const StyledErrorContainer = styled(Paper)<StyledProps>(
  ({ theme, severity }) => ({
    padding: theme.spacing(2),
    display: 'flex',
    alignItems: 'flex-start',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
    borderRadius: '12px',
    animation: `${fadeIn} 0.3s ease-out`,
    backgroundColor: theme.palette.background.paper,
    border: '1px solid',
    borderColor:
      severity === 'error'
        ? 'rgba(255, 59, 48, 0.3)'
        : severity === 'warning'
        ? 'rgba(255, 204, 0, 0.3)'
        : severity === 'info'
        ? 'rgba(0, 122, 255, 0.3)'
        : 'rgba(52, 199, 89, 0.3)',
    marginBottom: theme.spacing(2),
    position: 'relative',
  })
);

const BannerContainer = styled(Box)<StyledProps>(({ theme, severity }) => ({
  width: '100%',
  padding: theme.spacing(1.5),
  backgroundColor:
    severity === 'error'
      ? 'rgba(255, 59, 48, 0.08)'
      : severity === 'warning'
      ? 'rgba(255, 204, 0, 0.08)'
      : severity === 'info'
      ? 'rgba(0, 122, 255, 0.08)'
      : 'rgba(52, 199, 89, 0.08)',
  backdropFilter: 'blur(5px)',
  animation: `${fadeIn} 0.3s ease-out`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderBottom: '1px solid',
  borderColor:
    severity === 'error'
      ? 'rgba(255, 59, 48, 0.2)'
      : severity === 'warning'
      ? 'rgba(255, 204, 0, 0.2)'
      : severity === 'info'
      ? 'rgba(0, 122, 255, 0.2)'
      : 'rgba(52, 199, 89, 0.2)',
}));

const getIcon = (severity: ErrorSeverity) => {
  switch (severity) {
    case 'error':
      return <ErrorOutlineIcon sx={{ color: 'rgb(255, 59, 48)' }} />;
    case 'warning':
      return <WarningAmberIcon sx={{ color: 'rgb(255, 204, 0)' }} />;
    case 'info':
      return <InfoOutlinedIcon sx={{ color: 'rgb(0, 122, 255)' }} />;
    case 'success':
      return <CheckCircleOutlineIcon sx={{ color: 'rgb(52, 199, 89)' }} />;
    default:
      return <ErrorOutlineIcon sx={{ color: 'rgb(255, 59, 48)' }} />;
  }
};

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  detail,
  severity = 'error',
  onClose,
  variant = 'standard',
  actionText,
  onAction,
}) => {
  if (!message) return null;

  // Функция для отображения соответствующего типа компонента ошибки
  const renderErrorContent = () => (
    <>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', mr: 1 }}>
        {getIcon(severity)}
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography
          variant='body1'
          sx={{
            fontWeight: 500,
            color:
              severity === 'error'
                ? 'rgb(255, 59, 48)'
                : severity === 'warning'
                ? 'rgb(255, 204, 0)'
                : severity === 'info'
                ? 'rgb(0, 122, 255)'
                : 'rgb(52, 199, 89)',
          }}
        >
          {message}
        </Typography>
        {detail && (
          <Typography variant='body2' color='text.secondary' sx={{ mt: 0.5 }}>
            {detail}
          </Typography>
        )}
        {actionText && onAction && (
          <Typography
            variant='body2'
            sx={{
              mt: 1,
              color: 'rgb(0, 122, 255)',
              cursor: 'pointer',
              fontWeight: 500,
            }}
            onClick={onAction}
          >
            {actionText}
          </Typography>
        )}
      </Box>
      {onClose && (
        <IconButton
          size='small'
          sx={{ ml: 1, p: 0.5 }}
          onClick={onClose}
          aria-label='закрыть'
        >
          <CloseIcon fontSize='small' />
        </IconButton>
      )}
    </>
  );

  if (variant === 'banner') {
    return (
      <Collapse in={!!message}>
        <BannerContainer severity={severity}>
          {renderErrorContent()}
        </BannerContainer>
      </Collapse>
    );
  }

  return (
    <Collapse in={!!message}>
      <StyledErrorContainer severity={severity} elevation={0}>
        {renderErrorContent()}
      </StyledErrorContainer>
    </Collapse>
  );
};

export default ErrorMessage;
