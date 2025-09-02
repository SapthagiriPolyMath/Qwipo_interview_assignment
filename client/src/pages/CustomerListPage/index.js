import { useState, useEffect, useCallback } from "react";
import { getCustomers } from "../../api/customerApi.js";
import { GridLoader } from "react-spinners";
import Logo from "../../assets/Qwipo_logo_img.png";
import { IoMdSearch } from "react-icons/io";
import { IoMdArrowRoundBack, IoMdArrowRoundForward } from "react-icons/io";
import CustomerList from "../../components/CustomerList";
import {
  CustomerListContainer,
  AppLogoImg,
  LoaderContainer,
  FailureViewContainer,
  SearchBar,
  SearchInput,
  SearchButton,
  PaginationContainer,
  PreviousButton,
  NextButton,
  CustomerListPageHeading,
  SortSelect,
  SortOption,
} from "./styledComponents.js";

const apiStatusConstants = {
  initial: "INITIAL",
  inProgress: "IN_PROGRESS",
  success: "SUCCESS",
  failure: "FAILURE",
};

const CustomerListPage = () => {
  const [customerList, setCustomerList] = useState({
    status: apiStatusConstants.initial,
    data: null,
    customerCount: null,
    errorMsg: null,
  });

  // Query params
  const [search, setSearch] = useState("");
  const [sortBy,setSortBy] = useState("first_name");
  const [sortOrder,setSortOrder] = useState("ASC");
  const [limit] = useState(10);
  const [offset, setOffset] = useState(0);

  // UI state
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");

  const total = customerList.customerCount ?? 0;
  const totalPages = Math.max(1, Math.ceil((total || 0) / limit) || 1);
  const startIdx = total === 0 ? 0 : (currentPage - 1) * limit + 1;
  const endIdx = total === 0 ? 0 : Math.min(currentPage * limit, total);

  // Fetch customers function — accepts params so we can pass fresh values
  const fetchCustomers = useCallback(
    async (params) => {
      setCustomerList((prev) => ({
        ...prev,
        status: apiStatusConstants.inProgress,
        errorMsg: null,
      }));

      try {
        const response = await getCustomers(params || {
          search,
          sortBy,
          sortOrder,
          limit,
          offset,
        });

        const total = response?.data?.total ?? 0;
        const rows = response?.data?.data ?? [];

        if (total === 0) {
          setCustomerList({
            status: apiStatusConstants.failure,
            data: null,
            customerCount: 0,
            errorMsg: "No search results found",
          });
          return;
        }

        setCustomerList({
          status: apiStatusConstants.success,
          data: rows,
          customerCount: total,
          errorMsg: null,
        });
      } catch (error) {
        const status = error?.response?.status;
        const message =
          status === 500
            ? "Internal server error, Try again later"
            : error?.message || "Something went wrong";

        setCustomerList({
          status: apiStatusConstants.failure,
          data: null,
          customerCount: null,
          errorMsg: message,
        });
      }
    },
    [search, sortBy, sortOrder, limit, offset]
  );

  // Initial fetch on mount
  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  // Handlers
  const handleSearchClick = () => {
    const newSearch = (searchInput || "").trim();
    setCurrentPage(1);
    setOffset(0);
    setSearch(newSearch);
    fetchCustomers({
      search: newSearch,
      sortBy,
      sortOrder,
      limit,
      offset: 0,
    });
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearchClick();
    }
  };

  const handleSortChange = (newSortBy, newSortOrder) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    setCurrentPage(1);
    setOffset(0);
  
    fetchCustomers({
      search,
      sortBy: newSortBy,
      sortOrder: newSortOrder,
      limit,
      offset: 0,
    });
  };
  

  const handlePageChange = (page) => {
    const newOffset = (page - 1) * limit;
    setCurrentPage(page);
    setOffset(newOffset);
    fetchCustomers({
      search,
      sortBy,
      sortOrder,
      limit,
      offset: newOffset,
    });
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  const getVisiblePages = () => {
    if (totalPages <= 3) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage === 1) return [1, 2, 3];
    if (currentPage === totalPages)
      return [totalPages - 2, totalPages - 1, totalPages];
    return [currentPage - 1, currentPage, currentPage + 1];
  };

  const renderCustomerListViews = () => {
    const { status, data, errorMsg } = customerList;
    switch (status) {
      case apiStatusConstants.inProgress:
        return (
          <LoaderContainer>
            <GridLoader color="#36d7b7" loading={true} size={14} margin={2} />
          </LoaderContainer>
        );
      case apiStatusConstants.success:
        return <CustomerList customer={data} />;
      case apiStatusConstants.failure:
        return (
          <FailureViewContainer>
            <p>{errorMsg || "Something went wrong"}</p>
          </FailureViewContainer>
        );
      default:
        return null;
    }
  };

  return (
    <CustomerListContainer>
      <AppLogoImg src={Logo} alt="Qwipo" />
      <CustomerListPageHeading>
        Registered Customers List
      </CustomerListPageHeading>

      <SearchBar>
        <SearchInput
          type="text"
          placeholder="Search by Name/ Phone Number/ City/ State/ Pincode."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={handleSearchKeyDown}
        />
        <SearchButton onClick={handleSearchClick}>
          <IoMdSearch size={16} />
          <p>Click to search</p>
        </SearchButton>
      </SearchBar>
      <SortSelect
        value={sortBy}
        onChange={(e) => handleSortChange(e.target.value, sortOrder)}
      >
        <SortOption value="first_name">First Name</SortOption>
        <SortOption value="last_name">Last Name</SortOption>
        <SortOption value="id">ID</SortOption>
      </SortSelect>

      <SortSelect
        value={sortOrder}
        onChange={(e) => handleSortChange(sortBy, e.target.value)}
      >
        <SortOption value="ASC">Ascending</SortOption>
        <SortOption value="DESC">Descending</SortOption>
      </SortSelect>

      {renderCustomerListViews()}

      <PaginationContainer>
        <PreviousButton
          onClick={handlePrev}
          disabled={currentPage === 1 || totalPages === 1}
        >
          <IoMdArrowRoundBack size={18} />
        </PreviousButton>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {getVisiblePages().map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              disabled={page === currentPage}
              style={{
                padding: "6px 12px",
                borderRadius: 6,
                border: "1px solid #d1d5db",
                cursor: page === currentPage ? "default" : "pointer",
                backgroundColor:
                  page === currentPage ? "#4fa94d" : "#ffffff",
                color: page === currentPage ? "#ffffff" : "#111827",
                minWidth: 36,
              }}
            >
              {page}
            </button>
          ))}
        </div>

        <NextButton
          onClick={handleNext}
          disabled={currentPage === totalPages || totalPages === 1}
        >
          <IoMdArrowRoundForward size={18} />
        </NextButton>
      </PaginationContainer>

      <div style={{ display: "flex", justifyContent: "center", marginTop: 8 }}>
        <p style={{ color: "#6b7280", fontSize: 12 }}>
          {total === 0
            ? "No entries"
            : `Showing ${startIdx}–${endIdx} of ${total}`}
        </p>
      </div>
    </CustomerListContainer>
  );
};

export default CustomerListPage;
