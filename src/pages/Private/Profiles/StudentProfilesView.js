import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { FaFilter, FaSearch, FaBan } from "react-icons/fa";
import axios from "../../../components/axios";
import "./ProfilesView.css";
import ProfilesViewCard from "../../../components/ProfilesViewCard/ProfilesViewCard";
import Select from "react-select";
import { Link } from "react-router-dom";

function StudentProfilesView() {
  const token =
    localStorage.getItem("authKey") || sessionStorage.getItem("authKey");
  const [alumniData, setAlumniData] = useState([]);
  const [searchAlumniData, setSearchAlumniData] = useState([]);
  const searchRef = useRef();
  const departmentRef = useRef();
  const interestRef = useRef();
  const sortRef = useRef();
  const [deptList, setDeptList] = useState([
    { value: "", label: "Department" },
  ]);
  const [interestList, setInterestList] = useState([{ value: "", label: "" }]);
  const [filterData, setFilterData] = useState({
    department: "",
    areasOfInterest: [],
    sort: "",
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
    //remove null values and empty string and empty array from filterData
    var filter = Object.fromEntries(
      Object.entries(filterData).filter(
        ([key, value]) => value !== null && value !== "" && value !== 0
      )
    );
    if (filter.areasOfInterest.length)
      filter.areasOfInterest = filter.areasOfInterest.join(",");
    else {
      const { areasOfInterest, ...remfilter } = filter;
      filter = remfilter;
    }

    if (Object.keys(filter).length === 0) {
      fetchData();
    } else {
      await axios({
        method: "get",
        url: "student/student_list",
        params: filter,
        headers: {
          Authorization: `bearer ${token}`,
        },
      }).then((res) => {
        setAlumniData(res.data);
        setSearchAlumniData(res.data);
      });
    }
  };

  const fetchData = async () => {
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
    });
  };

  const handleClearFilter = () => {
    const clearData = {
      department: "",
      areasOfInterest: [],
      sort: "",
    };
    interestRef.current.clearValue();
    departmentRef.current.clearValue();
    sortRef.current.clearValue();
    setFilterData(clearData);
    fetchData();
  };

  const getAreasofInterest = async () => {
    axios({
      method: "get",
      url: `user/get_interest_list`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => {
      const areasList = res.data.areasOfInterest.map((areas) => ({
        value: areas,
        label: areas,
      }));
      setInterestList(areasList);
    });
  };

  const sortData = [
    { label: "Default", value: "" },
    { label: "Ascending By Name", value: "a_to_z" },
    { label: "Descending By Name", value: "z_to_a" },
    { label: "Latest", value: "latest" },
    { label: "Oldest", value: "oldest" },
  ];

  useEffect(() => {
    getAreasofInterest();
    fetchData();
  }, []);

  return (
    <div className="profiles-view">
      <div className="profiles-view-cnt">
        <h1 className="profiles-view-head">Student Profiles</h1>
        <div className="filter-container mt-5">
          <form id="filterForm">
            <div className="filter-inner mb-4 align-items-center">
              <div className="d-sm-flex d-block align-items-center mb-4">
                <Select
                  name="department"
                  className="department me-3 mt-2"
                  classNamePrefix="filter-dept"
                  placeholder="Department"
                  isClearable={true}
                  ref={departmentRef}
                  options={deptList}
                  onChange={(e) =>
                    e
                      ? handleFilterChange("department", e.value)
                      : handleFilterChange("department", "")
                  }
                />
                <Select
                  isMulti
                  name="areasOfInterest"
                  className="department me-3 mt-2"
                  classNamePrefix="filter-dept"
                  placeholder="Domain"
                  ref={interestRef}
                  options={interestList}
                  onChange={(e) => handleFilterChange("areasOfInterest", e)}
                />
                <Select
                  name="sort"
                  className="department me-3 mt-2"
                  classNamePrefix="filter-dept"
                  placeholder="Sort By"
                  isClearable={true}
                  ref={sortRef}
                  options={sortData}
                  onChange={(e) =>
                    e
                      ? handleFilterChange("sort", e.value)
                      : handleFilterChange("sort", "")
                  }
                />
              </div>
            </div>

            <div className="d-md-flex flex-row-reverse d-block align-items-center justify-content-end">
              <div className="d-flex">
                <div className="apply-filter" onClick={applyFilter}>
                  <FaFilter className="me-1" />
                  Apply Filters
                </div>
                <div className="apply-filter ms-3" onClick={handleClearFilter}>
                  <FaBan className="me-2" />
                  Clear Filters
                </div>
              </div>
              <div className="search-cnt d-flex align-items-center me-3">
                <input
                  type="text"
                  placeholder="Search by Name"
                  ref={searchRef}
                  onChange={handleSearch}
                />
                <FaSearch className="search-ic" onClick={handleSearch} />
              </div>
            </div>
          </form>
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
