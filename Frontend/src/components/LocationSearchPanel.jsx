import React from 'react'

const LocationSearchPanel = (props) => {
    console.log(props);
    

    

    // sample array for location

    const locations = [
        "24A , Model Town Lahore MERN seekhni hai to Ajao",
        "24B, Jassar Bybass Narowal MERN seekhni hai to Ajao",
        "24C , Sadar Cantt Lahore MERN seekhni hai to Ajao",
        "24D , Kacha Sadiqabad Rahim Yar Khan MERN seekhni hai to Ajao"
    ]

    return (
        <div>
            {/* this is just a sample data */}

            {
                locations.map(function (elem , idx) {
                    return <div  key={idx }
                    onClick={() =>{
                    props.setVehiclePanel(true)
                    props.setPanelOpen(false)
                    }} className='flex gap-4  border-2 p-3 rounded-xl border-gray-50 active:border-black items-center justify-start my-4'>
                        <h2 className='bg-[#eee] h-6 flex items-center justify-center w-14 rounded-full'><i className="ri-map-pin-fill  "></i></h2>
                        <h4 className='font-medium'>{elem}</h4>
                    </div>
                })
            }

           





        </div>
    )
}

export default LocationSearchPanel
