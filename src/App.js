
import './App.css';
import {useState, useEffect} from 'react';

// The with part of the HOC name is a general convention recommended by React,
// as it expresses the enhancing nature of the technique, like providing component 'with' something else.
const withMousePosition = (WrappedComponent) => {
  return(props) => {

    // Track the position of the cursor we need the useState
    const [mousePosition, setMousePosition] = useState({
      // The initial state will be an object with two properties, x and y equal to 0
      x: 0,
      y: 0,
    })

    // Set a global listener in the window object for the mouse move events.
    // Since this is a side-effect, a subscription and unsubscription logic inside the useEffect will be needed
    // That's why imported the useEffect hook
    useEffect(() => {
      // It's important to remove any subscription when your component unmounts
      // The way to do this is by returning a function from useEffect and then performingany cleanup needed
      const handleMousePositionChange = (e) => {
        // To complete the logic and set the state with current mouse position,
        // we need to read that information from the browser event object,
        // which is passed as an argument to the callback
        setMousePosition({
          x: e.clientX,
          y: e.clientY,
        });
      };
      // Add a new event listener for a mouse movement to the window object
      window.addEventListener("mousemove", handleMousePositionChange);
      return () => {
        window.removeEventListener("mousemove", handleMousePositionChange);
      }
    }, [])

    // Return a Wrapped component spreading the ...props so that they're passes through
    return(
      // The final step would be to set a new prop to pass that information down to all components that are interested in that data
      <WrappedComponent {...props} mousePosition={mousePosition}/>
    );
  };
};

const PanelMouseLogger = ({mousePosition}) => {
  if(!mousePosition) {
    return null;
  }

  return (
    <div className='BasicTracker'>
      <p>Mouse position:</p>
      <div className='Row'>
        <span>x: {mousePosition.x}</span>
        <span>y: {mousePosition.y}</span>
      </div>
    </div>
  );
};



const PointMouseLogger = ({mousePosition}) => {
  if(!mousePosition) {
    return null;
  }

  return(
    <p>
      ({mousePosition.x}, {mousePosition.y})
    </p>
  );
};

// Now, that the implementation of the HOC is finished,
// we'll add the last few pieces to display the mouse position on the screen.
// To enhance the 2 components previosly defined (PanelMouseLogger & PointMouseLogger)
// we'll use the HOC to create 2 new component version that will be aware of the mouse position data
// and we'll call them this way:
const PanelMouseTracker = withMousePosition(PanelMouseLogger);
const PointMouseTracker = withMousePosition(PointMouseLogger);

function App() {
  return (
    <div className='App'>
      <header className='Header'>Little Lemon Restaurant</header>
      <PanelMouseTracker/>
      <PointMouseTracker/>
    </div>
  );
}

export default App;