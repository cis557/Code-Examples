import './App.css';
import React, { useState, useEffect } from 'react';


function AppEvents() {
    const [currentEvent, setCurrentEvent] = useState('');
    
    function updateEvent(evt){
        setCurrentEvent(evt.type);
    }
    useEffect(() => {
        const elt = document.getElementById('evt');
        elt.innerHTML = currentEvent;
      }, [currentEvent]);

    return (
      <div>
        <textarea
          onKeyPress={ updateEvent }
          onCopy={ updateEvent }
          cols="15"
          rows="5"
        />
        <div id="evt"></div>
      </div>
    );
}

export default AppEvents;