import "./container.css";
import React, { useState, useEffect } from 'react';


export default function NotFound() {
  const [strings, setStrings] = useState<any | null>(null); // Using 'any' for flexibility

  useEffect(() => {
    const fetchStrings = async () => {
      try {
        const response = await fetch('/strings.json'); // Adjust the path if needed
        const data = await response.json();
        setStrings(data);
      } catch (error) {
        console.error('Error fetching strings:', error);
      }
    };

    fetchStrings();
  }, []);
  return (
    <div className="container">
      <h1>{strings.notFound}</h1>
    </div>
  );
}
