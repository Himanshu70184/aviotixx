import { createBrowserRouter } from 'react-router';
import { LandingPage } from './App'; // Original landing page
import { SearchResultsPage } from './pages/SearchResultsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/search-results',
    element: <SearchResultsPage />,
  },
]);