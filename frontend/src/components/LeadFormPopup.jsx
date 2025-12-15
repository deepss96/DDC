import React, { useState, useEffect, useRef } from "react";
import { FiX } from "react-icons/fi";
import { toast } from "react-toastify";

// InputField component moved outside to prevent re-creation on each render
const InputField = ({ label, required, type = "text", value, onChange, placeholder, ...rest }) => (
  <div className="relative" style={{ marginBottom: 'var(--form-margin-bottom)' }}>
    <label className="absolute -top-2 left-3 bg-white px-1 text-gray-500 uppercase tracking-wider" style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--label-font-size)', fontWeight: 'var(--label-font-weight)' }}>
      <span>
        {label}{required && <span style={{ color: 'var(--secondary-color)', fontFamily: 'var(--font-family)' }} className="ml-1">*</span>}
      </span>
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{
        width: '100%',
        height: 'var(--input-height)',
        padding: 'var(--input-padding)',
        fontSize: 'var(--placeholder-font-size)',
        fontFamily: 'var(--font-family)',
        fontWeight: 'normal',
        border: `1px solid var(--input-border-color)`,
        borderRadius: 'var(--input-border-radius)',
        backgroundColor: 'var(--input-bg-color)',
        color: 'var(--input-text-color)',
        outline: 'none',
        transition: 'border-color 0.2s',
      }}
      onFocus={(e) => e.target.style.borderColor = 'var(--input-focus-border-color)'}
      onBlur={(e) => e.target.style.borderColor = 'var(--input-border-color)'}
      {...rest}
    />

  </div>
);

export default function LeadFormPopup({ isOpen, onClose, onSubmit, isEdit = false, editLead = null }) {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [leadType, setLeadType] = useState("");
  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [countryFlag, setCountryFlag] = useState("🇮🇳");
  const [openCountryDropdown, setOpenCountryDropdown] = useState(false);
  const [countries, setCountries] = useState([]);
  const countryRef = useRef(null);
  const [countryQuery, setCountryQuery] = useState("");
  const countrySearchRef = useRef(null);

  // ---- Added states for previously non-editable fields ----
  const [address, setAddress] = useState("");
  const [source, setSource] = useState(""); // if you want to store select values later
  const [category, setCategory] = useState("");
  const [leadStatus, setLeadStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [lastContactedDate, setLastContactedDate] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");
  const [expectedClosureDate, setExpectedClosureDate] = useState("");
  const [budget, setBudget] = useState("");
  const [description, setDescription] = useState("");
  const [leadAssignee, setLeadAssignee] = useState("");

  useEffect(() => {
    if (isEdit && editLead) {
      setContactName(editLead.contact_name || '');
      setDate(editLead.date || '');
      const phoneParts = editLead.phone ? editLead.phone.split(' ') : ['', ''];
      setCountryCode(phoneParts[0] || '+91');
      setPhone(phoneParts.slice(1).join(' ') || '');
      setEmail(editLead.email || '');
      setCompany(editLead.company_name || '');
      setAddress(editLead.address || '');
      setLeadType(editLead.lead_type || '');
      setSource(editLead.source || '');
      setLeadStatus(editLead.lead_status || '');
      setLastContactedDate(editLead.last_contacted_date || '');
      setLeadAssignee(editLead.lead_assignee || '');
      setDescription(editLead.description || '');
    } else {
      // Reset for new lead
      setContactName('');
      setDate(new Date().toISOString().slice(0, 10));
      setPhone('');
      setEmail('');
      setCompany('');
      setAddress('');
      setLeadType('');
      setSource('');
      setLeadStatus('');
      setLastContactedDate('');
      setLeadAssignee('');
      setDescription('');
    }
  }, [isEdit, editLead]);

  const handleSave = async () => {
    if (!contactName || !phone) {
      toast.error("Contact Name and Phone are required");
      return;
    }

    const leadData = {
      contact_name: contactName,
      date,
      phone: `${countryCode} ${phone}`.trim(),
      email,
      company_name: company,
      address,
      lead_type: leadType,
      source,
      lead_status: leadStatus,
      last_contacted_date: lastContactedDate,
      lead_assignee: leadAssignee,
      description
    };

    try {
      const method = isEdit ? 'PUT' : 'POST';
      const url = isEdit ? `/api/leads/${editLead.id}` : '/api/leads';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData)
      });

      if (response.ok) {
        toast.success(isEdit ? 'Lead updated successfully!' : 'Lead saved successfully!');
        onClose();
      } else {
        toast.error(isEdit ? 'Failed to update lead' : 'Failed to save lead');
      }
    } catch (error) {
      toast.error(isEdit ? 'Error updating lead' : 'Error saving lead');
    }
  };

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await fetch("https://restcountries.com/v3.1/all?fields=name,flags,idd,cca2");
        const data = await res.json();
        const mapped = (Array.isArray(data) ? data : []).map((c) => {
          const root = (c.idd && c.idd.root) || "";
          const suff = c.idd && Array.isArray(c.idd.suffixes) && c.idd.suffixes.length ? c.idd.suffixes[0] : "";
          const code = `${root}${suff}`.trim();
          return {
            name: (c.name && c.name.common) || "",
            code: code || "",
            flag: (c.flags && (c.flags.svg || c.flags.png)) || "",
            cca2: c.cca2 || "",
          };
        }).filter((c) => c.code.startsWith("+"));

        mapped.sort((a, b) => a.name.localeCompare(b.name));
        if (mounted) setCountries(mapped);

        const india = mapped.find((c) => c.cca2 === "IN") || mapped.find((c) => c.code.startsWith("+91"));
        if (india && mounted) {
          setCountryCode(india.code);
          setCountryFlag(india.flag || "🇮🇳");
        }
      } catch {}
    };
    load();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (openCountryDropdown && countryRef.current && !countryRef.current.contains(e.target)) {
        setOpenCountryDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openCountryDropdown]);

  useEffect(() => {
    if (openCountryDropdown && countrySearchRef.current) {
      countrySearchRef.current.focus();
    }
  }, [openCountryDropdown]);

  const filteredCountries = (() => {
    const q = countryQuery.trim().toLowerCase();
    const rank = (c) => {
      if (!q) return 10;
      const digits = (c.code || "").replace(/\+/g, "");
      const name = (c.name || "").toLowerCase();
      if (digits.startsWith(q)) return 0;
      if (digits.includes(q)) return 1;
      if (name.startsWith(q)) return 2;
      if (name.includes(q)) return 3;
      return 99;
    };
    return countries
      .map((c) => ({ ...c, _r: rank(c) }))
      .filter((c) => c._r !== 99)
      .sort((a, b) => a._r - b._r || a.name.localeCompare(b.name));
  })();

  const SelectField = ({ label, options = [], value, onChange, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef(null);

    useEffect(() => {
      const handleClickOutside = (e) => {
        if (isOpen && selectRef.current && !selectRef.current.contains(e.target)) {
          setIsOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    const handleSelect = (option) => {
      onChange(option);
      setIsOpen(false);
    };

    return (
      <div ref={selectRef} className="relative" style={{ marginBottom: 'var(--form-margin-bottom)' }}>
        <label className="absolute -top-2 left-3 bg-white px-1 text-gray-500 uppercase tracking-wider" style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--label-font-size)', fontWeight: 'var(--label-font-weight)' }}>
          {label}
        </label>
        <div
          onClick={() => setIsOpen(!isOpen)}
          style={{
            width: '100%',
            height: 'var(--input-height)',
            padding: 'var(--input-padding)',
            fontSize: 'var(--input-font-size)',
            fontFamily: 'var(--font-family)',
            border: `1px solid var(--input-border-color)`,
            borderRadius: 'var(--input-border-radius)',
            backgroundColor: 'var(--input-bg-color)',
            color: value ? 'var(--input-text-color)' : 'var(--input-placeholder-color)',
            outline: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'border-color 0.2s',
          }}
          onFocus={(e) => e.target.style.borderColor = 'var(--input-focus-border-color)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--input-border-color)'}
        >
          <span style={{
            color: value ? 'var(--input-text-color)' : 'var(--input-placeholder-color)',
            fontSize: 'var(--placeholder-font-size)',
            fontFamily: 'var(--font-family)',
          }}>
            {value || placeholder}
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
          </svg>
        </div>
        {isOpen && (
          <div className="absolute top-full left-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto mt-1 w-full">
            {options.map((option, index) => (
              <div
                key={index}
                onClick={() => handleSelect(option)}
                style={{
                  padding: '8px 12px',
                  fontSize: 'var(--input-font-size)',
                  fontFamily: 'var(--font-family)',
                  color: option === value ? 'var(--input-placeholder-color)' : 'var(--input-text-color)',
                  cursor: 'pointer',
                  backgroundColor: option === value ? '#f3f4f6' : 'transparent',
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f9fafb'}
                onMouseLeave={(e) => e.target.style.backgroundColor = option === value ? '#f3f4f6' : 'transparent'}
              >
                {option}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1100] p-2 sm:p-6 overflow-auto">
      <div className="w-full max-w-5xl bg-white rounded-xl flex flex-col max-h-[75vh] sm:max-h-[90vh] mt-2 mb-2 sm:mt-0 sm:mb-0 lead-modal">
        <div className="flex items-center justify-between px-6 py-4 sticky top-0 bg-white z-10 border-b-2 rounded-t-xl" style={{ borderBottomColor: 'var(--primary-color)' }}>
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100"
            >
              <FiX size={20} />
            </button>
            <h2 className="text-lg font-bold" style={{ color: 'var(--primary-color)', fontFamily: 'var(--font-family)' }}>{isEdit ? 'EDIT LEAD' : 'NEW LEAD'}</h2>
          </div>
          <button
            onClick={handleSave}
            className="text-white px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base rounded-xl shadow-md hover:opacity-90"
            style={{ backgroundColor: 'var(--primary-color)', fontFamily: 'var(--font-family)' }}
          >
            Save
          </button>
        </div>
        <div className="p-6 flex-1 overflow-y-auto rounded-b-xl">
          <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 'var(--form-gap)' }}>
            {/* Row 1: CONTACT NAME* | DATE */}
            <div className="md:col-span-1">
              <InputField
                label="CONTACT NAME"
                required
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="Enter contact name"
              />
            </div>
            <div className="md:col-span-1">
              <InputField
                label="DATE"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            {/* Row 2: PHONE NO. | EMAIL */}
            <div className="md:col-span-1">
              <InputField
                label="PHONE NO."
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter phone number"
              />
            </div>
            <div className="md:col-span-1">
              <InputField
                label="EMAIL"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
              />
            </div>

            {/* Row 3: COMPANY NAME | ADDRESS */}
            <div className="md:col-span-1">
              <InputField
                label="COMPANY NAME"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Enter company name"
              />
            </div>
            <div className="md:col-span-1">
              <InputField
                label="ADDRESS"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter address"
              />
            </div>

            {/* Row 4: LEAD TYPE | SOURCE */}
            <div className="md:col-span-1">
              <SelectField
                label="LEAD TYPE"
                options={["Construction", "Interior", "Renovation"]}
                value={leadType}
                onChange={setLeadType}
                placeholder="Select lead type"
              />
            </div>
            <div className="md:col-span-1">
              <SelectField
                label="SOURCE"
                options={["Manual", "Email", "Website", "Social Media", "Whatsapp"]}
                value={source}
                onChange={setSource}
                placeholder="Select source"
              />
            </div>

            {/* Row 5: LEAD STATUS | LAST CONTACTED DATE */}
            <div className="md:col-span-1">
              <SelectField
                label="LEAD STATUS"
                options={["Open - Not Converted", "Working - Completed", "Close - Convert", "Close - Lost"]}
                value={leadStatus}
                onChange={setLeadStatus}
                placeholder="Select lead status"
              />
            </div>
            <div className="md:col-span-1">
              <InputField
                label="LAST CONTACTED DATE"
                value={lastContactedDate}
                onChange={(e) => setLastContactedDate(e.target.value)}
                placeholder="dd/mm/yyyy"
              />
            </div>

            {/* Row 6: LEAD ASSIGNEE | DESCRIPTION */}
            <div className="md:col-span-1">
              <SelectField
                label="LEAD ASSIGNEE"
                options={["Rahul Sharma", "Priya Patel", "Amit Kumar", "Sneha Singh", "Vikram Gupta", "Anjali Verma"]}
                value={leadAssignee}
                onChange={setLeadAssignee}
                placeholder="Select assignee"
              />
            </div>
            <div className="md:col-span-1">
              <InputField
                label="DESCRIPTION"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
