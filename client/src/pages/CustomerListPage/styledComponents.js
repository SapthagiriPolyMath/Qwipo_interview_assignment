import styled from "styled-components";

export const CustomerListContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
`;

export const AppLogoImg = styled.img`
  height: auto;
  width: 100px;
`;

export const CustomerListPageHeading = styled.h1`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 16px;
`;

export const SearchBar = styled.div`
  display: flex;
  gap: 8px;
  padding: 0px;
  margin-bottom: 16px;
`;

export const SearchInput = styled.input`
  flex: 1;
  padding: 4px 8px;
  margin: 0px;
  border: 1px solid #d1d5db;
  font-size: 14px;
  border-radius: 4px;
`;

export const SearchButton = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  background-color: #4fa94d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

export const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

export const FailureViewContainer = styled.div`
  text-align: center;
  color: red;
  margin-top: 20px;
`;

export const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 20px;
`;

export const PreviousButton = styled.button`
  padding: 6px 10px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background-color: white;
  cursor: pointer;
`;

export const NextButton = styled(PreviousButton)``;

export const SortSelect = styled.select`
  padding: 6px 30px 6px 10px;
  width: fit-content;
  border: 1px solid #d1d5db;
  margin-right: 14px;
  border-radius: 4px;
  background-color: #fff;
  font-size: 14px;
  color: #111827;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml;utf8,<svg fill='black' height='12' viewBox='0 0 24 24' width='12' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>");
  background-repeat: no-repeat;
  background-position: right 8px center;
  background-size: 12px;
`;

export const SortOption = styled.option`
  padding: 6px 10px;
`;