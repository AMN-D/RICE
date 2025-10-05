import { BrowserRouter as Router } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <h1 className="text-4xl font-bold text-center py-8">
          Rice Showcase
        </h1>
        <p className="text-center text-gray-600">
          Setup complete! Ready to build pages.
        </p>
      </div>
    </Router>
  );
}

export default App;