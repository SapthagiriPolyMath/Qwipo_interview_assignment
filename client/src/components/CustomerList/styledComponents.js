import styled, {css} from "styled-components";
import { Link } from "react-router-dom";

export const CustomerListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
  margin-top: 10px;
  height: auto;
`;

export const CustomerRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

export const CustomerLink = styled(Link)`
  flex: 1;
  text-decoration: none;
  color: inherit;
`;

export const CustomerCard = styled.div`
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background-color: #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
  }
`;

export const CustomerName = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 4px 0;
  color: #111827;
`;

export const CustomerPhone = styled.p`
  font-size: 14px;
  color: #4b5563;
  margin: 0;
`;

export const EditLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  border-radius: 4px;
  background-color: #bababa;
  color: #374151;
  text-decoration: none;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #e5e7eb;
  }
`;

export const DeleteButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
  border: none;
  margin: none;
  color: #dc2626;
  cursor: pointer;
  transition: background-color 0.2s ease;
  background-color: transparent;
  border-radius: 4px;

  &:hover {
    background-color: rgba(220, 38, 38, 0.5);
  }
`;

export const AddressFlag = styled.span`
  margin-left: 8px;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  ${({ variant }) =>
    variant === "one"
      ? css`
          background-color: #fef3c7;
          color: #92400e;
          border: 1px solid #fde68a;
        `
      : css`
          background-color: #dcfce7;
          color: #166534;
          border: 1px solid #bbf7d0;
        `}
`;