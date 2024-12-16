import { QueryClient, QueryClientProvider } from 'react-query';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import FetchPosts from './FetchPosts';
import AddPosts from './AddPosts';

const queryClient = new QueryClient();

function App() {

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <div className='App'>
          <h1>Example Posts</h1>
          <AddPosts />
          <br />
          <FetchPosts />
        </div>
      </QueryClientProvider>
    </>
  )
}

export default App;
