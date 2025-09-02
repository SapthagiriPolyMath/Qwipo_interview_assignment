import { MdEdit } from "react-icons/md";
import {
  CustomerListWrapper,
  CustomerRow,
  CustomerCard,
  CustomerName,
  CustomerPhone,
  CustomerLink,
  EditLink
} from "./styledComponents";

const CustomerList = ({ customer }) => {
  if (!customer || customer.length === 0) {
    return <p>No customers to display</p>;
  }

  return (
    <CustomerListWrapper>
      {customer.map((cust) => (
        <CustomerRow key={cust.id}>
          <CustomerLink to={`/customers/${cust.id}`}>
            <CustomerCard>
              <CustomerName>
                {cust.first_name} {cust.last_name}
              </CustomerName>
              <CustomerPhone>{cust.phone_number}</CustomerPhone>
            </CustomerCard>
          </CustomerLink>
          <EditLink to={`/customers/${cust.id}/edit`} title="Edit customer">
            <MdEdit size={20} />
          </EditLink>
        </CustomerRow>
      ))}
    </CustomerListWrapper>
  );
};

export default CustomerList;
