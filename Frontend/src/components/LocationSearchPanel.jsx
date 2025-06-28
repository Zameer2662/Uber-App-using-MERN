
import React  from "react";

const LocationSearchPanel = ({
  setPanelOpen,
  setVehiclePanel,
  suggestions,
  activeField,
  setPickup,
  setDestination
}) => {
  const handleSelect = (suggestion) => {
    if (activeField === 'pickup') {
      setPickup(suggestion.description);
    } else if (activeField === 'destination') {
      setDestination(suggestion.description);
    }
    // setPanelOpen(false);
    // setVehiclePanel(true);
  };

  return (
    <div className='p-4'>
      {suggestions && suggestions.length > 0 ? (
        suggestions.map((loc, idx) => (
          <div
            key={loc.place_id || idx}
            onClick={() => handleSelect(loc)}
            className='flex gap-4 border-2 p-3 rounded-xl border-gray-50 hover:border-black cursor-pointer items-center justify-start my-4'
          >
            <h2 className='bg-[#eee] h-6 flex items-center justify-center w-14 rounded-full'>
              <i className='ri-map-pin-fill'></i>
            </h2>
            <h4 className='font-medium'>{loc.description}</h4>
          </div>
        ))
      ) : (
        <p className='text-gray-500 text-center mt-4'>No suggestions found</p>
      )}
    </div>
  );
};

export default LocationSearchPanel;
