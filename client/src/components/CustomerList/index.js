import { MdEdit, MdLocalPhone, MdDeleteForever } from "react-icons/md";
import {
  CustomerListWrapper,
  CustomerRow,
  CustomerCard,
  CustomerName,
  CustomerPhone,
  CustomerLink,
  EditLink,
  DeleteButton,
  AddressFlag,
} from "./styledComponents";

const CustomerList = ({ customer, onDelete }) => {
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
                {cust.address_count === 1 && (
                  <AddressFlag variant="one">Only one address</AddressFlag>
                )}
                {cust.address_count === 0 && (
                  <AddressFlag variant="add">Add address</AddressFlag>
                )}
              </CustomerName>
              <CustomerPhone>
                <MdLocalPhone size={16} color="#4fa94d" />
                {cust.phone_number}
              </CustomerPhone>
            </CustomerCard>
          </CustomerLink>

          <EditLink to={`/customers/${cust.id}/edit`}>
            <MdEdit />
          </EditLink>

          <DeleteButton onClick={() => onDelete(cust)}>
            <MdDeleteForever size={16} /> Delete
          </DeleteButton>
        </CustomerRow>
      ))}
    </CustomerListWrapper>
  );
};

export default CustomerList;
