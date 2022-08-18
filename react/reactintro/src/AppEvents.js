import './App.css';
import React, { useState } from 'react';


function AppEvents() {
    const [currentEvent, setCurrentEvent] = useState(''); //state
    
    function updateEvent(evt){
        setCurrentEvent(evt.type); // update the state inside event handlers
    }

    return (
      <div>
        <textarea
          onKeyPress={ updateEvent }
          onCopy={ updateEvent }
          onClick={ updateEvent }
          cols="15"
          rows="5"
        />
        <div id="evt">{currentEvent}</div>
      </div>
    );
}

export default AppEvents;