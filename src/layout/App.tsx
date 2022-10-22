import './App.css';
import EgangotriFooter from 'layout/footer';
import EgangotriHeader from 'layout/header';
import TabPanel from 'pages/tab/tab';

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
