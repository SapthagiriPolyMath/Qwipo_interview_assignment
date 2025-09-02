import { useState, useEffect } from "react";
import {
  FormWrapper,
  FormRow,
  Label,
  Input,
  ErrorText,
  SubmitButton,
} from "./styledComponents";

const RegistrationForm = ({ initialData = {}, onSubmit, isEdit, externalErrors = {} }) => {
    const [form, setForm] = useState({ first_name: "", last_name: "", phone_number: "" });
    const [errors, setErrors] = useState({});
  

    useEffect(() => {
        if (initialData) {
          setForm({
            first_name: initialData.first_name || "",
            last_name: initialData.last_name || "",
            phone_number: initialData.phone_number || "",
          });
        }
      }, [initialData]);
      
      useEffect(() => {
        if (Object.keys(externalErrors).length > 0) {
          setErrors((prev) => ({ ...prev, ...externalErrors }));
        }
      }, [externalErrors]);
      

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value.trim() }));
  };

  const validate = () => {
    const errs = {};
    if (!form.first_name) errs.first_name = "First name is required.";
    if (!form.last_name) errs.last_name = "Last name is required.";
    if (!form.phone_number) errs.phone_number = "Phone number is required.";
    else if (!/^\d{10}$/.test(form.phone_number))
      errs.phone_number = "Phone number must be 10 digits.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(form);
  };

  return (
    <FormWrapper onSubmit={handleSubmit}>
      <FormRow>
        <Label htmlFor="first_name">First Name</Label>
        <Input
          id="first_name"
          name="first_name"
          placeholder="Enter first name"
          value={form.first_name}
          onChange={handleChange}
        />
        {errors.first_name && <ErrorText>{errors.first_name}</ErrorText>}
      </FormRow>

      <FormRow>
        <Label htmlFor="last_name">Last Name</Label>
        <Input
          id="last_name"
          name="last_name"
          placeholder="Enter last name"
          value={form.last_name}
          onChange={handleChange}
        />
        {errors.last_name && <ErrorText>{errors.last_name}</ErrorText>}
      </FormRow>

      <FormRow>
        <Label htmlFor="phone_number">Phone Number</Label>
        <Input
          id="phone_number"
          name="phone_number"
          placeholder="Enter 10-digit phone number"
          value={form.phone_number}
          onChange={handleChange}
          inputMode="numeric"
        />
        {errors.phone_number && <ErrorText>{errors.phone_number}</ErrorText>}
      </FormRow>

      <SubmitButton type="submit">
        {isEdit ? "Update Customer" : "Create Customer"}
      </SubmitButton>
    </FormWrapper>
  );
};

export default RegistrationForm;
