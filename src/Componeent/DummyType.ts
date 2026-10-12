import React from "react";

function DummyType() {
    function add (a: Number, b: Number): Number {
        return a + b; 
    }

    console.log(add("5", 10))
  return (
    <div>
      <h1>Dummy Child</h1>
    </div>
  );
}

export default DummyType;