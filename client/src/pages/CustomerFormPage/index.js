import { useParams, useNavigate} from "react-router-dom";
import { useEffect, useState } from "react";
import { getCustomerById, createCustomer, updateCustomer } from "../../api/customerApi";
import RegistrationForm from "./RegistrationForm";
import { PageWrapper, LogoImg, MessageBar } from "./styledComponents";
import Logo from "../../assets/Qwipo_logo_img.png";

const CustomerFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [initialData, setInitialData] = useState(null);
  const [message, setMessage] = useState("");
  const [messageVariant, setMessageVariant] = useState("success");
  const [fieldErrors, setFieldErrors] = useState({});


  useEffect(() => {
    if (isEdit) {
      getCustomerById(id)
        .then((res) => setInitialData(res.data.customer))
        .catch(() => setMessage("Failed to load customer data."));
    }
  }, [id, isEdit]);

  const handleSubmit = async (formData) => {
    try {
        if (isEdit) {
          await updateCustomer(id, formData);
          setMessage("Customer updated successfully.");
          setMessageVariant("success");
        } else {
          await createCustomer(formData);
          setMessage("Customer created successfully.");
          setMessageVariant("success");
        }
        setTimeout(() => {
          setMessage("");
          navigate("/");
        }, 3000);
      } catch (err) {
        const msg =
          err?.response?.data?.error ||
          err?.message ||
          "Something went wrong.";
        setMessage(msg);
        setMessageVariant("error");
      
        // ✅ Trigger phone number field error if conflict
        if (
          msg.includes("Phone number already exists") ||
          msg.includes("Phone number already registered")
        ) {
          setFieldErrors({ phone_number: "Enter a valid phone number" });
        }
      
        setTimeout(() => {
          setMessage("");
          setFieldErrors({});
        }, 3000);
      }
    };      

  return (
    <PageWrapper>
      <LogoImg src={Logo} alt="Qwipo Logo" />
      {message && <MessageBar variant={messageVariant}>{message}</MessageBar>}
      <RegistrationForm
        initialData={initialData}
        onSubmit={handleSubmit}
        isEdit={isEdit}
        externalErrors={fieldErrors}
     />

    </PageWrapper>
  );
};

export default CustomerFormPage;
