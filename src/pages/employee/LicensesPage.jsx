import { useState, useEffect } from "react";
import { useAuth } from "../../auth/AuthContext";
import { getLicenseTypes, getMyLicenses, addLicense, updateLicense, deleteLicense } from "../../api/licenses";
import { LoadingState } from "../../components/common/LoadingState";
import { ErrorState } from "../../components/common/ErrorState";
import { EmptyState } from "../../components/common/EmptyState";
import { DashTable } from "../../components/dashboard/DashTable";

export default function LicensesPage() {
  const { user } = useAuth();
  const [licenses, setLicenses] = useState([]);
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newTypeId, setNewTypeId] = useState("");
  const [newExpiry, setNewExpiry] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [editKey, setEditKey] = useState(null);
  const [editExpiry, setEditExpiry] = useState("");

  const load = () => {
    setLoading(true);
    Promise.all([getMyLicenses(user.u_id), getLicenseTypes()])
      .then(([mine, allTypes]) => { setLicenses(mine); setTypes(allTypes); setError(null); })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect, react-hooks/exhaustive-deps -- load() sets loading state ahead of the fetch it performs; intentionally run once on mount only
  useEffect(() => { load(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newTypeId || !newExpiry) return;
    setSubmitting(true);
    try {
      await addLicense(newTypeId, newExpiry);
      setNewTypeId("");
      setNewExpiry("");
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (l) => {
    setEditKey(`${l.lo_u_id}-${l.lo_l_id}-${l.lo_expiryDate.slice(0, 10)}`);
    setEditExpiry(l.lo_expiryDate.slice(0, 10));
  };

  const handleSaveEdit = async (l) => {
    await updateLicense(l.lo_u_id, l.lo_l_id, l.lo_expiryDate.slice(0, 10), editExpiry);
    setEditKey(null);
    load();
  };

  const handleDelete = async (l) => {
    await deleteLicense(l.lo_u_id, l.lo_l_id, l.lo_expiryDate.slice(0, 10));
    load();
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;

  return (
    <div>
      <h1 className="auth-title" style={{ marginBottom: "1.4rem" }}>My <em>Licenses</em></h1>

      {licenses.length === 0 && <EmptyState message="No licenses on file yet." />}
      {licenses.length > 0 && (
        <DashTable columns={["License", "Expiry", ""]}>
          {licenses.map((l) => {
            const key = `${l.lo_u_id}-${l.lo_l_id}-${l.lo_expiryDate.slice(0, 10)}`;
            return (
              <tr key={key}>
                <td>{l.l_name}</td>
                <td>
                  {editKey === key
                    ? <input className="auth-inp" type="date" value={editExpiry} onChange={(e) => setEditExpiry(e.target.value)} />
                    : l.lo_expiryDate.slice(0, 10)}
                </td>
                <td>
                  {editKey === key ? (
                    <>
                      <button className="btn-gold" onClick={() => handleSaveEdit(l)}>Save</button>{" "}
                      <button className="btn-ghost" onClick={() => setEditKey(null)}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button className="btn-ghost" onClick={() => startEdit(l)}>Edit</button>{" "}
                      <button className="btn-ghost" onClick={() => handleDelete(l)}>Delete</button>
                    </>
                  )}
                </td>
              </tr>
            );
          })}
        </DashTable>
      )}

      <h2 className="dash-card-title" style={{ margin: "1.8rem 0 1rem" }}>Add License</h2>
      <form className="auth-form" style={{ maxWidth: 420, flexDirection: "row", alignItems: "flex-end", gap: ".7rem" }} onSubmit={handleAdd}>
        <div className="auth-fg" style={{ flex: 1 }}>
          <label className="auth-lbl">Type</label>
          <select className="auth-inp" value={newTypeId} onChange={(e) => setNewTypeId(e.target.value)}>
            <option value="">Select</option>
            {types.map((t) => <option key={t.l_id} value={t.l_id}>{t.l_name}</option>)}
          </select>
        </div>
        <div className="auth-fg">
          <label className="auth-lbl">Expiry</label>
          <input className="auth-inp" type="date" value={newExpiry} onChange={(e) => setNewExpiry(e.target.value)} />
        </div>
        <button className="auth-submit" type="submit" disabled={submitting} style={{ marginTop: 0 }}>Add</button>
      </form>
    </div>
  );
}
