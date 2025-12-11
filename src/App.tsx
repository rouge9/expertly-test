import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { Matches } from "./pages/Matches";
import { MatchDetail } from "./pages/MatchDetail";
import { Standings } from "./pages/Standings";
import { Teams } from "./pages/Teams";
import { Comparison } from "./pages/Comparison";
import { Statistics } from "./pages/Statistics";
import { Venues } from "./pages/Venues";
import { Live } from "./pages/Live";
import { MatchesProvider } from "./context/MatchesContext";

function App() {
  return (
    <MatchesProvider>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Live />} />
            <Route path="matches" element={<Matches />} />
            <Route path="match/:id" element={<MatchDetail />} />
            <Route path="standings" element={<Standings />} />
            <Route path="teams" element={<Teams />} />
            <Route path="comparison" element={<Comparison />} />
            <Route path="statistics" element={<Statistics />} />
            <Route path="venues" element={<Venues />} />
          </Route>
        </Routes>
      </Router>
    </MatchesProvider>
  );
}

export default App;
