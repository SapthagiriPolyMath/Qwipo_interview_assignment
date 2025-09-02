import styled, { css } from "styled-components";

export const ListWrapper = styled.div`
  margin-top: 16px;
`;

export const ListTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #111827;
`;

export const EmptyText = styled.p`
  color: #6b7280;
  font-size: 14px;
`;

export const AddressItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 10px 12px;
  background: #ffffff;
  & + & {
    margin-top: 8px;
  }
`;

export const AddressLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
`;

export const AddressText = styled.span`
  color: #111827;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const AddressActions = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const IconButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  background: #ffffff;
  color: #374151;
  cursor: pointer;

  ${(p) =>
    p.danger &&
    css`
      color: #b91c1c;
      border-color: #fecaca;
      background: #fef2f2;
    `}
`;
