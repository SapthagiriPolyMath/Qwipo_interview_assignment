import { MdLocationCity, MdEdit, MdDelete } from "react-icons/md";
import {
  ListWrapper,
  ListTitle,
  AddressItem,
  AddressLeft,
  AddressText,
  AddressActions,
  IconButton,
  EmptyText,
} from "./styledComponents";

const AddressList = ({ addresses, onEdit, onDelete }) => {
  return (
    <ListWrapper>
      <ListTitle>Addresses</ListTitle>
      {(!addresses || addresses.length === 0) && (
        <EmptyText>No addresses yet.</EmptyText>
      )}

      {addresses.map((addr) => (
        <AddressItem key={addr.id}>
          <AddressLeft>
            <MdLocationCity size={18} color="#4b5563" />
            <AddressText>
              {addr.address_details}, {addr.city}, {addr.state} - {addr.pin_code}
            </AddressText>
          </AddressLeft>

          <AddressActions>
            <IconButton
              aria-label="Edit address"
              title="Edit address"
              onClick={() => onEdit(addr)}
            >
              <MdEdit />
            </IconButton>
            <IconButton
              aria-label="Delete address"
              title="Delete address"
              onClick={() => onDelete(addr)}
              danger
            >
              <MdDelete />
            </IconButton>
          </AddressActions>
        </AddressItem>
      ))}
    </ListWrapper>
  );
};

export default AddressList;
