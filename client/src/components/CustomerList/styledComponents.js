import styled from "styled-components";
import { Link } from "react-router-dom";

export const CustomerListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
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
  background-color: #f3f4f6;
  color: #374151;
  text-decoration: none;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #e5e7eb;
  }
`;
