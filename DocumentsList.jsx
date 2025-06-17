import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../api";

const DocumentsList = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocuments = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_URL}/documents`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDocuments(res.data);
      } catch (err) {
        // Gérer l’erreur
      }
      setLoading(false);
    };
    fetchDocuments();
  }, []);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {documents.map(doc => (
            <li key={doc.id}>{doc.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DocumentsList;