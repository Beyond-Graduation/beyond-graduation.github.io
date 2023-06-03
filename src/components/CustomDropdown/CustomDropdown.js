import React, { useEffect } from "react";
import "./CustomDropdown.css";
import { components } from "react-select";
import Select from "react-select";
import Creatable from "react-select/creatable";
import addIcon from "../../assets/icons/add-icon.svg";

export function CustomDropdown({ title, options, onChange, defaultValue }) {
  const DropdownIndicator = (props) => {
    return (
      <components.DropdownIndicator {...props}>
        <svg
          fill="white"
          height="24"
          viewBox="0 0 24 24"
          width="24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M7 10l5 5 5-5z" />
          <path d="M0 0h24v24H0z" fill="none" />
        </svg>
      </components.DropdownIndicator>
    );
  };
  return (
    <div className="custom-dd">
      <Select
        className="basic-single"
        classNamePrefix="custom-dd"
        components={{ DropdownIndicator }}
        options={options}
        placeholder={title}
        isClearable={true}
        onChange={(e) => onChange(e)}
        defaultValue={defaultValue}
      />
    </div>
  );
}

export function MutliDropdown({ title, options, onChange, defaultValue }) {
  const DropdownIndicator = (props) => {
    return (
      <components.DropdownIndicator {...props}>
        <img src={addIcon} alt="add" />
      </components.DropdownIndicator>
    );
  };

  return (
    <div className="multi-dd">
      <Creatable
        isMulti="true"
        classNamePrefix="multi-select"
        placeholder={title}
        components={{ DropdownIndicator }}
        options={options}
        noOptionsMessage={() => "Type and add a new option"}
        maxMenuHeight={210}
        onChange={(e) => {
          //console.log(e);
          onChange(e);
        }}
        defaultValue={defaultValue}
      />
    </div>
  );
}
