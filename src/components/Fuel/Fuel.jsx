import React, { useState } from "react";
import petrolpump from "../../assets/petrolpump.svg";
import fueldispenser from "../../assets/fueldispenser.svg";
import Container from "../Container/Container";
import { FaPlus, FaMinus, FaShoppingCart, FaGasPump } from "react-icons/fa";

const Fuel = () => {
  const fuelData = {
    Octane: 130,
    Petrol: 120,
    Diesel: 110,
  };

  const [fuel, setFuel] = useState("Petrol");
  const [qty, setQty] = useState(5);

  return (
    <div className="min-h-screen bg-center bg-cover flex items-center"style={{backgroundImage:`url(${petrolpump})`}}>
      <Container className="flex justify-center">

        <div className="w-[320px] h-[650px] bg-no-repeat bg-center flex flex-col items-center justify-center text-center" style={{ backgroundImage: `url(${fueldispenser})` }} >


          {/* Dropdown */}

           
          <div className="mt-10"> <select value={fuel} onChange={(e) => setFuel(e.target.value)} className="border rounded-lg px-4 py-.5 bg-white" > {Object.keys(fuelData).map((item) => ( <option key={item}>{item}</option> ))} </select> </div>

          {/* Price */}
          <div className="border rounded-lg px-3 py-.5 mt-2 bg-white"> Tk {fuelData[fuel]} per Liter </div>

          {/* Quantity */}
          <div className="flex items-center gap-6 mt-3"> 
            <button onClick={() => setQty(qty > 1 ? qty - 1 : 1)} className="border rounded-lg p-2" > <FaMinus /> </button>     <span className="text-xl">{qty}</span> 
            <button onClick={() => setQty(qty + 1)} className="border rounded-lg p-2" > <FaPlus /> </button> 
            </div>

          {/* Add to Cart */}
          <button className="flex items-center gap-2 border rounded-lg px-3 py-.5 mt-3 bg-white"> <FaShoppingCart /> add to cart </button>

          {/* Total */}
          <div className="border rounded-lg px-2 py-.5 mt-3 bg-white font-semibold"> Total: Tk {fuelData[fuel] * qty} </div>

        </div>

      </Container>
    </div>
  );
};

export default Fuel;