import { QueryClient, QueryClientProvider } from 'react-query';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import FetchPosts from './components/FetchPosts';
import AddPosts from './components/AddPosts';
import { I18nextProvider, useTranslation } from 'react-i18next';
import i18n from './i18n';
import Comments from './components/Comments';



const queryClient = new QueryClient();


function App() {

  const { t, i18n } = useTranslation();


  return (
    <>
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <div className='App'>
          <h1>{t('form.postsHeader')}</h1>
          <br />
          <Comments />
          <br />
          <FetchPosts />
          <br />
          <AddPosts />
        </div>
      </QueryClientProvider>
    </I18nextProvider>
    </>
  )
}

export default App;
