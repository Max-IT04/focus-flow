import styled from "styled-components";

const ButtonContainer = ({ children, className, ...props }) => {
  return (
    <button className={className} {...props}>
      {children}
    </button>
  );
};

export const Button = styled(ButtonContainer)`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme, $size = 'md' }) => {
    switch ($size) {
      case 'sm': return `${theme.spacing.xs} ${theme.spacing.sm}`;
      case 'lg': return `${theme.spacing.md} ${theme.spacing.xl}`;
      default: return `${theme.spacing.sm} ${theme.spacing.lg}`;
    }
  }};
  width: ${({ $fullWidth = false }) => $fullWidth ? '100%' : 'auto'};
  min-width: ${({ $minWidth = 'auto' }) => $minWidth};
  
  background-color: ${({ theme, $variant = 'primary' }) => {
    switch ($variant) {
      case 'danger': return theme.colors.danger;
      case 'secondary': return theme.colors.secondary;
      case 'success': return theme.colors.success;
      default: return theme.colors.primary;
    }
  }};
  
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ $size = 'md' }) => {
    switch ($size) {
      case 'sm': return '0.875rem';
      case 'lg': return '1.125rem';
      default: return '1rem';
    }
  }};
  font-weight: 500;
  cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  opacity: ${({ disabled }) => disabled ? 0.5 : 1};
  
  &:hover {
    transform: ${({ disabled }) => disabled ? 'none' : 'translateY(-2px)'};
    background-color: ${({ theme, $variant = 'primary', disabled }) => {
      if (disabled) return;
      switch ($variant) {
        case 'danger': return theme.colors.dangerHover;
        case 'secondary': return theme.colors.primaryHover;
        case 'success': return '#059669';
        default: return theme.colors.primaryHover;
      }
    }};
    box-shadow: ${({ disabled, theme }) => disabled ? 'none' : theme.shadows.md};
  }
  
  &:active {
    transform: ${({ disabled }) => disabled ? 'none' : 'translateY(0)'};
  }
`;