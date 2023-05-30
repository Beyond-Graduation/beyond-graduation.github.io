import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { FaFilter, FaSearch, FaBan } from "react-icons/fa";
import axios from "../../../components/axios";
import "./ProfilesView.css";
import ProfilesViewCard from "../../../components/ProfilesViewCard/ProfilesViewCard";
import Select from "react-select";
import { Link } from "react-router-dom";

function StudentProfilesView() {
  const [alumniData, setAlumniData] = useState([]);
  const [searchAlumniData, setSearchAlumniData] = useState([]);
  const searchRef = useRef();
  const [deptList, setDeptList] = useState([
    { value: "", label: "Department" },
  ]);
  const [interestList, setInterestList] = useState([{ value: "", label: "" }]);
  const [filterData, setFilterData] = useState({
    department: "",
    areasOfInterest: [],
  });

  const handleSearch = () => {
    const search = searchRef.current.value;
    const searchData = alumniData.filter((data) => {
      return (
        data.firstName.toLowerCase().includes(search.toLowerCase()) ||
        data.lastName.toLowerCase().includes(search.toLowerCase())
      );
    });
    setSearchAlumniData(searchData);
  };

  const handleFilterChange = (name, val) => {
    if (name === "areasOfInterest") {
      setFilterData({
        ...filterData,
        //append item.value of each item in val to filterData.interest
        areasOfInterest: val.map((item) => item.value),
      });
    } else {
      setFilterData({ ...filterData, [name]: val });
    }
  };

  const applyFilter = async () => {
    const token =
      localStorage.getItem("authKey") || sessionStorage.getItem("authKey");
    axios({
      method: "get",
      url: `student/student_list?department=${filterData.department}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => {
      setAlumniData(res.data);
      setSearchAlumniData(res.data);
    });
  };

  const fetchData = async () => {
    const token =
      localStorage.getItem("authKey") || sessionStorage.getItem("authKey");
    axios({
      method: "get",
      url: `student/student_list`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => {
      setAlumniData(res.data);
      setSearchAlumniData(res.data);
      const deptList = res.data
        .map((data) => {
          return {
            value: data.department,
            label: data.department.toUpperCase(),
          };
        })
        .filter((item, index, self) => {
          return self.findIndex((t) => t.label === item.label) === index;
        });
      setDeptList(deptList);

      const interestList = res.data
        .map((data) => {
          return data.areasOfInterest.map((interest) => {
            return {
              value: interest,
              label: interest.toUpperCase(),
            };
          });
        })
        .flat()
        .filter((item, index, self) => {
          return self.findIndex((t) => t.label === item.label) === index;
        });
      setInterestList(interestList);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="profiles-view">
      <div className="profiles-view-cnt">
        <h1 className="profiles-view-head">Student Profiles</h1>
        <div className="filter-container mt-5">
          <div className="filter-inner mb-4 d-flex">
            <Select
              name="department"
              className="department me-3"
              classNamePrefix="filter-dept"
              placeholder="Department"
              isClearable={true}
              options={deptList}
              onChange={(e) =>
                e
                  ? handleFilterChange("department", e.value)
                  : handleFilterChange("department", "")
              }
            />
            {/* <Select
              isMulti
              name="areasOfInterest"
              className="department me-3"
              classNamePrefix="filter-dept"
              placeholder="Domain"
              options={interestList}
              onChange={(e) => handleFilterChange("areasOfInterest", e)}
            /> */}
          </div>
          <div className="d-flex align-items-center justify-content-between">
            <div className="search-cnt d-flex align-items-center">
              <input
                type="text"
                placeholder="Search"
                ref={searchRef}
                onKeyPress={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
              />
              <FaSearch className="search-ic" onClick={handleSearch} />
            </div>
            <div className="d-flex">
              <div className="apply-filter" onClick={applyFilter}>
                <FaFilter className="me-1" />
                Apply Filters
              </div>
              <div className="apply-filter ms-3" onClick={applyFilter}>
                <FaBan className="me-2" onClick={fetchData} />
                Clear Filters
              </div>
            </div>
          </div>
        </div>
        <div className="profiles-view-list mt-5">
          {searchAlumniData.map((student) => (
            <Link to={`/student-profile/${student.userId}`}>
              <ProfilesViewCard key={student.__id} data={student} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default StudentProfilesView;
