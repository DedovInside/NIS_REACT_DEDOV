import styled from 'styled-components';

export const ActionButton = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: 8px 16px;
  margin: 4px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  font-family: 'SK Cuber', sans-serif;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  
  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background: linear-gradient(135deg, #ff00e1, #ff66ff); // Розовый градиент
          color: white;
          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(255, 0, 225, 0.4);
          }
        `;
      case 'danger':
        return `
          background: linear-gradient(135deg, #ff4757, #ff3838);
          color: white;
          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(255, 71, 87, 0.4);
          }
        `;
      default:
        return `
          background: linear-gradient(135deg, #7bed9f, #5f27cd);
          color: white;
          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(123, 237, 159, 0.4);
          }
        `;
    }
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;
