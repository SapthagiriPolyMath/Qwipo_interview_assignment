import { useEffect, useMemo, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { GridLoader } from "react-spinners";
import { getCustomerById } from "../../api/customerApi";
import {
  createAddress,
  updateAddress,
  deleteAddress,
} from "../../api/addressApi";
import AddressList from "../../components/AddressList";
import {
  PageWrapper,
  ContentGrid,
  SectionCard,
  SectionTitle,
  InfoRow,
  InfoLabel,
  InfoValue,
  FormRow,
  Input,
  TextArea,
  ButtonRow,
  PrimaryButton,
  SecondaryButton,
  InlineError,
  MessageBar,
  LoaderContainer,
  ModalOverlay,
  ModalCard,
  ModalActions,
} from "./styledComponents";

const apiStatus = {
  idle: "IDLE",
  loading: "LOADING",
};

const defaultForm = {
  address_details: "",
  city: "",
  state: "",
  pin_code: "",
};

const CustomerDetailsPage = () => {
  const { id } = useParams();
  const customerId = Number(id);

  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [onlyOneAddress, setOnlyOneAddress] = useState(false);

  const [form, setForm] = useState(defaultForm);
  const [formErrors, setFormErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(apiStatus.idle);
  const [message, setMessage] = useState("");

  const [editingAddressId, setEditingAddressId] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleteStatus, setDeleteStatus] = useState(apiStatus.idle);

  const isEditing = useMemo(() => editingAddressId !== null, [editingAddressId]);

  const showTimedMessage = useCallback((text) => {
    setMessage(text);
    setTimeout(() => setMessage(""), 6000);
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await getCustomerById(customerId);
        if (!mounted) return;
        setCustomer(res.data.customer);
        setAddresses(res.data.addresses || []);
        setOnlyOneAddress(Boolean(res.data.onlyOneAddress));
      } catch {
        setMessage("Error loading customer details. Please try again.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [customerId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value.trim() }));
  };

  const validate = () => {
    const errs = {};
    if (!form.address_details) errs.address_details = "Address is required";
    if (!form.city) errs.city = "City is required";
    if (!form.state) errs.state = "State is required";
    if (!form.pin_code) errs.pin_code = "PIN code is required";
    else if (!/^\d{6}$/.test(form.pin_code))
      errs.pin_code = "PIN must be 6 digits";
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const resetForm = () => {
    setForm(defaultForm);
    setFormErrors({});
    setEditingAddressId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (isEditing) {
      const original = addresses.find((a) => a.id === editingAddressId);
      const changed =
        original.address_details !== form.address_details ||
        original.city !== form.city ||
        original.state !== form.state ||
        original.pin_code !== form.pin_code;

      if (!changed) {
        showTimedMessage("No changes to save.");
        return;
      }
    }

    setSubmitStatus(apiStatus.loading);
    try {
      if (isEditing) {
        await updateAddress(editingAddressId, {
          address_details: form.address_details,
          city: form.city,
          state: form.state,
          pin_code: form.pin_code,
        });
        setAddresses((prev) =>
          prev.map((a) =>
            a.id === editingAddressId ? { ...a, ...form } : a
          )
        );
        showTimedMessage("Address updated successfully.");
      } else {
        const res = await createAddress(customerId, {
          address_details: form.address_details,
          city: form.city,
          state: form.state,
          pin_code: form.pin_code,
        });
        setAddresses((prev) => [
          { id: res.data.address_id, ...form },
          ...prev,
        ]);
        showTimedMessage("Address added successfully.");
      }
      resetForm();
    } catch (err) {
      const msg =
        err?.response?.data?.error ||
        err?.message ||
        "Error saving address. Please try again.";
      showTimedMessage(msg);
    } finally {
      setSubmitStatus(apiStatus.idle);
    }
  };

  const handleEditAddress = (addr) => {
    setEditingAddressId(addr.id);
    setForm({
      address_details: addr.address_details?.trim() || "",
      city: addr.city?.trim() || "",
      state: addr.state?.trim() || "",
      pin_code: addr.pin_code?.toString().trim() || "",
    });
  };

  const requestDeleteAddress = (addr) => {
    if (onlyOneAddress && addresses.length === 1) {
      showTimedMessage("Cannot delete the only address.");
      return;
    }
    setPendingDelete(addr);
    setShowDeleteModal(true);
  };

  const confirmDeleteAddress = async () => {
    if (!pendingDelete) return;
    setDeleteStatus(apiStatus.loading);
    try {
      await deleteAddress(pendingDelete.id);
      setAddresses((prev) => prev.filter((a) => a.id !== pendingDelete.id));
      showTimedMessage("Address deleted successfully.");
      setOnlyOneAddress(addresses.length - 1 === 1);
    } catch (err) {
      const msg =
        err?.response?.data?.error ||
        err?.message ||
        "Error deleting address. Please try again.";
      showTimedMessage(msg);
    } finally {
      setDeleteStatus(apiStatus.idle);
      setShowDeleteModal(false);
      setPendingDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setPendingDelete(null);
  };

  if (loading) {
    return (
      <LoaderContainer>
        <GridLoader color="#36d7b7" size={16} />
      </LoaderContainer>
    );
  }

  if (!customer) {
    return (
      <LoaderContainer>
        <p>Customer not found.</p>
      </LoaderContainer>
    );
  }

  return (
    <PageWrapper>
      <ContentGrid>
        {/* LEFT COLUMN: Customer info + Address list */}
        <div>
          <SectionCard>
            <SectionTitle>Customer Information</SectionTitle>
            <InfoRow>
              <div>
                <InfoLabel>First name:</InfoLabel>{" "}
                <InfoValue>{customer.first_name}</InfoValue>
              </div>
              <div>
                <InfoLabel>Phone no:</InfoLabel>{" "}
                <InfoValue>{customer.phone_number}</InfoValue>
              </div>
            </InfoRow>
            <InfoRow>
              <div>
                <InfoLabel>Second name:</InfoLabel>{" "}
                <InfoValue>{customer.last_name}</InfoValue>
              </div>
              <div>
                <InfoLabel>ID:</InfoLabel> <InfoValue>{customer.id}</InfoValue>
              </div>
            </InfoRow>
            {message && <MessageBar>{message}</MessageBar>}
          </SectionCard>

          <AddressList
            addresses={addresses}
            onEdit={handleEditAddress}
            onDelete={requestDeleteAddress}
          />
        </div>

        {/* RIGHT COLUMN: Address form */}
        <SectionCard as="form" onSubmit={handleSubmit}>
          <SectionTitle>{isEditing ? "Add/Edit Address" : "Add Address"}</SectionTitle>

          <FormRow>
            <label htmlFor="address_details">Address</label>
            <TextArea
              id="address_details"
              name="address_details"
              placeholder="Door no, Street, Sector, Landmark"
              value={form.address_details}
              onChange={handleInputChange}
              rows={3}
            />
            {formErrors.address_details && (
              <InlineError>{formErrors.address_details}</InlineError>
            )}
          </FormRow>

          <FormRow>
            <label htmlFor="city">City</label>
            <Input
              id="city"
              name="city"
              value={form.city}
              onChange={handleInputChange}
              placeholder="City"
            />
            {formErrors.city && <InlineError>{formErrors.city}</InlineError>}
          </FormRow>

          <FormRow>
            <label htmlFor="state">State</label>
            <Input
              id="state"
              name="state"
              value={form.state}
              onChange={handleInputChange}
              placeholder="State"
            />
            {formErrors.state && <InlineError>{formErrors.state}</InlineError>}
          </FormRow>

          <FormRow>
            <label htmlFor="pin_code">PIN Code</label>
            <Input
              id="pin_code"
              name="pin_code"
              value={form.pin_code}
              onChange={(e) => {
                const next = e.target.value.replace(/\D/g, "").trim();
                setForm((prev) => ({ ...prev, pin_code: next }));
              }}
              placeholder="6-digit PIN"
              inputMode="numeric"
              maxLength={6}
            />
            {formErrors.pin_code && (
              <InlineError>{formErrors.pin_code}</InlineError>
            )}
          </FormRow>

          <ButtonRow>
            <PrimaryButton
              type="submit"
              disabled={submitStatus === apiStatus.loading}
            >
              {submitStatus === apiStatus.loading ? (
                <GridLoader color="#ffffff" size={8} />
              ) : isEditing ? (
                "Save Changes"
              ) : (
                "Add Address"
              )}
            </PrimaryButton>
            {isEditing && (
              <SecondaryButton type="button" onClick={resetForm}>
                Cancel
              </SecondaryButton>
            )}
          </ButtonRow>
        </SectionCard>
      </ContentGrid>

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <ModalOverlay>
          <ModalCard>
            <p>Delete this address permanently?</p>
            <ModalActions>
              <PrimaryButton
                type="button"
                onClick={confirmDeleteAddress}
                disabled={deleteStatus === apiStatus.loading}
              >
                {deleteStatus === apiStatus.loading ? (
                  <GridLoader color="#ffffff" size={8} />
                ) : (
                  "Yes, Delete"
                )}
              </PrimaryButton>
              <SecondaryButton type="button" onClick={cancelDelete}>
                Cancel
              </SecondaryButton>
            </ModalActions>
          </ModalCard>
        </ModalOverlay>
      )}
    </PageWrapper>
  );
};

export default CustomerDetailsPage;
