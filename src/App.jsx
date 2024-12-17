import { QueryClient, QueryClientProvider } from 'react-query';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import FetchPosts from './components/FetchPosts';
import AddPosts from './components/AddPosts';

const queryClient = new QueryClient();

function App() {

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <div className='App'>
          <h1>Example Posts</h1>
          <FetchPosts />
          <br />
          <AddPosts />
        </div>
      </QueryClientProvider>
    </>
  )
}

export default App;
