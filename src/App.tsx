import './App.css';
import EgangotriFooter from './footer';
import EgangotriHeader from './header';
import TabPanel from './tab/tab';

function App() {
  return (
    <div className="App">
          <EgangotriHeader title='eGangotri Dashboard' />
          <TabPanel />
          <EgangotriFooter title='eGangotri Digital Preservation Trust. CC-0. In Public Domain' />
    </div>
  );
}

export default App;
