"use client";

import { useState } from "react";

const TriggerButton = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const triggerImport = async () => {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/importProducts", { method: "POST" });

      if (response.ok) {
        setMessage("Data successfully sent to Sanity!");
      } else {
        setMessage("Failed to send data to Sanity.");
      }
    } catch (error) {
      setMessage(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button  className='bg-gray-700 text-white px-6 py-2 rounded-xl hover:bg-gray-800 transition shadow-md' onClick={triggerImport} disabled={loading}>
        {loading ? "Sending..." : "Send Data to Sanity"}
      </button>
      {message && <p className="py-3 font-semibold font-mono">{message}</p>}
    </div>
  );
};

export default TriggerButton;