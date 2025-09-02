import styled from "styled-components";

export const PageWrapper = styled.div`
  max-width: 500px;
  margin: 0 auto;
  padding: 24px 16px;
`;

export const LogoImg = styled.img`
  display: block;
  margin: 0 auto 24px;
  max-width: 120px;
`;

export const MessageBar = styled.div`
  background-color: ${({ variant }) =>
    variant === "error" ? "#fef2f2" : "#ecfdf5"};
  color: ${({ variant }) => (variant === "error" ? "#991b1b" : "#065f46")};
  border: 1px solid
    ${({ variant }) => (variant === "error" ? "#fecaca" : "#a7f3d0")};
  padding: 8px 12px;
  border-radius: 6px;
  margin-bottom: 16px;
  text-align: center;
  font-size: 14px;
`;


export const FormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const FormRow = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Label = styled.label`
  font-size: 14px;
  margin-bottom: 4px;
  color: #374151;
`;

export const Input = styled.input`
  padding: 8px 10px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
`;

export const ErrorText = styled.span`
  color: #b91c1c;
  font-size: 12px;
  margin-top: 4px;
`;

export const SubmitButton = styled.button`
  padding: 10px 14px;
  background-color: #4fa94d;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
`;