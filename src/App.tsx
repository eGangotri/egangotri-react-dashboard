import logo from './logo.svg';
import './App.css';
import EgangotriHeader from './header';
import Uploads from './upload/Uploads';
import {getIndices, getUploadStatusData} from './service/UploadDataRetrievalService';


function App() {
  return (
    <div className="App">
          <EgangotriHeader title='eGangotri Dashboard' />
          <Uploads items={getUploadStatusData()}></Uploads>
    </div>
  );
}

function getRows(){
  return 
}
export default App;
