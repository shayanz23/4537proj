import { useNavigate } from "react-router-dom";
import "./container.css";
import "../components/EditUserModal.css";
import currentUser from "../currentUser";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const navigate = useNavigate();
  const [calls, setCalls] = useState<number>(0);
  const [apiCountWarning, setApiCountWarning] = useState<string>("");
  const [strings, setStrings] = useState<any | null>(null); // Using 'any' for flexibility

  useEffect(() => {
    const fetchStrings = async () => {
      try {
        const response = await fetch('../strings.json'); // Adjust the path if needed
        const data = await response.json();
        setStrings(data);
      } catch (error) {
        console.error('Error fetching strings:', error);
      }
    };

    fetchStrings();
  }, []);
  function setCalls2() {
    setCalls(currentUser.numOfReqs);
  }
  async function checkAuth() {
    if (currentUser.status === "") {
      setTimeout(checkAuth, 250);
    } else if (currentUser.status === "Authorized" && currentUser.isAdmin) {
      navigate("/admin");
    } else if (currentUser.status === "Unauthorized") {
      navigate("/login");
    } else {
      setCalls2();
    }
  }

  useEffect(() => {
    checkAuth();
    if (calls > 20) {
      <p>{strings.warning}</p>};
    }
  );

  return (
    <div className="container">
      <h1>{strings ? strings.dashboard : 'Loading...'}</h1>
      <p>{strings ? strings.yourReqs : 'Loading...'} {calls}</p>
      <p>{strings ? strings.warning : 'Loading...'}</p>
    </div>
  );
}
