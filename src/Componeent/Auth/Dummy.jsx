import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { increament } from "../../Redux/userSlice";
import DummyChild from "./DummyChild";

function Dummy() {
  const count = useSelector((state) => state.Counter);
  const dispatch = useDispatch();

  const [state, setState] = useState(0);

  // console.log("count", count);
  console.log(state);

  <style>.parentDiv {}</style>;
  return (
    <>
      <div className="parentDiv">
        <form id="form">
          <h1 style={{fontWeight: "35px"}}>
            Register with Lorem
          </h1>
          <p>Lorem ipsumsderfgtyhujikdcfvgbhsxdrctfgybhvfcdzserrupti asperiores iusto consectetur earum optio?</p>
          <div class="mb-3" style={{paddingTop: "37px", height: "119px"}}>
            <label for="exampleInputEmail1" class="form-label" style={{width: "153px", height: "31px", fontWeight: "20px"}}>
              Email address
            </label>
            <input
              type="email"
              class="form-control"
              id="exampleInputEmail1"
              placeholder="Enter Email...."
              aria-describedby="emailHelp"
              style={{marginTop: "18px", height: "55px", width: "399px", borderBottom: "4px solid #54E28D", borderRadius: "6px"}}
            />
          </div>
          <div class="mb-3" style={{paddingTop: "37px", height: "119px"}}>
            <label for="exampleInputEmail1" class="form-label" style={{width: "153px", height: "31px", fontWeight: "20px"}}>
              Password
            </label>
            <input
              type="password"
              placeholder="Enter password..."
              class="form-control"
              id="password"
              aria-describedby="emailHelp"
              style={{marginTop: "18px", height: "55px", width: "399px", borderBottom: "4px solid #54E28D", borderRadius: "6px"}}
            />
          </div>

          <button type="submit" class="btn btn-primary">
            Submit
          </button>
        </form>
      </div>
    </>
  );
}

export default Dummy;
