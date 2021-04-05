import './App.css';

/* function App(props) {
  const label = (<label>Hello Class!</label>);
  const elementTreeRoot = (<div className="container">{ label }</div>);

  return (elementTreeRoot);
} */

function App(props) {
  let label;
  if(props.greet){
    label = (<label>Hello { props.greet }!</label>);   
  }
  else{
    label = (<label>Hello class!</label>);
  }
  return (<div className="container">{ label }</div>);
}

export default App;
