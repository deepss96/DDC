import React, { useState, useEffect, useRef } from "react";
import { FiX } from "react-icons/fi";

const InputField = ({ label, required, type = "text", value, onChange, placeholder, ...rest }) => (
  <div className="relative" style={{ marginBottom: 'var(--form-margin-bottom)' }}>
    <label className="absolute -top-2 left-3 bg-white px-1 text-gray-500 uppercase tracking-wider" style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--label-font-size)', fontWeight: 'var(--label-font-weight)' }}>
      {label}{required && <span style={{ color: 'var(--secondary-color)', fontFamily: 'var(--font-family)' }} className="ml-1">*</span>}
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
        fontSize: 'var(--input-font-size)',
        fontFamily: 'var(--font-family)',
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

const SelectField = ({ label, options = [], value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = React.useRef(null);

  React.useEffect(() => {
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

export default function ClientFormPopup({ isOpen, onClose, onSubmit }) {
  const [clientName, setClientName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [countryCode, setCountryCode] = useState("+91");
  const [countryFlag, setCountryFlag] = useState("🇮🇳");
  const [openCountryDropdown, setOpenCountryDropdown] = useState(false);
  const [countries, setCountries] = useState([]);
  const countryRef = useRef(null);
  const [countryQuery, setCountryQuery] = useState("");
  const countrySearchRef = useRef(null);

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

  const handleSave = () => {
    const newClient = {
      id: Date.now(),
      name: clientName || "Unnamed Client",
      email: email || "",
      phone: phone ? `${countryCode} ${phone}`.trim() : "",
      status,
      company: company || "",
      date
    };
    if (typeof onSubmit === "function") onSubmit(newClient);
    // Reset form
    setClientName("");
    setEmail("");
    setPhone("");
    setCompany("");
    setStatus("");
    setDate(new Date().toISOString().slice(0, 10));
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1100] p-6 overflow-auto">
      <div className="w-full max-w-5xl bg-white rounded-xl flex flex-col max-h-[90vh] client-modal">
        <div className="flex items-center justify-between px-6 py-4 sticky top-0 bg-white z-10 border-b-2 rounded-t-xl" style={{ borderBottomColor: 'var(--primary-color)' }}>
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100"
            >
              <FiX size={20} />
            </button>
            <h2 className="text-lg font-bold" style={{ color: 'var(--primary-color)', fontFamily: 'var(--font-family)' }}>CREATE CLIENT</h2>
          </div>
          <button
            onClick={handleSave}
            className="text-white px-4 py-2 rounded-xl shadow-md hover:opacity-90"
            style={{ backgroundColor: 'var(--primary-color)', fontFamily: 'var(--font-family)' }}
          >
            Save
          </button>
        </div>
        <div className="p-6 flex-1 overflow-y-auto rounded-b-xl">
          <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 'var(--form-gap)' }}>
            <div className="md:col-span-2">
              <InputField
                label="CLIENT NAME"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Enter client name"
              />
            </div>
            <div className="md:col-span-1">
              <InputField
                label="COMPANY"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Enter company name"
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
            <div className="md:col-span-1">
              <SelectField
                label="STATUS"
                options={["Active", "Inactive"]}
                value={status}
                onChange={setStatus}
                placeholder="Select status"
              />
            </div>
            <div className="md:col-span-1">
              <InputField
                label="EMAIL"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
              />
            </div>
            <div className="md:col-span-2">
              <div className="flex flex-col md:flex-row gap-4">
                <div ref={countryRef} className="relative" style={{ maxWidth: '150px' }}>
                  <label className="absolute -top-2 left-3 bg-white px-1 text-gray-500 uppercase tracking-wider" style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--label-font-size)', fontWeight: 'var(--label-font-weight)' }}>
                    COUNTRY
                  </label>
                  <div
                    onClick={() => setOpenCountryDropdown(!openCountryDropdown)}
                    style={{
                      height: 'var(--input-height)',
                      padding: 'var(--input-padding)',
                      border: `1px solid var(--input-border-color)`,
                      borderRadius: 'var(--input-border-radius)',
                      backgroundColor: 'var(--input-bg-color)',
                      color: 'var(--input-text-color)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--input-focus-border-color)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--input-border-color)'}
                  >
                    <div className="flex items-center gap-2">
                      {countryFlag && (
                        typeof countryFlag === "string" && countryFlag.startsWith("http") ? (
                          <img src={countryFlag} alt="" className="w-5 h-5 rounded-sm" />
                        ) : (
                          <span className="text-2xl leading-none">{countryFlag}</span>
                        )
                      )}
                      <span style={{ fontSize: 'var(--input-font-size)', fontFamily: 'var(--font-family)', color: 'var(--input-text-color)' }}>{countryCode}</span>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                    </svg>
                  </div>
                  {openCountryDropdown && (
                    <div className="absolute top-full left-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto mt-1 w-full" style={{ fontFamily: 'var(--font-family)' }}>
                      {countries.length === 0 ? (
                        <div style={{ padding: '6px 12px', fontSize: 'var(--input-font-size)', fontFamily: 'var(--font-family)', color: 'var(--input-text-color)' }}>Loading...</div>
                      ) : (
                        filteredCountries.map((country) => (
                          <button
                            key={`${country.name}-${country.code}`}
                            onClick={() => {
                              setCountryCode(country.code);
                              setCountryFlag(country.flag || "");
                              setCountryQuery("");
                              setOpenCountryDropdown(false);
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              width: '100%',
                              padding: '6px 12px',
                              backgroundColor: 'transparent',
                              border: 'none',
                              cursor: 'pointer',
                              textAlign: 'left',
                              fontFamily: 'var(--font-family)',
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#f9fafb'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                          >
                            {country.flag ? (
                              <img src={country.flag} alt="" className="w-4 h-4 rounded-sm" />
                            ) : (
                              <div className="w-4 h-4 bg-gray-200 rounded-sm" />
                            )}
                            <span style={{ fontSize: 'var(--input-font-size)', color: 'var(--input-text-color)' }}>{country.name}</span>
                            <span style={{ fontSize: 'var(--input-font-size)', color: 'var(--input-text-color)', marginLeft: 'auto' }}>{country.code}</span>
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <InputField
                    label="PHONE NO."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter phone number"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
