import styled from "styled-components";

export const PageWrapper = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 16px;
`;

export const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr; /* horizontal layout on md+ */
  }
`;

export const SectionCard = styled.div`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
`;

export const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 12px 0;
  color: #111827;
`;

export const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 0;
  border-bottom: 1px dashed #e5e7eb;

  &:last-of-type {
    border-bottom: none;
  }
`;

export const InfoLabel = styled.span`
  color: #6b7280;
  font-weight: 500;
`;

export const InfoValue = styled.span`
  color: #111827;
  font-weight: 600;
`;

export const FormRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 12px;

  label {
    font-size: 14px;
    color: #374151;
  }
`;

export const Input = styled.input`
  padding: 8px 10px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  color: #111827;
  background: #fff;
`;

export const TextArea = styled.textarea`
  padding: 8px 10px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  color: #111827;
  background: #fff;
  resize: vertical;
`;

export const InlineError = styled.span`
  color: #b91c1c;
  font-size: 12px;
`;

export const ButtonRow = styled.div`
  display: flex;
  gap: 8px;
  margin: 8px 0 12px;
`;

export const PrimaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  background: #4fa94d;
  color: #ffffff;
  font-weight: 600;
`;

export const SecondaryButton = styled.button`
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  background: #ffffff;
  color: #111827;
  cursor: pointer;
`;

export const MessageBar = styled.div`
  margin-top: 12px;
  padding: 8px 12px;
  background: #ecfdf5;
  color: #065f46;
  border: 1px solid #a7f3d0;
  border-radius: 6px;
  font-size: 14px;
`;

export const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 40px 0;
`;

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
`;

export const ModalCard = styled.div`
  background: #ffffff;
  border-radius: 8px;
  padding: 16px;
  min-width: 300px;
  border: 1px solid #e5e7eb;
`;

export const ModalActions = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 12px;
`;
