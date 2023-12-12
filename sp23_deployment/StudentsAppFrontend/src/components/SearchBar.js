import React from "react";

function SearchBar(props) {
    
    const handleOnChange = (e) =>{
        props.setMajor(e.target.value);
    }

    return(
        <div>
            <input
            type="text"
            placeholder="Filter by major..."
            onChange={handleOnChange}
            />
        </div>
    )
}

export default SearchBar;